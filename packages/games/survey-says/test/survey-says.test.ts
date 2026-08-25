import { describe, expect, it } from "vitest";
import { GameHarness } from "@rs-party/game-engine";
import type { RoomPlayerRef } from "@rs-party/game-engine";
import surveySaysPlugin, { matchesInput, normalizeAnswer } from "../src/index.js";
import type { SurveyPublicView, SurveySaysState } from "../src/index.js";
import { SURVEY_QUESTIONS } from "../src/bank.js";

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
  seed?: number;
  rounds?: number;
  answerSeconds?: number;
  withSpectator?: boolean;
}) {
  const roster = [...players(opts?.playerCount ?? 3)];
  if (opts?.withSpectator) {
    roster.push({ playerId: "spec", nickname: "Spectator", role: "spectator" });
  }
  return new GameHarness<SurveySaysState>(surveySaysPlugin, {
    players: roster,
    // in-range values only — clampInt may raise below-minimum inputs
    settings: {
      rounds: opts?.rounds ?? 2,
      answerSeconds: opts?.answerSeconds ?? 15,
    },
    seed: opts?.seed ?? 1234,
  });
}

/** Deterministic fixture: force a specific bank question. */
function pinQuestion(h: ReturnType<typeof makeHarness>, id: string) {
  h.state = { ...h.state, questionId: id };
}

/** ROUND_PREP → COLLECTING at the current clock position. */
function enterCollecting(h: ReturnType<typeof makeHarness>) {
  h.clock.advance(PREP_MS + 100);
  h.runTickUntil((s) => s.phase === "COLLECTING");
  expect(h.state.phase).toBe("COLLECTING");
}

function questionOf(state: SurveySaysState) {
  return SURVEY_QUESTIONS.find((q) => q.id === state.questionId)!;
}

describe("Survey Says — spec §18 minimum test set", () => {
  it("plays deterministically: same seed ⇒ same questions, boards and scores", () => {
    const run = () => {
      const h = makeHarness({ playerCount: 3, seed: 99, rounds: 2 });
      const boards: string[] = [];
      for (let r = 0; r < 2; r++) {
        enterCollecting(h);
        const topText = questionOf(h.state).answers[0]!.text;
        h.act("TEXT", { text: topText }, "p1");
        h.act("TEXT", { text: topText.toUpperCase() }, "p2");
        h.act("TEXT", { text: `   ${topText}   ` }, "p3"); // whitespace-padded exact
        expect(h.state.phase).toBe("ROUND_RESULT"); // everyone answered ⇒ early close
        boards.push(JSON.stringify(h.state.lastResult));
        h.clock.advance(RESULT_MS + 100);
        h.runTickUntil((s) => s.phase === "ROUND_PREP" || s.phase === "GAME_RESULT");
      }
      expect(h.finished()).toBe(true);
      return { boards, totals: { ...h.state.totals }, score: h.score() };
    };

    const a = run();
    const b = run();
    expect(a.boards).toEqual(b.boards);
    expect(a.totals).toEqual(b.totals);
    expect(a.score.roundScores).toEqual(b.score.roundScores);
    // every submission hit the same top official ⇒ identical totals, shared title
    expect(Object.keys(a.score.titles ?? {}).sort()).toEqual(["p1", "p2", "p3"]);
  });

  it("scores by highest-weight match, awards +50 to the top answer, ignores misses", () => {
    const h = makeHarness({ playerCount: 4, rounds: 1 });
    pinQuestion(h, "manha"); // Café 30 · Ver o telemóvel 25 · Duche 20 · …
    enterCollecting(h);

    h.act("TEXT", { text: "CAFE" }, "p1"); // diacritic-free exact match, weight 30
    h.act("TEXT", { text: "ver o telemovel" }, "p2"); // exact after normalization, 25
    h.act("TEXT", { text: "duche quente e sabao" }, "p3"); // main word substring, 20
    h.act("TEXT", { text: "banana split" }, "p4"); // no match ⇒ 0

    expect(h.state.phase).toBe("ROUND_RESULT"); // all four answered ⇒ closed early
    const rows = Object.fromEntries(h.score().roundScores.map((r) => [r.playerId, r.delta]));
    expect(rows["p1"]).toBe(80); // 30 + 50 top-answer bonus
    expect(rows["p2"]).toBe(25);
    expect(rows["p3"]).toBe(20);
    expect(rows["p4"]).toBe(0);
    expect(Object.keys(h.score().titles ?? {})).toEqual(["p1"]);

    const result = h.state.lastResult!;
    expect(result.topAnswer).toBe("Café");
    const byAnswer = Object.fromEntries(
      result.board.map((row) => [row.answer, row.matchedBy]),
    );
    expect(byAnswer["Café"]).toEqual(["Player1"]);
    expect(byAnswer["Ver o telemóvel"]).toEqual(["Player2"]);
    expect(byAnswer["Duche"]).toEqual(["Player3"]);
    expect(byAnswer["Pequeno-almoço"]).toEqual([]);
  });

  it("matches multi-official inputs at the max weight without double counting", () => {
    const h = makeHarness({ playerCount: 2, rounds: 1 });
    pinQuestion(h, "manha");
    enterCollecting(h);

    // hits BOTH "Ver o telemóvel" (25) and "Duche" (20) ⇒ earns max(25,20) + 50
    // top-answer bonus (its biggest hit IS the round's top answer)
    h.act("TEXT", { text: "telemovel duche" }, "p1");
    h.act("TEXT", { text: "nada disto interessa" }, "p2");

    const rows = Object.fromEntries(h.score().roundScores.map((r) => [r.playerId, r.delta]));
    expect(rows["p1"]).toBe(75);
    expect(rows["p2"]).toBe(0);

    const byAnswer = Object.fromEntries(
      h.state.lastResult!.board.map((row) => [row.answer, row.matchedBy]),
    );
    expect(byAnswer["Ver o telemóvel"]).toEqual(["Player1"]);
    expect(byAnswer["Duche"]).toEqual(["Player1"]);
    // nobody hit the real top answer ⇒ no +50 anywhere and topAnswer reflects hits
    expect(h.state.lastResult!.topAnswer).toBe("Ver o telemóvel");
  });

  it("rejects spectators, duplicates, bad payloads and wrong phases; accepts the 60-char limit", () => {
    const h = makeHarness({ playerCount: 3, rounds: 1, withSpectator: true });
    pinQuestion(h, "praia");

    expect(codeOf(h.validate("TEXT", { text: "toalha" }, "spec"))).toBe("FORBIDDEN");
    expect(codeOf(h.validate("TEXT", { text: "toalha" }, "p1"))).toBe("BAD_PHASE"); // still prep
    expect(h.validate("SHOUT", {}).ok).toBe(false); // unknown action

    enterCollecting(h);
    expect(codeOf(h.validate("TEXT", {}, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("TEXT", null, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("TEXT", 42, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("TEXT", { text: "" }, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("TEXT", { text: "   " }, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("TEXT", { text: "a".repeat(61) }, "p1"))).toBe("INVALID_PAYLOAD");

    h.act("TEXT", { text: "a".repeat(60) }, "p1"); // boundary accepted
    expect(codeOf(h.validate("TEXT", { text: "outra" }, "p1"))).toBe("DUPLICATE_ACTION");

    h.act("TEXT", { text: "protetor solar" }, "p2");
    h.act("TEXT", { text: "toalha" }, "p3");
    expect(codeOf(h.validate("TEXT", { text: "chapeu" }, "p1"))).toBe("BAD_PHASE"); // round over
  });

  it("keeps official answers secret until reveal, then publishes the full board", () => {
    const h = makeHarness({ playerCount: 2, rounds: 1 });
    pinQuestion(h, "fruta"); // Banana · Ananás · Manga · Melão
    enterCollecting(h);

    const officials = questionOf(h.state).answers.map((a) => a.text);
    const pub = h.publicView() as SurveyPublicView;

    // semantic: no board before reveal
    expect(pub.board).toBeUndefined();
    expect(pub.topAnswer).toBeUndefined();
    expect(pub.question).toContain("fruta amarela");
    expect(pub.answeredCount).toBe(0);

    const serialized = JSON.stringify(pub);
    for (const official of officials) {
      expect(serialized).not.toContain(official);
      expect(serialized).not.toContain(normalizeAnswer(official));
    }

    h.act("TEXT", { text: "banana" }, "p1");
    expect((h.publicView() as SurveyPublicView).answeredCount).toBe(1);
    const mine = h.privateView("p1");
    expect(mine.textInput).toBe(true);
    expect(mine.textPlaceholder).toBe("Resposta popular…");
    expect(mine.statusText).toBe("Resposta registada!");

    h.act("TEXT", { text: "manga verde" }, "p2"); // main word "manga" substring
    expect(h.state.phase).toBe("ROUND_RESULT");

    const revealed = h.publicView() as SurveyPublicView;
    expect(revealed.board!.map((r) => r.answer)).toEqual(officials); // ALL officials shown
    expect(revealed.board!.map((r) => r.weight)).toEqual([40, 25, 20, 15]);
    expect(revealed.topAnswer).toBe("Banana");
    const byAnswer = Object.fromEntries(revealed.board!.map((r) => [r.answer, r.matchedBy]));
    expect(byAnswer["Banana"]).toEqual(["Player1"]);
    expect(byAnswer["Manga"]).toEqual(["Player2"]);
    expect(byAnswer["Ananás"]).toEqual([]); // unmatched rows stay visible, empty list
  });

  it("advances exactly one phase per deadline crossing through two full rounds", () => {
    const h = makeHarness({ playerCount: 2, rounds: 2, answerSeconds: 15 });
    pinQuestion(h, "medos");
    const firstQuestion = h.state.questionId;

    h.clock.advance(1000);
    h.runTickUntil((s) => s.phase !== "ROUND_PREP");
    expect(h.state.phase).toBe("ROUND_PREP"); // below the 2s prep deadline

    h.clock.advance(1200);
    h.runTickUntil((s) => s.phase !== "ROUND_PREP");
    expect(h.state.phase).toBe("COLLECTING");

    h.clock.advance(10_000);
    h.runTickUntil((s) => s.phase !== "COLLECTING");
    expect(h.state.phase).toBe("COLLECTING"); // 5s left on the answer window

    h.clock.advance(5200);
    h.runTickUntil((s) => s.phase !== "COLLECTING");
    expect(h.state.phase).toBe("ROUND_RESULT");
    expect(h.state.lastResult!.topAnswer).toBeNull(); // nobody answered
    expect(h.state.lastResult!.board.every((r) => r.matchedBy.length === 0)).toBe(true);

    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "ROUND_PREP");
    expect(h.state.roundNumber).toBe(2);
    expect(h.state.questionId).not.toBe(firstQuestion); // fresh unused question
    expect(h.state.usedQuestionIds).toContain(firstQuestion);

    h.clock.advance(PREP_MS + 100);
    h.runTickUntil((s) => s.phase === "COLLECTING");
    h.clock.advance(15_000 + 100);
    h.runTickUntil((s) => s.phase === "ROUND_RESULT");

    h.clock.advance(RESULT_MS + 100);
    h.runTickUntil((s) => s.phase === "GAME_RESULT");
    expect(h.finished()).toBe(true);
    expect(h.publicView().finished).toBe(true);
  });

  it("shares the title 🏆 on a final tie", () => {
    const h = makeHarness({ playerCount: 2, rounds: 1 });
    pinQuestion(h, "esplanada"); // top answer Café weight 35
    enterCollecting(h);

    h.act("TEXT", { text: "café" }, "p1");
    h.act("TEXT", { text: "CAFÉ COM NATA" }, "p2"); // also hits Café (main word)

    const rows = Object.fromEntries(h.score().roundScores.map((r) => [r.playerId, r.delta]));
    expect(rows["p1"]).toBe(85); // 35 + 50
    expect(rows["p2"]).toBe(85);
    expect(Object.keys(h.score().titles ?? {}).sort()).toEqual(["p1", "p2"]);
    expect(h.score().awards?.[0]?.kind).toBe("tie");
  });

  it("declares its manifest contract and keeps the content bank healthy", () => {
    expect(surveySaysPlugin.manifest.id).toBe("survey-says");
    expect(surveySaysPlugin.manifest.controllers).toEqual(["text"]);
    expect(surveySaysPlugin.manifest.lateJoin).toBe("disallow");
    expect(surveySaysPlugin.manifest.minPlayers).toBe(2);
    expect(surveySaysPlugin.manifest.maxPlayers).toBe(20);
    expect(surveySaysPlugin.manifest.priority).toBe("P0");
    const rounds = surveySaysPlugin.manifest.settings.find((s) => s.key === "rounds")!;
    expect([rounds.default, rounds.min, rounds.max]).toEqual([4, 2, 10]);
    const answerSeconds = surveySaysPlugin.manifest.settings.find(
      (s) => s.key === "answerSeconds",
    )!;
    expect([answerSeconds.default, answerSeconds.min, answerSeconds.max]).toEqual([25, 10, 60]);

    // bank hygiene: enough questions, unique ids, 4-6 answers, descending weights
    expect(SURVEY_QUESTIONS.length).toBeGreaterThanOrEqual(10);
    const ids = new Set(SURVEY_QUESTIONS.map((q) => q.id));
    expect(ids.size).toBe(SURVEY_QUESTIONS.length);
    for (const q of SURVEY_QUESTIONS) {
      expect(q.answers.length).toBeGreaterThanOrEqual(4);
      expect(q.answers.length).toBeLessThanOrEqual(6);
      for (let i = 1; i < q.answers.length; i++) {
        expect(q.answers[i - 1]!.weight).toBeGreaterThanOrEqual(q.answers[i]!.weight);
      }
    }
  });

  it("normalizes answers without regex unicode property escapes", () => {
    expect(normalizeAnswer("  CAFÉ  ")).toBe("cafe");
    expect(normalizeAnswer("Trânsito")).toBe("transito");
    expect(normalizeAnswer("PÊRA ção")).toBe("pera cao");
    const cafe = normalizeAnswer("Café");
    expect(matchesInput("cafe", cafe)).toBe(true); // exact after normalization
    expect(matchesInput("cafezinho", cafe)).toBe(true); // main word ⊆ input
    expect(matchesInput("dentes", normalizeAnswer("Escovar os dentes"))).toBe(true);
    expect(matchesInput("x", normalizeAnswer("Cão"))).toBe(false); // tiny input, no main word
  });
});
