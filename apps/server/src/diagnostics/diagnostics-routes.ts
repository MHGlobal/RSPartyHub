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
import { existsSync } from "node:fs";
import { join } from "node:path";

export interface DiagDeps {
  cfg: ServerConfig;
  db: Database;
  packs: PackLibrary;
  rooms: RoomManager;
  adminToken?: string;
  startedAt: number;
}

export function registerDiagnosticsRoutes(app: FastifyInstance, deps: DiagDeps): void {
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

  // backup stub — produce metadata only (spec 180.18)
  app.post("/api/admin/backups", async (req, reply) => {
    if (!requireAdmin(req)) { reply.code(401); return { error:"UNAUTHORIZED" }; }
    // verify DB file exists and is readable; real backup would copy file
    const exists = existsSync(deps.cfg.dbFile);
    return { ok: exists, dbFile: deps.cfg.dbFile, at: Date.now(), note: "MVP: backup metadata only — copia o ficheiro sqlite enquanto servidor parado para restauro completo" };
  });
}
