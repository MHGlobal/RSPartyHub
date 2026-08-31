/**
 * HTTP layer: health/ready, info/discovery, game catalog, QR generation,
 * admin overview. Static web app served from ./public (same origin — spec §5.1).
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import QRCode from "qrcode";
import { buildJoinUrls } from "./discovery.js";
import type { RoomManager } from "./rooms/room-manager.js";
import type { ServerConfig } from "./config.js";
import type { PackLibrary } from "@rs-party/content";
import { registerPackRoutes } from "./pack-routes.js";
import { registerMediaRoutes } from "./media/media-routes.js";
import type { MediaService } from "./media/media-service.js";
import { registerJukeboxRoutes } from "./jukebox/jukebox-routes.js";
import { registerPhotoWallRoutes } from "./photo-wall/photo-wall-routes.js";
import type { JukeboxService } from "./jukebox/jukebox-service.js";
import { registerI18nRoutes } from "./i18n/i18n-routes.js";
import { registerDiagnosticsRoutes } from "./diagnostics/diagnostics-routes.js";
import { newToken } from "@rs-party/protocol";

export interface HttpDeps {
  cfg: ServerConfig;
  rooms: RoomManager;
  adminToken?: string;
  packs: PackLibrary;
  media: MediaService;
  jukebox: JukeboxService;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function buildHttp(deps: HttpDeps) {
  const app = Fastify({ logger: false, bodyLimit: 12 * 1024 * 1024 });
  // multipart for media uploads (spec §176) — limits enforced at service layer too
  const multipart = (await import("@fastify/multipart")).default;
  await app.register(multipart, { limits: { fileSize: 12 * 1024 * 1024, files: 1 } });
  const startedAt = Date.now();

  // per-boot join tokens reduce accidental entry (spec §6.5)
  const joinTokens = new Map<string, string>();

  app.register(fastifyStatic, {
    root: path.join(__dirname, "..", "public"),
    prefix: "/",
    decorateReply: true,
  });

  app.get("/healthz", async () => ({ ok: true }));
  app.get("/api/health", async () => ({ ok: true }));

  app.get("/readyz", async () => {
    let dbOk = false;
    try {
      deps.rooms.db.prepare("SELECT 1").get();
      dbOk = true;
    } catch {
      dbOk = false;
    }
    return {
      ready: dbOk,
      uptimeMs: Date.now() - startedAt,
      activeRooms: deps.rooms.roomRepo.countActive(),
    };
  });

  app.get("/api/info", async () => {
    const urls = buildJoinUrls({ port: deps.cfg.port, roomCode: "----" });
    return {
      name: "RS Party Hub",
      version: "0.1.0",
      lanCandidates: urls.candidates,
      baseUrl: urls.baseUrl.replace("----", "").slice(0, -4),
      internet: "unknown", // client-side indicator; server never requires WAN
    };
  });

  app.get("/api/games", async () => {
    return { games: deps.rooms.registry.list() };
  });

  registerPackRoutes(app, { packs: deps.packs, adminToken: deps.adminToken });
  registerMediaRoutes(app, { media: deps.media, adminToken: deps.adminToken });
  registerJukeboxRoutes(app, { jukebox: deps.jukebox, adminToken: deps.adminToken });
  registerPhotoWallRoutes(app, { media: deps.media, db: deps.rooms.db });
  registerI18nRoutes(app);
  registerDiagnosticsRoutes(app, { cfg: deps.cfg, db: deps.rooms.db, packs: deps.packs, rooms: deps.rooms, adminToken: deps.adminToken, startedAt });

  // Security headers (spec AK.4) — safe for HTTP LAN
  app.addHook("onSend", async (_req, reply) => {
    reply.header("X-Content-Type-Options", "nosniff");
    reply.header("Referrer-Policy", "no-referrer");
    reply.header("X-Frame-Options", "SAMEORIGIN");
    reply.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    // CSP compatible with same-origin static + inline styles used by host UI
    reply.header("Content-Security-Policy", "default-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' ws: wss:; frame-ancestors 'self'");
  });

  /** Issue a short-lived join token for a room and render its QR (spec §6.5). */
  app.get<{ Querystring: { room: string } }>("/api/qr", async (req, reply) => {
    const roomCode = String(req.query.room ?? "").toUpperCase();
    const room = deps.rooms.byCode(roomCode);
    if (!room) {
      reply.code(404);
      return { error: "ROOM_NOT_FOUND" };
    }
    let token = joinTokens.get(room.id);
    if (!token) {
      token = newToken(6);
      joinTokens.set(room.id, token);
    }
    const urls = buildJoinUrls({
      port: deps.cfg.port,
      roomCode: room.code,
      joinToken: token,
    });
    const svg = await QRCode.toString(urls.qrPayload, {
      type: "svg",
      margin: 1,
      width: 320,
    });
    reply.type("image/svg+xml");
    return svg;
  });

  const requireAdmin = (req: import("fastify").FastifyRequest): void => {
    const header = req.headers["x-admin-token"];
    if (!deps.adminToken || header !== deps.adminToken) {
      throw Object.assign(new Error("unauthorized"), { statusCode: 401 });
    }
  };

  app.get("/api/admin/overview", async (req, reply) => {
    try {
      requireAdmin(req);
    } catch {
      reply.code(401);
      return { error: "UNAUTHORIZED" };
    }
    // aggregate view without private data
    const activeRooms: unknown[] = [];
    for (const room of deps.rooms.listActiveRooms()) {
      activeRooms.push({
        code: room.code,
        phase: room.phase,
        players: room.players.size,
        locked: room.locked,
        currentGame: room.game?.runtime.plugin.manifest.id ?? null,
      });
    }
    const mem = process.memoryUsage();
    return {
      rooms: activeRooms,
      system: {
        rssMb: Math.round(mem.rss / 1024 / 1024),
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
        node: process.version,
        uptimeSec: Math.round((Date.now() - startedAt) / 1000),
      },
      recentAudit: deps.rooms.audit.recent(50),
    };
  });

  await app.ready();
  return app;
}
