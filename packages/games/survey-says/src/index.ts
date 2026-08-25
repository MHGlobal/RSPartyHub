/**
 * Survey Says — respostas populares (spec §18, P0).
 * Cada ronda mostra uma pergunta do banco interno; todos respondem em texto
 * livre e o quadro revela as respostas oficiais com quem acertou em cada uma.
 *
 * Matching determinístico: normaliza (lowercase, trim, NFD removendo
 * diacríticos U+0300–U+036F via codePointAt — sem regex \p{Diacritic});
 * há match se igualdade exata OU substring bidirecional da palavra principal
 * (última palavra da resposta oficial normalizada, len ≥ 4). Para a direção
 * "principal contém resposta" exige-se resposta com ≥ 2 caracteres.
 *
 * Pontos: cada jogador ganha o MAIOR peso entre as oficiais que acertou;
 * a top answer da ronda (maior peso ACERTADO) rende +50 extra aos que a
 * acertaram. Empate final partilha o título.
 *
 * As respostas oficiais são segredo até ao ROUND_RESULT — nunca aparecem em
 * publicViews durante PREP/COLLECTING.
 */
import { defineGame } from "@rs-party/game-engine";
import type {
  GameBaseState,
  GameContext,
  PartyGamePlugin,
  ScoreResult,
} from "@rs-party/game-engine";
import type { Actor, GameManifest } from "@rs-party/protocol";
import { SURVEY_QUESTIONS } from "./bank.js";

/* ---------------- types ---------------- */

export interface SurveyBoardRow {
  answer: string;
  weight: number;
  /** nicknames that matched this official answer ([] if nobody did) */
  matchedBy: string[];
}

export interface SurveyRoundResult {
  board: SurveyBoardRow[];
  /** official text of the highest-weight HIT answer (null if nobody scored) */
  topAnswer: string | null;
}

export interface SurveySaysState extends GameBaseState {
  phase: "ROUND_PREP" | "COLLECTING" | "ROUND_RESULT" | "GAME_RESULT";
  /** question ids already played (no repeats while the bank lasts) */
  usedQuestionIds: string[];
  questionId: string;
  /** playerId → raw submitted answer */
  answers: Record<string, string>;
  totals: Record<string, number>;
  /** set when the current round is revealed */
  lastResult?: SurveyRoundResult;
}

export interface SurveyPublicView {
  prompt: string;
  question?: string;
  answeredCount?: number;
  finished: boolean;
  /** ROUND_RESULT only */
  board?: SurveyBoardRow[];
  topAnswer?: string | null;
  scoreboard?: Array<{ playerId: string; nickname: string; total: number }>;
  finalScores?: Array<{ playerId: string; total: number }>;
}

export interface SurveyPrivateView {
  statusText?: string;
  textInput?: boolean;
  textPlaceholder?: string;
}

type SurveyAction = { type: "TEXT"; payload: { text: string } };

/* ---------------- timing & settings ---------------- */

const PREP_MS = 2000;
const RESULT_MS = 4000;

function settingsFrom(ctx: GameContext) {
  const s = ctx.settings;
  return {
    rounds: clampInt(Number(s.rounds ?? 4), 2, 10),
    answerSeconds: clampInt(Number(s.answerSeconds ?? 25), 10, 60),
  };
}

function clampInt(v: number, min: number, max: number): number {
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, Math.round(v)));
}

/* ---------------- matching ---------------- */

/** lowercase + trim + NFD minus combining marks U+0300–U+036F. */
export function normalizeAnswer(raw: string): string {
  const nfd = raw.trim().toLowerCase().normalize("NFD");
  let out = "";
  for (const ch of nfd) {
    const cp = ch.codePointAt(0) ?? 0;
    if (cp >= 0x0300 && cp <= 0x036f) continue;
    out += ch;
  }
  return out;
}

/** Last word of the normalized official, when long enough to be distinctive. */
function mainWordOf(normalizedOfficial: string): string {
  const parts = normalizedOfficial.split(" ");
  const last = parts[parts.length - 1] ?? "";
  return last.length >= 4 ? last : "";
}

export function matchesInput(playerNorm: string, officialNorm: string): boolean {
  if (playerNorm === officialNorm) return true;
  const main = mainWordOf(officialNorm);
  if (main === "" || playerNorm.length < 2) return false;
  return playerNorm.includes(main) || main.includes(playerNorm);
}

/* ---------------- helpers ---------------- */

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function nicknameOf(ctx: GameContext, playerId: string): string {
  return ctx.players.find((p) => p.playerId === playerId)?.nickname ?? "?";
}

function activePlayers(ctx: GameContext) {
  return ctx.players.filter((p) => p.role === "player");
}

function questionOf(state: SurveySaysState) {
  return SURVEY_QUESTIONS.find((q) => q.id === state.questionId) ?? SURVEY_QUESTIONS[0]!;
}

function pickQuestion(ctx: GameContext, used: string[]): string {
  const pool = SURVEY_QUESTIONS.filter((q) => !used.includes(q.id));
  return ctx.rng.pick(pool.length > 0 ? pool : SURVEY_QUESTIONS).id;
}

/**
 * Reveal + scoring (pure). Each answering player earns the HIGHEST weight
 * among the officials they matched; the round's top answer (highest weight
 * among HIT officials, bank order breaks ties) pays +50 to its matchers.
 */
function closeRound(state: SurveySaysState, ctx: GameContext): SurveySaysState {
  if (state.phase === "GAME_RESULT") return state;
  const question = questionOf(state);

  const matchedByOfficial = question.answers.map(() => [] as string[]);
  const hitsByPlayer = new Map<string, number[]>(); // playerId → matched official indexes

  for (const [playerId, raw] of Object.entries(state.answers)) {
    const playerNorm = normalizeAnswer(raw);
    const hits: number[] = [];
    question.answers.forEach((official, idx) => {
      if (matchesInput(playerNorm, normalizeAnswer(official.text))) {
        hits.push(idx);
        matchedByOfficial[idx]!.push(nicknameOf(ctx, playerId));
      }
    });
    if (hits.length > 0) hitsByPlayer.set(playerId, hits);
  }

  // top answer = biggest weight among HIT officials (ties → first in bank order)
  let topIdx = -1;
  let topWeight = -1;
  hitsByPlayer.forEach((hits) => {
    for (const idx of hits) {
      const w = question.answers[idx]!.weight;
      if (w > topWeight) {
        topWeight = w;
        topIdx = idx;
      }
    }
  });

  const totals = { ...state.totals };
  hitsByPlayer.forEach((hits, playerId) => {
    let best = 0;
    for (const idx of hits) {
      best = Math.max(best, question.answers[idx]!.weight);
    }
    if (topIdx >= 0 && hits.includes(topIdx)) best += 50;
    totals[playerId] = (totals[playerId] ?? 0) + best;
  });

  const result: SurveyRoundResult = {
    board: question.answers.map((official, idx) => ({
      answer: official.text,
      weight: official.weight,
      matchedBy: [...matchedByOfficial[idx]!],
    })),
    topAnswer: topIdx >= 0 ? question.answers[topIdx]!.text : null,
  };

  return {
    ...state,
    phase: "ROUND_RESULT",
    phaseLabel: "O quadro das respostas!",
    deadlineAt: ctx.clock.now() + RESULT_MS,
    totals,
    lastResult: result,
  };
}

/* ---------------- plugin ---------------- */

export const surveySaysPlugin: PartyGamePlugin<
  SurveySaysState,
  SurveyPublicView,
  SurveyPrivateView,
  SurveyAction
> & { manifest: GameManifest } = defineGame({
  manifest: {
    id: "survey-says",
    name: "Survey Says",
    description:
      "Adivinha as respostas mais populares do público — texto livre contra o quadro.",
    minPlayers: 2,
    maxPlayers: 20,
    avgDurationMinutes: 6,
    tags: ["trivia", "party"],
    contentRating: "family",
    requiresBigScreen: true,
    supportsTableMode: false,
    lateJoin: "disallow",
    spectatorSupport: true,
    teamSupport: false,
    controllers: ["text"],
    settings: [
      {
        key: "rounds",
        label: "Número de rondas",
        kind: "number",
        default: 4,
        min: 2,
        max: 10,
        step: 1,
      },
      {
        key: "answerSeconds",
        label: "Segundos para responder",
        kind: "number",
        default: 25,
        min: 10,
        max: 60,
        step: 5,
      },
    ],
    priority: "P0",
  },

  createInitialState(ctx): SurveySaysState {
    const questionId = pickQuestion(ctx, []);
    return {
      phase: "ROUND_PREP",
      phaseLabel: "Pergunta a chegar…",
      roundNumber: 1,
      roundTotal: settingsFrom(ctx).rounds,
      deadlineAt: ctx.clock.now() + PREP_MS,
      usedQuestionIds: [],
      questionId,
      answers: {},
      totals: {},
    };
  },

  getPublicView(state, ctx): SurveyPublicView {
    if (state.phase === "GAME_RESULT") {
      const scoreboard = activePlayers(ctx)
        .map((p) => ({
          playerId: p.playerId,
          nickname: p.nickname,
          total: state.totals[p.playerId] ?? 0,
        }))
        .sort((a, b) => b.total - a.total);
      return {
        prompt: state.phaseLabel,
        finished: true,
        scoreboard,
        finalScores: scoreboard.map((r) => ({ playerId: r.playerId, total: Math.max(0, r.total) })),
      };
    }

    const base: SurveyPublicView = {
      prompt: state.phaseLabel,
      question: questionOf(state).question,
      answeredCount: Object.keys(state.answers).length,
      finished: false,
    };

    if (state.phase === "ROUND_RESULT" && state.lastResult) {
      return {
        ...base,
        // official answers become public only at reveal
        board: state.lastResult.board.map((row) => ({
          answer: row.answer,
          weight: row.weight,
          matchedBy: [...row.matchedBy],
        })),
        topAnswer: state.lastResult.topAnswer,
      };
    }
    // ROUND_PREP / COLLECTING: question + counter only, NO official answers
    return base;
  },

  getPrivateView(state, playerId): SurveyPrivateView {
    switch (state.phase) {
      case "ROUND_PREP":
        return { statusText: `Prepara-te para a ronda ${state.roundNumber}…` };
      case "COLLECTING": {
        const answered = state.answers[playerId] !== undefined;
        return {
          textInput: true,
          textPlaceholder: "Resposta popular…",
          statusText: answered ? "Resposta registada!" : "Qual será a resposta mais popular?",
        };
      }
      case "ROUND_RESULT":
        return { statusText: "Vejamos o quadro…" };
      case "GAME_RESULT":
        return { statusText: "Fim do jogo" };
    }
  },

  validateAction(state, action, actor) {
    switch (action.type) {
      case "TEXT": {
        if (actor.role !== "player") {
          return { ok: false, code: "FORBIDDEN", reason: "spectators cannot answer" };
        }
        if (state.phase !== "COLLECTING") return { ok: false, code: "BAD_PHASE" };
        const text = isPlainObject(action.payload) ? action.payload.text : undefined;
        if (typeof text !== "string") {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "text must be a string" };
        }
        const trimmed = text.trim();
        if (trimmed.length < 1 || trimmed.length > 60) {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "text must be 1..60 chars" };
        }
        if (state.answers[actor.playerId] !== undefined) {
          return { ok: false, code: "DUPLICATE_ACTION", reason: "already answered this round" };
        }
        return { ok: true };
      }
      default:
        return { ok: false, code: "INVALID_PAYLOAD" };
    }
  },

  reduce(state, action, actor, ctx) {
    switch (action.type) {
      case "TEXT":
        // pure transition: stores the answer and closes the round early
        // when every active player has submitted one
        return applyAnswer(state, actor.playerId, action.payload.text.trim(), ctx);
    }
  },

  /**
   * Returns the SAME state reference when nothing changed — the runtime
   * detects transitions by reference comparison, so this is the type-safe
   * equivalent of a "no-op" tick.
   */
  tick(state, now, ctx) {
    switch (state.phase) {
      case "ROUND_PREP": {
        if (state.deadlineAt === undefined || now < state.deadlineAt) return state;
        return {
          ...state,
          phase: "COLLECTING",
          phaseLabel: "Respondam!",
          deadlineAt: now + settingsFrom(ctx).answerSeconds * 1000,
        };
      }
      case "COLLECTING": {
        if (state.deadlineAt === undefined || now < state.deadlineAt) return state;
        return closeRound(state, ctx);
      }
      case "ROUND_RESULT": {
        if (state.deadlineAt === undefined || now < state.deadlineAt) return state;
        return advanceRound(state, ctx, now);
      }
      default:
        return state;
    }
  },

  isFinished(state) {
    return state.phase === "GAME_RESULT";
  },

  score(state, ctx): ScoreResult {
    // every active player appears exactly once — zero scorers included
    const totals: Record<string, number> = {};
    for (const p of activePlayers(ctx)) totals[p.playerId] = Math.max(0, state.totals[p.playerId] ?? 0);
    const clamped = Object.fromEntries(
      Object.entries(totals).map(([playerId, total]) => [playerId, Math.max(0, total)]),
    );
    const roundScores = Object.entries(clamped)
      .map(([playerId, delta]) => ({ playerId, delta }))
      .sort((a, b) => b.delta - a.delta);
    const top = roundScores[0]?.delta ?? 0;
    const winners =
      top <= 0 ? [] : roundScores.filter((r) => r.delta === top).map((r) => r.playerId);
    return {
      roundScores,
      titles: winners.length
        ? Object.fromEntries(winners.map((id) => [id, "🏆 Oráculo Popular"]))
        : undefined,
      awards:
        winners.length === 1
          ? [{ kind: "winner", label: "Lê a mente das massas", playerIds: winners }]
          : winners.length > 1
            ? [{ kind: "tie", label: "Empate no pódio popular", playerIds: winners }]
            : undefined,
    };
  },

  serialize(state) {
    return JSON.parse(JSON.stringify(state));
  },

  deserialize(value) {
    return value as SurveySaysState;
  },
});

export default surveySaysPlugin;

/* ---------------- transitions (pure) ---------------- */

/** Store an answer atomically; close early when every active player answered. */
export function applyAnswer(
  state: SurveySaysState,
  playerId: string,
  text: string,
  ctx: GameContext,
): SurveySaysState {
  const next: SurveySaysState = {
    ...state,
    answers: { ...state.answers, [playerId]: text },
  };
  const everyone = activePlayers(ctx).every((p) => next.answers[p.playerId] !== undefined);
  return everyone ? closeRound(next, ctx) : next;
}

/** Next round with a fresh unused question, or game over. */
function advanceRound(state: SurveySaysState, ctx: GameContext, now: number): SurveySaysState {
  if (state.roundNumber >= state.roundTotal) {
    return { ...state, phase: "GAME_RESULT", phaseLabel: "Fim do jogo", deadlineAt: undefined };
  }
  const used = [...state.usedQuestionIds, state.questionId];
  return {
    ...state,
    phase: "ROUND_PREP",
    phaseLabel: "Pergunta a chegar…",
    roundNumber: state.roundNumber + 1,
    usedQuestionIds: used,
    questionId: pickQuestion(ctx, used),
    answers: {},
    lastResult: undefined,
    deadlineAt: now + PREP_MS,
  };
}
