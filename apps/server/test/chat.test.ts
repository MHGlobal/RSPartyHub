import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Database, PlayerRepository, RoomRepository, sha256 } from "@rs-party/persistence";
import { GameRegistry } from "@rs-party/game-engine";
import { PackLibrary } from "@rs-party/content";
import { buildHttp } from "../src/http.js";
import { RoomManager } from "../src/rooms/room-manager.js";
import { registerAllGames } from "../src/runtime/register-games.js";
import { MediaService } from "../src/media/media-service.js";
import { JukeboxService } from "../src/jukebox/jukebox-service.js";
import { ChatService } from "../src/chat/chat-service.js";

let app: Awaited<ReturnType<typeof buildHttp>>;
let db: Database;
let rooms: RoomManager;
let home: string;
const adminToken = "chat-test-admin-token";
const config = (homeDir: string) => ({ port: 3210, host: "127.0.0.1", homeDir, dbFile: join(homeDir, "data/rsparty.sqlite"), maxPlayersDefault: 12, resultsViewMs: 2_000, disconnectGraceMs: 60_000, rateLimitMultiplier: 1 }) as never;

function auth(player: { playerId: string; resumeToken: string }) {
  return { "x-player-id": player.playerId, "x-resume-token": player.resumeToken };
}

describe("room chat HTTP service", () => {
  beforeAll(async () => {
    home = mkdtempSync(join(tmpdir(), "rsparty-chat-"));
    db = new Database(join(home, "data/rsparty.sqlite"));
    const registry = new GameRegistry();
    await registerAllGames(registry);
    const packs = new PackLibrary(join(home, "library/packs"));
    rooms = new RoomManager(db, registry, config(home), packs);
    app = await buildHttp({ cfg: config(home), rooms, packs, media: new MediaService(db, home), jukebox: new JukeboxService(db), chat: new ChatService(db), adminToken });
  });

  afterAll(async () => { await app.close(); db.close(); rmSync(home, { recursive: true, force: true }); });

  it("rejects unauthenticated and forged chat authors", async () => {
    const owner = rooms.createRoomAsHost(undefined, { nickname: "Owner", avatar: { icon: "star", bg: "blue" } }).result;
    const noAuth = await app.inject({ method: "POST", url: `/api/rooms/${owner.roomCode}/chat`, payload: { text: "hello" } });
    expect(noAuth.statusCode).toBe(401);
    const forged = await app.inject({ method: "POST", url: `/api/rooms/${owner.roomCode}/chat`, headers: { "x-player-id": owner.playerId, "x-resume-token": "forged" }, payload: { text: "hello" } });
    expect(forged.statusCode).toBe(403);
  });

  it("stores normalized escaped text, enforces its length, and scopes messages to rooms", async () => {
    const owner = rooms.createRoomAsHost(undefined, { nickname: "Text owner", avatar: { icon: "sun", bg: "yellow" } }).result;
    const other = rooms.createRoomAsHost(undefined, { nickname: "Other room", avatar: { icon: "moon", bg: "black" } }).result;
    const created = await app.inject({ method: "POST", url: `/api/rooms/${owner.roomCode}/chat`, headers: auth(owner), payload: { text: "  <img src=x onerror=alert(1)>\r\nHi  " } });
    expect(created.statusCode).toBe(201);
    const message = JSON.parse(created.body).message as { id: string; text: string };
    expect(message.text).toBe("&lt;img src=x onerror=alert(1)&gt;\nHi");
    const tooLong = await app.inject({ method: "POST", url: `/api/rooms/${owner.roomCode}/chat`, headers: auth(owner), payload: { text: "x".repeat(501) } });
    expect(tooLong.statusCode).toBe(400);
    expect(JSON.parse(tooLong.body)).toEqual({ error: "MESSAGE_TOO_LONG" });
    const ownList = await app.inject({ method: "GET", url: `/api/rooms/${owner.roomCode}/chat` });
    expect(JSON.parse(ownList.body).messages).toHaveLength(1);
    const otherList = await app.inject({ method: "GET", url: `/api/rooms/${other.roomCode}/chat` });
    expect(JSON.parse(otherList.body).messages).toHaveLength(0);
  });

  it("prevents cross-owner deletion and permits admin deletion and mute moderation", async () => {
    const owner = rooms.createRoomAsHost(undefined, { nickname: "Delete owner", avatar: { icon: "star", bg: "blue" } }).result;
    const intruder = rooms.join(owner.roomCode, { nickname: "Intruder", avatar: { icon: "moon", bg: "red" } });
    const posted = await app.inject({ method: "POST", url: `/api/rooms/${owner.roomCode}/chat`, headers: auth(owner), payload: { text: "mine" } });
    const messageId = JSON.parse(posted.body).message.id as string;
    const denied = await app.inject({ method: "DELETE", url: `/api/rooms/${owner.roomCode}/chat/${messageId}`, headers: auth(intruder) });
    expect(denied.statusCode).toBe(403);
    const muted = await app.inject({ method: "PUT", url: `/api/admin/rooms/${owner.roomCode}/chat/players/${owner.playerId}/mute`, headers: { "x-admin-token": adminToken }, payload: { muted: true } });
    expect(muted.statusCode).toBe(200);
    const blocked = await app.inject({ method: "POST", url: `/api/rooms/${owner.roomCode}/chat`, headers: auth(owner), payload: { text: "blocked" } });
    expect(blocked.statusCode).toBe(403);
    const unmuted = await app.inject({ method: "PUT", url: `/api/admin/rooms/${owner.roomCode}/chat/players/${owner.playerId}/mute`, headers: { "x-admin-token": adminToken }, payload: { muted: false } });
    expect(unmuted.statusCode).toBe(200);
    const adminDelete = await app.inject({ method: "DELETE", url: `/api/rooms/${owner.roomCode}/chat/${messageId}`, headers: { "x-admin-token": adminToken } });
    expect(adminDelete.statusCode).toBe(200);
  });

  it("rate limits chat per player on the server", async () => {
    const owner = rooms.createRoomAsHost(undefined, { nickname: "Rate owner", avatar: { icon: "bolt", bg: "green" } }).result;
    for (let i = 0; i < 5; i++) {
      expect((await app.inject({ method: "POST", url: `/api/rooms/${owner.roomCode}/chat`, headers: auth(owner), payload: { text: `message ${i}` } })).statusCode).toBe(201);
    }
    const limited = await app.inject({ method: "POST", url: `/api/rooms/${owner.roomCode}/chat`, headers: auth(owner), payload: { text: "too fast" } });
    expect(limited.statusCode).toBe(429);
    expect(JSON.parse(limited.body)).toEqual({ error: "RATE_LIMITED" });
  });

  it("persists messages across a database reopen", () => {
    const file = join(home, "persistence.sqlite");
    const first = new Database(file);
    const roomsRepo = new RoomRepository(first);
    const players = new PlayerRepository(first);
    roomsRepo.create({ id: "persist-room", code: "PERSIST", maxPlayers: 2, now: 1 });
    players.create({ id: "persist-player", roomId: "persist-room", nickname: "Persist", avatarIcon: "star", avatarBg: "blue", role: "player", resumeTokenHash: sha256("persist-token"), capabilities: {}, now: 1 });
    new ChatService(first).post("persist-room", "persist-player", "saved");
    first.close();
    const reopened = new Database(file);
    expect(new ChatService(reopened).list("persist-room").map((m) => m.text)).toEqual(["saved"]);
    reopened.close();
  });
});
