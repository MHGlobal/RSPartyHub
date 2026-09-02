/**
 * RoomManager — authoritative in-memory state per room, mirrored to SQLite.
 * Owns lobby lifecycle, join/resume/reconnect (spec §10.5–§12),
 * scoring accumulation, results and Party Mix chaining.
 */
import type { GameRegistry } from "@rs-party/game-engine";
import type {
  Announcement,
  GamePublicState,
  PlayerPublicInfo,
  ResultsPayload,
  RoomSnapshot,
  ScoreRow,
} from "@rs-party/protocol";
import { ErrorCodes, generateRoomCode, newId, newToken } from "@rs-party/protocol";
import {
  AuditRepository,
  GameInstanceRepository,
  PlayerRepository,
  RoomRepository,
  sha256,
} from "@rs-party/persistence";
import type { Database } from "@rs-party/persistence";
import type { RuntimePlayerRef } from "../runtime/game-runtime.js";
import { GameRuntime } from "../runtime/game-runtime.js";
import type { PackLibrary } from "@rs-party/content";
import type { GameSettingsValues } from "@rs-party/game-engine";
import type { ServerConfig } from "../config.js";
import { unlinkSync } from "node:fs";
import { basename, resolve } from "node:path";

export interface JoinInput {
  nickname: string;
  avatar: { icon: string; bg: string };
}

export interface JoinResult {
  roomCode: string;
  playerId: string;
  resumeToken: string;
  role: "host" | "player" | "spectator";
}

export interface MemPlayer {
  id: string;
  roomId: string;
  nickname: string;
  avatar: { icon: string; bg: string };
  role: "host" | "player" | "spectator";
  connected: boolean;
  ready: boolean;
  score: number;
  lastRoundDelta?: number;
  title?: string;
  kicked: boolean;
  lastSeenAt: number;
}

interface MemGame {
  runtime: GameRuntime;
}

interface MemPartyMix {
  /** Remaining host-selected games, in their intended order. */
  queue: string[];
}

export interface MemRoom {
  id: string;
  code: string;
  phase: "lobby" | "game" | "results" | "closed";
  locked: boolean;
  maxPlayers: number;
  reactionsMuted: boolean;
  settings: Record<string, unknown>;
  serverSeq: number;
  stateVersion: number;
  players: Map<string, MemPlayer>;
  announcements: Announcement[];
  game?: MemGame;
  partyMix?: MemPartyMix;
  results?: ResultsPayload & { gameId: string };
}

export interface JoinError extends Error {
  code: string;
}

function joinErr(code: keyof typeof ErrorCodes, detail?: string): JoinError {
  const e = new Error(detail ?? ErrorCodes[code]) as JoinError;
  e.code = code;
  return e;
}

export class RoomManager {
  private rooms = new Map<string, MemRoom>();
  /** Kept outside snapshots so a cancelled mix cannot retain a live timer. */
  private mixTimers = new Map<string, ReturnType<typeof setTimeout>>();

  /** Push channel injected by the gateway so runtime ticks reach clients. */
  broadcast: (roomId: string) => void = () => {};

  readonly roomRepo: RoomRepository;
  readonly playerRepo: PlayerRepository;
  readonly gameRepo: GameInstanceRepository;
  readonly audit: AuditRepository;

  constructor(
    readonly db: Database,
    readonly registry: GameRegistry,
    readonly cfg: ServerConfig,
    readonly packs?: PackLibrary,
  ) {
    this.roomRepo = new RoomRepository(db);
    this.playerRepo = new PlayerRepository(db);
    this.gameRepo = new GameInstanceRepository(db);
    this.audit = new AuditRepository(db);
  }

  /* ---------------- lifecycle ---------------- */

  createRoom(maxPlayers?: number, settings?: Record<string, unknown>): MemRoom {
    let code = generateRoomCode();
    while (this.roomRepo.activeByCode(code)) code = generateRoomCode();
    const id = newId("room");
    const row = this.roomRepo.create({
      id,
      code,
      maxPlayers: maxPlayers ?? this.cfg.maxPlayersDefault,
      settings,
      now: Date.now(),
    });
    const mem: MemRoom = {
      id,
      code,
      phase: "lobby",
      locked: false,
      maxPlayers: row.max_players,
      reactionsMuted: false,
      settings: rowSettings(row.settings_json),
      serverSeq: 0,
      stateVersion: 1,
      players: new Map(),
      announcements: [],
    };
    this.rooms.set(id, mem);
    this.audit.append({ category: "room", eventType: "room.created", roomId: id });
    return mem;
  }

  /** Rehydrate non-closed rooms from DB after restart (durability). */
  rehydrate(): number {
    const rows = this.db
      .prepare(`SELECT * FROM rooms WHERE status != 'closed'`)
      .all() as Array<{
      id: string;
      code: string;
      locked: number;
      max_players: number;
      status: MemRoom["phase"];
      current_game_id: string | null;
      settings_json: string;
      state_version: number;
    }>;
    let n = 0;
    for (const row of rows) {
      const mem: MemRoom = {
        id: row.id,
        code: row.code,
        phase: row.current_game_id ? "lobby" : row.status,
        locked: !!row.locked,
        maxPlayers: row.max_players,
        reactionsMuted: false,
        settings: rowSettings(row.settings_json),
        serverSeq: 0,
        stateVersion: row.state_version,
        players: new Map(),
        announcements: [],
      };
      // players reconnect via resume token even after restart
      const prows = this.playerRepo.byRoom(row.id);
      for (const pr of prows) {
        if (pr.kicked) continue;
        mem.players.set(pr.id, {
          id: pr.id,
          roomId: pr.room_id,
          nickname: pr.nickname,
          avatar: { icon: pr.avatar_icon, bg: pr.avatar_bg },
          role: pr.role as MemPlayer["role"],
          connected: false,
          ready: !!pr.ready,
          score: pr.score,
          kicked: false,
          lastSeenAt: pr.last_seen_at,
        });
      }
      this.rooms.set(mem.id, mem);
      // restart persisted game instance so its state is not lost
      const inst = row.current_game_id ? this.gameRepo.byId(row.current_game_id) : undefined;
      if (inst && !inst.ended_at && this.registry.get(inst.plugin_id)) {
        try {
          this.attachRuntime(mem, inst.plugin_id, inst.id);
        } catch {
          // corrupt instance: drop back to lobby rather than crash boot
          this.gameRepo.update(inst.id, { ended_at: Date.now() });
        }
      }
      n++;
    }
    return n;
  }

  byCode(code: string): MemRoom | undefined {
    return [...this.rooms.values()].find(
      (r) => r.code.toUpperCase() === code.toUpperCase() && r.phase !== "closed",
    );
  }

  byId(id: string): MemRoom | undefined {
    return this.rooms.get(id);
  }

  /** Snapshot of active rooms for the admin dashboard. */
  listActiveRooms(): MemRoom[] {
    return [...this.rooms.values()];
  }

  closeRoom(room: MemRoom): void {
    this.clearPartyMix(room);
    room.game?.runtime.finishEarly();
    room.game = undefined;
    room.phase = "closed";
    this.roomRepo.update(room.id, { status: "closed" });
    this.audit.append({ category: "room", eventType: "room.closed", roomId: room.id });
    this.rooms.delete(room.id);
  }

  /** Stop all runtime timers without altering durable room/game state. */
  dispose(): void {
    for (const room of this.rooms.values()) {
      room.game?.runtime.dispose();
      this.clearPartyMix(room);
    }
  }

  /** Explicit idle sweep, also usable deterministically by tests. */
  sweepIdleRooms(now = Date.now()): number {
    if (this.cfg.roomIdleTtlMs <= 0) return 0;
    const cutoff = now - this.cfg.roomIdleTtlMs;
    const candidates = this.db.prepare(
      `SELECT id FROM rooms
       WHERE status = 'lobby' AND current_game_id IS NULL AND updated_at <= ?`,
    ).all(cutoff) as Array<{ id: string }>;
    let swept = 0;
    for (const { id } of candidates) {
      const room = this.rooms.get(id);
      // Do not rely only on persisted state to protect live game runtimes.
      if (room && (room.phase !== "lobby" || room.game)) continue;
      const storageKeys = this.roomRepo.purgeIdleLobby(id, cutoff);
      if (storageKeys.length === 0 && this.roomRepo.byId(id)) continue;
      this.rooms.delete(id);
      for (const storageKey of storageKeys) this.removeOwnedUpload(storageKey);
      swept++;
    }
    return swept;
  }

  private removeOwnedUpload(storageKey: string): void {
    const uploadsDir = resolve(this.cfg.homeDir, "uploads", "approved");
    const path = resolve(uploadsDir, basename(storageKey));
    if (path === uploadsDir || !path.startsWith(`${uploadsDir}/`)) return;
    try { unlinkSync(path); } catch { /* best-effort after durable DB cleanup */ }
  }

  /* ---------------- join / resume ---------------- */

  join(code: string, input: JoinInput): JoinResult {
    const room =
      this.byCode(code) ??
      (() => {
        throw joinErr("ROOM_NOT_FOUND");
      })();

    if (room.locked) throw joinErr("ROOM_LOCKED");

    const activePlayers = [...room.players.values()].filter(
      (p) => !p.kicked && p.role !== "spectator",
    ).length;

    let role: MemPlayer["role"] = "player";
    if (activePlayers >= room.maxPlayers || room.phase !== "lobby") {
      role = "spectator"; // late join policy default at room level
    }

    const existingSameNick = [...room.players.values()].find(
      (p) => !p.kicked && p.nickname.toLowerCase() === input.nickname.toLowerCase(),
    );
    if (existingSameNick) throw joinErr("NICKNAME_TAKEN");

    const playerId = newId("pl");
    const resumeToken = newToken(18);

    room.players.set(playerId, {
      id: playerId,
      roomId: room.id,
      nickname: input.nickname,
      avatar: input.avatar,
      role,
      connected: false, // set once socket authenticated
      ready: false,
      score: 0,
      kicked: false,
      lastSeenAt: Date.now(),
    });

    this.playerRepo.create({
      id: playerId,
      roomId: room.id,
      nickname: input.nickname,
      avatarIcon: input.avatar.icon,
      avatarBg: input.avatar.bg,
      role,
      resumeTokenHash: sha256(resumeToken),
      capabilities: {},
      now: Date.now(),
    });

    this.audit.append({
      category: "room",
      eventType: "player.joined",
      roomId: room.id,
      playerId,
    });
    this.bumpVersion(room);

    return { roomCode: room.code, playerId, resumeToken, role };
  }

  /** Resume with token after refresh or reconnect (spec §10.5). */
  resume(code: string, playerId: string, token: string): JoinResult {
    const room =
      this.byCode(code) ?? (() => { throw joinErr("ROOM_NOT_FOUND"); })();
    const mem = room.players.get(playerId);
    if (!mem || mem.kicked) throw joinErr("NOT_IN_ROOM");
    const prow = this.playerRepo.byId(playerId);
    if (!prow || prow.resume_token_hash !== sha256(token)) {
      throw joinErr("FORBIDDEN", "resume token mismatch");
    }
    mem.lastSeenAt = Date.now();
    this.playerRepo.update(playerId, { last_seen_at: mem.lastSeenAt });
    this.roomRepo.touch(room.id, mem.lastSeenAt);
    return { roomCode: room.code, playerId, resumeToken: token, role: mem.role };
  }

  markConnected(roomId: string, playerId: string, connected: boolean): void {
    const room = this.rooms.get(roomId);
    const p = room?.players.get(playerId);
    if (!room || !p) return;
    p.connected = connected;
    if (connected) p.lastSeenAt = Date.now();
    this.playerRepo.update(playerId, { connected: connected ? 1 : 0 });
    this.bumpVersion(room);
  }

  touch(roomId: string, playerId: string): void {
    const room = this.rooms.get(roomId);
    const p = room?.players.get(playerId);
    if (!p || !room) return;
    p.lastSeenAt = Date.now();
    this.playerRepo.update(playerId, { last_seen_at: p.lastSeenAt });
    this.roomRepo.touch(room.id, p.lastSeenAt);
  }

  /* ---------------- lobby actions ---------------- */

  setReady(roomId: string, playerId: string, ready: boolean): void {
    const p = this.rooms.get(roomId)?.players.get(playerId);
    if (!p || p.role === "spectator") throw joinErr("FORBIDDEN");
    p.ready = ready;
    this.playerRepo.update(playerId, { ready: ready ? 1 : 0 });
    this.bumpVersion(this.rooms.get(roomId)!);
  }

  updateIdentity(roomId: string, playerId: string, patch: Partial<Pick<MemPlayer, "nickname" | "avatar">>): void {
    const room = this.rooms.get(roomId);
    const p = room?.players.get(playerId);
    if (!room || !p) throw joinErr("NOT_IN_ROOM");
    if (patch.nickname && patch.nickname !== p.nickname) {
      const taken = [...room.players.values()].some(
        (o) => o.id !== playerId && !o.kicked &&
          o.nickname.toLowerCase() === patch.nickname!.toLowerCase(),
      );
      if (taken) throw joinErr("NICKNAME_TAKEN");
      p.nickname = patch.nickname;
      this.playerRepo.update(playerId, { nickname: patch.nickname });
    }
    if (patch.avatar) {
      p.avatar = patch.avatar;
      this.playerRepo.update(playerId, {
        avatar_icon: patch.avatar.icon,
        avatar_bg: patch.avatar.bg,
      });
    }
    this.bumpVersion(room);
  }

  hostControl(roomId: string, hostPlayerId: string, control: { op: string } & Record<string, unknown>): void {
    const room = this.rooms.get(roomId);
    const host = room?.players.get(hostPlayerId);
    if (!room || !host || host.role !== "host") throw joinErr("NOT_HOST");

    switch (control.op) {
      case "kick": {
        const target = room.players.get(String(control.playerId));
        if (!target) throw joinErr("NOT_IN_ROOM");
        target.kicked = true;
        this.playerRepo.update(target.id, { kicked: 1 });
        room.players.delete(target.id);
        break;
      }
      case "rename": {
        const target = room.players.get(String(control.playerId));
        if (!target) throw joinErr("NOT_IN_ROOM");
        const nick = String(control.nickname);
        const taken = [...room.players.values()].some(
          (o) => o.id !== target.id && !o.kicked &&
            o.nickname.toLowerCase() === nick.toLowerCase(),
        );
        if (taken) throw joinErr("NICKNAME_TAKEN");
        target.nickname = nick;
        this.playerRepo.update(target.id, { nickname: nick });
        break;
      }
      case "make-spectator": {
        const target = room.players.get(String(control.playerId));
        if (!target) throw joinErr("NOT_IN_ROOM");
        target.role = "spectator";
        this.playerRepo.update(target.id, { role: "spectator" });
        break;
      }
      case "mute-reactions":
        room.reactionsMuted = !!control.muted;
        break;
      case "lock-joins":
        room.locked = !!control.locked;
        this.roomRepo.update(room.id, { locked: room.locked ? 1 : 0 });
        break;
      case "skip-round":
      case "end-game":
        if (room.game) room.game.runtime.finishEarly();
        break;
      case "return-to-lobby":
        // dispose FIRST: kill timers so the orphan cannot resolve a
        // future game through a stale onFinished callback (review H1)
        room.game?.runtime.dispose();
        room.game = undefined;
        this.clearPartyMix(room);
        room.results = undefined;
        room.phase = "lobby";
        for (const p of room.players.values()) {
          p.ready = false;
          p.lastRoundDelta = undefined;
          p.title = undefined;
          this.playerRepo.update(p.id, { ready: 0 });
        }
        this.db.prepare(`UPDATE rooms SET current_game_id = NULL WHERE id = ?`).run(room.id);
        break;
      case "close-room":
        this.closeRoom(room);
        return;
      default:
        throw joinErr("INVALID_PAYLOAD");
    }
    this.audit.append({
      category: "moderation",
      eventType: `host.${control.op}`,
      roomId,
      playerId: hostPlayerId,
    });
    this.bumpVersion(room);
  }

  announceTo(roomId: string, level: Announcement["level"], text: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.announcements.push({ id: newId("ann"), level, text, at: Date.now() });
    if (room.announcements.length > 20) room.announcements.shift();
    room.serverSeq++;
  }

  /* ---------------- game start / party mix ---------------- */

  startGame(roomId: string, hostPlayerId: string, pluginId: string, settings?: Record<string, unknown>, fromPartyMix = false): void {
    const room = this.rooms.get(roomId);
    const host = room?.players.get(hostPlayerId);
    if (!room || !host || host.role !== "host") throw joinErr("NOT_HOST");
    if (room.phase !== "lobby" && room.phase !== "results") throw joinErr("BAD_PHASE");
    const activeCount = [...room.players.values()].filter(
      (p) => !p.kicked && p.role === "player",
    ).length;

    const plugin = this.registry.get(pluginId);
    if (!plugin) throw joinErr("GAME_NOT_FOUND");
    if (activeCount < plugin.manifest.minPlayers) throw joinErr("MIN_PLAYERS");
    if (!fromPartyMix) this.clearPartyMix(room);

    // apply defaults from manifest settings schema
    const merged: GameSettingsValues = {};
    for (const f of plugin.manifest.settings) merged[f.key] = f.default as never;
    Object.assign(merged, settings ?? {});

    // content pack selection (etapa 15): validated pack questions injected
    if (typeof merged.packId === "string" && this.packs) {
      const loaded = this.packs.byPackId(merged.packId);
      if (!loaded || loaded.pack.kind !== "quiz") throw joinErr("GAME_NOT_FOUND", `pack ${String(merged.packId)} not found`);
      merged.questions = loaded.pack.questions;
    }

    room.results = undefined;
    room.phase = "game";
    this.roomRepo.update(room.id, { status: "game" });
    this.attachRuntime(room, pluginId, undefined, merged);
    this.audit.append({
      category: "game",
      eventType: "game.started",
      roomId,
      playerId: hostPlayerId,
      metadata: { pluginId },
    });
  }

  private attachRuntime(
    room: MemRoom,
    pluginId: string,
    existingInstanceId?: string,
    settings?: GameSettingsValues,
  ): void {
    const plugin = this.registry.require(pluginId);
    const seed = SeededRandomSeed();
    const runtime = new GameRuntime(
      plugin,
      room.id,
      seed,
      this.gameRepo,
      () => this.activeRefs(room),
      () => settings ?? {},
      (level: "info" | "success" | "error", text: string) => this.announceTo(room.id, level, text),
      () => this.onGameFinished(room),
      () => {
        room.serverSeq++;
        room.stateVersion++;
        this.broadcast(room.id);
      },
      existingInstanceId,
    );
    room.game = { runtime };
    this.db
      .prepare(`UPDATE rooms SET current_game_id = ? WHERE id = ?`)
      .run(runtime.instanceId, room.id);
  }

  onGameFinished(room: MemRoom): void {
    const game = room.game;
    if (!game) return;
    const result = game.runtime.score();

    // Party Mix uses rank-based Party Points so a long/high-score game cannot
    // dominate a short one. Standalone games retain their native score deltas.
    const scoreDeltas = room.partyMix
      ? normalizedPartyPoints(result.roundScores)
      : result.roundScores;
    for (const row of scoreDeltas) {
      const p = room.players.get(row.playerId);
      if (!p) continue;
      p.score += row.delta;
      p.lastRoundDelta = undefined;
      this.playerRepo.update(row.playerId, { score: p.score });
    }

    const rows: ScoreRow[] = rankScores(room, result.titles);
    const awards = result.awards ?? [];

    room.results = {
      rows,
      gameId: game.runtime.plugin.manifest.id,
      gameName: game.runtime.plugin.manifest.name,
      awards,
    };
    room.phase = "results";
    this.roomRepo.update(room.id, { status: "results" });
    this.broadcast(room.id);

    // persist current_game_id cleared so restart boots to lobby/results
    this.db.prepare(`UPDATE rooms SET current_game_id = NULL WHERE id = ?`).run(room.id);

    // Party Mix auto-chain. Store the timer centrally so return-to-lobby,
    // close and process disposal cancel it deterministically.
    const partyMix = room.partyMix;
    if (partyMix?.queue.length) {
      const next = partyMix.queue.shift()!;
      const timer = setTimeout(() => {
        this.mixTimers.delete(room.id);
        try {
          this.startMixNext(room.id, next);
        } catch {
          // A changing room can make the next game incompatible. End the mix
          // cleanly at the authoritative results screen rather than skipping.
          this.clearPartyMix(room);
        }
      }, this.cfg.resultsViewMs);
      this.mixTimers.set(room.id, timer);
    } else if (partyMix) {
      // The final scoreboard remains visible, but no obsolete mix state/timer
      // survives to affect a later manual game or lobby.
      this.clearPartyMix(room);
    }
  }

  private startMixNext(roomId: string, pluginId: string): void {
    const room = this.rooms.get(roomId);
    if (!room || room.phase !== "results") return;
    this.startGame(roomId, this.hostOf(room), pluginId, undefined, true);
  }

  hostOf(room: MemRoom): string {
    const host = [...room.players.values()].find((p) => p.role === "host");
    if (!host) throw joinErr("INTERNAL", "room has no host");
    return host.id;
  }

  startPartyMix(roomId: string, hostPlayerId: string, gameIds: string[]): void {
    const room = this.rooms.get(roomId);
    const host = room?.players.get(hostPlayerId);
    if (!room || !host || host.role !== "host") throw joinErr("NOT_HOST");
    if (room.phase !== "lobby" && room.phase !== "results") throw joinErr("BAD_PHASE");
    if (gameIds.length === 0) throw joinErr("MIX_EMPTY");
    if (new Set(gameIds).size !== gameIds.length) throw joinErr("MIX_DUPLICATE_GAME");
    const activeCount = [...room.players.values()].filter((p) => !p.kicked && p.role === "player").length;
    for (const gameId of gameIds) {
      const plugin = this.registry.get(gameId);
      if (!plugin || plugin.manifest.priority !== "P0" || activeCount < plugin.manifest.minPlayers || activeCount > plugin.manifest.maxPlayers) {
        throw joinErr("MIX_INCOMPATIBLE_GAME");
      }
    }
    room.partyMix = { queue: gameIds.slice(1) };
    this.startGame(roomId, hostPlayerId, gameIds[0]!, undefined, true);
  }

  private clearPartyMix(room: MemRoom): void {
    const timer = this.mixTimers.get(room.id);
    if (timer) clearTimeout(timer);
    this.mixTimers.delete(room.id);
    room.partyMix = undefined;
  }

  /**
   * Create a room and its host player in one step.
   * The first identity in a room is always the host (spec §12.4).
   */
  createRoomAsHost(maxPlayers: number | undefined, input: JoinInput): { room: MemRoom; result: JoinResult } {
    const room = this.createRoom(maxPlayers);
    const playerId = newId("pl");
    const resumeToken = newToken(18);
    room.players.set(playerId, {
      id: playerId,
      roomId: room.id,
      nickname: input.nickname,
      avatar: input.avatar,
      role: "host",
      connected: false,
      ready: true,
      score: 0,
      kicked: false,
      lastSeenAt: Date.now(),
    });
    this.playerRepo.create({
      id: playerId,
      roomId: room.id,
      nickname: input.nickname,
      avatarIcon: input.avatar.icon,
      avatarBg: input.avatar.bg,
      role: "host",
      resumeTokenHash: sha256(resumeToken),
      capabilities: {},
      now: Date.now(),
    });
    this.roomRepo.update(room.id, { host_player_id: playerId });
    this.playerRepo.update(playerId, { ready: 1 });
    this.bumpVersion(room);
    return {
      room,
      result: { roomCode: room.code, playerId, resumeToken, role: "host" },
    };
  }

  /* ---------------- snapshots (spec §10.4) ---------------- */

  bumpVersion(room: MemRoom): void {
    room.serverSeq++;
    room.stateVersion++;
    this.roomRepo.update(room.id, { state_version: room.stateVersion });
  }

  /**
   * Shared public portion built ONCE per flush cycle; viewers add only
   * their private slice (keeps 30-player broadcasts O(players) not O(n²)).
   */
  baseSnapshot(room: MemRoom): RoomSnapshot {
    return {
      roomCode: room.code,
      phase: room.phase,
      locked: room.locked,
      reactionsMuted: room.reactionsMuted,
      serverSeq: room.serverSeq,
      stateVersion: room.stateVersion,
      players: playerInfos(room),
      game: this.publicGameView(room),
      partyMix: room.partyMix ? { remainingGames: room.partyMix.queue.length } : undefined,
      announcements: room.announcements.slice(-5),
    };
  }

  publicGameView(room: MemRoom): GamePublicState | undefined {
    const g = room.game;
    if (!g) return undefined;
    const s = g.runtime.state;
    return {
      id: g.runtime.plugin.manifest.id,
      name: g.runtime.plugin.manifest.name,
      phase: s.phase,
      phaseLabel: s.phaseLabel,
      roundNumber: s.roundNumber,
      roundTotal: s.roundTotal,
      deadlineAt: s.deadlineAt,
      paused: !!s.paused,
      publicView: g.runtime.plugin.getPublicView(g.runtime.state, g.runtime.ctx),
    };
  }

  snapshotFor(room: MemRoom, viewerId?: string): RoomSnapshot {
    const base = this.baseSnapshot(room);

    const viewer = viewerId ? room.players.get(viewerId) : undefined;
    if (!viewer) {
      if (room.results) base.results = room.results;
      return base;
    }

    let privateView: unknown = null;
    if (room.game && viewer.role !== "spectator") {
      try {
        privateView = room.game.runtime.plugin.getPrivateView(
          room.game.runtime.state,
          viewer.id,
          room.game.runtime.ctx,
        );
      } catch {
        privateView = null;
      }
    }

    return {
      ...base,
      results: room.results,
      you: {
        id: viewer.id,
        role: viewer.role,
        score: viewer.score,
        connected: viewer.connected,
        privateView,
      },
    } as RoomSnapshot;
  }

  activeRefs(room: MemRoom): RuntimePlayerRef[] {
    return [...room.players.values()]
      .filter((p) => !p.kicked)
      .map((p) => ({
        playerId: p.id,
        nickname: p.nickname,
        role: p.role === "spectator" ? ("spectator" as const) : ("player" as const),
      }));
  }
}

/* ---------------- helpers ---------------- */

function playerInfos(room: MemRoom): PlayerPublicInfo[] {
  return [...room.players.values()]
    .filter((p) => !p.kicked)
    .map((p) => ({
      id: p.id,
      nickname: p.nickname,
      avatar: p.avatar,
      role: p.role,
      connected: p.connected,
      score: p.score,
      ready: p.ready,
    }))
    .sort((a, b) => b.score - a.score);
}

function rankScores(room: MemRoom, titles?: Record<string, string>): ScoreRow[] {
  const sorted = playerInfos(room);
  let lastScore = Number.NaN;
  let rank = 0;
  return sorted.map((p, i) => {
    if (p.score !== lastScore) {
      rank = i + 1;
      lastScore = p.score;
    }
    return {
      playerId: p.id,
      nickname: p.nickname,
      score: p.score,
      rank,
      title: titles?.[p.id],
    };
  });
}

/** Convert a game's native result into deterministic, bounded Party Points. */
export function normalizedPartyPoints(rows: Array<{ playerId: string; delta: number }>): Array<{ playerId: string; delta: number }> {
  const sorted = [...rows].sort((a, b) => b.delta - a.delta || a.playerId.localeCompare(b.playerId));
  let previous: number | undefined;
  let rank = 0;
  return sorted.map((row, index) => {
    if (row.delta !== previous) rank = index + 1;
    previous = row.delta;
    const points = rank === 1 ? 100 : rank === 2 ? 75 : rank === 3 ? 60 : Math.max(10, Math.round(60 * (sorted.length - rank) / Math.max(1, sorted.length - 3)));
    return { playerId: row.playerId, delta: points };
  });
}

function SeededRandomSeed(): number {
  return globalThis.crypto.getRandomValues(new Uint32Array(1))[0]! >>> 0;
}

function rowSettings(settingsJson: string): Record<string, unknown> {
  try {
    const value: unknown = JSON.parse(settingsJson);
    return value && typeof value === "object" && !Array.isArray(value)
      ? value as Record<string, unknown>
      : {};
  } catch {
    return {};
  }
}
