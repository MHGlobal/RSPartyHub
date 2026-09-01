import type { FastifyInstance, FastifyRequest } from "fastify";
import { sha256, type PlayerRow } from "@rs-party/persistence";
import type { RoomManager } from "../rooms/room-manager.js";
import { ChatError, type ChatService } from "./chat-service.js";

export function registerChatRoutes(app: FastifyInstance, deps: { rooms: RoomManager; chat: ChatService; adminToken?: string }): void {
  app.get<{ Params: { roomCode: string }; Querystring: { limit?: string } }>("/api/rooms/:roomCode/chat", async (req, reply) => {
    const room = deps.rooms.byCode(req.params.roomCode.toUpperCase());
    if (!room) return respond(reply, 404, "ROOM_NOT_FOUND");
    return { messages: deps.chat.list(room.id, Number(req.query.limit ?? 50)) };
  });

  app.post<{ Params: { roomCode: string }; Body: { text?: unknown } }>("/api/rooms/:roomCode/chat", async (req, reply) => {
    const room = deps.rooms.byCode(req.params.roomCode.toUpperCase());
    if (!room) return respond(reply, 404, "ROOM_NOT_FOUND");
    const actor = authenticate(req, deps.rooms, room.id, reply);
    if (!actor) return;
    try {
      const message = deps.chat.post(room.id, actor.id, req.body?.text);
      reply.code(201);
      return { message };
    } catch (error) { return chatError(reply, error); }
  });

  app.delete<{ Params: { roomCode: string; messageId: string } }>("/api/rooms/:roomCode/chat/:messageId", async (req, reply) => {
    const room = deps.rooms.byCode(req.params.roomCode.toUpperCase());
    if (!room) return respond(reply, 404, "ROOM_NOT_FOUND");
    const isAdmin = isAdminRequest(req, deps.adminToken);
    const actor = isAdmin ? undefined : authenticate(req, deps.rooms, room.id, reply);
    if (!isAdmin && !actor) return;
    try {
      deps.chat.delete(room.id, req.params.messageId, actor?.id, isAdmin);
      return { ok: true };
    } catch (error) { return chatError(reply, error); }
  });

  app.put<{ Params: { roomCode: string; playerId: string }; Body: { muted?: boolean; mutedUntil?: number | null } }>("/api/admin/rooms/:roomCode/chat/players/:playerId/mute", async (req, reply) => {
    if (!isAdminRequest(req, deps.adminToken)) return respond(reply, 401, "UNAUTHORIZED");
    const room = deps.rooms.byCode(req.params.roomCode.toUpperCase());
    if (!room) return respond(reply, 404, "ROOM_NOT_FOUND");
    if (typeof req.body?.muted !== "boolean") return respond(reply, 400, "INVALID_PAYLOAD");
    const until = req.body.mutedUntil;
    if (until !== undefined && until !== null && (!Number.isSafeInteger(until) || until <= Date.now())) return respond(reply, 400, "INVALID_PAYLOAD");
    try {
      deps.chat.setMute(room.id, req.params.playerId, req.body.muted, until);
      return { ok: true, muted: req.body.muted };
    } catch (error) { return chatError(reply, error); }
  });
}

function authenticate(req: FastifyRequest, rooms: RoomManager, roomId: string, reply: { code(statusCode: number): unknown }): PlayerRow | undefined {
  const playerId = req.headers["x-player-id"];
  const resumeToken = req.headers["x-resume-token"];
  if (typeof playerId !== "string" || typeof resumeToken !== "string" || !playerId || !resumeToken) {
    respond(reply, 401, "UNAUTHORIZED");
    return undefined;
  }
  const player = rooms.db.prepare(`SELECT * FROM players WHERE id = ? AND resume_token_hash = ? AND kicked = 0`).get(playerId, sha256(resumeToken)) as PlayerRow | undefined;
  if (!player || player.room_id !== roomId) {
    respond(reply, 403, "FORBIDDEN");
    return undefined;
  }
  return player;
}

function isAdminRequest(req: FastifyRequest, adminToken?: string): boolean {
  return !!adminToken && req.headers["x-admin-token"] === adminToken;
}

function respond(reply: { code(statusCode: number): unknown }, status: number, error: string): { error: string } {
  reply.code(status);
  return { error };
}

function chatError(reply: { code(statusCode: number): unknown }, error: unknown): { error: string } {
  if (!(error instanceof ChatError)) return respond(reply, 500, "INTERNAL");
  const status = error.code === "NOT_FOUND" ? 404 : error.code === "FORBIDDEN" || error.code === "MUTED" ? 403 : error.code === "RATE_LIMITED" ? 429 : 400;
  return respond(reply, status, error.code);
}
