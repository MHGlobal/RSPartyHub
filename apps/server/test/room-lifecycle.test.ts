import { afterEach, describe, expect, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GameRegistry } from "@rs-party/game-engine";
import { ChatRepository, Database, MediaRepository } from "@rs-party/persistence";
import type { ServerConfig } from "../src/config.js";
import { RoomManager } from "../src/rooms/room-manager.js";

const homes: string[] = [];

afterEach(() => {
  for (const home of homes.splice(0)) rmSync(home, { recursive: true, force: true });
});

function setup(ttl = 1_000) {
  const home = mkdtempSync(join(tmpdir(), "rsparty-room-lifecycle-"));
  homes.push(home);
  const cfg: ServerConfig = {
    port: 0,
    host: "127.0.0.1",
    homeDir: home,
    dbFile: join(home, "data", "rsparty.sqlite"),
    maxPlayersDefault: 12,
    resultsViewMs: 2_000,
    disconnectGraceMs: 60_000,
    roomIdleTtlMs: ttl,
    rateLimitMultiplier: 1,
    mdnsEnabled: false,
    logLevel: "silent",
  };
  return { home, cfg, registry: new GameRegistry() };
}

describe("RoomManager durable lobby lifecycle", () => {
  it("rehydrates a lobby without a game including settings, lock, players, and ready state", () => {
    const { cfg, registry } = setup();
    const firstDb = new Database(cfg.dbFile);
    const first = new RoomManager(firstDb, registry, cfg);
    const { room, result: host } = first.createRoomAsHost(7, {
      nickname: "Host",
      avatar: { icon: "🎤", bg: "#123456" },
    });
    const player = first.join(room.code, {
      nickname: "Player",
      avatar: { icon: "🎮", bg: "#abcdef" },
    });
    first.setReady(room.id, player.playerId, true);
    first.hostControl(room.id, host.playerId, { op: "lock-joins", locked: true });
    first.roomRepo.update(room.id, { settings_json: JSON.stringify({ theme: "neon" }) });
    first.dispose();
    firstDb.close();

    const secondDb = new Database(cfg.dbFile);
    const second = new RoomManager(secondDb, registry, cfg);
    expect(second.rehydrate()).toBe(1);

    const restored = second.byCode(room.code)!;
    expect(restored).toMatchObject({
      id: room.id,
      phase: "lobby",
      locked: true,
      maxPlayers: 7,
      settings: { theme: "neon" },
    });
    expect(restored.players.get(host.playerId)).toMatchObject({ ready: true, role: "host", connected: false });
    expect(restored.players.get(player.playerId)).toMatchObject({ ready: true, role: "player", connected: false });
    second.dispose();
    secondDb.close();
  });

  it("explicitly sweeps only expired idle lobbies and their owned resources", () => {
    const { cfg, home, registry } = setup(1_000);
    const db = new Database(cfg.dbFile);
    const rooms = new RoomManager(db, registry, cfg);
    const { room: stale } = rooms.createRoomAsHost(undefined, {
      nickname: "Old host",
      avatar: { icon: "🎤", bg: "#111111" },
    });
    rooms.roomRepo.touch(stale.id, 1_000);
    new ChatRepository(db).create({
      id: "chat-old",
      roomId: stale.id,
      authorPlayerId: rooms.hostOf(stale),
      text: "old",
      now: 1_000,
    });
    const uploads = join(home, "uploads", "approved");
    mkdirSync(uploads, { recursive: true });
    writeFileSync(join(uploads, "old.png"), "old");
    new MediaRepository(db).create({
      id: "media-old",
      roomId: stale.id,
      kind: "image",
      originalName: "old.png",
      storageKey: "old.png",
      mime: "image/png",
      bytes: 3,
      sha256: "hash",
      now: 1_000,
    });

    const protectedRoom = rooms.createRoom();
    rooms.roomRepo.update(protectedRoom.id, { status: "game" });
    rooms.roomRepo.touch(protectedRoom.id, 1_000);

    expect(rooms.sweepIdleRooms(1_999)).toBe(0);
    expect(rooms.sweepIdleRooms(2_000)).toBe(1);
    expect(rooms.byId(stale.id)).toBeUndefined();
    expect(rooms.roomRepo.byId(stale.id)).toBeUndefined();
    expect(rooms.playerRepo.byRoom(stale.id)).toEqual([]);
    expect(new ChatRepository(db).list(stale.id)).toEqual([]);
    expect(new MediaRepository(db).byId("media-old")).toBeUndefined();
    expect(existsSync(join(uploads, "old.png"))).toBe(false);
    expect(rooms.byId(protectedRoom.id)).toBeDefined();
    expect(rooms.roomRepo.byId(protectedRoom.id)?.status).toBe("game");
    rooms.dispose();
    db.close();
  });
});
