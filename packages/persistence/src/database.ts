/**
 * SQLite persistence via node:sqlite (Node 22.13+, spec §5.2, etapa 4).
 * WAL enabled, versioned migrations, typed repositories.
 * No external native dependency — keeps install light and offline-friendly.
 */
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

export interface DbPaths {
  /** absolute path to rsparty.sqlite */
  file: string;
}

/**
 * Row types mirror SQLite column names (snake_case) exactly as returned
 * by node:sqlite SELECTs.
 */

export interface RoomRow {
  id: string;
  code: string;
  status: string; // lobby | game | results | closed
  host_player_id: string | null;
  locked: number;
  max_players: number;
  settings_json: string;
  current_game_id: string | null;
  state_version: number;
  created_at: number;
  updated_at: number;
}

export interface PlayerRow {
  id: string;
  room_id: string;
  nickname: string;
  avatar_icon: string;
  avatar_bg: string;
  role: string;
  resume_token_hash: string;
  connected: number;
  ready: number;
  score: number;
  capabilities_json: string;
  joined_at: number;
  last_seen_at: number;
  kicked: number;
}

export interface GameInstanceRow {
  id: string;
  room_id: string;
  plugin_id: string;
  seed: number;
  phase: string;
  round_number: number;
  round_total: number;
  state_json: string;
  started_at: number;
  ended_at: number | null;
  result_json: string | null;
}

export interface AuditEventRow {
  id: string;
  at: number;
  severity: "info" | "warn" | "error";
  category: string;
  room_id: string | null;
  player_id: string | null;
  event_type: string;
  metadata_json: string;
}

export interface MediaItemRow {
  id: string;
  owner_player_id: string | null;
  room_id: string | null;
  kind: string; // image | audio | video
  original_name: string;
  storage_key: string;
  mime: string;
  bytes: number;
  sha256: string;
  approved: number;
  consent: number;
  created_at: number;
}

export interface JukeboxRow {
  id: string;
  media_id: string;
  proposer_id: string | null;
  votes: number;
  state: string; // queued | playing | played | skipped
  created_at: number;
}

export interface ChatMessageRow {
  id: string;
  room_id: string;
  author_player_id: string;
  text: string;
  created_at: number;
}

export interface ChatMuteRow {
  room_id: string;
  player_id: string;
  muted_until: number | null;
  created_at: number;
  updated_at: number;
}

const MIGRATIONS: { version: number; up: string }[] = [
  {
    version: 1,
    up: `
      CREATE TABLE IF NOT EXISTS schema_version (
        version INTEGER PRIMARY KEY,
        applied_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL DEFAULT 'lobby',
        host_player_id TEXT,
        locked INTEGER NOT NULL DEFAULT 0,
        max_players INTEGER NOT NULL DEFAULT 12,
        settings_json TEXT NOT NULL DEFAULT '{}',
        current_game_id TEXT,
        state_version INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(code);

      CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY,
        room_id TEXT NOT NULL REFERENCES rooms(id),
        nickname TEXT NOT NULL,
        avatar_icon TEXT NOT NULL,
        avatar_bg TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'player',
        resume_token_hash TEXT NOT NULL,
        connected INTEGER NOT NULL DEFAULT 0,
        ready INTEGER NOT NULL DEFAULT 0,
        score INTEGER NOT NULL DEFAULT 0,
        capabilities_json TEXT NOT NULL DEFAULT '{}',
        joined_at INTEGER NOT NULL,
        last_seen_at INTEGER NOT NULL,
        kicked INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_players_room ON players(room_id);
      CREATE INDEX IF NOT EXISTS idx_players_token ON players(resume_token_hash);

      CREATE TABLE IF NOT EXISTS game_instances (
        id TEXT PRIMARY KEY,
        room_id TEXT NOT NULL REFERENCES rooms(id),
        plugin_id TEXT NOT NULL,
        seed INTEGER NOT NULL,
        phase TEXT NOT NULL DEFAULT 'SETUP',
        round_number INTEGER NOT NULL DEFAULT 0,
        round_total INTEGER NOT NULL DEFAULT 0,
        state_json TEXT NOT NULL DEFAULT '{}',
        started_at INTEGER NOT NULL,
        ended_at INTEGER,
        result_json TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_games_room ON game_instances(room_id);

      CREATE TABLE IF NOT EXISTS audit_events (
        id TEXT PRIMARY KEY,
        at INTEGER NOT NULL,
        severity TEXT NOT NULL,
        category TEXT NOT NULL,
        room_id TEXT,
        player_id TEXT,
        event_type TEXT NOT NULL,
        metadata_json TEXT NOT NULL DEFAULT '{}'
      );
      CREATE INDEX IF NOT EXISTS idx_audit_at ON audit_events(at);

      CREATE TABLE IF NOT EXISTS kv (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `,
  },
  {
    version: 2,
    up: `
      CREATE TABLE IF NOT EXISTS media_items (
        id TEXT PRIMARY KEY,
        owner_player_id TEXT,
        room_id TEXT,
        kind TEXT NOT NULL,
        original_name TEXT NOT NULL,
        storage_key TEXT NOT NULL UNIQUE,
        mime TEXT NOT NULL,
        bytes INTEGER NOT NULL,
        sha256 TEXT NOT NULL,
        approved INTEGER NOT NULL DEFAULT 1,
        consent INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_media_created ON media_items(created_at);
      CREATE TABLE IF NOT EXISTS jukebox_queue (
        id TEXT PRIMARY KEY,
        media_id TEXT NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,
        proposer_id TEXT,
        votes INTEGER NOT NULL DEFAULT 0,
        state TEXT NOT NULL DEFAULT 'queued',
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_jukebox_state ON jukebox_queue(state, created_at);
    `,
  },
  {
    version: 3,
    up: `
      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
        author_player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_chat_messages_room_created ON chat_messages(room_id, created_at, id);
      CREATE TABLE IF NOT EXISTS chat_mutes (
        room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
        player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        muted_until INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (room_id, player_id)
      );
    `,
  },
];

export class Database {
  readonly db: DatabaseSync;
  readonly file: string;

  constructor(file = ":memory:") {
    if (file !== ":memory:") mkdirSync(dirname(file), { recursive: true });
    this.file = file;
    this.db = new DatabaseSync(file);
    this.db.exec("PRAGMA journal_mode = WAL;");
    this.db.exec("PRAGMA foreign_keys = ON;");
    this.db.exec("PRAGMA busy_timeout = 3000;");
    this.migrate();
  }

  /** Delegate statement preparation so repositories stay terse. */
  prepare(sql: string): ReturnType<DatabaseSync["prepare"]> {
    return this.db.prepare(sql);
  }

  exec(sql: string): void {
    this.db.exec(sql);
  }

  private migrate(): void {
    this.db.exec(
      `CREATE TABLE IF NOT EXISTS _migrations (version INTEGER PRIMARY KEY, applied_at INTEGER NOT NULL)`,
    );
    const applied = new Set(
      this.db
        .prepare(`SELECT version FROM _migrations`)
        .all()
        .map((r) => Number((r as { version: number }).version)),
    );
    for (const m of MIGRATIONS) {
      if (applied.has(m.version)) continue;
      this.db.exec("BEGIN");
      try {
        this.db.exec(m.up);
        this.db
          .prepare(`INSERT INTO _migrations (version, applied_at) VALUES (?, ?)`)
          .run(m.version, Date.now());
        this.db.exec("COMMIT");
      } catch (err) {
        this.db.exec("ROLLBACK");
        throw err;
      }
    }
  }

  close(): void {
    try {
      this.db.exec("PRAGMA wal_checkpoint(TRUNCATE);");
    } finally {
      this.db.close();
    }
  }
}

export function defaultDbPath(homeDir: string): string {
  return join(homeDir, "data", "rsparty.sqlite");
}
