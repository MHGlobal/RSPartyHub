/**
 * Hot Potato — batata quente por TAP (spec §14.14, P0).
 * A batata passa-se por taps; a duração de cada ronda é SECRETA (sorteada pelo
 * rng e guardada em campos próprios — NUNCA em deadlineAt, que aparece na UI
 * do anfitrião). Quando o segredo expira, o portador actual queima (−50) e
 * todos os outros ganham +30 na ronda.
 *
 * Roda de jogadores: ordem de entrada dos role==="player", circular.
 * A ronda seguinte começa com o vizinho à direita do queimado.
 * A transição de passe é atómica (um único dono em qualquer instante).
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

export interface HotPotatoState extends GameBaseState {
  phase: "ROUND_PREP" | "PASSING" | "ROUND_RESULT" | "GAME_RESULT";
  /** playerIds in entry order — the passing wheel */
  wheel: string[];
  /** index into wheel of the current holder */
  holderIdx: number;
  /** SECRET: hold duration drawn for this round (rng) */
  secretHoldMs?: number;
  /** SECRET: absolute epoch ms when the potato explodes; own field, never deadlineAt */
  secretDeadlineMs?: number;
  /** playerId burned in the round that just ended */
  burnedId?: string;
  totals: Record<string, number>;
}

export interface HotPotatoPublicView {
  prompt: string;
  roundNumber: number;
  holderNickname: string;
  /** set during ROUND_RESULT */
  burned?: string;
  scoreboard: Array<{ playerId: string; nickname: string; total: number }>;
  finished: boolean;
  finalScores?: Array<{ playerId: string; total: number }>;
}

export interface HotPotatoPrivateView {
  statusText?: string;
  targets?: { id: string; label: string; style?: "good" | "bad" | "neutral" }[];
}

type HotPotatoAction = { type: "TAP"; payload: { target: "pass" } };

/* ---------------- timing & settings ---------------- */

const PREP_MS = 2000;
const RESULT_MS = 3000;

const BURN_PENALTY = -50;
const SURVIVE_POINTS = 30;

function settingsFrom(ctx: GameContext) {
  const s = ctx.settings;
  const minHoldSeconds = clampInt(Number(s.minHoldSeconds ?? 5), 3, 10);
  const maxHoldSeconds = Math.max(
    minHoldSeconds,
    clampInt(Number(s.maxHoldSeconds ?? 15), 10, 30),
  );
  return { minHoldSeconds, maxHoldSeconds };
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

/** The passing wheel: active players in entry order. */
function wheelOf(ctx: GameContext): string[] {
  return ctx.players.filter((p) => p.role === "player").map((p) => p.playerId);
}

function holderOf(state: HotPotatoState): string {
  return state.wheel[state.holderIdx] ?? state.wheel[0] ?? "";
}

function nextIdx(state: HotPotatoState): number {
  return (state.holderIdx + 1) % state.wheel.length;
}

/* ---------------- plugin ---------------- */

export const hotPotatoPlugin: PartyGamePlugin<
  HotPotatoState,
  HotPotatoPublicView,
  HotPotatoPrivateView,
  HotPotatoAction
> & { manifest: GameManifest } = defineGame({
  manifest: {
    id: "hot-potato",
    name: "Hot Potato",
    description:
      "Passa a batata quente antes de ela rebentar — mas ninguém sabe quando.",
    minPlayers: 3,
    maxPlayers: 20,
    avgDurationMinutes: 5,
    tags: ["reflexo", "party"],
    contentRating: "family",
    requiresBigScreen: true,
    supportsTableMode: false,
    lateJoin: "disallow",
    spectatorSupport: true,
    teamSupport: false,
    controllers: ["tap"],
    settings: [
      {
        key: "rounds",
        label: "Número de rondas",
        kind: "number",
        default: 3,
        min: 1,
        max: 8,
        step: 1,
      },
      {
        key: "minHoldSeconds",
        label: "Duração mínima da batata (s)",
        kind: "number",
        default: 5,
        min: 3,
        max: 10,
        step: 1,
      },
      {
        key: "maxHoldSeconds",
        label: "Duração máxima da batata (s)",
        kind: "number",
        default: 15,
        min: 10,
        max: 30,
        step: 1,
      },
    ],
    priority: "P0",
  },

  createInitialState(ctx): HotPotatoState {
    const wheel = wheelOf(ctx);
    return {
      phase: "ROUND_PREP",
      phaseLabel: "A aquecer a batata…",
      roundNumber: 1,
      roundTotal: clampInt(Number(ctx.settings.rounds ?? 3), 1, 8),
      deadlineAt: ctx.clock.now() + PREP_MS,
      wheel,
      holderIdx: ctx.rng.int(0, wheel.length - 1),
      secretHoldMs:
        ctx.rng.int(settingsFrom(ctx).minHoldSeconds, settingsFrom(ctx).maxHoldSeconds) * 1000,
      totals: {},
    };
  },

  getPublicView(state, ctx): HotPotatoPublicView {
    const scoreboard = wheelOf(ctx).map((playerId) => ({
      playerId,
      nickname: nicknameOf(ctx, playerId),
      total: state.totals[playerId] ?? 0,
    }));

    if (state.phase === "GAME_RESULT") {
      return {
        prompt: state.phaseLabel,
        roundNumber: state.roundNumber,
        holderNickname: nicknameOf(ctx, holderOf(state)),
        scoreboard,
        finished: true,
        finalScores: scoreboard
          .map((r) => ({ playerId: r.playerId, total: Math.max(0, r.total) }))
          .sort((a, b) => b.total - a.total),
      };
    }

    const base: HotPotatoPublicView = {
      prompt: state.phaseLabel,
      roundNumber: state.roundNumber,
      holderNickname: nicknameOf(ctx, holderOf(state)),
      scoreboard,
      finished: false,
    };
    if (state.phase === "ROUND_RESULT") {
      // reveal happens only once the round has closed
      return { ...base, burned: nicknameOf(ctx, state.burnedId ?? "") };
    }
    return base;
  },

  getPrivateView(state, playerId, ctx): HotPotatoPrivateView {
    switch (state.phase) {
      case "ROUND_PREP":
        return { statusText: `Prepara-te para a ronda ${state.roundNumber}…` };
      case "PASSING": {
        const mine = holderOf(state) === playerId;
        return mine
          ? {
              targets: [{ id: "pass", label: "🔥 Passa!", style: "bad" }],
              statusText: "Tens a batata!",
            }
          : { statusText: `Batata com ${nicknameOf(ctx, holderOf(state))}` };
      }
      case "ROUND_RESULT": {
        const burned = state.burnedId ?? "";
        const mine = burned === playerId;
        return {
          statusText: mine ? "Ai! Queimaste-te… −50" : `${nicknameOf(ctx, burned)} queimou! 🔥`,
        };
      }
      case "GAME_RESULT":
        return { statusText: "Fim do jogo" };
    }
  },

  validateAction(state, action, actor) {
    switch (action.type) {
      case "TAP": {
        if (actor.role !== "player") {
          return { ok: false, code: "FORBIDDEN", reason: "spectators cannot tap" };
        }
        if (state.phase !== "PASSING") return { ok: false, code: "BAD_PHASE" };
        const target = isPlainObject(action.payload) ? action.payload.target : undefined;
        if (target !== "pass") {
          return { ok: false, code: "INVALID_PAYLOAD", reason: 'target must be "pass"' };
        }
        if (actor.playerId !== holderOf(state)) {
          return { ok: false, code: "FORBIDDEN", reason: "only the holder can pass" };
        }
        return { ok: true };
      }
      default:
        return { ok: false, code: "INVALID_PAYLOAD" };
    }
  },

  reduce(state, action) {
    switch (action.type) {
      case "TAP":
        // atomic hand-off: holder changes in a single pure transition
        return { ...state, holderIdx: nextIdx(state) };
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
          phase: "PASSING",
          phaseLabel: "Passa a batata!",
          // secret fuse starts here; deadlineAt stays UNDEFINED (never on the host UI)
          secretDeadlineMs: now + (state.secretHoldMs ?? 0),
        };
      }
      case "PASSING": {
        if (state.secretDeadlineMs === undefined || now < state.secretDeadlineMs) return state;
        return burn(state, now);
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

  score(state): ScoreResult {
    // clamp each player's final total at zero (burned rounds never go negative)
    const clamped = Object.fromEntries(
      Object.entries(state.totals).map(([playerId, total]) => [playerId, Math.max(0, total)]),
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
        ? Object.fromEntries(winners.map((id) => [id, "🏆 Sobrevivente da Batata"]))
        : undefined,
      awards:
        winners.length === 1
          ? [{ kind: "winner", label: "Mãos mais rápidas", playerIds: winners }]
          : winners.length > 1
            ? [{ kind: "tie", label: "Empate sem queimaduras", playerIds: winners }]
            : undefined,
    };
  },

  serialize(state) {
    return JSON.parse(JSON.stringify(state));
  },

  deserialize(value) {
    return value as HotPotatoState;
  },
});

export default hotPotatoPlugin;

/* ---------------- transitions (pure) ---------------- */

/**
 * The fuse expired: whoever HOLDS the potato (stored in state, never the
 * acting player) burns −50; everyone else in the wheel banks +30.
 */
function burn(state: HotPotatoState, now: number): HotPotatoState {
  const burnedId = holderOf(state);
  const totals = { ...state.totals };
  for (const id of state.wheel) {
    totals[id] = (totals[id] ?? 0) + (id === burnedId ? BURN_PENALTY : SURVIVE_POINTS);
  }
  return {
    ...state,
    phase: "ROUND_RESULT",
    phaseLabel: "Quem queimou?",
    deadlineAt: now + RESULT_MS,
    holderIdx: state.holderIdx, // burned player keeps holding the memory of shame
    burnedId,
    totals,
    secretDeadlineMs: undefined, // fuse consumed
  };
}

/** After the reveal: next round seeded right of the burned player, or game over. */
function advanceRound(state: HotPotatoState, ctx: GameContext, now: number): HotPotatoState {
  if (state.roundNumber >= state.roundTotal) {
    return { ...state, phase: "GAME_RESULT", phaseLabel: "Fim do jogo", deadlineAt: undefined };
  }
  const burnedPos = state.wheel.indexOf(state.burnedId ?? "");
  const startIdx = burnedPos >= 0 ? (burnedPos + 1) % state.wheel.length : 0;
  return {
    ...state,
    phase: "ROUND_PREP",
    phaseLabel: "A aquecer a batata…",
    roundNumber: state.roundNumber + 1,
    holderIdx: startIdx,
    burnedId: undefined,
    secretHoldMs:
      ctx.rng.int(settingsFrom(ctx).minHoldSeconds, settingsFrom(ctx).maxHoldSeconds) * 1000,
    secretDeadlineMs: undefined,
    deadlineAt: now + PREP_MS,
  };
}
