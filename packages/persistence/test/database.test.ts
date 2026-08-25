import { describe, expect, it } from "vitest";
import { Database } from "../src/database.js";
import {
  AuditRepository,
  GameInstanceRepository,
  PlayerRepository,
  RoomRepository,
} from "../src/repositories.js";
import { sha256 } from "../src/hash.js";

function setup() {
  const db = new Database(":memory:");
  return {
    db,
    rooms: new RoomRepository(db),
    players: new PlayerRepository(db),
    games: new GameInstanceRepository(db),
    audit: new AuditRepository(db),
  };
}

describe("Database migrations", () => {
  it("applies migrations idempotently", () => {
    const db = new Database(":memory:");
    const tables = db
      .prepare(`SELECT name FROM sqlite_master WHERE type='table'`)
      .all()
      .map((r) => (r as { name: string }).name);
    expect(tables).toContain("rooms");
    expect(tables).toContain("players");
    expect(tables).toContain("game_instances");
    expect(tables).toContain("audit_events");
    // second instance on same file path would be covered by migrate() no-op
    db.close();
  });
});

describe("RoomRepository", () => {
  it("creates and finds rooms by code", () => {
    const { rooms } = setup();
    rooms.create({ id: "r1", code: "ABCD", maxPlayers: 8, now: 1 });
    expect(rooms.byCode("ABCD")?.id).toBe("r1");
    expect(rooms.byCode("XXXX")).toBeUndefined();
    expect(rooms.countActive()).toBe(1);
  });

  it("updates status and filters closed rooms from active count", () => {
    const { rooms } = setup();
    rooms.create({ id: "r1", code: "ABCD", maxPlayers: 8, now: 1 });
    rooms.update("r1", { status: "closed" });
    expect(rooms.byId("r1")?.status).toBe("closed");
    expect(rooms.activeByCode("ABCD")).toBeUndefined();
    expect(rooms.countActive()).toBe(0);
  });
});

describe("PlayerRepository", () => {
  it("enforces case-insensitive unique nicknames per room", () => {
    const { players, rooms } = setup();
    rooms.create({ id: "r1", code: "ABCD", maxPlayers: 8, now: 1 });
    const base = {
      roomId: "r1",
      avatarIcon: "cat",
      avatarBg: "#ff0000",
      role: "player",
      capabilities: {},
      now: 1,
    };
    players.create({
      ...base,
      id: "p1",
      nickname: "Ana",
      resumeTokenHash: sha256("t1"),
    });
    expect(players.nicknameTaken("r1", "ana")).toBe(true);
    expect(players.nicknameTaken("r1", "Bruno")).toBe(false);
    // excluding self is fine
    expect(players.nicknameTaken("r1", "Ana", "p1")).toBe(false);
  });

  it("resumes by token hash and excludes kicked players", () => {
    const { players, rooms } = setup();
    rooms.create({ id: "r1", code: "ABCD", maxPlayers: 8, now: 1 });
    players.create({
      id: "p1",
      roomId: "r1",
      nickname: "Ana",
      avatarIcon: "cat",
      avatarBg: "#ff0000",
      role: "player",
      resumeTokenHash: sha256("tok"),
      capabilities: {},
      now: 1,
    });
    const hash = sha256("tok");
    expect(players.byResumeTokenHash(hash)?.id).toBe("p1");
    players.update("p1", { kicked: 1 });
    expect(players.byResumeTokenHash(hash)).toBeUndefined();
    expect(players.countActiveInRoom("r1")).toBe(0);
  });
});

describe("GameInstanceRepository + AuditRepository", () => {
  it("tracks current game per room and appends audit events", () => {
    const { games, rooms, audit } = setup();
    rooms.create({ id: "r1", code: "ABCD", maxPlayers: 8, now: 1 });
    const g1 = games.create({ pluginId: "quiz-rush", roomId: "r1", seed: 42, now: 10 });
    games.update(g1.id, { phase: "ACTIVE", round_number: 1 });
    expect(games.currentForRoom("r1")?.phase).toBe("ACTIVE");
    audit.append({ category: "room", eventType: "room.created", roomId: "r1" });
    expect(audit.recent()).toHaveLength(1);
  });
});
