/** Mirrors node:sqlite SqlValue without importing the module type. */
type SqlValue = string | number | bigint | Uint8Array | null;

import type {
  AuditEventRow,
  ChatMessageRow,
  ChatMuteRow,
  Database,
  GameInstanceRow,
  JukeboxRow,
  MediaItemRow,
  PlayerRow,
  RoomRow,
} from "./database.js";
import { newId } from "./id-gen.js";

/* ---------------- Rooms ---------------- */

export class RoomRepository {
  constructor(private readonly db: Database) {}

  create(opts: {
    id: string;
    code: string;
    maxPlayers: number;
    settings?: Record<string, unknown>;
    now: number;
  }): RoomRow {
    this.db
      .prepare(
        `INSERT INTO rooms (id, code, status, host_player_id, locked, max_players, settings_json, current_game_id, state_version, created_at, updated_at)
         VALUES (?, ?, 'lobby', NULL, 0, ?, ?, NULL, 1, ?, ?)`,
      )
      .run(opts.id, opts.code, opts.maxPlayers, JSON.stringify(opts.settings ?? {}), opts.now, opts.now);
    return this.byId(opts.id)!;
  }

  byId(id: string): RoomRow | undefined {
    return this.db.prepare(`SELECT * FROM rooms WHERE id = ?`).get(id) as
      | RoomRow
      | undefined;
  }

  byCode(code: string): RoomRow | undefined {
    return this.db.prepare(`SELECT * FROM rooms WHERE code = ?`).get(code) as
      | RoomRow
      | undefined;
  }

  activeByCode(code: string): RoomRow | undefined {
    return this.db
      .prepare(`SELECT * FROM rooms WHERE code = ? AND status != 'closed'`)
      .get(code) as RoomRow | undefined;
  }

  update(id: string, patch: Partial<RoomRow>): void {
    const allowed = new Set<keyof RoomRow>([
      "status",
      "host_player_id",
      "locked",
      "max_players",
      "settings_json",
      "current_game_id",
      "state_version",
    ]);
    const sets: string[] = [];
    const vals: SqlValue[] = [];
    for (const [k, v] of Object.entries(patch)) {
      if (!allowed.has(k as keyof RoomRow)) continue;
      sets.push(`${k} = ?`);
      vals.push((v === undefined ? null : v) as SqlValue);
    }
    if (sets.length === 0) return;
    sets.push(`updated_at = ?`);
    vals.push(Date.now(), id);
    this.db.prepare(`UPDATE rooms SET ${sets.join(", ")} WHERE id = ?`).run(...(vals as SqlValue[]));
  }

  countActive(): number {
    const r = this.db
      .prepare(`SELECT COUNT(*) AS c FROM rooms WHERE status != 'closed'`)
      .get() as { c: number };
    return Number(r.c);
  }

  /** Record room activity without changing its externally visible state. */
  touch(id: string, now = Date.now()): void {
    this.db.prepare(`UPDATE rooms SET updated_at = ? WHERE id = ?`).run(now, id);
  }

  /**
   * Remove an expired idle lobby and all data owned by it.  The status and
   * current-game predicates are repeated inside the transaction so a caller
   * can never purge a room that became active after it was selected.
   */
  purgeIdleLobby(id: string, cutoff: number): string[] {
    const eligible = this.db.prepare(
      `SELECT id FROM rooms
       WHERE id = ? AND status = 'lobby' AND current_game_id IS NULL AND updated_at <= ?`,
    ).get(id, cutoff);
    if (!eligible) return [];

    const media = this.db.prepare(`SELECT storage_key FROM media_items WHERE room_id = ?`)
      .all(id) as Array<{ storage_key: string }>;
    this.db.exec("BEGIN");
    try {
      // Delete dependants explicitly: original v1 foreign keys predate CASCADE.
      this.db.prepare(`DELETE FROM chat_mutes WHERE room_id = ?`).run(id);
      this.db.prepare(`DELETE FROM chat_messages WHERE room_id = ?`).run(id);
      this.db.prepare(`DELETE FROM game_instances WHERE room_id = ?`).run(id);
      this.db.prepare(`DELETE FROM media_items WHERE room_id = ?`).run(id);
      this.db.prepare(`DELETE FROM players WHERE room_id = ?`).run(id);
      this.db.prepare(`DELETE FROM audit_events WHERE room_id = ?`).run(id);
      const result = this.db.prepare(
        `DELETE FROM rooms
         WHERE id = ? AND status = 'lobby' AND current_game_id IS NULL AND updated_at <= ?`,
      ).run(id, cutoff);
      if (Number(result.changes) !== 1) {
        this.db.exec("ROLLBACK");
        return [];
      }
      this.db.exec("COMMIT");
      return media.map((row) => row.storage_key);
    } catch (err) {
      this.db.exec("ROLLBACK");
      throw err;
    }
  }
}

/* ---------------- Players ---------------- */

export class PlayerRepository {
  constructor(private readonly db: Database) {}

  create(opts: {
    id: string;
    roomId: string;
    nickname: string;
    avatarIcon: string;
    avatarBg: string;
    role: string;
    resumeTokenHash: string;
    capabilities: Record<string, unknown>;
    now: number;
  }): PlayerRow {
    this.db
      .prepare(
        `INSERT INTO players (id, room_id, nickname, avatar_icon, avatar_bg, role, resume_token_hash, connected, ready, score, capabilities_json, joined_at, last_seen_at, kicked)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?, ?, ?, 0)`,
      )
      .run(
        opts.id,
        opts.roomId,
        opts.nickname,
        opts.avatarIcon,
        opts.avatarBg,
        opts.role,
        opts.resumeTokenHash,
        JSON.stringify(opts.capabilities ?? {}),
        opts.now,
        opts.now,
      );
    return this.byId(opts.id)!;
  }

  byId(id: string): PlayerRow | undefined {
    return this.db.prepare(`SELECT * FROM players WHERE id = ?`).get(id) as
      | PlayerRow
      | undefined;
  }

  byResumeTokenHash(hash: string): PlayerRow | undefined {
    return this.db
      .prepare(`SELECT * FROM players WHERE resume_token_hash = ? AND kicked = 0`)
      .get(hash) as PlayerRow | undefined;
  }

  byRoom(roomId: string): PlayerRow[] {
    return this.db
      .prepare(`SELECT * FROM players WHERE room_id = ? ORDER BY joined_at ASC`)
      .all(roomId) as unknown as PlayerRow[];
  }

  nicknameTaken(roomId: string, nickname: string, excludeId?: string): boolean {
    const row = this.db
      .prepare(
        `SELECT id FROM players WHERE room_id = ? AND LOWER(nickname) = LOWER(?) AND kicked = 0`,
      )
      .get(roomId, nickname) as { id: string } | undefined;
    return row !== undefined && row.id !== excludeId;
  }

  countActiveInRoom(roomId: string): number {
    const r = this.db
      .prepare(`SELECT COUNT(*) AS c FROM players WHERE room_id = ? AND kicked = 0`)
      .get(roomId) as { c: number };
    return Number(r.c);
  }

  update(id: string, patch: Partial<PlayerRow>): void {
    const allowed = new Set<keyof PlayerRow>([
      "nickname",
      "avatar_icon",
      "avatar_bg",
      "role",
      "connected",
      "ready",
      "score",
      "capabilities_json",
      "last_seen_at",
      "kicked",
    ]);
    const sets: string[] = [];
    const vals: SqlValue[] = [];
    for (const [k, v] of Object.entries(patch)) {
      if (!allowed.has(k as keyof PlayerRow)) continue;
      sets.push(`${k} = ?`);
      vals.push((v === undefined ? null : v) as SqlValue);
    }
    if (sets.length === 0) return;
    vals.push(id);
    this.db.prepare(`UPDATE players SET ${sets.join(", ")} WHERE id = ?`).run(...(vals as SqlValue[]));
  }
}

/* ---------------- Game instances ---------------- */

export class GameInstanceRepository {
  constructor(private readonly db: Database) {}

  create(opts: {
    pluginId: string;
    roomId: string;
    seed: number;
    now: number;
  }): GameInstanceRow {
    const id = newId("game");
    this.db
      .prepare(
        `INSERT INTO game_instances (id, room_id, plugin_id, seed, phase, round_number, round_total, state_json, started_at)
         VALUES (?, ?, ?, ?, 'SETUP', 0, 0, '{}', ?)`,
      )
      .run(id, opts.roomId, opts.pluginId, opts.seed, opts.now);
    return this.byId(id)!;
  }

  byId(id: string): GameInstanceRow | undefined {
    return this.db.prepare(`SELECT * FROM game_instances WHERE id = ?`).get(id) as
      | GameInstanceRow
      | undefined;
  }

  currentForRoom(roomId: string): GameInstanceRow | undefined {
    return this.db
      .prepare(
        `SELECT * FROM game_instances WHERE room_id = ? ORDER BY started_at DESC LIMIT 1`,
      )
      .get(roomId) as GameInstanceRow | undefined;
  }

  update(id: string, patch: Partial<GameInstanceRow>): void {
    const allowed = new Set<keyof GameInstanceRow>([
      "phase",
      "round_number",
      "round_total",
      "state_json",
      "ended_at",
      "result_json",
    ]);
    const sets: string[] = [];
    const vals: SqlValue[] = [];
    for (const [k, v] of Object.entries(patch)) {
      if (!allowed.has(k as keyof GameInstanceRow)) continue;
      sets.push(`${k} = ?`);
      vals.push((v === undefined ? null : v) as SqlValue);
    }
    if (sets.length === 0) return;
    vals.push(id);
    this.db.prepare(`UPDATE game_instances SET ${sets.join(", ")} WHERE id = ?`).run(...(vals as SqlValue[]));
  }
}

/* ---------------- Media ---------------- */

export class MediaRepository {
  constructor(private readonly db: Database) {}

  create(opts: {
    id: string;
    ownerPlayerId?: string | null;
    roomId?: string | null;
    kind: string;
    originalName: string;
    storageKey: string;
    mime: string;
    bytes: number;
    sha256: string;
    approved?: number;
    consent?: number;
    now: number;
  }): MediaItemRow {
    this.db
      .prepare(
        `INSERT INTO media_items (id, owner_player_id, room_id, kind, original_name, storage_key, mime, bytes, sha256, approved, consent, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        opts.id,
        opts.ownerPlayerId ?? null,
        opts.roomId ?? null,
        opts.kind,
        opts.originalName,
        opts.storageKey,
        opts.mime,
        opts.bytes,
        opts.sha256,
        opts.approved ?? 1,
        opts.consent ?? 1,
        opts.now,
      );
    return this.byId(opts.id)!;
  }

  byId(id: string): MediaItemRow | undefined {
    return this.db.prepare(`SELECT * FROM media_items WHERE id = ?`).get(id) as MediaItemRow | undefined;
  }

  list(limit = 50, offset = 0): MediaItemRow[] {
    return this.db
      .prepare(`SELECT * FROM media_items ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .all(limit, offset) as unknown as MediaItemRow[];
  }

  byStorageKey(key: string): MediaItemRow | undefined {
    return this.db.prepare(`SELECT * FROM media_items WHERE storage_key = ?`).get(key) as MediaItemRow | undefined;
  }

  totalBytes(): number {
    const r = this.db.prepare(`SELECT COALESCE(SUM(bytes),0) as s FROM media_items`).get() as { s: number };
    return Number(r.s);
  }

  delete(id: string): void {
    this.db.prepare(`DELETE FROM media_items WHERE id = ?`).run(id);
  }

  count(): number {
    const r = this.db.prepare(`SELECT COUNT(*) as c FROM media_items`).get() as { c: number };
    return Number(r.c);
  }
}

export class JukeboxRepository {
  constructor(private readonly db: Database) {}

  enqueue(mediaId: string, proposerId?: string | null): JukeboxRow {
    const id = newId("jb");
    this.db
      .prepare(`INSERT INTO jukebox_queue (id, media_id, proposer_id, votes, state, created_at) VALUES (?, ?, ?, 0, 'queued', ?)`)
      .run(id, mediaId, proposerId ?? null, Date.now());
    return this.byId(id)!;
  }

  byId(id: string): JukeboxRow | undefined {
    return this.db.prepare(`SELECT * FROM jukebox_queue WHERE id = ?`).get(id) as JukeboxRow | undefined;
  }

  list(): JukeboxRow[] {
    return this.db.prepare(`SELECT * FROM jukebox_queue ORDER BY votes DESC, created_at ASC`).all() as unknown as JukeboxRow[];
  }

  vote(id: string, delta = 1): void {
    this.db.prepare(`UPDATE jukebox_queue SET votes = votes + ? WHERE id = ?`).run(delta, id);
  }

  setState(id: string, state: string): void {
    this.db.prepare(`UPDATE jukebox_queue SET state = ? WHERE id = ?`).run(state, id);
  }

  remove(id: string): void {
    this.db.prepare(`DELETE FROM jukebox_queue WHERE id = ?`).run(id);
  }
}

/* ---------------- Chat ---------------- */

export class ChatRepository {
  constructor(private readonly db: Database) {}

  create(opts: { id: string; roomId: string; authorPlayerId: string; text: string; now: number }): ChatMessageRow {
    this.db.prepare(
      `INSERT INTO chat_messages (id, room_id, author_player_id, text, created_at) VALUES (?, ?, ?, ?, ?)`,
    ).run(opts.id, opts.roomId, opts.authorPlayerId, opts.text, opts.now);
    return this.byId(opts.id)!;
  }

  byId(id: string): ChatMessageRow | undefined {
    return this.db.prepare(`SELECT * FROM chat_messages WHERE id = ?`).get(id) as ChatMessageRow | undefined;
  }

  list(roomId: string, limit = 50): ChatMessageRow[] {
    return this.db.prepare(
      `SELECT * FROM chat_messages WHERE room_id = ? ORDER BY created_at DESC, id DESC LIMIT ?`,
    ).all(roomId, limit).reverse() as unknown as ChatMessageRow[];
  }

  remove(id: string): void {
    this.db.prepare(`DELETE FROM chat_messages WHERE id = ?`).run(id);
  }

  mute(roomId: string, playerId: string, mutedUntil: number | null, now: number): void {
    this.db.prepare(
      `INSERT INTO chat_mutes (room_id, player_id, muted_until, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(room_id, player_id) DO UPDATE SET muted_until = excluded.muted_until, updated_at = excluded.updated_at`,
    ).run(roomId, playerId, mutedUntil, now, now);
  }

  unmute(roomId: string, playerId: string): void {
    this.db.prepare(`DELETE FROM chat_mutes WHERE room_id = ? AND player_id = ?`).run(roomId, playerId);
  }

  muteFor(roomId: string, playerId: string): ChatMuteRow | undefined {
    return this.db.prepare(`SELECT * FROM chat_mutes WHERE room_id = ? AND player_id = ?`).get(roomId, playerId) as ChatMuteRow | undefined;
  }
}

/* ---------------- Audit ---------------- */

export interface AuditInput {
  severity?: "info" | "warn" | "error";
  category: string;
  roomId?: string | null;
  playerId?: string | null;
  eventType: string;
  metadata?: Record<string, unknown>;
}

export class AuditRepository {
  constructor(private readonly db: Database) {}

  append(input: AuditInput): void {
    // metadata must be pre-sanitized by callers (no tokens/secrets — spec §AX)
    this.db
      .prepare(
        `INSERT INTO audit_events (id, at, severity, category, room_id, player_id, event_type, metadata_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        newId("aud"),
        Date.now(),
        input.severity ?? "info",
        input.category,
        input.roomId ?? null,
        input.playerId ?? null,
        input.eventType,
        JSON.stringify(input.metadata ?? {}),
      );
  }

  recent(limit = 100): AuditEventRow[] {
    return this.db
      .prepare(`SELECT * FROM audit_events ORDER BY at DESC LIMIT ?`)
      .all(limit) as unknown as AuditEventRow[];
  }
}
