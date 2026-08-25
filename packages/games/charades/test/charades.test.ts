import { describe, expect, it } from "vitest";
import { GameHarness } from "@rs-party/game-engine";
import type { RoomPlayerRef } from "@rs-party/game-engine";
import charadesPlugin from "../src/index.js";
import type { CharadesState } from "../src/index.js";

const PREP_MS = 2000;
const RESULT_MS = 3000;
const TURN_S = 30; // actorTurnSeconds used by every harness

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

function makeHarness(opts?: { playerCount?: number; seed?: number; withSpectator?: boolean }) {
  const roster = [...players(opts?.playerCount ?? 2)];
  if (opts?.withSpectator) {
    roster.push({ playerId: "spec", nickname: "Spectator", role: "spectator" });
  }
  return new GameHarness<CharadesState>(charadesPlugin, {
    players: roster,
    settings: { actorTurnSeconds: TURN_S },
    seed: opts?.seed ?? 99,
  });
}

function activeIds(h: ReturnType<typeof makeHarness>) {
  return h.ctx.players.filter((p) => p.role === "player").map((p) => p.playerId);
}

function actorAt(h: ReturnType<typeof makeHarness>, slot: number): string {
  const ps = activeIds(h);
  return ps[(h.state.actorOffset + slot) % ps.length]!;
}

/** Actor of the CURRENT turn. */
function actorOf(h: ReturnType<typeof makeHarness>): string {
  return actorAt(h, h.state.actorSlot);
}

function nicknameOfForTest(h: ReturnType<typeof makeHarness>, playerId: string): string | null {
  return h.ctx.players.find((p) => p.playerId === playerId)?.nickname ?? null;
}

/** ROUND_PREP → ACTING at the current clock position. */
function enterActing(h: ReturnType<typeof makeHarness>) {
  h.clock.advance(PREP_MS + 100);
  h.runTickUntil((s) => s.phase === "ACTING");
  expect(h.state.phase).toBe("ACTING");
}

describe("Charades — spec §14.11 minimum test set", () => {
  it("completes a full game deterministically (same scores on repeated runs)", () => {
    const run = () => {
      const h = makeHarness({ playerCount: 2 });
      const actorA = actorOf(h);
      // turn A: two hits (+200) and one wasted pass
      enterActing(h);
      h.act("TAP", { target: "correct" }, actorA);
      h.clock.advance(7);
      h.act("TAP", { target: "correct" }, actorA);
      h.clock.advance(7);
      h.act("TAP", { target: "pass" }, actorA);
      expect(h.state.phase).toBe("ACTING");

      h.clock.advance(TURN_S * 1000 + 100);
      h.runTickUntil((s) => s.phase === "ROUND_RESULT");
      h.clock.advance(RESULT_MS + 100);
      h.runTickUntil((s) => s.phase === "ROUND_PREP" && s.roundNumber === 2);

      const actorB = actorOf(h);
      expect(actorB).not.toBe(actorA); // rotation gave everyone exactly one turn
      h.clock.advance(PREP_MS + 100);
      h.runTickUntil((s) => s.phase === "ACTING");
      h.act("TAP", { target: "correct" }, actorB);

      h.clock.advance(TURN_S * 1000 + 100);
      h.runTickUntil((s) => s.phase === "ROUND_RESULT");
      h.clock.advance(RESULT_MS + 100);
      h.runTickUntil((s) => s.phase === "GAME_RESULT");
      expect(h.finished()).toBe(true);
      return { score: h.score(), totals: { ...h.state.totals }, actorA, actorB };
    };

    const a = run();
    const b = run();
    expect(a.score.roundScores).toEqual(b.score.roundScores); // seeded PRNG

    expect(a.totals).toEqual({ [a.actorA]: 200, [a.actorB]: 100 });
    expect(a.totals).toEqual(b.totals);
    expect(Object.keys(a.score.titles ?? {}).length).toBe(1);
  });

  it("rejects double taps at the same instant as DUPLICATE_ACTION", () => {
    const h = makeHarness({ playerCount: 2 });
    enterActing(h);
    const actor = actorOf(h);
    h.act("TAP", { target: "correct" }, actor);
    const dup = h.tryAct("TAP", { target: "correct" }, actor); // same ms ⇒ double fire
    expect(dup.ok).toBe(false);
    if (!dup.ok) expect(dup.code).toBe("DUPLICATE_ACTION");
    h.clock.advance(1); // a real interval separates genuine taps
    expect(h.tryAct("TAP", { target: "correct" }, actor).ok).toBe(true);
  });

  it("rejects non-actors, spectators, bad targets and the 4th pass", () => {
    const h = makeHarness({ playerCount: 2, withSpectator: true });
    const actor = actorOf(h);
    const others = activeIds(h).filter((pid) => pid !== actor);

    // wrong phase first (still ROUND_PREP)
    expect(codeOf(h.validate("TAP", { target: "correct" }))).toBe("BAD_PHASE");
    expect(h.validate("WAVE", {}).ok).toBe(false); // unknown action

    enterActing(h);
    const specRes = h.tryAct("TAP", { target: "correct" }, "spec");
    expect(specRes.ok).toBe(false);
    if (!specRes.ok) expect(specRes.code).toBe("FORBIDDEN");

    for (const pid of others) {
      const res = h.tryAct("TAP", { target: "correct" }, pid);
      expect(res.ok).toBe(false);
      if (!res.ok) expect(res.code).toBe("FORBIDDEN"); // team may only watch/guess aloud
    }

    expect(h.validate("TAP", { target: "banana" }).ok).toBe(false);
    expect(h.validate("TAP", {}).ok).toBe(false); // missing target

    // pass budget: 3 allowed, 4th forbidden
    const h2 = makeHarness({ playerCount: 2 });
    enterActing(h2);
    const actor2 = actorOf(h2);
    for (let i = 0; i < 3; i++) {
      expect(h2.state.passesLeft).toBe(3 - i);
      h2.act("TAP", { target: "pass" }, actor2);
      h2.clock.advance(1);
    }
    const fourth = h2.tryAct("TAP", { target: "pass" }, actor2);
    expect(fourth.ok).toBe(false);
    if (!fourth.ok) expect(fourth.code).toBe("FORBIDDEN");
    expect(h2.state.passedCount).toBe(3);
    expect(h2.state.totals[actor2] ?? 0).toBe(0); // passing scores nothing
  });

  it("advances every phase via deadlines until all actors have played once", () => {
    const h = makeHarness({ playerCount: 2 });
    expect(h.state.roundTotal).toBe(2); // one turn per player

    enterActing(h); // PREP deadline moved us to ACTING
    h.clock.advance(TURN_S * 1000 + 100);
    h.runTickUntil((s) => s.phase === "ROUND_RESULT");
    expect(h.state.lastRound?.actorId).toBe(actorOf(h));

    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase !== "ROUND_RESULT");
    expect(h.state.phase).toBe("ROUND_PREP");
    expect(h.state.roundNumber).toBe(2);

    enterActing(h); // second actor's turn
    h.clock.advance(TURN_S * 1000 + 100);
    h.runTickUntil((s) => s.phase === "ROUND_RESULT");
    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "GAME_RESULT");
    expect(h.finished()).toBe(true);
  });

  it("keeps the secret word away from the public view and the team", () => {
    const h = makeHarness({ playerCount: 2 });
    const actor = actorOf(h);
    const word = h.state.currentWord;

    let pub = JSON.stringify(h.publicView());
    expect(pub.includes(word)).toBe(false);

    enterActing(h);
    pub = JSON.stringify(h.publicView());
    expect(pub.includes(word)).toBe(false); // NEVER the word while acting
    expect(pub).toContain("🎭 em ação");
    const view = h.publicView();
    expect(view.wordsLeft).toBeGreaterThanOrEqual(0);
    expect(view.solvedCount).toBe(0);
    expect(view.actorNickname).toBe(nicknameOfForTest(h, actor));

    expect(JSON.stringify(h.privateView(actor))).toContain(word); // actor's phone only
    for (const pid of activeIds(h)) {
      if (pid === actor) continue;
      const priv = JSON.stringify(h.privateView(pid));
      expect(priv).not.toContain(word);
      expect(priv).toContain("não digas a palavra");
    }

    // positive control: the reveal is public after the turn
    h.act("TAP", { target: "correct" }, actor);
    const wordOnScreenAtExpiry = h.state.currentWord; // correct ⇒ a new word was drawn
    h.clock.advance(TURN_S * 1000 + 100);
    h.runTickUntil((s) => s.phase === "ROUND_RESULT");
    pub = JSON.stringify(h.publicView());
    expect(h.state.lastRound?.solvedCount).toBe(1);
    expect(pub.includes(wordOnScreenAtExpiry)).toBe(true);
  });

  it("shares the title when both actors solve the same amount", () => {
    const h = makeHarness({ playerCount: 2 });
    const actorA = actorOf(h);
    enterActing(h);
    h.act("TAP", { target: "correct" }, actorA);
    h.clock.advance(5);
    h.act("TAP", { target: "correct" }, actorA);

    h.clock.advance(TURN_S * 1000 + 100);
    h.runTickUntil((s) => s.phase === "ROUND_RESULT");
    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "ROUND_PREP" && s.roundNumber === 2);
    h.clock.advance(PREP_MS + 100);
    h.runTickUntil((s) => s.phase === "ACTING");
    const actorB = actorOf(h);
    h.act("TAP", { target: "correct" }, actorB);
    h.clock.advance(5);
    h.act("TAP", { target: "correct" }, actorB);

    h.clock.advance(TURN_S * 1000 + 100);
    h.runTickUntil((s) => s.phase === "ROUND_RESULT");
    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "GAME_RESULT");

    const s = h.score();
    expect(h.state.totals[actorA]).toBe(200);
    expect(h.state.totals[actorB]).toBe(200);
    expect(Object.keys(s.titles ?? {}).sort()).toEqual([actorA, actorB].sort());
    expect(s.awards?.[0]?.kind).toBe("tie");
  });

  it("recycles discarded words when the deck runs dry (pure draw logic)", () => {
    const h = makeHarness({ playerCount: 2 });
    enterActing(h);
    const actor = actorOf(h);
    const mkCopy = () =>
      charadesPlugin.deserialize(charadesPlugin.serialize(h.state)) as CharadesState;

    // deck empty but recyclable discards exist ⇒ reshuffle keeps the turn alive
    const st = mkCopy();
    st.deck = [];
    st.discard = ["palavra antiga", st.currentWord];
    const out = charadesPlugin.reduce(
      st,
      { type: "TAP", payload: { target: "pass" } },
      { playerId: actor, role: "player" },
      h.ctx,
    );
    expect(out.phase).toBe("ACTING");
    expect(out.passesLeft).toBe(st.passesLeft - 1);
    // the recyclable word was drawn out of the reshuffled pile onto the screen
    expect(out.currentWord).toBe("palavra antiga");
    expect(out.deck).toEqual([]);
    expect(out.currentWord).not.toBe(st.currentWord);

    // nothing recyclable at all (only the word on screen existed) ⇒ turn ends
    const st2 = mkCopy();
    st2.deck = [];
    st2.discard = [];
    const out2 = charadesPlugin.reduce(
      st2,
      { type: "TAP", payload: { target: "pass" } },
      { playerId: actor, role: "player" },
      h.ctx,
    );
    expect(out2.phase).toBe("ROUND_RESULT"); // baralho vazio ends the turn
  });

  it("declares its manifest contract (controllers, lateJoin, bounds)", () => {
    expect(charadesPlugin.manifest.controllers).toEqual(["tap"]);
    expect(charadesPlugin.manifest.lateJoin).toBe("spectatorUntilRound");
    expect(charadesPlugin.manifest.minPlayers).toBe(2);
    expect(charadesPlugin.manifest.maxPlayers).toBe(12);
    expect(charadesPlugin.manifest.priority).toBe("P0");
  });
});
