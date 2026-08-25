import { describe, expect, it } from "vitest";
import { GameHarness } from "@rs-party/game-engine";
import type { RoomPlayerRef } from "@rs-party/game-engine";
import majorityVotePlugin from "../src/index.js";
import type { MajorityVoteState, MajorityPublicView } from "../src/index.js";
import { questionBank } from "../src/bank.js";

const PREP_MS = 3000;
const RESULT_MS = 4000;

/** Unwrap a ValidationResult for assertions (undefined when ok). */
function codeOf(r: { ok: true } | { ok: false; code: string }): string | undefined {
  return r.ok ? undefined : r.code;
}

function players(n: number): RoomPlayerRef[] {
  return Array.from({ length: n }, (_, i) => ({
    playerId: `p${i + 1}`,
    nickname: `Player${i + 1}`,
    role: "player" as const,
  }));
}

function makeHarness(opts?: {
  playerCount?: number;
  rounds?: number;
  seed?: number;
  withSpectator?: boolean;
}) {
  const roster = [...players(opts?.playerCount ?? 3)];
  if (opts?.withSpectator) {
    roster.push({ playerId: "spec", nickname: "Spectator", role: "spectator" });
  }
  return new GameHarness<MajorityVoteState>(majorityVotePlugin, {
    players: roster,
    settings: { rounds: opts?.rounds ?? 2, secondsPerQuestion: 20 },
    seed: opts?.seed ?? 1234,
  });
}

/** ROUND_PREP → ACTIVE at the current clock position. */
function enterActive(h: ReturnType<typeof makeHarness>) {
  h.clock.advance(PREP_MS + 100);
  h.runTickUntil((s) => s.phase === "ACTIVE");
  expect(h.state.phase).toBe("ACTIVE");
}

/** Advance through RESULT into the next ROUND_PREP (or GAME_RESULT when done). */
function leaveResult(h: ReturnType<typeof makeHarness>) {
  h.clock.advance(RESULT_MS + 100);
  h.runTickUntil((s) => s.phase !== "ROUND_RESULT");
}

describe("Majority Vote — spec §14.2 minimum test set", () => {
  it("completes a full game deterministically (plurality +100, unanimous +50 bonus)", () => {
    const run = () => {
      const h = makeHarness({ playerCount: 3, rounds: 2 });

      // round 1: unanimous ⇒ everyone +150
      enterActive(h);
      for (const pid of ["p1", "p2", "p3"]) h.act("VOTE", { optionId: "b" }, pid);
      expect(h.state.phase).toBe("ROUND_RESULT"); // early close on last vote
      expect(h.state.lastRound?.unanimous).toBe(true);
      expect(h.state.lastRound?.majority).toBe("b");

      leaveResult(h);

      // round 2: 2-1 split ⇒ only the two plurality voters score
      enterActive(h);
      h.act("VOTE", { optionId: "a" }, "p1");
      h.act("VOTE", { optionId: "a" }, "p2");
      expect(h.state.phase).toBe("ACTIVE"); // p3 silent so far
      h.act("VOTE", { optionId: "c" }, "p3");
      expect(h.state.phase).toBe("ROUND_RESULT");
      expect(h.state.lastRound?.majority).toBe("a");

      leaveResult(h);
      h.runTickUntil((s) => s.phase === "GAME_RESULT");
      expect(h.finished()).toBe(true);
      return { score: h.score(), totals: { ...h.state.totals } };
    };

    const a = run();
    const b = run();
    expect(a.score.roundScores).toEqual(b.score.roundScores); // seeded PRNG
    expect(a.totals).toEqual(b.totals);
    expect(a.totals).toEqual({ p1: 250, p2: 250, p3: 150 });
    // shared title between the tied winners
    expect(Object.keys(a.score.titles ?? {}).sort()).toEqual(["p1", "p2"]);
    expect(a.score.awards?.[0]?.kind).toBe("tie");
  });

  it("rejects duplicate votes within the same round but allows voting next round", () => {
    const h = makeHarness({ playerCount: 3, rounds: 2 });
    enterActive(h);
    h.act("VOTE", { optionId: "a" }, "p1");
    const dup = h.tryAct("VOTE", { optionId: "c" }, "p1"); // even switching is a duplicate
    expect(dup.ok).toBe(false);
    if (!dup.ok) expect(dup.code).toBe("DUPLICATE_ACTION");

    h.act("VOTE", { optionId: "a" }, "p2");
    h.act("VOTE", { optionId: "a" }, "p3");
    leaveResult(h);
    enterActive(h); // round 2 — fresh vote registry
    expect(h.tryAct("VOTE", { optionId: "d" }, "p1").ok).toBe(true);
  });

  it("rejects spectators and invalid payloads / wrong phases", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1, withSpectator: true });
    expect(codeOf(h.validate("VOTE", { optionId: "a" }, "spec"))).toBe("FORBIDDEN");
    expect(codeOf(h.validate("VOTE", { optionId: "a" }, "p1"))).toBe("BAD_PHASE"); // ROUND_PREP

    enterActive(h);
    expect(codeOf(h.validate("VOTE", { optionId: "e" }, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("VOTE", { optionId: "" }, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("VOTE", { optionId: 0 }, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("VOTE", {}, "p1"))).toBe("INVALID_PAYLOAD");
    expect(h.validate("TEXT", { text: "oi" }).ok).toBe(false); // unknown action type

    h.act("VOTE", { optionId: "d" }, "p1");
    expect(codeOf(h.validate("VOTE", { optionId: "d" }, "p1"))).toBe("DUPLICATE_ACTION");
  });

  it("advances phases via deadlines; total silence yields an empty void round", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1 });
    enterActive(h);
    h.clock.advance(20_100); // > secondsPerQuestion
    h.runTickUntil((s) => s.phase === "ROUND_RESULT");
    const lr = h.state.lastRound!;
    expect(lr.majority).toBeNull();
    expect(lr.correctIds).toEqual([]);
    expect(lr.distribution).toEqual({ a: 0, b: 0, c: 0, d: 0 });
    expect(Object.keys(h.state.totals)).toEqual([]);

    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "GAME_RESULT");
    expect(h.score().titles).toBeUndefined(); // nobody scored ⇒ no title
  });

  it("closes the round early when every player has voted", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1 });
    enterActive(h);
    expect(h.state.deadlineAt).toBeDefined();
    h.act("VOTE", { optionId: "a" }, "p1");
    expect(h.state.phase).toBe("ACTIVE");
    h.act("VOTE", { optionId: "a" }, "p2");
    expect(h.state.phase).toBe("ACTIVE"); // still missing p3
    h.act("VOTE", { optionId: "a" }, "p3");
    expect(h.state.phase).toBe("ROUND_RESULT"); // early close well before deadline
  });

  it("voids the round on a tied plurality (no points for anyone)", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1 });
    enterActive(h);
    h.act("VOTE", { optionId: "a" }, "p1");
    h.act("VOTE", { optionId: "b" }, "p2");
    // p3 abstains until the deadline ⇒ 1-1 tie at the top
    h.clock.advance(20_100);
    h.runTickUntil((s) => s.phase === "ROUND_RESULT");
    expect(h.state.lastRound?.majority).toBeNull();
    expect(Object.keys(h.state.totals)).toEqual([]); // tie ⇒ void round
  });

  it("keeps votes secret during ACTIVE and reveals only the distribution after", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1 });
    enterActive(h);
    h.act("VOTE", { optionId: "c" }, "p1");

    let pub = JSON.stringify(h.publicView());
    expect(pub.includes('"distribution"')).toBe(false);
    expect(pub.includes('"majority"')).toBe(false);
    expect(pub.includes("correctIds")).toBe(false);
    expect(pub.includes('"answeredCount":1')).toBe(true); // counts are public
    // no per-voter attribution anywhere in the serialized public view
    expect(pub.match(/"votes"/)).toBeNull();
    expect(pub.match(/"optionId"\s*:\s*"c"/)).toBeNull();

    const mine = h.privateView("p1") as { yourVote?: string | null };
    expect(mine.yourVote).toBe("c");
    // other players' private views never expose someone else's vote
    const others = h.privateView("p2") as { yourVote?: string | null };
    expect(others.yourVote).toBeNull();

    // close the round with a unanimous vote to force a real reveal
    h.act("VOTE", { optionId: "c" }, "p2");
    h.act("VOTE", { optionId: "c" }, "p3");
    pub = JSON.stringify(h.publicView() as MajorityPublicView);
    expect(pub.includes('"distribution"')).toBe(true);
    expect((h.publicView() as MajorityPublicView).distribution).toEqual({
      a: 0,
      b: 0,
      c: 3,
      d: 0,
    });
    expect((h.publicView() as MajorityPublicView).correctNicknames).toEqual([
      "Player1",
      "Player2",
      "Player3",
    ]);
  });

  it("declares its manifest contract (controllers, bounds, bank size)", () => {
    expect(majorityVotePlugin.manifest.id).toBe("majority-vote");
    expect(majorityVotePlugin.manifest.controllers).toEqual(["vote"]);
    expect(majorityVotePlugin.manifest.minPlayers).toBe(3);
    expect(majorityVotePlugin.manifest.maxPlayers).toBe(30);
    expect(majorityVotePlugin.manifest.priority).toBe("P0");
    const rounds = majorityVotePlugin.manifest.settings.find((s) => s.key === "rounds")!;
    expect([rounds.default, rounds.min, rounds.max]).toEqual([5, 1, 15]);
    const spq = majorityVotePlugin.manifest.settings.find(
      (s) => s.key === "secondsPerQuestion",
    )!;
    expect([spq.default, spq.min, spq.max]).toEqual([20, 10, 60]);
    // bank must cover the max rounds without repetition
    expect(questionBank.length).toBeGreaterThanOrEqual(15);
    expect(new Set(questionBank.map((q) => q.id)).size).toBe(questionBank.length);
    for (const q of questionBank) expect(q.options).toHaveLength(4);
  });
});
