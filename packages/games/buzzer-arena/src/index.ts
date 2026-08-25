/**
 * Buzzer Arena — buzzer genérico: o primeiro a carregar responde (spec §14.8, P0).
 * O servidor fecha no primeiro buzz válido da ronda e mostra a ordem com
 * timestamps. O anfitrião julga dentro de uma janela de 3s: correcto ⇒ +100;
 * errado ⇒ −25 e a ronda reabre (o buzzador anterior fica bloqueado).
 * Se ninguém arriscar até ao soft timeout, a ronda termina vazia.
 *
 * Decisões determinísticas para casos não especificados:
 *  - LOCKED expira sem JUDGE ⇒ ROUND_RESULT "sem veredicto", sem pontos
 *    (silêncio do anfitrião nunca premia nem penaliza).
 *  - Após um julgamento errado, se todos os jogadores activos já tiveram
 *    buzz bloqueado, a ronda avança directamente para ROUND_RESULT.
 *
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

/* ---------------- types ---------------- */

export interface BuzzEntry {
  playerId: string;
  nickname: string;
  /** epoch ms of the buzz */
  at: number;
}

export interface JudgeOutcome {
  playerId: string;
  nickname: string;
  correct: boolean;
  delta: number;
}

export interface BuzzerArenaState extends GameBaseState {
  phase: "ROUND_PREP" | "ACTIVE" | "LOCKED" | "ROUND_RESULT" | "GAME_RESULT";
  /** every buzz attempt this round, in arrival order */
  order: BuzzEntry[];
  /** playerId currently locked-in (undefined when no active lock) */
  lockedBy?: string;
  /** players who may NOT buzz again this round (judged incorrect) */
  blocked: Record<string, true>;
  /** result of the round that just ended */
  lastRound?: {
    order: BuzzEntry[];
    judge: JudgeOutcome | null;
    outcome: "judged-correct" | "judged-incorrect" | "empty-timeout" | "judge-timeout" | "all-wrong";
  };
  totals: Record<string, number>;
}

export interface BuzzerPublicView {
  prompt: string;
  lockedByNickname: string | null;
  order: Array<{ nickname: string; at: number }>;
  /** only set during ROUND_RESULT; null = no verdict was given */
  judgeResult?: JudgeOutcome | null;
  openActive: boolean;
  scoreboard: Array<{ playerId: string; nickname: string; total: number }>;
  finished: boolean;
  finalScores?: Array<{ playerId: string; total: number }>;
}

export interface BuzzerPrivateView {
  buzzerEnabled?: boolean;
  statusText?: string;
}

type BuzzerAction =
  | { type: "BUZZ"; payload: Record<string, never> }
  | { type: "JUDGE"; payload: { correct: boolean } };

/* ---------------- timing & settings ---------------- */

const PREP_MS = 2000;
const RESULT_MS = 2000;
const JUDGE_MS = 3000;

const CORRECT_POINTS = 100;
const WRONG_POINTS = -25;

function settingsFrom(ctx: GameContext) {
  const s = ctx.settings;
  return {
    rounds: clampInt(Number(s.rounds ?? 5), 1, 20),
    softTimeoutSeconds: clampInt(Number(s.softTimeoutSeconds ?? 30), 10, 60),
  };
}

function clampInt(v: number, min: number, max: number): number {
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, Math.round(v)));
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

/* ---------------- plugin ---------------- */

export const buzzerArenaPlugin: PartyGamePlugin<
  BuzzerArenaState,
  BuzzerPublicView,
  BuzzerPrivateView,
  BuzzerAction
> & { manifest: GameManifest } = defineGame({
  manifest: {
    id: "buzzer-arena",
    name: "Buzzer Arena",
    description:
      "Buzzer genérico: o primeiro a carregar responde e o anfitrião julga.",
    minPlayers: 2,
    maxPlayers: 30,
    avgDurationMinutes: 6,
    tags: ["reflexo", "party"],
    contentRating: "family",
    requiresBigScreen: true,
    supportsTableMode: false,
    lateJoin: "spectatorUntilRound",
    spectatorSupport: true,
    teamSupport: false,
    controllers: ["buzzer"],
    settings: [
      {
        key: "rounds",
        label: "Número de rondas",
        kind: "number",
        default: 5,
        min: 1,
        max: 20,
        step: 1,
      },
      {
        key: "softTimeoutSeconds",
        label: "Segundos até fechar sem buzz",
        kind: "number",
        default: 30,
        min: 10,
        max: 60,
        step: 5,
      },
    ],
    priority: "P0",
  },

  createInitialState(ctx): BuzzerArenaState {
    const { rounds } = settingsFrom(ctx);
    return {
      phase: "ROUND_PREP",
      phaseLabel: "A preparar a ronda…",
      roundNumber: 1,
      roundTotal: rounds,
      deadlineAt: ctx.clock.now() + PREP_MS,
      order: [],
      blocked: {},
      totals: {},
    };
  },

  getPublicView(state, ctx) {
    const prompt = `Ronda ${state.roundNumber}/${state.roundTotal}`;
    const scoreboard = scoreboardOf(state, ctx);

    if (state.phase === "GAME_RESULT") {
      return {
        prompt,
        lockedByNickname: null,
        order: [],
        openActive: false,
        scoreboard,
        finished: true,
        finalScores: scoreboard.map((r) => ({ playerId: r.playerId, total: Math.max(0, r.total) })),
      };
    }

    const base = {
      prompt,
      lockedByNickname: state.lockedBy ? nicknameOf(ctx, state.lockedBy) : null,
      order: state.order.map((e) => ({ nickname: e.nickname, at: e.at })),
      openActive: state.phase === "ACTIVE",
      scoreboard,
      finished: false,
    };

    if (state.phase === "ROUND_RESULT") {
      return {
        ...base,
        openActive: false,
        lockedByNickname: null,
        // verdict becomes public only after the round closes
        judgeResult: state.lastRound?.judge ?? null,
      };
    }
    return base;
  },

  getPrivateView(state, playerId, ctx) {
    switch (state.phase) {
      case "ROUND_PREP":
        return { statusText: `Prepara-te para a ronda ${state.roundNumber}…` };
      case "ACTIVE": {
        const canBuzz = !state.blocked[playerId];
        return {
          buzzerEnabled: canBuzz,
          statusText: canBuzz
            ? "Buzina quando souberes!"
            : "Já buzzaste nesta ronda — aguarda a próxima.",
          disabledText: canBuzz ? undefined : "Buzz bloqueado nesta ronda.",
        };
      }
      case "LOCKED": {
        const mine = state.lockedBy === playerId;
        return {
          buzzerEnabled: false,
          statusText: mine
            ? "É a tua vez de responder em voz alta!"
            : `${nicknameOf(ctx, state.lockedBy ?? "")} buzinou primeiro!`,
          disabledText: "Buzzer fechado.",
        };
      }
      case "ROUND_RESULT": {
        const judge = state.lastRound?.judge ?? null;
        if (!judge) {
          return { statusText: state.lastRound?.outcome === "empty-timeout" ? "Ninguém arriscou!" : "Sem veredicto nesta ronda." };
        }
        const mine = judge.playerId === playerId;
        if (judge.correct) {
          return { statusText: mine ? `Acertaste! +${judge.delta}` : `${judge.nickname} acertou (+${judge.delta})` };
        }
        return {
          statusText: mine ? `Resposta errada… ${judge.delta}` : `${judge.nickname} errou (${judge.delta})`,
        };
      }
      case "GAME_RESULT":
        return { statusText: "Fim do jogo" };
    }
  },

  validateAction(state, action, actor) {
    switch (action.type) {
      case "BUZZ": {
        if (actor.role !== "player") {
          return { ok: false, code: "FORBIDDEN", reason: "spectators cannot buzz" };
        }
        if (state.phase !== "ACTIVE") return { ok: false, code: "BAD_PHASE" };
        if (!isPlainObject(action.payload)) {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "BUZZ takes no fields" };
        }
        if (state.blocked[actor.playerId]) {
          return { ok: false, code: "DUPLICATE_ACTION", reason: "already buzzed this round" };
        }
        return { ok: true };
      }
      case "JUDGE": {
        if (actor.role !== "host") {
          return { ok: false, code: "FORBIDDEN", reason: "only the host can judge" };
        }
        if (state.phase !== "LOCKED") return { ok: false, code: "BAD_PHASE" };
        const correct = isPlainObject(action.payload) ? action.payload.correct : undefined;
        if (typeof correct !== "boolean") {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "correct must be boolean" };
        }
        return { ok: true };
      }
      default:
        return { ok: false, code: "INVALID_PAYLOAD" };
    }
  },

  reduce(state, action, actor, ctx) {
    switch (action.type) {
      case "BUZZ": {
        const entry: BuzzEntry = {
          playerId: actor.playerId,
          nickname: nicknameOf(ctx, actor.playerId),
          at: ctx.clock.now(),
        };
        // server locks on the first valid buzz; later concurrent buzzes are BAD_PHASE
        return {
          ...state,
          phase: "LOCKED",
          phaseLabel: "Buzzer fechado — a julgar!",
          deadlineAt: ctx.clock.now() + JUDGE_MS,
          lockedBy: entry.playerId,
          order: [...state.order, entry],
        };
      }
      case "JUDGE":
        // the verdict applies to the locked-in BUZZER, never to the acting host
        return action.payload.correct
          ? judgeCorrect(state, state.lockedBy ?? "", ctx)
          : judgeIncorrect(state, state.lockedBy ?? "", ctx);
    }
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
        return openActive(state, ctx, now);
      case "ACTIVE": {
        // soft timeout without a live buzz ⇒ empty round (keeps prior attempt history)
        return toRoundResult(
          state,
          state.order,
          null,
          state.order.length === 0 ? "empty-timeout" : "all-wrong",
          now,
        );
      }
      case "LOCKED": {
        // host stayed silent during the judging window ⇒ no verdict, no points
        return toRoundResult(
          state,
          state.order,
          null,
          "judge-timeout",
          now,
        );
      }
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
    // clamp each player's final total at zero (negative rounds never win)
    const clamped = Object.fromEntries(
      Object.entries(state.totals).map(([playerId, total]) => [playerId, Math.max(0, total)]),
    );
    const roundScores = Object.entries(clamped).map(([playerId, delta]) => ({ playerId, delta }));
    const sorted = [...roundScores].sort((a, b) => b.delta - a.delta);
    const top = sorted[0]?.delta ?? 0;
    const winners = top <= 0 ? [] : sorted.filter((r) => r.delta === top).map((r) => r.playerId);
    return {
      roundScores,
      titles: winners.length
        ? Object.fromEntries(winners.map((id) => [id, "🏆 Reflexo Relâmpago"]))
        : undefined,
      awards:
        winners.length === 1
          ? [{ kind: "winner", label: "Dedo mais rápido da festa", playerIds: winners }]
          : winners.length > 1
            ? [{ kind: "tie", label: "Empate no topo", playerIds: winners }]
            : undefined,
    };
  },

  serialize(state) {
    return JSON.parse(JSON.stringify(state));
  },

  deserialize(value) {
    return value as BuzzerArenaState;
  },
});

export default buzzerArenaPlugin;

/* ---------------- transitions (pure) ---------------- */

/** LOCKED judged CORRECT: +100 to the buzzer, round consumed. */
function judgeCorrect(state: BuzzerArenaState, buzzerId: string, _ctx: GameContext): BuzzerArenaState {
  const at = _ctx.clock.now();
  const totals = { ...state.totals, [buzzerId]: (state.totals[buzzerId] ?? 0) + CORRECT_POINTS };
  return toRoundResult(
    { ...state, totals },
    state.order,
    {
      playerId: buzzerId,
      nickname: nicknameOf(_ctx, buzzerId),
      correct: true,
      delta: CORRECT_POINTS,
    },
    "judged-correct",
    at,
  );
}

/** LOCKED judged INCORRECT: −25, reopen ACTIVE unless everyone is blocked. */
function judgeIncorrect(state: BuzzerArenaState, buzzerId: string, ctx: GameContext): BuzzerArenaState {
  const at = ctx.clock.now();
  const next: BuzzerArenaState = {
    ...state,
    totals: { ...state.totals, [buzzerId]: (state.totals[buzzerId] ?? 0) + WRONG_POINTS },
    blocked: { ...state.blocked, [buzzerId]: true },
    lockedBy: undefined,
  };
  const judge: JudgeOutcome = {
    playerId: buzzerId,
    nickname: nicknameOf(ctx, buzzerId),
    correct: false,
    delta: WRONG_POINTS,
  };

  // everyone already tried and failed ⇒ nothing left to buzz for
  const roster = activePlayers(ctx);
  if (roster.length > 0 && roster.every((p) => next.blocked[p.playerId])) {
    return toRoundResult(next, next.order, judge, "all-wrong", at);
  }
  return { ...openActive(next, ctx, at), lastRound: undefined };
}

/** Enter/renter ACTIVE with a fresh soft timeout. */
function openActive(state: BuzzerArenaState, ctx: GameContext, now: number): BuzzerArenaState {
  return {
    ...state,
    phase: "ACTIVE",
    phaseLabel: "Buzzers abertos!",
    deadlineAt: now + settingsFrom(ctx).softTimeoutSeconds * 1000,
    lockedBy: undefined,
  };
}

/** Close the current round (shared by all exits) and freeze its result. */
function toRoundResult(
  state: BuzzerArenaState,
  order: BuzzEntry[],
  judge: JudgeOutcome | null,
  outcome: NonNullable<BuzzerArenaState["lastRound"]>["outcome"],
  now: number,
): BuzzerArenaState {
  return {
    ...state,
    phase: "ROUND_RESULT",
    phaseLabel: "Resultado da ronda",
    deadlineAt: now + RESULT_MS,
    lockedBy: undefined,
    lastRound: { order: [...order], judge, outcome },
  };
}

function advanceRound(state: BuzzerArenaState, ctx: GameContext, now?: number): BuzzerArenaState {
  const at = now ?? ctx.clock.now();
  if (state.roundNumber >= state.roundTotal) {
    return { ...state, phase: "GAME_RESULT", phaseLabel: "Fim do jogo", deadlineAt: undefined };
  }
  return {
    ...state,
    phase: "ROUND_PREP",
    phaseLabel: "A preparar a ronda…",
    roundNumber: state.roundNumber + 1,
    order: [],
    blocked: {},
    lockedBy: undefined,
    lastRound: undefined,
    deadlineAt: at + PREP_MS,
  };
}

/* ---------------- view helpers ---------------- */

function scoreboardOf(
  state: BuzzerArenaState,
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
