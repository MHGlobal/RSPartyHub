/**
 * Server configuration + RS_PARTY_HOME directory layout (spec §8.3).
 * Rule: library/ is never deleted by the app; temp/ is TTL-cleanable.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash, randomBytes } from "node:crypto";

export interface ServerConfig {
  port: number;
  host: string;
  homeDir: string;
  dbFile: string;
  adminToken?: string;
  adminSessionSecret?: string;
  maxPlayersDefault: number;
  resultsViewMs: number;
  disconnectGraceMs: number;
  /** Idle lobby TTL; zero disables automatic expiry. */
  roomIdleTtlMs: number;
  /** Multiplier for rate limits; >1 only in tests/load runs. */
  rateLimitMultiplier: number;
  /** Optional CORS allowlist (comma-separated origins); empty = same-origin + LAN IPs allowed. */
  corsAllowedOrigins?: string[];
  /** Enable the optional, best-effort `_rsparty._tcp` mDNS announcement. */
  mdnsEnabled: boolean;
  logLevel: string;
  /** Admin PIN hash (hex) for session-based authentication. Set on first boot if absent. */
  adminPinHash?: string;
}

function intEnv(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function boolEnv(env: NodeJS.ProcessEnv, name: string, fallback: boolean): boolean {
  const value = env[name]?.trim().toLowerCase();
  if (!value) return fallback;
  return !["0", "false", "no", "off"].includes(value);
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
  // Bootstrap admin credentials on first start if no token is configured
  let adminPinHash = env.RS_PARTY_ADMIN_PIN_HASH as string | undefined;
  let adminSessionSecret = env.RS_PARTY_ADMIN_SESSION_SECRET as string | undefined;

  if (!adminSessionSecret) {
    // Generate a random session secret on first start
    adminSessionSecret = randomBytes(32).toString("hex");
  }

  if (!adminPinHash) {
    // Try to load existing credentials, otherwise generate a default PIN hash
    const credsPath = join(homeDir, "config", "admin-credentials.json");
    if (existsSync(credsPath)) {
      const creds = JSON.parse(readFileSync(credsPath, "utf8"));
      adminPinHash = creds.pinHash;
    } else {
      // Default: PIN "1234" hashed with SHA-256 for first-time bootstrap
      adminPinHash = createHash("sha256").update("1234").digest("hex");
      // Persist so future starts reuse the same default
      mkdirSync(join(homeDir, "config"), { recursive: true });
      writeFileSync(credsPath, JSON.stringify({ pinHash: adminPinHash }));
    }
  }

  return {
    port: intEnv("RS_PARTY_PORT", 3210),
    host: env.RS_PARTY_BIND ?? "0.0.0.0",
    homeDir,
    dbFile:
      env.RS_PARTY_DB ?? join(homeDir, "data", "rsparty.sqlite"),
    adminToken: env.RS_PARTY_ADMIN_TOKEN,
    adminSessionSecret,
    adminPinHash,
    maxPlayersDefault: intEnv("RS_PARTY_MAX_PLAYERS", 12),
    resultsViewMs: intEnv("RS_PARTY_RESULTS_MS", 8000),
    disconnectGraceMs: intEnv("RS_PARTY_DISCONNECT_GRACE_MS", 60_000),
    roomIdleTtlMs: Math.max(0, intEnv("RS_PARTY_ROOM_IDLE_TTL_MS", 24 * 60 * 60 * 1000)),
    rateLimitMultiplier: intEnv("RS_PARTY_RATE_MULT", 1),
    corsAllowedOrigins,
    mdnsEnabled: boolEnv(env, "RS_PARTY_MDNS", true),
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
