/**
 * HTTP layer: health/ready, info/discovery, game catalog, QR generation,
 * admin overview with session-based authentication (spec etapa 22).
 * Static web app served from ./public (same origin — spec §5.1).
 */
import path from "node:path";
import { randomBytes } from "node:crypto";
import { createHash, createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "@fastify/cookie";
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
import { registerChatRoutes } from "./chat/chat-routes.js";
import { ChatService } from "./chat/chat-service.js";
import { newToken } from "@rs-party/protocol";

export interface HttpDeps {
  cfg: ServerConfig;
  rooms: RoomManager;
  adminToken?: string;
  packs: PackLibrary;
  media: MediaService;
  jukebox: JukeboxService;
  chat?: ChatService;
}

/** HMAC-signed session token: "randomId.sig" where sig = HMAC(randomId, sessionSecret) (base64url) */
function signSessionToken(sessionId: string, sessionSecret: string): string {
  const sig = createHmac("sha256", sessionSecret).update(sessionId).digest();
  const b64 = sig.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${sessionId}.${b64}`;
}

function verifySessionToken(cookieValue: string | undefined, sessionSecret: string): { valid: boolean; sessionId?: string } {
  if (!cookieValue) return { valid: false };
  const parts = cookieValue.split(".");
  if (parts.length !== 2) return { valid: false };
  const [sessionId, signature] = parts;
  const expected = createHmac("sha256", sessionSecret).update(sessionId).digest();
  const expectedB64 = expected.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  if (expectedB64 !== signature) return { valid: false };
  return { valid: true, sessionId };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

function contentSecurityPolicy(nonce?: string): string {
  const scriptSource = nonce ? `'self' 'nonce-${nonce}'` : "'self'";
  return `default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' data: blob:; media-src 'self' blob:; style-src 'self' 'unsafe-inline'; script-src ${scriptSource}; connect-src 'self' ws: wss:; frame-ancestors 'self'`;
}

export async function buildHttp(deps: HttpDeps) {
  const app = Fastify({ logger: false, bodyLimit: 12 * 1024 * 1024 });
  // multipart for media uploads (spec §176) — limits enforced at service layer too
  const multipart = (await import("@fastify/multipart")).default;
  await app.register(multipart, { limits: { fileSize: 12 * 1024 * 1024, files: 1 } });
  const startedAt = Date.now();

  // per-boot join tokens reduce accidental entry (spec §6.5)
  const joinTokens = new Map<string, string>();

  app.register(fastifyStatic, {
    root: publicDir,
    prefix: "/",
    decorateReply: true,
  });
  app.register(fastifyCookie, { secret: "admin-session-secret-change-in-production" });

  // The UI uses inline ES modules. Render each HTML response with a fresh CSP
  // nonce instead of allowing arbitrary inline scripts globally.
  const sendHtml = async (reply: import("fastify").FastifyReply, file: string) => {
    const nonce = randomBytes(16).toString("base64");
    const html = await readFile(path.join(publicDir, file), "utf8");
    reply
      .header("Content-Security-Policy", contentSecurityPolicy(nonce))
      .type("text/html; charset=utf-8")
      .send(html.replace(/<script type="module">/g, `<script type="module" nonce="${nonce}">`));
  };

  // Public navigation uses extensionless LAN-friendly URLs while the static
  // files retain their explicit names on disk. Serve every HTML entrypoint
  // here so direct .html links receive the same per-response nonce.
  for (const [url, file] of [
    ["/", "index.html"], ["/index.html", "index.html"],
    ["/host", "host.html"], ["/host.html", "host.html"],
    ["/play", "play.html"], ["/play.html", "play.html"],
    ["/admin", "admin.html"], ["/admin.html", "admin.html"],
  ] as const) {
    app.get(url, async (_req, reply) => sendHtml(reply, file));
  }
  app.get("/join/:roomCode", async (_req, reply) => sendHtml(reply, "index.html"));

  app.get("/healthz", async () => ({ ok: true }));
  app.get("/api/health", async () => ({ ok: true }));
  app.get("/api/v1/health", async () => ({ ok: true }));
  // rooms stubs §180.3-6 minimal (lobby already via Socket.IO; HTTP mirrors for tooling)
  app.get("/api/rooms", async () => ({ rooms: deps.rooms.listActiveRooms().map((r) => ({ code: r.code, phase: r.phase, players: r.players.size })) }));
  app.get("/api/v1/rooms", async () => ({ rooms: deps.rooms.listActiveRooms().map((r) => ({ code: r.code, phase: r.phase, players: r.players.size })) }));

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
      version: "0.2.0",
      lanCandidates: urls.candidates,
      baseUrl: urls.baseUrl.replace("----", "").slice(0, -4),
      internet: "unknown", // client-side indicator; server never requires WAN
    };
  });
  // §180.2 alias
  app.get("/api/network", async () => {
    const urls = buildJoinUrls({ port: deps.cfg.port, roomCode: "----" });
    return {
      name: "RS Party Hub",
      version: "0.2.0",
      lanCandidates: urls.candidates,
      baseUrl: urls.baseUrl.replace("----", "").slice(0, -4),
      internet: "unknown",
    };
  });
  app.get("/api/v1/network", async () => {
    const urls = buildJoinUrls({ port: deps.cfg.port, roomCode: "----" });
    return {
      name: "RS Party Hub",
      version: "0.2.0",
      lanCandidates: urls.candidates,
      baseUrl: urls.baseUrl.replace("----", "").slice(0, -4),
      internet: "unknown",
    };
  });

  app.get("/api/games", async () => {
    return { games: deps.rooms.registry.list() };
  });
  app.get("/api/v1/games", async () => {
    return { games: deps.rooms.registry.list() };
  });
  // §180.8 single game lookup stub (manifest)
  app.get<{ Params: { pluginId: string } }>("/api/games/:pluginId", async (req, reply) => {
    const g = deps.rooms.registry.get(req.params.pluginId);
    if (!g) { reply.code(404); return { error: "GAME_NOT_FOUND" }; }
    return { game: g.manifest ?? g };
  });
  app.get<{ Params: { pluginId: string } }>("/api/v1/games/:pluginId", async (req, reply) => {
    const g = deps.rooms.registry.get(req.params.pluginId);
    if (!g) { reply.code(404); return { error: "GAME_NOT_FOUND" }; }
    return { game: g.manifest ?? g };
  });

  registerPackRoutes(app, { packs: deps.packs, adminToken: deps.adminToken, adminSessionSecret: deps.cfg.adminSessionSecret });
  registerMediaRoutes(app, { media: deps.media, adminToken: deps.adminToken });
  registerJukeboxRoutes(app, { jukebox: deps.jukebox, adminToken: deps.adminToken });
  registerPhotoWallRoutes(app, { media: deps.media, db: deps.rooms.db, adminToken: deps.adminToken });
  registerChatRoutes(app, { rooms: deps.rooms, chat: deps.chat ?? new ChatService(deps.rooms.db), adminToken: deps.adminToken });
  registerI18nRoutes(app);
  registerDiagnosticsRoutes(app, { cfg: deps.cfg, db: deps.rooms.db, packs: deps.packs, rooms: deps.rooms, adminToken: deps.adminToken, startedAt });

  // Security headers (spec AK.4 / §25.5) — safe for HTTP LAN
  app.addHook("onSend", async (_req, reply) => {
    reply.header("X-Content-Type-Options", "nosniff");
    reply.header("Referrer-Policy", "no-referrer");
    reply.header("X-Frame-Options", "SAMEORIGIN");
    reply.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    reply.header("X-Powered-By", "RS Party Hub");
    // Non-HTML responses have no inline script to authorize.
    if (!reply.hasHeader("Content-Security-Policy")) {
      reply.header("Content-Security-Policy", contentSecurityPolicy());
    }
    reply.header("Cache-Control", "no-store");
  });

  /** Verify admin authentication: session cookie first, then x-admin-token fallback */
function requireAdmin(req: import("fastify").FastifyRequest): boolean {
  // 1) Check session cookie first
  const cookieHeader = req.headers["cookie"];
  let sessionCookie: string | undefined;
  if (cookieHeader) {
    const parts = cookieHeader.split(";").map(p => p.trim());
    for (const part of parts) {
      if (part.startsWith("admin-session=")) {
        sessionCookie = part.split("=")[1];
        break;
      }
    }
  }
  if (deps.cfg.adminSessionSecret) {
    const verified = verifySessionToken(sessionCookie, deps.cfg.adminSessionSecret);
    if (verified.valid) return true;
  }
  // 2) Fall back to header token (backward-compatible automation)
  const header = req.headers["x-admin-token"];
  if (deps.cfg.adminToken && header === deps.cfg.adminToken) return true;
  return false;
}

/** POST /api/admin/login — validate PIN, set session cookie */
app.post("/api/admin/login", async (req, reply) => {
  const { pin } = req.body as { pin?: string };
  if (!pin) {
    reply.code(400);
    return { error: "PIN_REQUIRED" };
  }
  // Verify PIN against stored hash
  if (!deps.cfg.adminPinHash) {
    reply.code(503);
    return { error: "ADMIN_NOT_CONFIGURED" };
  }
  const valid = createHash("sha256").update(pin).digest("hex") === deps.cfg.adminPinHash;
  if (!valid) {
    reply.code(401);
    return { error: "INVALID_PIN" };
  }
  // Create signed session token
  const sessionId = randomBytes(16).toString("hex");
  const token = signSessionToken(sessionId, deps.cfg.adminSessionSecret ?? "");
  reply.cookie("admin-session", token, {
    httpOnly: true,
    secure: false, // LAN only; HTTPS would use true
    path: "/",
    sameSite: "lax",
  });
  return { ok: true };
});

/** POST /api/admin/logout — clear session cookie */
app.post("/api/admin/logout", async (req, reply) => {
  reply.clearCookie("admin-session", {
    httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "lax",
  });
  return { ok: true };
});

app.get("/api/admin/overview", async (req, reply) => {
    if (!requireAdmin(req)) {
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
