import { describe, expect, it } from "vitest";
import { GameHarness } from "@rs-party/game-engine";
import type { RoomPlayerRef } from "@rs-party/game-engine";
import hotPotatoPlugin from "../src/index.js";
import type { HotPotatoPrivateView, HotPotatoPublicView, HotPotatoState } from "../src/index.js";

const PREP_MS = 2000;
const RESULT_MS = 3000;

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
  seed?: number;
  rounds?: number;
  withSpectator?: boolean;
}) {
  const roster = [...players(opts?.playerCount ?? 4)];
  if (opts?.withSpectator) {
    roster.push({ playerId: "spec", nickname: "Spectator", role: "spectator" });
  }
  return new GameHarness<HotPotatoState>(hotPotatoPlugin, {
    players: roster,
    // in-range values only — clampInt may raise below-minimum inputs.
    // min=max=10 ⇒ the fuse is ALWAYS exactly 10_000 ms (deterministic tests).
    settings: {
      rounds: opts?.rounds ?? 2,
      minHoldSeconds: 10,
      maxHoldSeconds: 10,
    },
    seed: opts?.seed ?? 1234,
  });
}

/** ROUND_PREP → PASSING at the current clock position. */
function enterPassing(h: ReturnType<typeof makeHarness>) {
  h.clock.advance(PREP_MS + 100);
  h.runTickUntil((s) => s.phase === "PASSING");
  expect(h.state.phase).toBe("PASSING");
}

/** Tap-cycle until the secret fuse burns the current holder. */
function playRoundToBurn(h: ReturnType<typeof makeHarness>): string[] {
  const tapped: string[] = [];
  let guard = 0;
  while (h.state.phase === "PASSING" && guard++ < 500) {
    h.clock.advance(700);
    h.runTickUntil((s) => s.phase !== "PASSING");
    if (h.state.phase !== "PASSING") break;
    const holder = h.state.wheel[h.state.holderIdx]!;
    expect(h.tryAct("TAP", { target: "pass" }, holder).ok).toBe(true);
    tapped.push(holder);
  }
  return tapped;
}

describe("Hot Potato — spec §14.14 minimum test set", () => {
  it("plays deterministically: same seed ⇒ same burn order, totals and scores", () => {
    const run = () => {
      const h = makeHarness({ playerCount: 4, seed: 777, rounds: 2 });
      const burnedOrder: string[] = [];
      let guard = 0;
      while (!h.finished() && guard++ < 50) {
        if (h.state.phase === "PASSING") {
          playRoundToBurn(h);
        } else {
          h.clock.advance(1000);
          h.runTickUntil((s) => s.phase === "PASSING" || s.phase === "GAME_RESULT");
        }
        if (h.state.phase === "ROUND_RESULT" && h.state.burnedId) {
          burnedOrder.push(h.state.burnedId);
        }
      }
      expect(h.finished()).toBe(true);
      return { burnedOrder, totals: { ...h.state.totals }, score: h.score() };
    };

    const a = run();
    const b = run();
    expect(a.burnedOrder).toEqual(b.burnedOrder);
    expect(a.totals).toEqual(b.totals);
    expect(a.score.roundScores).toEqual(b.score.roundScores);
    expect(a.burnedOrder.length).toBeGreaterThanOrEqual(2);
  });

  it("burns the current holder after the SECRET deadline (−50 / +30) and clamps finals", () => {
    const h = makeHarness({ playerCount: 4, rounds: 1 });
    h.state = { ...h.state, holderIdx: 0 }; // deterministic fixture: p1 holds first
    enterPassing(h);

    // nobody taps; one generous advance crosses ONLY the fuse boundary
    h.clock.advance(10_000 + 100);
    h.runTickUntil((s) => s.phase !== "PASSING");
    expect(h.state.phase).toBe("ROUND_RESULT");
    expect(h.state.burnedId).toBe("p1");
    expect(h.state.totals).toEqual({ p1: -50, p2: 30, p3: 30, p4: 30 });

    const pub = h.publicView() as HotPotatoPublicView;
    expect(pub.burned).toBe("Player1"); // reveal happens in ROUND_RESULT
    expect(pub.holderNickname).toBe("Player1");

    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "GAME_RESULT");
    const rows = Object.fromEntries(h.score().roundScores.map((r) => [r.playerId, r.delta]));
    expect(rows["p1"]).toBe(0); // clamped at zero
    expect(rows["p2"]).toBe(30);
    // three survivors tie ⇒ shared 🏆
    expect(Object.keys(h.score().titles ?? {}).sort()).toEqual(["p2", "p3", "p4"]);
    expect(h.score().awards?.[0]?.kind).toBe("tie");
  });

  it("passes atomically around the wheel; next round starts right of the burned player", () => {
    const h = makeHarness({ playerCount: 3, rounds: 2 });
    h.state = { ...h.state, holderIdx: 0 };
    enterPassing(h);

    // two quick passes well below any legal fuse length
    expect(h.tryAct("TAP", { target: "pass" }, "p1").ok).toBe(true);
    expect(h.state.holderIdx).toBe(1);
    expect(h.tryAct("TAP", { target: "pass" }, "p2").ok).toBe(true);
    expect(h.state.holderIdx).toBe(2);

    // exactly ONE owner at any instant
    const owners = h.state.wheel.filter(
      (_, i) => i === h.state.holderIdx,
    );
    expect(owners).toEqual(["p3"]);

    // let it blow up in p3's hands
    h.clock.advance(10_000 + 100);
    h.runTickUntil((s) => s.phase !== "PASSING");
    expect(h.state.burnedId).toBe("p3");

    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "ROUND_PREP");
    expect(h.state.roundNumber).toBe(2);
    expect(h.state.wheel[h.state.holderIdx]).toBe("p1"); // right neighbour of p3

    // round 2 burns its initial holder (no taps) ⇒ final standings accumulate
    enterPassing(h);
    h.clock.advance(10_000 + 100);
    h.runTickUntil((s) => s.phase !== "PASSING");
    expect(h.state.burnedId).toBe("p1");
    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "GAME_RESULT");

    expect(h.finished()).toBe(true);
    expect(h.state.totals).toEqual({ p1: -20, p2: 60, p3: -20 });
    const rows = Object.fromEntries(h.score().roundScores.map((r) => [r.playerId, r.delta]));
    expect(rows["p2"]).toBe(60); // sole survivor keeps the crown
    expect(rows["p1"]).toBe(0); // negatives clamped away
    expect(Object.keys(h.score().titles ?? {})).toEqual(["p2"]);
  });

  it("rejects spectators, non-holders, wrong phases and bad payloads", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1, withSpectator: true });
    h.state = { ...h.state, holderIdx: 0 };

    expect(codeOf(h.validate("TAP", { target: "pass" }, "spec"))).toBe("FORBIDDEN");
    expect(codeOf(h.validate("TAP", { target: "pass" }, "p1"))).toBe("BAD_PHASE"); // still prep
    expect(codeOf(h.validate("POKE", {}, "p1"))).toBe("INVALID_PAYLOAD"); // unknown action

    enterPassing(h);
    expect(codeOf(h.validate("TAP", {}, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("TAP", null, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("TAP", 42, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("TAP", { target: "throw" }, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("TAP", { target: "pass" }, "p2"))).toBe("FORBIDDEN"); // not holder
    expect(h.validate("TAP", { target: "pass" }, "p1").ok).toBe(true);

    h.act("TAP", { target: "pass" }, "p1");
    expect(h.state.wheel[h.state.holderIdx]).toBe("p2");
    expect(codeOf(h.validate("TAP", { target: "pass" }, "p1"))).toBe("FORBIDDEN"); // lost it
  });

  it("never leaks the secret timer into ANY serialized view (public or private)", () => {
    const h = makeHarness({ playerCount: 4, rounds: 2 });
    h.state = { ...h.state, holderIdx: 0 };
    enterPassing(h);

    const secretDeadline = h.state.secretDeadlineMs!;
    expect(typeof secretDeadline).toBe("number");

    const pub = h.publicView() as HotPotatoPublicView;
    expect(Object.keys(pub)).not.toContain("secretDeadlineMs");
    expect(Object.keys(pub)).not.toContain("secretHoldMs");
    expect(pub.prompt).not.toMatch(/\d+\s*s/); // no countdown text anywhere

    for (const p of ["p1", "p2", "p3", "p4"]) {
      const view = h.privateView(p) as HotPotatoPrivateView;
      const json = JSON.stringify(view);
      expect(json).not.toContain("secretDeadlineMs");
      expect(json).not.toContain("secretHoldMs");
      expect(json).not.toContain("deadlineAt");
      expect(json).not.toContain(String(secretDeadline));
    }

    const everything = JSON.stringify([pub, ...["p1", "p2", "p3", "p4"].map((p) => h.privateView(p))]);
    expect(everything).not.toContain("secret");
    expect(everything).not.toContain(String(secretDeadline));
  });

  it("shows the pass button only to the current holder, swapping live after each TAP", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1 });
    h.state = { ...h.state, holderIdx: 0 };
    enterPassing(h);

    const holderView = h.privateView("p1") as HotPotatoPrivateView;
    expect(holderView.targets).toEqual([{ id: "pass", label: "🔥 Passa!", style: "bad" }]);
    expect(holderView.statusText).toBe("Tens a batata!");

    const otherView = h.privateView("p2") as HotPotatoPrivateView;
    expect(otherView.targets).toBeUndefined();
    expect(otherView.statusText).toBe("Batata com Player1");

    h.act("TAP", { target: "pass" }, "p1");
    expect((h.privateView("p1") as HotPotatoPrivateView).targets).toBeUndefined();
    expect((h.privateView("p1") as HotPotatoPrivateView).statusText).toBe("Batata com Player2");
    expect((h.privateView("p2") as HotPotatoPrivateView).statusText).toBe("Tens a batata!");
    expect(
      (h.privateView("p2") as HotPotatoPrivateView).targets?.[0]?.id,
    ).toBe("pass");
  });

  it("declares its manifest contract (controllers, lateJoin, bounds, settings)", () => {
    expect(hotPotatoPlugin.manifest.id).toBe("hot-potato");
    expect(hotPotatoPlugin.manifest.controllers).toEqual(["tap"]);
    expect(hotPotatoPlugin.manifest.lateJoin).toBe("disallow");
    expect(hotPotatoPlugin.manifest.minPlayers).toBe(3);
    expect(hotPotatoPlugin.manifest.maxPlayers).toBe(20);
    expect(hotPotatoPlugin.manifest.priority).toBe("P0");
    const rounds = hotPotatoPlugin.manifest.settings.find((s) => s.key === "rounds")!;
    expect([rounds.default, rounds.min, rounds.max]).toEqual([3, 1, 8]);
    const minHold = hotPotatoPlugin.manifest.settings.find((s) => s.key === "minHoldSeconds")!;
    expect([minHold.default, minHold.min, minHold.max]).toEqual([5, 3, 10]);
    const maxHold = hotPotatoPlugin.manifest.settings.find((s) => s.key === "maxHoldSeconds")!;
    expect([maxHold.default, maxHold.min, maxHold.max]).toEqual([15, 10, 30]);
  });
});
