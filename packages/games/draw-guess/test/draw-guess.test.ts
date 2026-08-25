import { describe, expect, it } from "vitest";
import { GameHarness } from "@rs-party/game-engine";
import type { RoomPlayerRef } from "@rs-party/game-engine";
import drawGuessPlugin from "../src/index.js";
import type { DrawGuessState } from "../src/index.js";

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

function makeHarness(opts?: { playerCount?: number; rounds?: number; seed?: number }) {
  return new GameHarness<DrawGuessState>(drawGuessPlugin, {
    players: players(opts?.playerCount ?? 3),
    settings: { rounds: opts?.rounds ?? 2, drawSeconds: 60 },
    seed: opts?.seed ?? 777,
  });
}

function activeIds(h: ReturnType<typeof makeHarness>) {
  return h.ctx.players.filter((p) => p.role === "player").map((p) => p.playerId);
}

function artistAt(h: ReturnType<typeof makeHarness>, roundIndex: number): string {
  const ps = activeIds(h);
  return ps[(h.state.artistOffset + roundIndex) % ps.length]!;
}

/** ROUND_PREP → DRAWING at the current clock position. */
function enterDrawing(h: ReturnType<typeof makeHarness>) {
  h.clock.advance(PREP_MS + 100);
  h.runTickUntil((s) => s.phase === "DRAWING");
  expect(h.state.phase).toBe("DRAWING");
}

function guessersOf(h: ReturnType<typeof makeHarness>) {
  const artist = artistAt(h, h.state.current);
  return activeIds(h).filter((pid) => pid !== artist);
}

describe("Draw & Guess — spec §14.6 minimum test set", () => {
  it("completes a full game deterministically (same scores on repeated runs)", () => {
    const run = () => {
      const h = makeHarness({ playerCount: 3, rounds: 2 });
      for (let round = 0; round < 2; round++) {
        enterDrawing(h);
        const [firstGuesser, secondGuesser] = guessersOf(h);
        h.act("TEXT", { text: "uma tentativa errada" }, secondGuesser!);
        h.act(
          "TEXT",
          { text: h.state.words[h.state.current].toUpperCase() },
          firstGuesser!,
        );
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
    expect(a.score.roundScores).toEqual(b.score.roundScores); // seeded PRNG ⇒ deterministic

    // expected maths: winning guesser +120, round artist +80, every round solved
    const probe = makeHarness({ playerCount: 3, rounds: 2 });
    const expected: Record<string, number> = {};
    for (let r = 0; r < 2; r++) {
      const artist = artistAt(probe, r); // same seed ⇒ same rotation
      const winner = activeIds(probe).find((pid) => pid !== artist)!;
      expected[artist] = (expected[artist] ?? 0) + 80;
      expected[winner] = (expected[winner] ?? 0) + 120;
    }
    expect(a.totals).toEqual(expected);
    expect(Object.keys(a.score.titles ?? []).length).toBe(1); // unique top scorer
  });

  it("rejects identical guesses as DUPLICATE_ACTION (accent/case-insensitive)", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1 });
    enterDrawing(h);
    const guesser = guessersOf(h)[0]!;
    h.act("TEXT", { text: "casa amarela" }, guesser);
    const dup = h.tryAct("TEXT", { text: "casa amarela" }, guesser);
    expect(dup.ok).toBe(false);
    if (!dup.ok) expect(dup.code).toBe("DUPLICATE_ACTION");
    // normalised duplicate (case/accents/whitespace) also counts
    const dupNorm = h.tryAct("TEXT", { text: "  CASA Amarela" }, guesser);
    expect(dupNorm.ok).toBe(false);
    if (!dupNorm.ok) expect(dupNorm.code).toBe("DUPLICATE_ACTION");
    // a different guess is fine — multiple attempts allowed per round
    expect(h.tryAct("TEXT", { text: "carro azul" }, guesser).ok).toBe(true);
  });

  it("rejects spectators, the artist guessing, and invalid payloads", () => {
    const roster = [
      ...players(3),
      { playerId: "spec", nickname: "Spectator", role: "spectator" as const },
    ];
    const h = new GameHarness<DrawGuessState>(drawGuessPlugin, {
      players: roster,
      settings: { rounds: 1, drawSeconds: 60 },
      seed: 777,
    });

    enterDrawing(h);
    const artist = artistAt(h, 0);
    const guesser = activeIds(h).find((pid) => pid !== artist)!;

    const specRes = h.tryAct("TEXT", { text: "chute do espectador" }, "spec");
    expect(specRes.ok).toBe(false);
    if (!specRes.ok) expect(specRes.code).toBe("FORBIDDEN");

    const artistRes = h.tryAct("TEXT", { text: "o proprio desenhista" }, artist);
    expect(artistRes.ok).toBe(false);
    if (!artistRes.ok) expect(artistRes.code).toBe("FORBIDDEN");

    expect(h.validate("TEXT", { text: "" }).ok).toBe(false);
    expect(h.validate("TEXT", { text: "   " }).ok).toBe(false);
    expect(h.validate("TEXT", { text: 7 }).ok).toBe(false);
    expect(h.validate("TEXT", { text: "a".repeat(41) }).ok).toBe(false);
    expect(h.validate("TELEPATIA", {}).ok).toBe(false); // unknown action type
    expect(h.validate("TEXT", { text: "chute válido" }).ok).toBe(true);

    // wrong phase on a fresh game (ROUND_PREP)
    const h2 = makeHarness({ playerCount: 3, rounds: 1 });
    expect(codeOf(h2.validate("TEXT", { text: "ainda em prep" }))).toBe("BAD_PHASE");
  });

  it("advances to ROUND_RESULT with no points when the drawing deadline passes", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1 });
    enterDrawing(h);
    h.clock.advance(60_100); // > drawSeconds
    h.runTickUntil((s) => s.phase !== "DRAWING");
    expect(h.state.phase).toBe("ROUND_RESULT");
    expect(h.state.lastRound?.winnerId).toBeNull();

    const pub = h.publicView();
    expect(pub.solved).toBe(false);
    expect(pub.word).toBe(h.state.words[0]); // revealed after close
    expect(Object.keys(h.state.totals)).toEqual([]); // nobody scored

    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "GAME_RESULT");
    expect(h.finished()).toBe(true);
  });

  it("never leaks the word or guess texts before the reveal", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1 });
    const secret = h.state.words[0];

    let pub = JSON.stringify(h.publicView());
    expect(pub.includes(secret)).toBe(false);

    enterDrawing(h);
    pub = JSON.stringify(h.publicView());
    expect(pub.includes(secret)).toBe(false);
    expect(pub.toLowerCase().includes("desenha:")).toBe(false); // no artist prompt leak

    const guesser = guessersOf(h)[0]!;
    h.act("TEXT", { text: "chute errado qualquer" }, guesser);
    pub = JSON.stringify(h.publicView());
    expect(pub.includes("chute errado qualquer")).toBe(false); // guesses stay private
    expect(h.publicView().attempts).toBe(1);

    // the secret reaches ONLY the artist's phone during play
    const artist = artistAt(h, 0);
    expect(JSON.stringify(h.privateView(artist))).toContain(secret);
    for (const pid of activeIds(h)) {
      if (pid === artist) continue;
      expect(JSON.stringify(h.privateView(pid))).not.toContain(secret);
    }

    // positive control: reveal after the round closes
    const other = guessersOf(h).find((pid) => pid !== guesser)!;
    h.act("TEXT", { text: secret.toUpperCase() }, other);
    pub = JSON.stringify(h.publicView());
    expect(h.state.phase).toBe("ROUND_RESULT");
    expect(pub).toContain(`"word":"${secret}"`);
  });

  it("shares the title when two players tie at the top", () => {
    const h = makeHarness({ playerCount: 3, rounds: 2 });
    // symmetric scheme: round-1 winner is round-2's artist and vice-versa ⇒
    // both finish with 120 + 80 = 200; the third player scores nothing.
    const artistR1 = artistAt(h, 0);
    const artistR2 = artistAt(h, 1);
    expect(artistR1).not.toBe(artistR2); // consecutive rounds rotate the pen

    enterDrawing(h);
    h.act("TEXT", { text: h.state.words[0] }, artistR2); // artistR2 wins round 1
    expect(h.state.phase).toBe("ROUND_RESULT");

    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "ROUND_PREP" && s.roundNumber === 2);
    h.clock.advance(PREP_MS + 100);
    h.runTickUntil((s) => s.phase === "DRAWING");
    h.act("TEXT", { text: h.state.words[1] }, artistR1); // artistR1 wins round 2
    expect(h.state.phase).toBe("ROUND_RESULT");

    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "GAME_RESULT");

    const s = h.score();
    expect(h.state.totals[artistR1]).toBe(200);
    expect(h.state.totals[artistR2]).toBe(200);
    expect(Object.keys(s.titles ?? {}).sort()).toEqual([artistR1, artistR2].sort());
    expect(s.awards?.[0]?.kind).toBe("tie");
  });

  it("declares its manifest contract (controllers, lateJoin, bounds)", () => {
    expect(drawGuessPlugin.manifest.controllers).toEqual(["draw", "text"]);
    expect(drawGuessPlugin.manifest.lateJoin).toBe("spectatorUntilRound");
    expect(drawGuessPlugin.manifest.minPlayers).toBe(3);
    expect(drawGuessPlugin.manifest.maxPlayers).toBe(12);
    expect(drawGuessPlugin.manifest.priority).toBe("P0");
  });
});
