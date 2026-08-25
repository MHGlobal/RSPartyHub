import { describe, expect, it } from "vitest";
import { Database, GameInstanceRepository, RoomRepository } from "@rs-party/persistence";
import quizRushPlugin from "@rs-party/games-quiz-rush";
import { GameRuntime } from "../src/runtime/game-runtime.js";

function makeRuntime() {
  const db = new Database(":memory:");
  const games = new GameInstanceRepository(db);
  const rooms = new RoomRepository(db);
  rooms.create({ id: "room1", code: "ABCD", maxPlayers: 8, now: Date.now() });
  const rt = new GameRuntime(
    quizRushPlugin,
    "room1",
    42,
    games,
    () => [
      { playerId: "p1", nickname: "A", role: "player" },
      { playerId: "p2", nickname: "B", role: "player" },
    ],
    () => ({ rounds: 2, secondsPerQuestion: 5 }),
    () => {},
    () => {},
  );
  return { rt, games, db };
}

describe("runtime tick advancement", () => {
  it("advances ROUND_PREP → ACTIVE after the deadline", async () => {
    const { rt, db } = makeRuntime();
    expect(rt.state.phase).toBe("ROUND_PREP");
    await new Promise((r) => setTimeout(r, 3600));
    // manual sweep in case timers are flaky under vitest fake envs
    rt.sweep();
    expect(rt.state.phase).toBe("ACTIVE");
    db.close();
  }, 10_000);
});
