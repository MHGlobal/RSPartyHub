import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GameRegistry } from "@rs-party/game-engine";
import { ChatRepository, Database, MediaRepository } from "@rs-party/persistence";
import quizRushPlugin from "@rs-party/games-quiz-rush";
import type { ServerConfig } from "../src/config.js";
import { normalizedPartyPoints, RoomManager } from "../src/rooms/room-manager.js";

const homes: string[] = [];

afterEach(() => {
  for (const home of homes.splice(0)) rmSync(home, { recursive: true, force: true });
});

function setup(ttl = 1_000) {
  const home = mkdtempSync(join(tmpdir(), "rsparty-room-lifecycle-"));
  homes.push(home);
  const cfg: ServerConfig = {
    port: 0,
    host: "127.0.0.1",
    homeDir: home,
    dbFile: join(home, "data", "rsparty.sqlite"),
    maxPlayersDefault: 12,
    resultsViewMs: 2_000,
    disconnectGraceMs: 60_000,
    roomIdleTtlMs: ttl,
    rateLimitMultiplier: 1,
    mdnsEnabled: false,
    logLevel: "silent",
  };
  return { home, cfg, registry: new GameRegistry() };
}

describe("RoomManager durable lobby lifecycle", () => {
  it("normalizes Party Mix results into deterministic bounded Party Points", () => {
    expect(normalizedPartyPoints([
      { playerId: "p3", delta: 10 },
      { playerId: "p1", delta: 40 },
      { playerId: "p2", delta: 20 },
      { playerId: "p4", delta: 0 },
    ])).toEqual([
      { playerId: "p1", delta: 100 },
      { playerId: "p2", delta: 75 },
      { playerId: "p3", delta: 60 },
      { playerId: "p4", delta: 10 },
    ]);
  });

  it("chains the selected next game after results and accumulates Party Points", () => {
    vi.useFakeTimers();
    const { cfg, registry } = setup();
    const db = new Database(cfg.dbFile);
    const rooms = new RoomManager(db, registry, cfg);
    const { room, result: host } = rooms.createRoomAsHost(undefined, { nickname: "Host", avatar: { icon: "🎤", bg: "#123456" } });
    const p1 = rooms.join(room.code, { nickname: "One", avatar: { icon: "1", bg: "#111111" } });
    const p2 = rooms.join(room.code, { nickname: "Two", avatar: { icon: "2", bg: "#222222" } });
    room.phase = "game";
    room.partyMix = { queue: ["next-game"] };
    room.game = { runtime: {
      plugin: { manifest: { id: "first-game", name: "First" } },
      score: () => ({ roundScores: [{ playerId: p1.playerId, delta: 9 }, { playerId: p2.playerId, delta: 3 }], awards: [] }),
      dispose: () => {},
    } } as never;
    const next = vi.spyOn(rooms as unknown as { startMixNext(roomId: string, gameId: string): void }, "startMixNext").mockImplementation(() => {});

    rooms.onGameFinished(room);
    expect(room.phase).toBe("results");
    expect(room.players.get(p1.playerId)?.score).toBe(100);
    expect(room.players.get(p2.playerId)?.score).toBe(75);
    vi.advanceTimersByTime(cfg.resultsViewMs);
    expect(next).toHaveBeenCalledWith(room.id, "next-game");
    rooms.dispose();
    db.close();
    vi.useRealTimers();
    void host;
  });

  it("return-to-lobby cancels a pending Party Mix transition", () => {
    vi.useFakeTimers();
    const { cfg, registry } = setup();
    const db = new Database(cfg.dbFile);
    const rooms = new RoomManager(db, registry, cfg);
    const { room, result: host } = rooms.createRoomAsHost(undefined, { nickname: "Host", avatar: { icon: "🎤", bg: "#123456" } });
    const p1 = rooms.join(room.code, { nickname: "One", avatar: { icon: "1", bg: "#111111" } });
    room.phase = "game";
    room.partyMix = { queue: ["next-game"] };
    room.game = { runtime: {
      plugin: { manifest: { id: "first-game", name: "First" } },
      score: () => ({ roundScores: [{ playerId: p1.playerId, delta: 1 }], awards: [] }),
      dispose: () => {},
    } } as never;
    const next = vi.spyOn(rooms as unknown as { startMixNext(roomId: string, gameId: string): void }, "startMixNext").mockImplementation(() => {});

    rooms.onGameFinished(room);
    rooms.hostControl(room.id, host.playerId, { op: "return-to-lobby" });
    vi.advanceTimersByTime(cfg.resultsViewMs);
    expect(room).toMatchObject({ phase: "lobby", partyMix: undefined, game: undefined, results: undefined });
    expect(next).not.toHaveBeenCalled();
    rooms.dispose();
    db.close();
    vi.useRealTimers();
  });

  it("shutdown cancels a pending Party Mix transition", () => {
    vi.useFakeTimers();
    const { cfg, registry } = setup();
    const db = new Database(cfg.dbFile);
    const rooms = new RoomManager(db, registry, cfg);
    const { room } = rooms.createRoomAsHost(undefined, { nickname: "Host", avatar: { icon: "🎤", bg: "#123456" } });
    const p1 = rooms.join(room.code, { nickname: "One", avatar: { icon: "1", bg: "#111111" } });
    room.phase = "game";
    room.partyMix = { queue: ["next-game"] };
    room.game = { runtime: {
      plugin: { manifest: { id: "first-game", name: "First" } },
      score: () => ({ roundScores: [{ playerId: p1.playerId, delta: 1 }], awards: [] }),
      dispose: () => {},
    } } as never;
    const next = vi.spyOn(rooms as unknown as { startMixNext(roomId: string, gameId: string): void }, "startMixNext").mockImplementation(() => {});

    rooms.onGameFinished(room);
    rooms.dispose();
    vi.advanceTimersByTime(cfg.resultsViewMs);
    expect(next).not.toHaveBeenCalled();
    expect(room.partyMix).toBeUndefined();
    db.close();
    vi.useRealTimers();
  });

  it("rehydrates a lobby without a game including settings, lock, players, and ready state", () => {
    const { cfg, registry } = setup();
    const firstDb = new Database(cfg.dbFile);
    const first = new RoomManager(firstDb, registry, cfg);
    const { room, result: host } = first.createRoomAsHost(7, {
      nickname: "Host",
      avatar: { icon: "🎤", bg: "#123456" },
    });
    const player = first.join(room.code, {
      nickname: "Player",
      avatar: { icon: "🎮", bg: "#abcdef" },
    });
    first.setReady(room.id, player.playerId, true);
    first.hostControl(room.id, host.playerId, { op: "lock-joins", locked: true });
    first.roomRepo.update(room.id, { settings_json: JSON.stringify({ theme: "neon" }) });
    first.dispose();
    firstDb.close();

    const secondDb = new Database(cfg.dbFile);
    const second = new RoomManager(secondDb, registry, cfg);
    expect(second.rehydrate()).toBe(1);

    const restored = second.byCode(room.code)!;
    expect(restored).toMatchObject({
      id: room.id,
      phase: "lobby",
      locked: true,
      maxPlayers: 7,
      settings: { theme: "neon" },
    });
    expect(restored.players.get(host.playerId)).toMatchObject({ ready: true, role: "host", connected: false });
    expect(restored.players.get(player.playerId)).toMatchObject({ ready: true, role: "player", connected: false });
    second.dispose();
    secondDb.close();
  });

  it("rehydrates an active game with its phase, runtime settings, and actions intact", () => {
    const { cfg, registry } = setup();
    registry.register(quizRushPlugin);
    const firstDb = new Database(cfg.dbFile);
    const first = new RoomManager(firstDb, registry, cfg);
    const { room, result: host } = first.createRoomAsHost(undefined, { nickname: "Host", avatar: { icon: "🎤", bg: "#123456" } });
    const p1 = first.join(room.code, { nickname: "One", avatar: { icon: "1", bg: "#111111" } });
    first.join(room.code, { nickname: "Two", avatar: { icon: "2", bg: "#222222" } });
    first.startGame(room.id, host.playerId, "quiz-rush", { rounds: 1, secondsPerQuestion: 25 });
    room.game!.runtime.state.phase = "ACTIVE";
    room.game!.runtime.persist();
    first.dispose();
    firstDb.close();

    const secondDb = new Database(cfg.dbFile);
    const second = new RoomManager(secondDb, registry, cfg);
    expect(second.rehydrate()).toBe(1);
    const restored = second.byId(room.id)!;
    expect(restored.phase).toBe("game");
    expect(restored.game?.runtime.ctx.settings).toMatchObject({ rounds: 1, secondsPerQuestion: 25 });
    expect(second.roomRepo.byId(room.id)).toMatchObject({ status: "game", current_game_id: restored.game?.runtime.instanceId });
    expect(() => restored.game!.runtime.applyAction(
      { type: "SUBMIT_ANSWER", payload: { choice: 0 } },
      { playerId: p1.playerId, role: "player" },
    )).not.toThrow();
    second.dispose();
    secondDb.close();
  });

  it("explicitly sweeps only expired idle lobbies and their owned resources", () => {
    const { cfg, home, registry } = setup(1_000);
    const db = new Database(cfg.dbFile);
    const rooms = new RoomManager(db, registry, cfg);
    const { room: stale } = rooms.createRoomAsHost(undefined, {
      nickname: "Old host",
      avatar: { icon: "🎤", bg: "#111111" },
    });
    rooms.roomRepo.touch(stale.id, 1_000);
    new ChatRepository(db).create({
      id: "chat-old",
      roomId: stale.id,
      authorPlayerId: rooms.hostOf(stale),
      text: "old",
      now: 1_000,
    });
    const uploads = join(home, "uploads", "approved");
    mkdirSync(uploads, { recursive: true });
    writeFileSync(join(uploads, "old.png"), "old");
    new MediaRepository(db).create({
      id: "media-old",
      roomId: stale.id,
      kind: "image",
      originalName: "old.png",
      storageKey: "old.png",
      mime: "image/png",
      bytes: 3,
      sha256: "hash",
      now: 1_000,
    });

    const protectedRoom = rooms.createRoom();
    rooms.roomRepo.update(protectedRoom.id, { status: "game" });
    rooms.roomRepo.touch(protectedRoom.id, 1_000);

    expect(rooms.sweepIdleRooms(1_999)).toBe(0);
    expect(rooms.sweepIdleRooms(2_000)).toBe(1);
    expect(rooms.byId(stale.id)).toBeUndefined();
    expect(rooms.roomRepo.byId(stale.id)).toBeUndefined();
    expect(rooms.playerRepo.byRoom(stale.id)).toEqual([]);
    expect(new ChatRepository(db).list(stale.id)).toEqual([]);
    expect(new MediaRepository(db).byId("media-old")).toBeUndefined();
    expect(existsSync(join(uploads, "old.png"))).toBe(false);
    expect(rooms.byId(protectedRoom.id)).toBeDefined();
    expect(rooms.roomRepo.byId(protectedRoom.id)?.status).toBe("game");
    rooms.dispose();
    db.close();
  });

  it("does not sweep an expired lobby while a player is connected", () => {
    const { cfg, registry } = setup(1_000);
    const db = new Database(cfg.dbFile);
    const rooms = new RoomManager(db, registry, cfg);
    const { room, result: host } = rooms.createRoomAsHost(undefined, {
      nickname: "Host", avatar: { icon: "🎤", bg: "#111111" },
    });
    rooms.markConnected(room.id, host.playerId, true);
    rooms.roomRepo.touch(room.id, 1_000);

    expect(rooms.sweepIdleRooms(2_000)).toBe(0);
    expect(rooms.roomRepo.byId(room.id)).toBeDefined();
    rooms.markConnected(room.id, host.playerId, false);
    rooms.roomRepo.touch(room.id, 1_000);
    expect(rooms.sweepIdleRooms(2_000)).toBe(1);
    rooms.dispose();
    db.close();
  });
});
