/**
 * Server configuration + RS_PARTY_HOME directory layout (spec §8.3).
 * Rule: library/ is never deleted by the app; temp/ is TTL-cleanable.
 */
import { mkdirSync, readdirSync, statSync, rmSync } from "node:fs";
import { join } from "node:path";

export interface ServerConfig {
  port: number;
  host: string;
  homeDir: string;
  dbFile: string;
  adminToken?: string;
  maxPlayersDefault: number;
  resultsViewMs: number;
  disconnectGraceMs: number;
  /** Multiplier for rate limits; >1 only in tests/load runs. */
  rateLimitMultiplier: number;
  /** Optional CORS allowlist (comma-separated origins); empty = same-origin + LAN IPs allowed. */
  corsAllowedOrigins?: string[];
  logLevel: string;
}

function intEnv(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  const homeDir =
    env.RS_PARTY_HOME ?? join(process.cwd(), ".rs-party-home");
  const corsRaw = env.RS_PARTY_CORS_ORIGINS ?? env.CORS_ALLOWED_ORIGINS ?? "";
  const corsAllowedOrigins = corsRaw
    ? corsRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;
  if (corsAllowedOrigins?.some((origin) => origin.includes("*"))) {
    throw new Error("CORS wildcard origins are not allowed");
  }
  return {
    port: intEnv("RS_PARTY_PORT", 3210),
    host: env.RS_PARTY_BIND ?? "0.0.0.0",
    homeDir,
    dbFile:
      env.RS_PARTY_DB ?? join(homeDir, "data", "rsparty.sqlite"),
    adminToken: env.RS_PARTY_ADMIN_TOKEN,
    maxPlayersDefault: intEnv("RS_PARTY_MAX_PLAYERS", 12),
    resultsViewMs: intEnv("RS_PARTY_RESULTS_MS", 8000),
    disconnectGraceMs: intEnv("RS_PARTY_DISCONNECT_GRACE_MS", 60_000),
    rateLimitMultiplier: intEnv("RS_PARTY_RATE_MULT", 1),
    corsAllowedOrigins,
    logLevel: env.RS_PARTY_LOG_LEVEL ?? env.LOG_LEVEL ?? "info",
  };
}

/** Create RS_PARTY_HOME layout; never wipes library/ (spec §8.3). */
export function ensureHomeLayout(cfg: ServerConfig): void {
  for (const dir of [
    "config",
    "data",
    join("library", "games"),
    join("library", "quizzes"),
    join("library", "audio"),
    join("library", "images"),
    join("library", "videos"),
    join("library", "packs"),
    join("uploads", "approved"),
    "temp",
    "logs",
    "backups",
  ]) {
    mkdirSync(join(cfg.homeDir, dir), { recursive: true });
  }
}

const TEMP_TTL_MS = 24 * 60 * 60 * 1000;

/** Remove temp/ entries older than TTL. Library is untouched. */
export function cleanTemp(cfg: ServerConfig, now = Date.now()): number {
  const dir = join(cfg.homeDir, "temp");
  let removed = 0;
  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return 0;
  }
  for (const name of entries) {
    try {
      const p = join(dir, name);
      const st = statSync(p);
      if (now - st.mtimeMs > TEMP_TTL_MS) {
        rmSync(p, { recursive: true });
        removed++;
      }
    } catch {
      // best effort cleanup only
    }
  }
  return removed;
}
