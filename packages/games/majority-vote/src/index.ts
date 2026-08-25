/**
 * Majority Vote — prevê a opção da maioria; voto anónimo até ao fecho
 * (spec §14.2, P0). Cada ronda apresenta uma pergunta com opções a–d.
 * Ganha quem votar na opção de pluralidade (+100); voto unânime rende
 * bónus +50 a todos. Empate no topo = ronda sem pontos para ninguém.
 *
 * O voto é SECRETO: a distribuição só é revelada em ROUND_RESULT e nunca
 * existe qualquer mapping jogador→opção nas vistas públicas.
 * Transições puras — estados aninhados são sempre copiados.
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

export interface MajorityQuestion {
  id: string;
  question: string;
  /** exactly 4 labels, indexed a..d */
  options: [string, string, string, string];
}

export const OPTION_IDS = ["a", "b", "c", "d"] as const;
export type OptionId = (typeof OPTION_IDS)[number];

export interface MajorityVoteState extends GameBaseState {
  phase: "ROUND_PREP" | "ACTIVE" | "ROUND_RESULT" | "GAME_RESULT";
  questionIds: string[];
  current: number;
  /** voterId -> optionId (server-side only; never exposed per-player) */
  votes: Record<string, string>;
  lastRound?: {
    distribution: Record<string, number>;
    /** winning option id, null on tie or when nobody voted */
    majority: string | null;
    correctIds: string[];
    deltas: Record<string, number>;
    unanimous: boolean;
  };
  totals: Record<string, number>;
}

export interface MajorityPublicView {
  prompt: string | null;
  answeredCount: number;
  playerCount: number;
  scoreboard: Array<{ playerId: string; nickname: string; total: number }>;
  finished: boolean;
  finalScores?: Array<{ playerId: string; total: number }>;
  /** only set during ROUND_RESULT — the reveal */
  distribution?: { a: number; b: number; c: number; d: number };
  majority?: string | null;
  correctIds?: string[];
  correctNicknames?: string[];
}

export interface MajorityPrivateView {
  voteOptions?: Array<{ id: string; label: string }>;
  yourVote?: string | null;
  statusText?: string;
  disabledText?: string;
}

type MajorityAction = { type: "VOTE"; payload: { optionId: string } };

/* ---------------- timing & settings ---------------- */

const PREP_MS = 3000;
const RESULT_MS = 4000;

const CORRECT_POINTS = 100;
const UNANIMOUS_BONUS = 50;

function settingsFrom(ctx: GameContext) {
  const s = ctx.settings;
  return {
    rounds: clampInt(Number(s.rounds ?? 5), 1, 15),
    secondsPerQuestion: clampInt(Number(s.secondsPerQuestion ?? 20), 10, 60),
  };
}

function clampInt(v: number, min: number, max: number): number {
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, Math.round(v)));
}

/* ---------------- helpers ---------------- */

function questionById(id: string): MajorityQuestion {
  const found = questionBank.find((q) => q.id === id);
  return found ?? questionBank[0]!;
}

function activePlayers(ctx: GameContext) {
  return ctx.players.filter((p) => p.role === "player");
}

function isOptionId(v: unknown): v is OptionId {
  return typeof v === "string" && (OPTION_IDS as readonly string[]).includes(v);
}

/* ---------------- plugin ---------------- */

export const majorityVotePlugin: PartyGamePlugin<
  MajorityVoteState,
  MajorityPublicView,
  MajorityPrivateView,
  MajorityAction
> & { manifest: GameManifest } = defineGame({
  manifest: {
    id: "majority-vote",
    name: "Majority Vote",
    description:
      "Prevê a opção da maioria. Voto anónimo até ao fecho da ronda.",
    minPlayers: 3,
    maxPlayers: 30,
    avgDurationMinutes: 7,
    tags: ["social", "party"],
    contentRating: "family",
    requiresBigScreen: true,
    supportsTableMode: false,
    lateJoin: "spectatorUntilRound",
    spectatorSupport: true,
    teamSupport: false,
    controllers: ["vote"],
    settings: [
      {
        key: "rounds",
        label: "Número de rondas",
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
        default: 20,
        min: 10,
        max: 60,
        step: 5,
      },
    ],
    priority: "P0",
  },

  createInitialState(ctx): MajorityVoteState {
    const { rounds } = settingsFrom(ctx);
    // questions without repetition within the match (bank ≥ max rounds)
    const shuffled = ctx.rng.shuffle(questionBank);
    const questionIds: string[] = [];
    for (let i = 0; i < rounds; i++) {
      questionIds.push(shuffled[i % shuffled.length]!.id);
    }
    return {
      phase: "ROUND_PREP",
      phaseLabel: "A preparar a ronda…",
      roundNumber: 1,
      roundTotal: rounds,
      deadlineAt: ctx.clock.now() + PREP_MS,
      questionIds,
      current: 0,
      votes: {},
      totals: {},
    };
  },

  getPublicView(state, ctx) {
    const playerCount = activePlayers(ctx).length;
    const scoreboard = scoreboardOf(state, ctx);
    const prompt = questionById(state.questionIds[state.current]).question;

    if (state.phase === "GAME_RESULT") {
      return {
        prompt: null,
        answeredCount: 0,
        playerCount,
        scoreboard,
        finished: true,
        finalScores: scoreboard.map((r) => ({ playerId: r.playerId, total: r.total })),
      };
    }

    if (state.phase === "ROUND_RESULT") {
      const lr = state.lastRound!;
      return {
        prompt,
        answeredCount: Object.keys(state.votes).length,
        playerCount,
        scoreboard,
        finished: false,
        // the distribution becomes public only AFTER voting closes (anonymity)
        distribution: lr.distribution as { a: number; b: number; c: number; d: number },
        majority: lr.majority,
        correctIds: lr.correctIds,
        correctNicknames: lr.correctIds.map((id) => nicknameOf(ctx, id)),
      };
    }

    // ROUND_PREP/ACTIVE: counts only — never the distribution nor any vote
    return {
      prompt,
      answeredCount: Object.keys(state.votes).length,
      playerCount,
      scoreboard,
      finished: false,
    };
  },

  getPrivateView(state, playerId, ctx) {
    const q = questionById(state.questionIds[state.current]);
    switch (state.phase) {
      case "ROUND_PREP":
        return { statusText: `Prepara-te: ${q.question}` };
      case "ACTIVE": {
        const yourVote = state.votes[playerId] ?? null;
        return {
          voteOptions: q.options.map((label, i) => ({ id: OPTION_IDS[i]!, label })),
          yourVote,
          statusText: yourVote
            ? "Voto registado — a aguardar os restantes"
            : "Em que vai votar a maioria?",
          disabledText: yourVote ? "Já votaste nesta ronda." : undefined,
        };
      }
      case "ROUND_RESULT": {
        const delta = state.lastRound?.deltas[playerId] ?? 0;
        return {
          statusText:
            delta > 0
              ? `Acertaste! +${delta} pontos`
              : "Sem pontos nesta ronda",
        };
      }
      case "GAME_RESULT":
        return { statusText: "Fim do jogo" };
    }
  },

  validateAction(state, action, actor) {
    if (actor.role !== "player") {
      return { ok: false, code: "FORBIDDEN", reason: "spectators cannot act" };
    }
    switch (action.type) {
      case "VOTE": {
        if (state.phase !== "ACTIVE") return { ok: false, code: "BAD_PHASE" };
        const optionId = (action.payload as { optionId?: unknown })?.optionId;
        if (!isOptionId(optionId)) {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "optionId must be a|b|c|d" };
        }
        if (state.votes[actor.playerId]) {
          return { ok: false, code: "DUPLICATE_ACTION", reason: "already voted this round" };
        }
        return { ok: true };
      }
      default:
        return { ok: false, code: "INVALID_PAYLOAD" };
    }
  },

  reduce(state, action, actor, ctx) {
    const optionId = String(action.payload.optionId);
    const next: MajorityVoteState = {
      ...state,
      votes: { ...state.votes, [actor.playerId]: optionId },
    };
    if (activePlayers(ctx).every((p) => next.votes[p.playerId])) {
      return closeVoting(next, ctx);
    }
    return next;
  },

  /**
   * Returns the SAME state reference when nothing changed — the runtime
   * detects transitions by reference comparison, so this is the type-safe
   * equivalent of a "no-op" tick.
   */
  tick(state, now, ctx) {
    if (state.deadlineAt === undefined || now < state.deadlineAt) return state;
    switch (state.phase) {
      case "ROUND_PREP":
        return {
          ...state,
          phase: "ACTIVE",
          phaseLabel: "Vota na maioria!",
          deadlineAt: now + settingsFrom(ctx).secondsPerQuestion * 1000,
        };
      case "ACTIVE":
        return closeVoting(state, ctx, now); // deadline ⇒ whoever voted, voted
      case "ROUND_RESULT":
        return advanceRound(state, ctx, now);
      default:
        return state;
    }
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
    const winners = top <= 0 ? [] : sorted.filter((r) => r.delta === top).map((r) => r.playerId);
    return {
      roundScores,
      titles: winners.length
        ? Object.fromEntries(winners.map((id) => [id, "🏆 Leitor de Mentes"]))
        : undefined,
      awards:
        winners.length === 1
          ? [{ kind: "winner", label: "Adivinhou a maioria vezes demais", playerIds: winners }]
          : winners.length > 1
            ? [{ kind: "tie", label: "Empate no topo", playerIds: winners }]
            : undefined,
    };
  },

  serialize(state) {
    return JSON.parse(JSON.stringify(state));
  },

  deserialize(value) {
    return value as MajorityVoteState;
  },
});

export default majorityVotePlugin;

/* ---------------- transitions (pure) ---------------- */

/** ACTIVE → ROUND_RESULT: plurality wins, unanimous bonus, ties void the round. */
function closeVoting(state: MajorityVoteState, ctx: GameContext, now?: number): MajorityVoteState {
  const at = now ?? ctx.clock.now();

  const distribution: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
  for (const optionId of Object.values(state.votes)) {
    if (isOptionId(optionId)) distribution[optionId]! += 1;
  }

  const counts = OPTION_IDS.map((id) => distribution[id] ?? 0);
  const maxCount = Math.max(...counts);

  let majority: string | null = null;
  if (maxCount > 0) {
    const leaders = OPTION_IDS.filter((id) => (distribution[id] ?? 0) === maxCount);
    if (leaders.length === 1) majority = leaders[0]!;
  } // maxCount === 0 ⇒ nobody voted ⇒ majority stays null

  const roster = activePlayers(ctx);
  const everyoneVoted =
    roster.length > 0 && roster.every((p) => state.votes[p.playerId] !== undefined);
  const unanimous = everyoneVoted && majority !== null && maxCount === roster.length;

  const deltas: Record<string, number> = {};
  for (const [voterId, optionId] of Object.entries(state.votes)) {
    if (!isOptionId(optionId)) continue;
    if (majority === null) continue; // tied plurality ⇒ no points this round
    if (optionId !== majority) continue;
    deltas[voterId] = (deltas[voterId] ?? 0) + CORRECT_POINTS;
    if (unanimous) deltas[voterId] += UNANIMOUS_BONUS;
  }

  const totals = { ...state.totals };
  for (const [playerId, delta] of Object.entries(deltas)) {
    totals[playerId] = (totals[playerId] ?? 0) + delta;
  }

  return {
    ...state,
    phase: "ROUND_RESULT",
    phaseLabel: "Resultado da ronda",
    deadlineAt: at + RESULT_MS,
    totals,
    lastRound: {
      distribution,
      majority,
      correctIds: Object.keys(deltas),
      deltas,
      unanimous,
    },
  };
}

function advanceRound(state: MajorityVoteState, ctx: GameContext, now?: number): MajorityVoteState {
  const at = now ?? ctx.clock.now();
  if (state.current + 1 >= state.questionIds.length) {
    return { ...state, phase: "GAME_RESULT", phaseLabel: "Fim do jogo", deadlineAt: undefined };
  }
  return {
    ...state,
    phase: "ROUND_PREP",
    phaseLabel: "A preparar a ronda…",
    current: state.current + 1,
    roundNumber: state.current + 2,
    votes: {},
    lastRound: undefined,
    deadlineAt: at + PREP_MS,
  };
}

/* ---------------- view helpers ---------------- */

function nicknameOf(ctx: GameContext, playerId: string): string {
  return ctx.players.find((p) => p.playerId === playerId)?.nickname ?? "?";
}

function scoreboardOf(
  state: MajorityVoteState,
  ctx: GameContext,
): Array<{ playerId: string; nickname: string; total: number }> {
  return activePlayers(ctx)
    .map((p) => ({
      playerId: p.playerId,
      nickname: p.nickname,
      total: state.totals[p.playerId] ?? 0,
    }))
    .sort((a, b) => b.total - a.total);
}
