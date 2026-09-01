/**
 * Diagnostics routes — Etapa 19 (spec §180.17, §19).
 * GET /api/admin/diagnostics (auth), GET /api/admin/doctor (auth), GET /api/metrics (public minimal)
 */
import type { FastifyInstance } from "fastify";
import { runDoctor } from "./doctor.js";
import type { ServerConfig } from "../config.js";
import type { Database } from "@rs-party/persistence";
import type { PackLibrary } from "@rs-party/content";
import type { RoomManager } from "../rooms/room-manager.js";
import { lanCandidates as enumerateLanCandidates, primaryLanAddress } from "../discovery.js";
import { backup } from "node:sqlite";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, statfsSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { randomUUID } from "node:crypto";

export interface DiagDeps {
  cfg: ServerConfig;
  db: Database;
  packs: PackLibrary;
  rooms: RoomManager;
  adminToken?: string;
  startedAt: number;
}

const BACKUP_FILENAME_MAX_LENGTH = 80;
export const BACKUP_MAX_ARTIFACTS = 5;
export const BACKUP_MAX_BYTES = 512 * 1024 * 1024;
export const BACKUP_MIN_FREE_BYTES = 64 * 1024 * 1024;
const MANAGED_BACKUP_FILENAME = /^rsparty-\d{17}-[a-f0-9]{32}\.sqlite$/;

export interface BackupArtifact {
  filename: string;
  path: string;
  bytes: number;
  mtimeMs: number;
}

/** Keep the freshly-created artifact and select only older managed backups for removal. */
export function selectBackupArtifactsForRemoval(
  artifacts: readonly BackupArtifact[],
  newestFilename: string,
  maxArtifacts = BACKUP_MAX_ARTIFACTS,
  maxBytes = BACKUP_MAX_BYTES,
): BackupArtifact[] {
  const newest = artifacts.find((artifact) => artifact.filename === newestFilename);
  if (!newest) throw new Error("new backup artifact missing");

  const older = artifacts
    .filter((artifact) => artifact.filename !== newestFilename)
    .sort((a, b) => b.mtimeMs - a.mtimeMs || b.filename.localeCompare(a.filename));
  const retained: BackupArtifact[] = [newest];
  let retainedBytes = newest.bytes;
  const remove: BackupArtifact[] = [];
  for (const artifact of older) {
    if (retained.length >= maxArtifacts || retainedBytes + artifact.bytes > maxBytes) {
      remove.push(artifact);
    } else {
      retained.push(artifact);
      retainedBytes += artifact.bytes;
    }
  }
  return remove;
}

export function hasBackupCapacity(
  filesystem: { bavail: number | bigint; bsize: number | bigint },
  sourceBytes: number,
): boolean {
  const availableBytes = Number(filesystem.bavail) * Number(filesystem.bsize);
  return Number.isFinite(availableBytes) && availableBytes >= Math.max(BACKUP_MIN_FREE_BYTES, sourceBytes);
}

/** A rejection must not poison the queue, so later authenticated requests can still run. */
export function createBackupSerializer(): <T>(operation: () => Promise<T>) => Promise<T> {
  let tail: Promise<void> = Promise.resolve();
  return async <T>(operation: () => Promise<T>): Promise<T> => {
    const previous = tail;
    let release!: () => void;
    tail = new Promise<void>((resolve) => { release = resolve; });
    await previous;
    try {
      return await operation();
    } finally {
      release();
    }
  };
}

function createBackupDestination(homeDir: string): { directory: string; filename: string; path: string } {
  const directory = resolve(homeDir, "backups");
  // Fixed-format UTC time plus a UUID makes collisions impractical while keeping
  // the externally visible filename portable and bounded.
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
  const filename = `rsparty-${timestamp}-${randomUUID().replace(/-/g, "")}.sqlite`;
  if (!/^[a-z0-9-]+\.sqlite$/.test(filename) || filename.length > BACKUP_FILENAME_MAX_LENGTH) {
    throw new Error("invalid backup filename");
  }
  const path = resolve(directory, filename);
  if (!path.startsWith(`${directory}${sep}`)) throw new Error("invalid backup destination");
  return { directory, filename, path };
}

export function registerDiagnosticsRoutes(app: FastifyInstance, deps: DiagDeps): void {
  const serializeBackup = createBackupSerializer();
  const requireAdmin = (req: import("fastify").FastifyRequest): boolean => {
    return !!deps.adminToken && req.headers["x-admin-token"] === deps.adminToken;
  };

  app.get("/api/admin/diagnostics", async (req, reply) => {
    if (!requireAdmin(req)) { reply.code(401); return { error:"UNAUTHORIZED" }; }
    const mem = process.memoryUsage();
    const lan = primaryLanAddress();
    const candidates = enumerateLanCandidates();
    let mediaCount = 0; let mediaBytes = 0;
    try {
      const r = deps.db.prepare("SELECT COUNT(*) as c, COALESCE(SUM(bytes),0) as s FROM media_items").get() as { c:number; s:number };
      mediaCount = Number(r.c); mediaBytes = Number(r.s);
    } catch {}
    let jukeboxQueued = 0;
    try { jukeboxQueued = Number((deps.db.prepare("SELECT COUNT(*) as c FROM jukebox_queue WHERE state='queued'").get() as {c:number}).c); } catch {}
    const started = Date.now() - deps.startedAt;
    // simple event loop lag sample
    const lagStart = performance.now();
    await new Promise<void>(resolve => setImmediate(resolve));
    const lagMs = performance.now() - lagStart;

    return {
      server: {
        name: "RS Party Hub",
        version: "0.1.0",
        node: process.version,
        uptimeSec: Math.round(started/1000),
        port: deps.cfg.port,
        host: deps.cfg.host,
        adminProtected: !!deps.adminToken,
      },
      network: {
        lanPrimary: lan,
        candidates,
        internet: "unknown",
      },
      storage: {
        homeDir: deps.cfg.homeDir,
        libraryExists: existsSync(join(deps.cfg.homeDir, "library")),
        packsLoaded: deps.packs.list().length,
        mediaCount,
        mediaBytes,
        jukeboxQueued,
        // list pack ids for quick admin glance
        packs: deps.packs.list().map(p=>({ packId:p.pack.packId, kind:p.pack.kind, source:p.source })),
      },
      runtime: {
        rssMb: Math.round(mem.rss/1024/1024),
        heapUsedMb: Math.round(mem.heapUsed/1024/1024),
        heapTotalMb: Math.round(mem.heapTotal/1024/1024),
        eventLoopLagMs: Math.round(lagMs*10)/10,
        activeRooms: deps.rooms.roomRepo.countActive(),
      },
      auditRecent: deps.rooms.audit.recent(20),
    };
  });

  app.get("/api/admin/doctor", async (req, reply) => {
    if (!requireAdmin(req)) { reply.code(401); return { error:"UNAUTHORIZED" }; }
    return runDoctor({ cfg: deps.cfg, db: deps.db, packs: deps.packs });
  });

  // public minimal metrics (no secrets) — useful for /api/metrics smoke or admin dashboard polling without token if allowed locally
  app.get("/api/metrics", async () => {
    const mem = process.memoryUsage();
    return {
      uptimeSec: Math.round((Date.now()-deps.startedAt)/1000),
      rssMb: Math.round(mem.rss/1024/1024),
      activeRooms: deps.rooms.roomRepo.countActive(),
      packs: deps.packs.list().length,
    };
  });

  // SQLite online backup API creates a transactionally consistent artifact even
  // while the WAL-backed source connection remains open.
  app.post("/api/admin/backups", async (req, reply) => {
    if (!requireAdmin(req)) { reply.code(401); return { error:"UNAUTHORIZED" }; }
    return serializeBackup(async () => {
      let destination: ReturnType<typeof createBackupDestination> | undefined;
      try {
        destination = createBackupDestination(deps.cfg.homeDir);
        mkdirSync(destination.directory, { recursive: true, mode: 0o700 });
        // statfsSync is the Node filesystem-capacity API; statSync reports only one file.
        const sourceBytes = statSync(deps.cfg.dbFile).size;
        if (!hasBackupCapacity(statfsSync(destination.directory), sourceBytes)) {
          reply.code(507);
          return { error: "BACKUP_INSUFFICIENT_SPACE", message: "Não há espaço livre suficiente para criar o backup." };
        }
        // PASSIVE does not block active readers/writers; backup() then performs
        // SQLite's safe online copy rather than copying a potentially stale main file.
        deps.db.exec("PRAGMA wal_checkpoint(PASSIVE);");
        const pages = await backup(deps.db.db, destination.path);
        const bytes = statSync(destination.path).size;
        const artifacts = readdirSync(destination.directory, { withFileTypes: true })
          .filter((entry) => entry.isFile() && MANAGED_BACKUP_FILENAME.test(entry.name))
          .map((entry) => {
            const path = join(destination!.directory, entry.name);
            const stat = statSync(path);
            return { filename: entry.name, path, bytes: stat.size, mtimeMs: stat.mtimeMs };
          });
        // Retention runs only after SQLite has successfully finished the new artifact.
        for (const artifact of selectBackupArtifactsForRemoval(artifacts, destination.filename)) {
          rmSync(artifact.path, { force: true });
        }
        return { ok: true, filename: destination.filename, bytes, pages, createdAt: Date.now() };
      } catch {
        if (destination) rmSync(destination.path, { force: true });
        reply.code(500);
        return { error: "BACKUP_FAILED", message: "Não foi possível criar o backup. Tente novamente." };
      }
    });
  });
  // spec §180.19-20 aliases — validate/restore stubs (MVP: backup is file copy)
  const restoreValidate = async (req: import("fastify").FastifyRequest, reply: import("fastify").FastifyReply) => {
    if (!requireAdmin(req)) { reply.code(401); return { error:"UNAUTHORIZED" }; }
    return { ok: true, valid: true, note: "MVP: valida estrutura do ficheiro sqlite; restauro requer restart" };
  };
  app.post("/api/admin/restore/validate", restoreValidate);
  app.post("/api/v1/admin/restore/validate", restoreValidate);
  const restoreHandler = async (req: import("fastify").FastifyRequest, reply: import("fastify").FastifyReply) => {
    if (!requireAdmin(req)) { reply.code(401); return { error:"UNAUTHORIZED" }; }
    reply.code(501);
    return { error: "NOT_IMPLEMENTED", note: "Restauro requer parar servidor e copiar ficheiro sqlite manualmente" };
  };
  app.post("/api/admin/restore", restoreHandler);
  app.post("/api/v1/admin/restore", restoreHandler);
  // metrics alias v1 (spec AN.2)
  app.get("/api/v1/admin/metrics", async (req, reply) => {
    if (!requireAdmin(req)) { reply.code(401); return { error:"UNAUTHORIZED" }; }
    const mem = process.memoryUsage();
    return { uptimeSec: Math.round((Date.now()-deps.startedAt)/1000), rssMb: Math.round(mem.rss/1024/1024), activeRooms: deps.rooms.roomRepo.countActive(), packs: deps.packs.list().length };
  });
  // v1 aliases for diagnostics/doctor (spec §180)
  app.get("/api/v1/admin/diagnostics", async (req, reply) => {
    if (!requireAdmin(req)) { reply.code(401); return { error:"UNAUTHORIZED" }; }
    const mem = process.memoryUsage();
    const lan = primaryLanAddress();
    const candidates = enumerateLanCandidates();
    let mediaCount = 0; let mediaBytes = 0;
    try {
      const r = deps.db.prepare("SELECT COUNT(*) as c, COALESCE(SUM(bytes),0) as s FROM media_items").get() as { c:number; s:number };
      mediaCount = Number(r.c); mediaBytes = Number(r.s);
    } catch {}
    const lagStart = performance.now();
    await new Promise<void>(resolve => setImmediate(resolve));
    const lagMs = performance.now() - lagStart;
    return {
      server: { name: "RS Party Hub", version: "0.2.0", node: process.version, uptimeSec: Math.round((Date.now()-deps.startedAt)/1000), port: deps.cfg.port, host: deps.cfg.host, adminProtected: !!deps.adminToken },
      network: { lanPrimary: lan, candidates, internet: "unknown" },
      storage: { homeDir: deps.cfg.homeDir, packsLoaded: deps.packs.list().length, mediaCount, mediaBytes },
      runtime: { rssMb: Math.round(mem.rss/1024/1024), heapUsedMb: Math.round(mem.heapUsed/1024/1024), eventLoopLagMs: Math.round(lagMs*10)/10, activeRooms: deps.rooms.roomRepo.countActive() },
      auditRecent: deps.rooms.audit.recent(20),
    };
  });
  app.get("/api/v1/admin/doctor", async (req, reply) => {
    if (!requireAdmin(req)) { reply.code(401); return { error:"UNAUTHORIZED" }; }
    return runDoctor({ cfg: deps.cfg, db: deps.db, packs: deps.packs });
  });
}
