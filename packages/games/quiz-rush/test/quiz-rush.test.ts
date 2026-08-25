import { describe, expect, it } from "vitest";
import { GameHarness } from "@rs-party/game-engine";
import quizRushPlugin from "../src/index.js";

const PREP_MS = 3000;
const RESULT_MS = 4000;

function makeHarness(players = 2) {
  return new GameHarness(quizRushPlugin, {
    players: Array.from({ length: players }, (_, i) => ({
      playerId: `p${i + 1}`,
      nickname: `Player${i + 1}`,
      role: "player" as const,
    })),
    settings: { rounds: 2, secondsPerQuestion: 10 },
    seed: 1234,
  });
}

/** ROUND_PREP → ACTIVE at current clock position. */
function enterActive(h: ReturnType<typeof makeHarness>) {
  h.clock.advance(PREP_MS + 100);
  h.runTickUntil((s) => s.phase === "ACTIVE");
  expect(h.state.phase).toBe("ACTIVE");
}

/** Everyone answers → auto-resolve without waiting for the timer. */
function playRound(
  h: ReturnType<typeof makeHarness>,
  correctOf: (p: string) => number,
) {
  enterActive(h);
  for (const p of h.ctx.players) {
    if (p.role !== "player") continue;
    h.act("SUBMIT_ANSWER", { choice: correctOf(p.playerId) }, p.playerId);
  }
  expect(h.state.phase).toBe("ROUND_RESULT");
  return h.state.questions[h.state.current]!;
}

/** ROUND_RESULT → next ROUND_PREP → ACTIVE. */
function nextRoundActive(h: ReturnType<typeof makeHarness>, round: number) {
  h.clock.advance(RESULT_MS + 100);
  h.runTickUntil((s) => s.phase === "ROUND_PREP" && s.roundNumber === round);
  expect(h.state.roundNumber).toBe(round);
  enterActive(h);
}

describe("Quiz Rush — spec §14.1 minimum test set", () => {
  it("completes a game with the minimum number of players deterministically", () => {
    const runA = () => {
      const h = makeHarness(2);
      const answer = (playerId: string) => {
        const q = h.state.questions[h.state.current]!;
        // p1 always right, p2 always wrong ⇒ single deterministic winner
        return playerId === "p1" ? q.correctIndex : (q.correctIndex + 1) % q.choices.length;
      };
      enterActive(h);
      for (const p of h.ctx.players) {
        if (p.role !== "player") continue;
        h.act("SUBMIT_ANSWER", { choice: answer(p.playerId) }, p.playerId);
      }
      nextRoundActive(h, 2);
      for (const p of h.ctx.players) {
        if (p.role !== "player") continue;
        h.act("SUBMIT_ANSWER", { choice: answer(p.playerId) }, p.playerId);
      }
      h.clock.advance(RESULT_MS + 100);
      h.runTickUntil((s) => s.phase === "GAME_RESULT");
      return h.plugin.score(h.state, h.ctx);
    };
    const a = runA();
    const b = runA();
    expect(a.roundScores).toEqual(b.roundScores); // seeded PRNG ⇒ deterministic
    expect(Object.keys(a.titles ?? {})).toEqual(["p1"]);
  });

  it("rejects a duplicate answer and never double-scores", () => {
    const h = makeHarness(3);
    enterActive(h);
    h.act("SUBMIT_ANSWER", { choice: 0 }, "p1");
    const res = h.tryAct("SUBMIT_ANSWER", { choice: 1 }, "p1");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.code).toBe("DUPLICATE_ACTION");
  });

  it("rejects invalid payloads (choice out of range / wrong type)", () => {
    const h = makeHarness(2);
    enterActive(h);
    expect(h.validate("SUBMIT_ANSWER", { choice: 9 }).ok).toBe(false);
    expect(h.validate("SUBMIT_ANSWER", { choice: "x" }).ok).toBe(false);
    expect(h.validate("SUBMIT_ANSWER", {}).ok).toBe(false);
  });

  it("resolves the round automatically when the deadline passes", () => {
    const h = makeHarness(2);
    enterActive(h);
    // only p1 answers; p2 stays silent until deadline
    h.act("SUBMIT_ANSWER", { choice: 0 }, "p1");
    expect(h.state.phase).toBe("ACTIVE");
    h.clock.advance(10_100); // > secondsPerQuestion
    h.runTickUntil((s) => s.phase !== "ACTIVE");
    expect(h.state.phase).toBe("ROUND_RESULT");
    // p2 streak reset recorded
    expect(h.state.streaks["p2"]).toBe(0);
  });

  it("never leaks the correct index during ACTIVE phase (anti-cheat)", () => {
    const h = makeHarness(2);
    enterActive(h);
    const pub = JSON.stringify(h.publicView());
    const priv = JSON.stringify(h.privateView("p1"));
    expect(pub.includes("correct")).toBe(false);
    expect(priv.includes("correct")).toBe(false);
  });

  it("defines explicit tie resolution at game over", () => {
    const h = makeHarness(2);
    // both answer identically every round → guaranteed tie
    playRound(h, () => 0);
    nextRoundActive(h, 2);
    playRound(h, () => 1);
    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "GAME_RESULT");
    const score = h.plugin.score(h.state, h.ctx);
    const winners = Object.keys(score.titles ?? {});
    expect(winners.sort()).toEqual(["p1", "p2"]); // both share the title
    expect(score.awards?.[0]?.kind).toBe("tie");
  });

  it("declares lateJoin policy spectatorUntilRound in its manifest", () => {
    expect(quizRushPlugin.manifest.lateJoin).toBe("spectatorUntilRound");
  });

  it("keeps totals consistent with score() mid-game", () => {
    const h = makeHarness(2);
    playRound(h, () => 0);
    const partialTotals = Object.values(h.state.totals).reduce((a, b) => a + b, 0);
    const s = h.plugin.score(h.state, h.ctx);
    const sumDeltas = s.roundScores.reduce((acc, r) => acc + r.delta, 0);
    expect(sumDeltas).toBe(partialTotals);
  });
});
