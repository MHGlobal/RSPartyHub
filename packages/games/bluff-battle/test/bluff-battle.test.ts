import { describe, expect, it } from "vitest";
import { GameHarness } from "@rs-party/game-engine";
import type { RoomPlayerRef } from "@rs-party/game-engine";
import bluffBattlePlugin from "../src/index.js";
import { promptBank } from "../src/bank.js";
import type { BluffBattleState, BluffPublicView } from "../src/index.js";

const PREP_MS = 2000;
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
  return new GameHarness<BluffBattleState>(bluffBattlePlugin, {
    players: roster,
    settings: { rounds: opts?.rounds ?? 2, writeSeconds: 30, voteSeconds: 20 },
    seed: opts?.seed ?? 1234,
  });
}

function activeIds(h: ReturnType<typeof makeHarness>) {
  return h.ctx.players.filter((p) => p.role === "player").map((p) => p.playerId);
}

/** ROUND_PREP → WRITING at the current clock position. */
function enterWriting(h: ReturnType<typeof makeHarness>) {
  h.clock.advance(PREP_MS + 100);
  h.runTickUntil((s) => s.phase === "WRITING");
  expect(h.state.phase).toBe("WRITING");
}

function correctTextOf(h: ReturnType<typeof makeHarness>) {
  const id = h.state.promptIds[h.state.current];
  return promptBank.find((p) => p.id === id)!.correctText;
}

/** Everyone writes a distinct bluff ⇒ ends in VOTING (≥2 distinct bluffs). */
function writeDistinct(h: ReturnType<typeof makeHarness>) {
  enterWriting(h);
  for (const pid of activeIds(h)) {
    h.act("TEXT", { text: `bluff exclusivo de ${pid} na ronda ${h.state.roundNumber}` }, pid);
  }
  expect(h.state.phase).toBe("VOTING");
}

/** Index of the option authored by `authorId` (null author = correct answer). */
function optionIdxByAuthor(h: ReturnType<typeof makeHarness>, authorId: string | null) {
  return h.state.optionAuthors.indexOf(authorId);
}

describe("Bluff Battle — spec §14.5 minimum test set", () => {
  it("completes a full game deterministically (same scores on repeated runs)", () => {
    const run = () => {
      const h = makeHarness({ playerCount: 3, rounds: 2 });
      for (let round = 0; round < 2; round++) {
        writeDistinct(h);
        const correctIdx = optionIdxByAuthor(h, null);
        const p1BluffIdx = optionIdxByAuthor(h, "p1");
        // p1 finds the truth (+100); p3 falls for p1's bluff (+40 to p1)
        h.act("VOTE", { optionId: String(correctIdx) }, "p1");
        h.act("VOTE", { optionId: String(correctIdx) }, "p2");
        h.act("VOTE", { optionId: String(p1BluffIdx) }, "p3");
        expect(h.state.phase).toBe("ROUND_RESULT");
        if (round === 0) {
          h.clock.advance(RESULT_MS + 100);
          h.runTickUntil((s) => s.phase === "ROUND_PREP" && s.roundNumber === 2);
        }
      }
      h.clock.advance(RESULT_MS + 100);
      h.runTickUntil((s) => s.phase === "GAME_RESULT");
      expect(h.finished()).toBe(true);
      return { score: h.score(), totals: { ...h.state.totals } };
    };

    const a = run();
    const b = run();
    expect(a.score.roundScores).toEqual(b.score.roundScores); // seeded PRNG
    expect(a.totals).toEqual(b.totals);
    expect(a.totals["p1"]).toBe((100 + 40) * 2);
    expect(Object.keys(a.score.titles ?? [])).toEqual(["p1"]);
  });

  it("rejects duplicate submissions and duplicate votes", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1 });
    enterWriting(h);
    h.act("TEXT", { text: "mentira original" }, "p1");
    const dup = h.tryAct("TEXT", { text: "outra versao qualquer" }, "p1");
    expect(dup.ok).toBe(false);
    if (!dup.ok) expect(dup.code).toBe("DUPLICATE_ACTION");

    for (const pid of ["p2", "p3"]) {
      h.act("TEXT", { text: `bluff de ${pid}` }, pid);
    }
    expect(h.state.phase).toBe("VOTING");
    const correctIdx = optionIdxByAuthor(h, null);
    h.act("VOTE", { optionId: String(correctIdx) }, "p1");
    const dupVote = h.tryAct("VOTE", { optionId: String(optionIdxByAuthor(h, "p2")) }, "p1");
    expect(dupVote.ok).toBe(false);
    if (!dupVote.ok) expect(dupVote.code).toBe("DUPLICATE_ACTION");
  });

  it("voting for your own bluff is FORBIDDEN", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1 });
    writeDistinct(h);
    const ownIdx = optionIdxByAuthor(h, "p1");
    const res = h.tryAct("VOTE", { optionId: String(ownIdx) }, "p1");
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.code).toBe("FORBIDDEN");
      expect(res.reason).toContain("cannot vote own");
    }
  });

  it("rejects spectators and invalid payloads / wrong phases", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1, withSpectator: true });
    // spectator cannot act
    const specRes = h.tryAct("TEXT", { text: "espectador" }, "spec");
    expect(specRes.ok).toBe(false);
    if (!specRes.ok) expect(specRes.code).toBe("FORBIDDEN");

    enterWriting(h);
    expect(h.validate("TEXT", { text: "" }).ok).toBe(false); // empty
    expect(h.validate("TEXT", { text: "   " }).ok).toBe(false); // whitespace only
    expect(h.validate("TEXT", { text: 42 }).ok).toBe(false); // wrong type
    expect(h.validate("TEXT", { text: "a".repeat(81) }).ok).toBe(false); // too long
    expect(h.validate("TEXT", {}).ok).toBe(false); // missing field
    expect(codeOf(h.validate("VOTE", { optionId: "0" }))).toBe("BAD_PHASE");
    expect(h.validate("DANCE", {}).ok).toBe(false); // unknown action

    writeDistinct(h);
    expect(codeOf(h.validate("TEXT", { text: "agora ja nao posso" }))).toBe("BAD_PHASE");
    expect(h.validate("VOTE", { optionId: "99" }).ok).toBe(false); // out of range
    expect(h.validate("VOTE", { optionId: 0 }).ok).toBe(false); // not a string
    expect(h.validate("VOTE", { optionId: "x" }).ok).toBe(false);
  });

  it("advances phases via deadlines when players stay silent", () => {
    const h = makeHarness({ playerCount: 3, rounds: 2 }); // spec min rounds = 2
    enterWriting(h);
    // two distinct bluffs submitted; p3 silent until the writing deadline
    h.act("TEXT", { text: "primeiro bluff" }, "p1");
    h.act("TEXT", { text: "segundo bluff bem diferente" }, "p2");
    expect(h.state.phase).toBe("WRITING");

    h.clock.advance(30_100); // > writeSeconds
    h.runTickUntil((s) => s.phase !== "WRITING");
    expect(h.state.phase).toBe("VOTING"); // 2 distinct bluffs ⇒ voting happens

    // a player without a submitted bluff may still vote
    h.act("VOTE", { optionId: String(optionIdxByAuthor(h, null)) }, "p3");
    h.clock.advance(20_100); // > voteSeconds
    h.runTickUntil((s) => s.phase !== "VOTING");
    expect(h.state.phase).toBe("ROUND_RESULT");

    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "ROUND_PREP" && s.roundNumber === 2);

    // round 2: total silence ⇒ <2 distinct bluffs ⇒ voting skipped entirely
    enterWriting(h);
    h.clock.advance(30_100);
    h.runTickUntil((s) => s.phase === "ROUND_RESULT");
    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "GAME_RESULT");
    expect(h.finished()).toBe(true);
  });

  it("never leaks the correct answer or authors before the reveal", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1 });
    const secret = correctTextOf(h);

    enterWriting(h);
    let pub = JSON.stringify(h.publicView());
    expect(pub.includes(secret)).toBe(false);

    writeDistinct(h);
    pub = JSON.stringify(h.publicView());
    expect(pub.includes(secret)).toBe(false);
    expect(pub.includes("reveal")).toBe(false);
    expect(pub.includes("authorNickname")).toBe(false);
    for (const opt of h.state.options) {
      expect(pub.includes(opt)).toBe(false);
    }

    // positive control: after the vote the reveal IS public
    const correctIdx = optionIdxByAuthor(h, null);
    for (const pid of activeIds(h)) {
      h.act("VOTE", { optionId: String(correctIdx) }, pid);
    }
    pub = JSON.stringify(h.publicView());
    expect(h.state.phase).toBe("ROUND_RESULT");
    expect(pub.includes(secret)).toBe(true);
    expect(pub.includes("authorNickname")).toBe(true);
  });

  it("shares the title when the game ends in a tie", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1 });
    writeDistinct(h);
    const correctIdx = optionIdxByAuthor(h, null);
    for (const pid of activeIds(h)) {
      h.act("VOTE", { optionId: String(correctIdx) }, pid); // everyone finds the truth
    }
    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "GAME_RESULT");

    const s = h.score();
    expect(s.roundScores.every((r) => r.delta === 100)).toBe(true);
    expect(Object.keys(s.titles ?? {}).sort()).toEqual(["p1", "p2", "p3"]);
    expect(s.awards?.[0]?.kind).toBe("tie");
  });

  it("skips voting when fewer than 2 distinct bluffs survive dedup", () => {
    // scenario A: one lone survivor ⇒ +60 impossible bonus, others discarded
    const h = makeHarness({ playerCount: 3, rounds: 2 });
    enterWriting(h);
    h.act("TEXT", { text: "mentira solitária" }, "p1");
    h.act("TEXT", { text: "cópia gémea" }, "p2");
    h.act("TEXT", { text: " CÓPIA gémeA " }, "p3"); // duplicate of p2 once sanitised+normalised
    expect(h.state.phase).toBe("ROUND_RESULT"); // voting skipped entirely
    expect(h.state.totals["p1"]).toBe(60);
    expect(h.state.totals["p2"]).toBeUndefined();
    expect(h.state.totals["p3"]).toBeUndefined();

    const reveal = (h.publicView() as BluffPublicView).reveal!;
    expect(reveal.impossibleBonusNicknames).toEqual(["Player1"]);
    const discarded = reveal.submissions.filter((s) => s.discarded);
    expect(discarded.map((s) => s.authorNickname).sort()).toEqual(["Player2", "Player3"]);

    // scenario B: everyone writes the truth ⇒ zero bluffs, zero points
    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "ROUND_PREP" && s.roundNumber === 2);
    h.clock.advance(PREP_MS + 100);
    h.runTickUntil((s) => s.phase === "WRITING");
    const secret = correctTextOf(h);
    for (const pid of activeIds(h)) {
      h.act("TEXT", { text: pid === "p1" ? secret : secret.toUpperCase() }, pid);
    }
    expect(h.state.phase).toBe("ROUND_RESULT");
    expect(h.state.lastRound?.impossibleBonusIds).toEqual([]);
    expect(Object.keys(h.state.totals)).toEqual(["p1"]); // only round-1 bonus remains
  });

  it("declares its manifest contract (controllers, lateJoin, bounds)", () => {
    expect(bluffBattlePlugin.manifest.controllers).toEqual(["text", "vote"]);
    expect(bluffBattlePlugin.manifest.lateJoin).toBe("spectatorUntilRound");
    expect(bluffBattlePlugin.manifest.minPlayers).toBe(3);
    expect(bluffBattlePlugin.manifest.maxPlayers).toBe(20);
    expect(bluffBattlePlugin.manifest.priority).toBe("P0");
  });
});
