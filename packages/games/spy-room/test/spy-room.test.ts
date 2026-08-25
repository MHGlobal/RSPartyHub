import { describe, expect, it } from "vitest";
import { GameHarness } from "@rs-party/game-engine";
import type { RoomPlayerRef } from "@rs-party/game-engine";
import spyRoomPlugin from "../src/index.js";
import type { SpyPrivateView, SpyPublicView, SpyRoomState } from "../src/index.js";
import { locationById } from "../src/bank.js";

const PREP_MS = 2000;

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
  withSpectator?: boolean;
}) {
  const roster = [...players(opts?.playerCount ?? 4)];
  if (opts?.withSpectator) {
    roster.push({ playerId: "spec", nickname: "Spectator", role: "spectator" });
  }
  return new GameHarness<SpyRoomState>(spyRoomPlugin, {
    players: roster,
    settings: { discussionSeconds: 60, voteSeconds: 20 },
    seed: opts?.seed ?? 1234,
  });
}

/** Force a known spy so assertions never depend on the seed draw. */
function pinSpy(h: ReturnType<typeof makeHarness>, spyId: string) {
  h.state = { ...h.state, spyId };
}

/** SETUP → DISCUSSION → VOTING, one clock boundary at a time. */
function enterVoting(h: ReturnType<typeof makeHarness>) {
  h.clock.advance(PREP_MS + 100);
  h.runTickUntil((s) => s.phase === "DISCUSSION");
  expect(h.state.phase).toBe("DISCUSSION");
  h.clock.advance(60_000 + 100);
  h.runTickUntil((s) => s.phase === "VOTING");
  expect(h.state.phase).toBe("VOTING");
}

describe("Spy Room — spec §14.12 minimum test set", () => {
  it("resolves deterministically: spy most-voted ⇒ group +100 each non-spy, shared title", () => {
    const run = () => {
      const h = makeHarness({ playerCount: 4 });
      pinSpy(h, "p4");
      enterVoting(h);
      h.act("VOTE", { optionId: "p4" }, "p1");
      h.act("VOTE", { optionId: "p4" }, "p2");
      h.act("VOTE", { optionId: "p4" }, "p3");
      // last eligible voter (the spy himself) closes the round early
      expect(h.state.phase).toBe("VOTING");
      h.act("VOTE", { optionId: "p1" }, "p4");
      expect(h.state.phase).toBe("GAME_RESULT");

      const res = h.state.result!;
      expect(res.winner).toBe("group");
      expect(res.spyNickname).toBe("Player4");
      expect(res.scores).toEqual({ p1: 100, p2: 100, p3: 100, p4: 0 });
      return { score: h.score(), tally: { ...res.tally } };
    };

    const a = run();
    const b = run();
    expect(a.score.roundScores).toEqual(b.score.roundScores);
    expect(a.score.roundScores.map((r) => r.delta)).toEqual([100, 100, 100, 0]);
    // three-way tie at the top ⇒ shared 🏆
    expect(Object.keys(a.score.titles ?? {}).sort()).toEqual(["p1", "p2", "p3"]);
    expect(a.score.awards?.[0]?.kind).toBe("tie");
    expect(a.tally["p4"]).toBe(3);
  });

  it("spy escapes (+150) when the vote leader is not the spy — even a non-spy lynch", () => {
    const h = makeHarness({ playerCount: 4 });
    pinSpy(h, "p4");
    enterVoting(h);
    h.act("VOTE", { optionId: "p2" }, "p1");
    h.act("VOTE", { optionId: "p1" }, "p2");
    h.act("VOTE", { optionId: "p2" }, "p3");
    // p4 never votes; the vote deadline resolves the round
    h.clock.advance(20_000 + 100);
    h.runTickUntil((s) => s.phase === "GAME_RESULT");

    const res = h.state.result!;
    expect(res.winner).toBe("spy");
    expect(res.spyGuessCorrect).toBe(false);
    expect(res.scores).toEqual({ p1: 0, p2: 0, p3: 0, p4: 150 });
    const rows = Object.fromEntries(h.score().roundScores.map((r) => [r.playerId, r.delta]));
    expect(rows["p4"]).toBe(150);
    expect(Object.keys(h.score().titles ?? {})).toEqual(["p4"]);
  });

  it("a correct SPY_GUESS adds +50 to the spy in any scenario (caught ⇒ 50)", () => {
    const h = makeHarness({ playerCount: 4 });
    pinSpy(h, "p4");
    enterVoting(h);

    const trueLocation = h.state.locationId;
    expect(codeOf(h.validate("SPY_GUESS", { locationId: trueLocation }, "p1"))).toBe("FORBIDDEN");
    expect(h.act("SPY_GUESS", { locationId: trueLocation }, "p4")).toBeTruthy();

    h.act("VOTE", { optionId: "p4" }, "p1");
    h.act("VOTE", { optionId: "p4" }, "p2");
    h.act("VOTE", { optionId: "p4" }, "p3");
    h.act("VOTE", { optionId: "p1" }, "p4"); // everyone voted ⇒ immediate resolve

    const res = h.state.result!;
    expect(res.winner).toBe("group");
    expect(res.spyGuessCorrect).toBe(true);
    expect(res.scores["p4"]).toBe(50);
    expect(res.scores["p1"]).toBe(100);
  });

  it("a wrong SPY_GUESS stacks nothing; guessing twice is DUPLICATE_ACTION", () => {
    const h = makeHarness({ playerCount: 4 });
    pinSpy(h, "p4");
    enterVoting(h);

    const wrongCandidate = h.state.candidates.find((id) => id !== h.state.locationId)!;
    expect(h.tryAct("SPY_GUESS", { locationId: wrongCandidate }, "p4").ok).toBe(true);
    expect(codeOf(h.validate("SPY_GUESS", { locationId: h.state.locationId }, "p4"))).toBe(
      "DUPLICATE_ACTION",
    );
    // guessing again (even wrong twice) stays rejected
    expect(codeOf(h.validate("SPY_GUESS", { locationId: wrongCandidate }, "p4"))).toBe(
      "DUPLICATE_ACTION",
    );

    h.act("VOTE", { optionId: "p1" }, "p4");
    h.act("VOTE", { optionId: "p2" }, "p1");
    h.act("VOTE", { optionId: "p1" }, "p2"); // cannot vote for self
    h.act("VOTE", { optionId: "p2" }, "p3");
    // p1/p2 tie at the top ⇒ spy escaped, guessed wrong ⇒ plain 150
    expect(h.state.result!.scores["p4"]).toBe(150);
    expect(h.state.result!.spyGuessCorrect).toBe(false);
  });

  it("rejects spectators, self-votes, duplicates, bad payloads and wrong phases", () => {
    const h = makeHarness({ playerCount: 4, withSpectator: true });
    pinSpy(h, "p4");

    // SETUP: everything is out of phase
    expect(codeOf(h.validate("VOTE", { optionId: "p1" }, "p1"))).toBe("BAD_PHASE");
    expect(codeOf(h.validate("SPY_GUESS", { locationId: "praia" }, "p4"))).toBe("BAD_PHASE");
    expect(h.validate("DANCE", {}).ok).toBe(false);

    enterVoting(h);
    expect(codeOf(h.validate("VOTE", { optionId: "p1" }, "spec"))).toBe("FORBIDDEN"); // spectator
    expect(codeOf(h.validate("VOTE", { optionId: "p1" }, "p1"))).toBe("FORBIDDEN"); // self
    expect(codeOf(h.validate("VOTE", {}, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("VOTE", { optionId: 42 }, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("VOTE", null, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("VOTE", { optionId: "ghost" }, "p1"))).toBe("INVALID_PAYLOAD");

    h.act("VOTE", { optionId: "p4" }, "p1");
    expect(codeOf(h.validate("VOTE", { optionId: "p3" }, "p1"))).toBe("DUPLICATE_ACTION");

    expect(codeOf(h.validate("SPY_GUESS", { locationId: "atlantida" }, "p4"))).toBe(
      "INVALID_PAYLOAD", // not among candidates
    );
    expect(codeOf(h.validate("SPY_GUESS", { location: "x" }, "p4"))).toBe("INVALID_PAYLOAD");
  });

  it("advances one phase per deadline crossing and never leaks secrets into public views", () => {
    const h = makeHarness({ playerCount: 5 });
    pinSpy(h, "p5");

    // one advance(+ε) crosses EXACTLY one boundary (next deadline sits in the future)
    h.clock.advance(PREP_MS + 100);
    h.runTickUntil((s) => s.phase === "DISCUSSION");
    expect(h.state.phase).toBe("DISCUSSION");
    h.clock.advance(59_000); // below the discussion deadline ⇒ no-op tick
    h.runTickUntil((s) => s.phase !== "DISCUSSION");
    expect(h.state.phase).toBe("DISCUSSION"); // still discussing

    const locName = locationById(h.state.locationId)?.name ?? "";
    const roleValues = Object.values(h.state.roles);

    const pub = h.publicView() as SpyPublicView;
    expect(pub.finished).toBe(false);
    expect(pub.result).toBeUndefined(); // semantic: no reveal before GAME_RESULT
    const serialized = JSON.stringify(pub);
    expect(serialized).not.toContain(locName);
    expect(serialized).not.toContain("candidates");
    expect(serialized).not.toContain("roles");
    for (const role of roleValues) expect(serialized).not.toContain(role);

    // the spy learns nothing; non-spies see their card
    const spyView = JSON.stringify(h.privateView("p5"));
    expect(spyView).not.toContain(locName);
    expect(spyView).not.toContain("📍");
    const civId = Object.keys(h.state.roles)[0]!; // any non-spy (seed-independent)
    const civilianView = JSON.stringify(h.privateView(civId));
    expect(civilianView).toContain("📍");
    expect(civilianView).toContain(h.state.roles[civId]!);

    h.clock.advance(500);
    h.runTickUntil((s) => s.phase !== "DISCUSSION");
    expect(h.state.phase).toBe("DISCUSSION"); // 60s window not over yet

    h.clock.advance(700); // crosses the 60s discussion deadline
    h.runTickUntil((s) => s.phase !== "DISCUSSION");
    expect(h.state.phase).toBe("VOTING");

    const votingPub = h.publicView() as SpyPublicView;
    expect(votingPub.votedCount).toBe(0);
    const votingSerialized = JSON.stringify(votingPub);
    expect(votingSerialized).not.toContain(locName);

    h.clock.advance(20_000 + 100);
    h.runTickUntil((s) => s.phase === "GAME_RESULT");
    const finalPub = h.publicView() as SpyPublicView;
    expect(finalPub.finished).toBe(true);
    expect(finalPub.result!.location).toBe(locName); // revealed now
    expect(finalPub.result!.spyNickname).toBe("Player5");
  });

  it("exposes voteOptions (others only) plus a 4-candidate guess menu to the spy", () => {
    const h = makeHarness({ playerCount: 4 });
    pinSpy(h, "p4");
    enterVoting(h);

    const spyView = h.privateView("p4") as SpyPrivateView;
    expect(spyView.voteOptions?.map((o) => o.id).sort()).toEqual(["p1", "p2", "p3"]);
    expect(spyView.choices).toHaveLength(4); // candidates incl. the true location
    expect(spyView.choices!.some((c) => c.id === h.state.locationId)).toBe(true);

    const civView = h.privateView("p2") as SpyPrivateView;
    expect(civView.voteOptions?.map((o) => o.id).sort()).toEqual(["p1", "p3", "p4"]);
    expect(civView.choices).toBeUndefined(); // guess menu is spy-only

    // every vote closes the round once all active players have voted
    h.act("VOTE", { optionId: "p4" }, "p1");
    h.act("VOTE", { optionId: "p4" }, "p2");
    h.act("VOTE", { optionId: "p4" }, "p3");
    expect(h.state.phase).toBe("VOTING");
    h.act("VOTE", { optionId: "p1" }, "p4");
    expect(h.state.phase).toBe("GAME_RESULT");
  });

  it("declares its manifest contract (controllers, lateJoin, bounds, settings)", () => {
    expect(spyRoomPlugin.manifest.id).toBe("spy-room");
    expect(spyRoomPlugin.manifest.controllers).toEqual(["cards", "vote"]);
    expect(spyRoomPlugin.manifest.lateJoin).toBe("disallow");
    expect(spyRoomPlugin.manifest.minPlayers).toBe(3);
    expect(spyRoomPlugin.manifest.maxPlayers).toBe(12);
    expect(spyRoomPlugin.manifest.priority).toBe("P0");
    const disc = spyRoomPlugin.manifest.settings.find((s) => s.key === "discussionSeconds")!;
    expect([disc.default, disc.min, disc.max]).toEqual([120, 30, 300]);
    const vote = spyRoomPlugin.manifest.settings.find((s) => s.key === "voteSeconds")!;
    expect([vote.default, vote.min, vote.max]).toEqual([30, 10, 120]);
  });
});
