/**
 * Quiz Rush — quiz rápido de múltipla escolha (spec §14.1, P0).
 * Pontos = correção + rapidez; streak dá bónus. Tudo decidido no servidor.
 */
import { defineGame } from "@rs-party/game-engine";
import type {
  GameBaseState,
  GameContext,
  PartyGamePlugin,
  ScoreResult,
} from "@rs-party/game-engine";
import type { Actor, GameManifest } from "@rs-party/protocol";
import { questionBank } from "./bank.js";

/* ---------------- types ---------------- */

export interface QuizQuestion {
  id: string;
  category: string;
  text: string;
  choices: string[];
  correctIndex: number;
}

interface AnswerRec {
  choice: number;
  at: number;
}

export interface QuizRushState extends GameBaseState {
  phase: "INTRO" | "ROUND_PREP" | "ACTIVE" | "ROUND_RESULT" | "GAME_RESULT";
  questions: QuizQuestion[];
  current: number;
  answers: Record<string, AnswerRec>;
  streaks: Record<string, number>;
  totals: Record<string, number>;
  lastRound?: {
    correctIndex: number;
    correctIds: string[];
    deltas: Record<string, number>;
  };
}

export interface QuizPublicView {
  questionText: string | null;
  choices: string[] | null;
  category: string | null;
  answeredCount: number;
  playerCount: number;
  scoreboard: Array<{ playerId: string; nickname: string; total: number }>;
  lastRound?: {
    correctIndex: number;
    correctIds: string[];
    deltas: Record<string, number>;
  };
  finished: boolean;
  finalScores?: Array<{ playerId: string; total: number }>;
}

export interface QuizPrivateView {
  answered: boolean;
  yourChoice: number | null;
  streak: number;
  waitingText: string;
}

type QuizAction =
  | { type: "SUBMIT_ANSWER"; payload: { choice: number } }
  | { type: "NEXT"; payload: Record<string, never> };

/* ---------------- timing ---------------- */

const PREP_MS = 3000;
const RESULT_MS = 4000;

function settingsFrom(ctx: GameContext) {
  const s = ctx.settings;
  const rounds = clampInt(Number(s.rounds ?? 5), 1, 15);
  const seconds = clampInt(Number(s.secondsPerQuestion ?? 15), 5, 60);
  const category = String(s.category ?? "all");
  return { rounds, seconds, category };
}

function clampInt(v: number, min: number, max: number): number {
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, Math.round(v)));
}

/* ---------------- plugin ---------------- */

export const quizRushPlugin: PartyGamePlugin<
  QuizRushState,
  QuizPublicView,
  QuizPrivateView,
  QuizAction
> & { manifest: GameManifest } = defineGame({
  manifest: {
    id: "quiz-rush",
    name: "Quiz Rush",
    description: "Quiz de escolha múltipla: acerta rápido e mantém o streak.",
    minPlayers: 2,
    maxPlayers: 30,
    avgDurationMinutes: 8,
    tags: ["quiz", "trivia"],
    contentRating: "family",
    requiresBigScreen: true,
    supportsTableMode: false,
    lateJoin: "spectatorUntilRound",
    spectatorSupport: true,
    teamSupport: false,
    controllers: ["choices"],
    settings: [
      {
        key: "rounds",
        label: "Número de perguntas",
        kind: "number",
        default: 5,
        min: 1,
        max: 15,
        step: 1,
      },
      {
        key: "secondsPerQuestion",
        label: "Segundos por pergunta",
        kind: "number",
        default: 15,
        min: 5,
        max: 60,
        step: 5,
      },
      {
        key: "category",
        label: "Categoria",
        kind: "select",
        default: "all",
        options: [
          { value: "all", label: "Todas" },
          { value: "general", label: "Geral" },
          { value: "tech", label: "Tecnologia" },
          { value: "movies", label: "Cinema" },
        ],
      },
    ],
    priority: "P0",
  },

  createInitialState(ctx): QuizRushState {
    const { rounds, category } = settingsFrom(ctx);
    const pool = questionBank.filter(
      (q) => category === "all" || q.category === category,
    );
    const questions = ctx.rng.shuffle(pool.length >= rounds ? pool : questionBank).slice(0, rounds);
    return {
      phase: "ROUND_PREP",
      phaseLabel: "A preparar a pergunta…",
      roundNumber: 1,
      roundTotal: questions.length,
      deadlineAt: ctx.clock.now() + PREP_MS,
      questions,
      current: 0,
      answers: {},
      streaks: {},
      totals: {},
    };
  },

  getPublicView(state, ctx) {
    const q = state.questions[state.current];
    const scoreboard = ctx.players
      .filter((p) => p.role === "player")
      .map((p) => ({
        playerId: p.playerId,
        nickname: p.nickname,
        total: state.totals[p.playerId] ?? 0,
      }))
      .sort((a, b) => b.total - a.total);

    if (state.phase === "GAME_RESULT") {
      return {
        questionText: null,
        choices: null,
        category: null,
        answeredCount: 0,
        playerCount: ctx.players.filter((p) => p.role === "player").length,
        scoreboard,
        finished: true,
        finalScores: scoreboard.map((r) => ({ playerId: r.playerId, total: r.total })),
      };
    }

    const reveal = state.phase === "ROUND_RESULT";
    return {
      // correct index is NEVER exposed outside ROUND_RESULT (spec anti-cheat)
      questionText: q?.text ?? null,
      choices: q?.choices ?? null,
      category: q?.category ?? null,
      answeredCount: Object.keys(state.answers).length,
      playerCount: ctx.players.filter((p) => p.role === "player").length,
      scoreboard,
      lastRound: state.lastRound,
      finished: false,
    };
  },

  getPrivateView(state, playerId) {
    const rec = state.answers[playerId];
    return {
      answered: !!rec,
      yourChoice: rec?.choice ?? null,
      streak: state.streaks[playerId] ?? 0,
      waitingText: rec
        ? "Resposta recebida — aguardando outros jogadores"
        : "Escolhe uma resposta",
    };
  },

  validateAction(state, action, actor) {
    if (actor.role !== "player") return { ok: false, code: "FORBIDDEN", reason: "spectators cannot answer" };
    switch (action.type) {
      case "SUBMIT_ANSWER": {
        if (state.phase !== "ACTIVE") return { ok: false, code: "BAD_PHASE" };
        const choice = Number((action.payload as { choice?: unknown })?.choice);
        if (!Number.isInteger(choice) || choice < 0 || choice > 3) {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "choice must be 0..3" };
        }
        if (state.answers[actor.playerId]) return { ok: false, code: "DUPLICATE_ACTION" };
        return { ok: true };
      }
      case "NEXT":
        return (actor.role as string) === "host" && state.phase === "ROUND_RESULT"
          ? { ok: true }
          : { ok: false, code: "BAD_PHASE" };
      default:
        return { ok: false, code: "INVALID_PAYLOAD" };
    }
  },

  reduce(state, action, actor, ctx) {
    switch (action.type) {
      case "SUBMIT_ANSWER": {
        const choice = Number((action.payload as { choice: number }).choice);
        const next: QuizRushState = {
          ...state,
          answers: { ...state.answers, [actor.playerId]: { choice, at: ctx.clock.now() } },
        };
        const activePlayers = ctx.players.filter((p) => p.role === "player");
        if (activePlayers.every((p) => next.answers[p.playerId])) {
          return resolveRound(next, ctx);
        }
        return next;
      }
      case "NEXT":
        return advanceRound(state, ctx);
    }
  },

  tick(state, now, ctx) {
    if (
      (state.phase === "ROUND_PREP" || state.phase === "ROUND_RESULT") &&
      state.deadlineAt !== undefined &&
      now >= state.deadlineAt
    ) {
      if (state.phase === "ROUND_PREP") {
        return {
          ...state,
          phase: "ACTIVE",
          phaseLabel: "Responde!",
          answers: {},
          deadlineAt: now + settingsFrom(ctx).seconds * 1000,
        };
      }
      return advanceRound(state, ctx);
    }
    if (
      state.phase === "ACTIVE" &&
      state.deadlineAt !== undefined &&
      now >= state.deadlineAt
    ) {
      return resolveRound(state, ctx);
    }
    return state; // same reference = no-op (runtime compares identity)
  },

  isFinished(state) {
    return state.phase === "GAME_RESULT";
  },

  score(state): ScoreResult {
    const roundScores = Object.entries(state.totals).map(([playerId, delta]) => ({
      playerId,
      delta,
    }));
    const sorted = [...roundScores].sort((a, b) => b.delta - a.delta);
    const top = sorted[0]?.delta ?? 0;
    const winners = sorted.filter((r) => r.delta === top).map((r) => r.playerId);
    return {
      roundScores,
      titles: winners.length
        ? Object.fromEntries(winners.map((id) => [id, "🏆 Vencedor"]))
        : undefined,
      awards:
        winners.length === 1
          ? [{ kind: "winner", label: "Vencedor da partida", playerIds: winners }]
          : [{ kind: "tie", label: "Empate no topo", playerIds: winners }],
    };
  },

  serialize(state) {
    return JSON.parse(JSON.stringify(state));
  },

  deserialize(value) {
    return value as QuizRushState;
  },
});

/* ---------------- transitions ---------------- */

/** Resolve ACTIVE → ROUND_RESULT with speed+streak scoring (server-only). */
function resolveRound(state: QuizRushState, ctx: GameContext): QuizRushState {
  const q = state.questions[state.current];
  if (!q) return { ...state, phase: "GAME_RESULT", phaseLabel: "Fim do jogo" };

  const { seconds } = settingsFrom(ctx);
  const windowMs = seconds * 1000;
  const deltas: Record<string, number> = {};
  const correctIds: string[] = [];
  // pure transitions: copy nested maps before writing
  const streaks = { ...state.streaks };
  const totals = { ...state.totals };

  for (const p of ctx.players) {
    if (p.role !== "player") continue;
    const rec = state.answers[p.playerId];
    let delta = 0;
    if (rec && rec.choice === q.correctIndex) {
      correctIds.push(p.playerId);
      const remaining = Math.max(0, 1 - (rec.at - (state.deadlineAt ?? rec.at) + windowMs) / windowMs);
      // base 100 + up to 50 speed bonus — latency advantage stays bounded (spec §14.1)
      delta = 100 + Math.round(50 * clamp01(remaining));
      const streak = (streaks[p.playerId] ?? 0) + 1;
      streaks[p.playerId] = streak;
      if (streak >= 2) delta += 25 * Math.min(streak - 1, 4); // capped streak bonus
    } else {
      streaks[p.playerId] = 0;
    }
    deltas[p.playerId] = delta;
    totals[p.playerId] = (totals[p.playerId] ?? 0) + delta;
  }

  return {
    ...state,
    phase: "ROUND_RESULT",
    phaseLabel: "Resultado da ronda",
    deadlineAt: ctx.clock.now() + RESULT_MS,
    streaks,
    totals,
    lastRound: { correctIndex: q.correctIndex, correctIds, deltas },
  };
}

function advanceRound(state: QuizRushState, ctx: GameContext): QuizRushState {
  if (state.current + 1 >= state.questions.length) {
    return { ...state, phase: "GAME_RESULT", phaseLabel: "Fim do jogo", deadlineAt: undefined };
  }
  return {
    ...state,
    phase: "ROUND_PREP",
    phaseLabel: "A preparar a pergunta…",
    current: state.current + 1,
    roundNumber: state.current + 2,
    answers: {},
    lastRound: undefined,
    deadlineAt: ctx.clock.now() + PREP_MS,
  };
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

export default quizRushPlugin;
