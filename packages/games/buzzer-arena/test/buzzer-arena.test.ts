import { describe, expect, it } from "vitest";
import { GameHarness } from "@rs-party/game-engine";
import type { RoomPlayerRef } from "@rs-party/game-engine";
import buzzerArenaPlugin from "../src/index.js";
import type { BuzzerArenaState, BuzzerPublicView } from "../src/index.js";

const PREP_MS = 2000;
const RESULT_MS = 2000;
const JUDGE_MS = 3000;
const SOFT_MS = 30_000;

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
  return new GameHarness<BuzzerArenaState>(buzzerArenaPlugin, {
    players: roster,
    settings: { rounds: opts?.rounds ?? 2, softTimeoutSeconds: 30 },
    seed: opts?.seed ?? 1234,
  });
}

/** ROUND_PREP → ACTIVE at the current clock position. */
function enterActive(h: ReturnType<typeof makeHarness>) {
  h.clock.advance(PREP_MS + 100);
  h.runTickUntil((s) => s.phase === "ACTIVE");
  expect(h.state.phase).toBe("ACTIVE");
}

describe("Buzzer Arena — spec §14.8 minimum test set", () => {
  it("completes a full game deterministically (clamp at 0 + shared title on tie)", () => {
    const run = () => {
      const h = makeHarness({ playerCount: 3, rounds: 2 });
      // round 1: p1 buzzes first, host judges CORRECT ⇒ +100
      enterActive(h);
      h.act("BUZZ", {}, "p1");
      expect(h.state.phase).toBe("LOCKED");
      expect(h.state.lockedBy).toBe("p1");
      // concurrent latecomer arrives after the transition
      expect(codeOf(h.tryAct("BUZZ", {}, "p2"))).toBe("BAD_PHASE");
      expect(h.tryAct("JUDGE", { correct: true }, "HOST").ok).toBe(true);
      expect(h.state.phase).toBe("ROUND_RESULT");
      expect(h.state.totals["p1"]).toBe(100);

      h.clock.advance(RESULT_MS + 100);
      h.runTickUntil((s) => s.phase === "ROUND_PREP" && s.roundNumber === 2);

      // round 2: p2 buzzes, judged WRONG (−25) ⇒ reopen; p3 wins the re-buzz
      enterActive(h);
      h.act("BUZZ", {}, "p2");
      expect(h.tryAct("JUDGE", { correct: false }, "HOST").ok).toBe(true);
      expect(h.state.phase).toBe("ACTIVE"); // reopened within the same round
      expect(codeOf(h.tryAct("BUZZ", {}, "p2"))).toBe("DUPLICATE_ACTION"); // blocked
      h.act("BUZZ", {}, "p3");
      expect(h.tryAct("JUDGE", { correct: true }, "HOST").ok).toBe(true);
      expect(h.state.order).toHaveLength(2);

      h.clock.advance(RESULT_MS + 100);
      h.runTickUntil((s) => s.phase === "GAME_RESULT");
      expect(h.finished()).toBe(true);
      return { score: h.score(), totals: { ...h.state.totals } };
    };

    const a = run();
    const b = run();
    expect(a.score.roundScores).toEqual(b.score.roundScores);
    expect(a.totals).toEqual(b.totals);
    // p2 ends negative and is CLAMPED to 0 in the final score only
    expect(a.totals["p2"]).toBe(-25);
    const rows = Object.fromEntries(a.score.roundScores.map((r) => [r.playerId, r.delta]));
    expect(rows["p1"]).toBe(100);
    expect(rows["p3"]).toBe(100);
    expect(rows["p2"]).toBe(0);
    // p1 and p3 share the title
    expect(Object.keys(a.score.titles ?? {}).sort()).toEqual(["p1", "p3"]);
    expect(a.score.awards?.[0]?.kind).toBe("tie");
  });

  it("ends the round empty when nobody buzzes before the soft timeout", () => {
    const h = makeHarness({ playerCount: 3, rounds: 2 });
    enterActive(h);
    h.clock.advance(SOFT_MS + 100);
    h.runTickUntil((s) => s.phase === "ROUND_RESULT");
    expect(h.state.lastRound?.outcome).toBe("empty-timeout");

    const pub = h.publicView() as BuzzerPublicView;
    expect(pub.judgeResult).toBeNull();
    expect(pub.openActive).toBe(false);

    // next round still happens
    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "ROUND_PREP" && s.roundNumber === 2);
  });

  it("closes without points when the host misses the judging window", () => {
    const h = makeHarness({ playerCount: 2, rounds: 1 });
    enterActive(h);
    h.act("BUZZ", {}, "p1");
    expect(h.state.phase).toBe("LOCKED");
    h.clock.advance(JUDGE_MS + 100);
    h.runTickUntil((s) => s.phase === "ROUND_RESULT");
    expect(h.state.lastRound?.outcome).toBe("judge-timeout");
    expect(Object.keys(h.state.totals)).toEqual([]); // silence never scores

    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "GAME_RESULT");
    expect(h.score().titles).toBeUndefined(); // everyone at 0 ⇒ no winner
  });

  it("rejects spectators, players judging, bad payloads and unknown actions", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1, withSpectator: true });
    expect(codeOf(h.validate("JUDGE", { correct: true }, "p1"))).toBe("FORBIDDEN");
    expect(codeOf(h.validate("BUZZ", {}, "spec"))).toBe("FORBIDDEN");
    expect(codeOf(h.validate("BUZZ", {}, "p1"))).toBe("BAD_PHASE"); // still ROUND_PREP
    expect(h.validate("DANCE", {}).ok).toBe(false);

    enterActive(h);
    expect(codeOf(h.validate("BUZZ", 42, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("BUZZ", null, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("JUDGE", { correct: true }, "HOST"))).toBe("BAD_PHASE"); // not LOCKED yet

    h.act("BUZZ", {}, "p1");
    expect(codeOf(h.validate("JUDGE", {}, "HOST"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("JUDGE", { correct: "sim" }, "HOST"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("JUDGE", { correct: true }, "p2"))).toBe("FORBIDDEN");
    expect(codeOf(h.validate("BUZZ", {}, "p2"))).toBe("BAD_PHASE"); // locked
  });

  it("keeps the buzz order with timestamps across reopen cycles", () => {
    const h = makeHarness({ playerCount: 4, rounds: 1 });
    enterActive(h);

    let pub = h.publicView() as BuzzerPublicView;
    expect(pub.openActive).toBe(true);
    expect(pub.lockedByNickname).toBeNull();
    expect(pub.order).toEqual([]);

    h.clock.advance(1500); // separate the two buzzes in time
    h.act("BUZZ", {}, "p1");
    h.tryAct("JUDGE", { correct: false }, "HOST");
    expect(h.state.phase).toBe("ACTIVE");
    expect(h.state.blocked["p1"]).toBe(true);

    // private views reflect eligibility
    expect((h.privateView("p1") as { buzzerEnabled?: boolean }).buzzerEnabled).toBe(false);
    expect((h.privateView("p2") as { buzzerEnabled?: boolean }).buzzerEnabled).toBe(true);

    h.clock.advance(700);
    h.act("BUZZ", {}, "p2");
    pub = h.publicView() as BuzzerPublicView;
    expect(h.state.phase).toBe("LOCKED");
    expect(pub.lockedByNickname).toBe("Player2");
    expect(pub.order.map((o) => o.nickname)).toEqual(["Player1", "Player2"]);
    expect(pub.order[1]!.at).toBeGreaterThan(pub.order[0]!.at);
    expect(pub.openActive).toBe(false);
  });

  it("skips straight to the result when every player has buzzed and failed", () => {
    const h = makeHarness({ playerCount: 2, rounds: 1 });
    enterActive(h);
    h.act("BUZZ", {}, "p1");
    expect(h.tryAct("JUDGE", { correct: false }, "HOST").ok).toBe(true);
    // p1 blocked but p2 hasn't buzzed ⇒ still ACTIVE
    expect(h.state.phase).toBe("ACTIVE");
    h.act("BUZZ", {}, "p2");
    expect(h.tryAct("JUDGE", { correct: false }, "HOST").ok).toBe(true);
    // everyone failed ⇒ round over without waiting for the soft timeout
    expect(h.state.phase).toBe("ROUND_RESULT");
    expect(h.state.lastRound?.outcome).toBe("all-wrong");
    expect(h.state.lastRound?.judge?.delta).toBe(-25);
  });

  it("declares its manifest contract (controllers, lateJoin, bounds)", () => {
    expect(buzzerArenaPlugin.manifest.id).toBe("buzzer-arena");
    expect(buzzerArenaPlugin.manifest.controllers).toEqual(["buzzer"]);
    expect(buzzerArenaPlugin.manifest.lateJoin).toBe("spectatorUntilRound");
    expect(buzzerArenaPlugin.manifest.minPlayers).toBe(2);
    expect(buzzerArenaPlugin.manifest.maxPlayers).toBe(30);
    expect(buzzerArenaPlugin.manifest.priority).toBe("P0");
    const rounds = buzzerArenaPlugin.manifest.settings.find((s) => s.key === "rounds")!;
    expect([rounds.default, rounds.min, rounds.max]).toEqual([5, 1, 20]);
    const soft = buzzerArenaPlugin.manifest.settings.find((s) => s.key === "softTimeoutSeconds")!;
    expect([soft.default, soft.min, soft.max]).toEqual([30, 10, 60]);
  });
});
