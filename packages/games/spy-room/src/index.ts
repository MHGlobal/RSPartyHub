/**
 * Spy Room — dedução social (spec §14.12, P0).
 * Todos recebem o MESMO local e um papel; UM jogador (o spy) não sabe o local.
 * A discussão é falada fora do app com timer central; depois todos votam quem
 * é o spy e o spy pode tentar adivinhar o local (uma única vez).
 *
 * Regra de resolução explícita:
 *  (a) spy mais votado ⇒ grupo vence: +100 a cada não-spy, spy 0;
 *  (b) empate no topo OU spy menos votado ⇒ spy escapa: +150 ao spy, resto 0.
 *  SPY_GUESS correto dá sempre +50 extra ao spy, em qualquer cenário.
 *
 * Segredos (local, papéis, spyId, candidatos) nunca saem nos publicViews —
 * só no privateView do próprio e no reveal do GAME_RESULT.
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
import { SPY_LOCATIONS, locationById } from "./bank.js";

/* ---------------- types ---------------- */

export interface SpyRoomResult {
  spyNickname: string;
  /** human location name revealed at the end */
  location: string;
  /** target playerId → vote count */
  tally: Record<string, number>;
  winner: "group" | "spy";
  spyGuessCorrect: boolean;
  /** final delta per playerId */
  scores: Record<string, number>;
}

export interface SpyRoomState extends GameBaseState {
  phase: "SETUP" | "DISCUSSION" | "VOTING" | "GAME_RESULT";
  /** secret: chosen bank location id */
  locationId: string;
  /** secret: playerId → role label (non-spy players only) */
  roles: Record<string, string>;
  /** secret: the spy */
  spyId?: string;
  /** secret: 4 candidate location ids for the spy guess (true one included) */
  candidates: string[];
  /** voter playerId → target playerId */
  votes: Record<string, string>;
  /** secret-ish: the spy's one-shot guess (undefined until made) */
  spyGuessLocationId?: string;
  /** set when the round resolves */
  result?: SpyRoomResult;
}

export interface SpyPublicView {
  prompt: string;
  finished: boolean;
  /** number of votes cast so far (VOTING onwards) */
  votedCount?: number;
  /** only set during GAME_RESULT */
  result?: {
    spyNickname: string;
    location: string;
    tally: Record<string, number>;
    winner: "group" | "spy";
    spyGuessCorrect: boolean;
  };
}

export interface SpyPrivateView {
  prompt?: string;
  statusText?: string;
  voteOptions?: { id: string; label: string }[];
  /** spy-only guess menu; `id` lets custom renderers send SPY_GUESS { locationId } */
  choices?: { label: string; id: string }[];
  disabledText?: string;
}

type SpyAction =
  | { type: "VOTE"; payload: { optionId: string } }
  | { type: "SPY_GUESS"; payload: { locationId: string } };

/* ---------------- timing & settings ---------------- */

const PREP_MS = 2000;

function settingsFrom(ctx: GameContext) {
  const s = ctx.settings;
  return {
    discussionSeconds: clampInt(Number(s.discussionSeconds ?? 120), 30, 300),
    voteSeconds: clampInt(Number(s.voteSeconds ?? 30), 10, 120),
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

export const spyRoomPlugin: PartyGamePlugin<
  SpyRoomState,
  SpyPublicView,
  SpyPrivateView,
  SpyAction
> & { manifest: GameManifest } = defineGame({
  manifest: {
    id: "spy-room",
    name: "Spy Room",
    description:
      "Dedução social: todos conhecem o local menos o espião. Discutam, votem, apanhem-no.",
    minPlayers: 3,
    maxPlayers: 12,
    avgDurationMinutes: 8,
    tags: ["social", "dedução", "party"],
    contentRating: "family",
    requiresBigScreen: true,
    supportsTableMode: false,
    lateJoin: "disallow",
    spectatorSupport: true,
    teamSupport: false,
    controllers: ["cards", "vote"],
    settings: [
      {
        key: "discussionSeconds",
        label: "Segundos de discussão",
        kind: "number",
        default: 120,
        min: 30,
        max: 300,
        step: 10,
      },
      {
        key: "voteSeconds",
        label: "Segundos de votação",
        kind: "number",
        default: 30,
        min: 10,
        max: 120,
        step: 5,
      },
    ],
    priority: "P0",
  },

  createInitialState(ctx): SpyRoomState {
    const roster = activePlayers(ctx);
    const spyIdx = ctx.rng.int(0, roster.length - 1);
    const spyId = roster[spyIdx]?.playerId;

    const loc = ctx.rng.pick(SPY_LOCATIONS);
    const shuffledRoles = ctx.rng.shuffle(loc.roles);

    const roles: Record<string, string> = {};
    let roleIdx = 0;
    for (const p of roster) {
      if (p.playerId === spyId) continue;
      roles[p.playerId] = shuffledRoles[roleIdx % shuffledRoles.length]!;
      roleIdx++;
    }

    // 4 candidate locations for the spy's guess — the true one always included
    const others = SPY_LOCATIONS.filter((l) => l.id !== loc.id);
    const picked = ctx.rng.shuffle([...others]).slice(0, 3).map((l) => l.id);
    const candidates = ctx.rng.shuffle([loc.id, ...picked]);

    return {
      phase: "SETUP",
      phaseLabel: "A distribuir papéis em segredo…",
      roundNumber: 1,
      roundTotal: 1,
      deadlineAt: ctx.clock.now() + PREP_MS,
      locationId: loc.id,
      roles,
      spyId,
      candidates,
      votes: {},
    };
  },

  getPublicView(state, _ctx): SpyPublicView {
    const base: SpyPublicView = {
      prompt: state.phaseLabel,
      finished: false,
    };
    if (state.phase === "VOTING") {
      return { ...base, votedCount: Object.keys(state.votes).length };
    }
    if (state.phase === "GAME_RESULT" && state.result) {
      return {
        ...base,
        finished: true,
        votedCount: Object.keys(state.votes).length,
        result: {
          spyNickname: state.result.spyNickname,
          location: state.result.location,
          tally: { ...state.result.tally },
          winner: state.result.winner,
          spyGuessCorrect: state.result.spyGuessCorrect,
        },
      };
    }
    return base;
  },

  getPrivateView(state, playerId, ctx): SpyPrivateView {
    switch (state.phase) {
      case "SETUP":
        return { statusText: "Olha bem para o teu cartão…" };

      case "DISCUSSION": {
        if (state.spyId === playerId) {
          return {
            prompt: "Não sabes onde estás! Descobre pela conversa.",
            statusText: "Finge que sabes — e não te deixes apanhar.",
          };
        }
        const role = state.roles[playerId];
        return {
          prompt: `📍 ${locationById(state.locationId)?.name ?? "?"} · 🎭 ${role ?? "?"}`,
          statusText: "Descreve o local sem o dizer!",
        };
      }

      case "VOTING": {
        const options = activePlayers(ctx)
          .filter((p) => p.playerId !== playerId)
          .map((p) => ({ id: p.playerId, label: p.nickname }));
        const isSpy = state.spyId === playerId;
        const view: SpyPrivateView = {
          voteOptions: options,
          statusText: isSpy
            ? "Vota em quem suspeitas de ti — e podes adivinhar o local uma vez!"
            : "Quem é o espião?",
        };
        if (isSpy && !state.spyGuessLocationId) {
          view.choices = state.candidates.map((id) => ({
            label: locationById(id)?.name ?? id,
            id,
          }));
        }
        return view;
      }

      case "GAME_RESULT": {
        const r = state.result;
        if (!r) return { statusText: "Fim do jogo" };
        const mine = r.scores[playerId] ?? 0;
        const text =
          r.winner === "group"
            ? `Apanharam o espião ${r.spyNickname}! Era o/rá ${r.location}. +${mine}`
            : `${r.spyNickname} escapou-se! O local era ${r.location}. +${mine}`;
        return { statusText: text };
      }
    }
  },

  validateAction(state, action, actor, ctx) {
    switch (action.type) {
      case "VOTE": {
        if (actor.role !== "player") {
          return { ok: false, code: "FORBIDDEN", reason: "spectators cannot vote" };
        }
        if (state.phase !== "VOTING") return { ok: false, code: "BAD_PHASE" };
        const optionId = isPlainObject(action.payload) ? action.payload.optionId : undefined;
        if (typeof optionId !== "string") {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "optionId must be a string" };
        }
        if (optionId === actor.playerId) {
          return { ok: false, code: "FORBIDDEN", reason: "you cannot vote for yourself" };
        }
        if (!activePlayers(ctx).some((p) => p.playerId === optionId)) {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "unknown vote target" };
        }
        if (state.votes[actor.playerId] !== undefined) {
          return { ok: false, code: "DUPLICATE_ACTION", reason: "already voted" };
        }
        return { ok: true };
      }
      case "SPY_GUESS": {
        if (state.spyId !== actor.playerId) {
          return { ok: false, code: "FORBIDDEN", reason: "only the spy can guess" };
        }
        if (state.phase !== "VOTING") return { ok: false, code: "BAD_PHASE" };
        const locationId = isPlainObject(action.payload) ? action.payload.locationId : undefined;
        if (typeof locationId !== "string") {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "locationId must be a string" };
        }
        if (state.spyGuessLocationId !== undefined) {
          return { ok: false, code: "DUPLICATE_ACTION", reason: "already guessed once" };
        }
        if (!state.candidates.includes(locationId)) {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "not a candidate location" };
        }
        return { ok: true };
      }
      default:
        return { ok: false, code: "INVALID_PAYLOAD" };
    }
  },

  reduce(state, action, actor, ctx) {
    switch (action.type) {
      case "VOTE": {
        const next: SpyRoomState = {
          ...state,
          votes: { ...state.votes, [actor.playerId]: action.payload.optionId },
        };
        // early close: every active player has cast their vote
        const everyone = activePlayers(ctx).every((p) => next.votes[p.playerId] !== undefined);
        return everyone ? resolveRound(next, ctx) : next;
      }
      case "SPY_GUESS":
        return { ...state, spyGuessLocationId: action.payload.locationId };
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
      case "SETUP":
        return {
          ...state,
          phase: "DISCUSSION",
          phaseLabel: "Discussão — descubram o espião!",
          deadlineAt: now + settingsFrom(ctx).discussionSeconds * 1000,
        };
      case "DISCUSSION":
        return {
          ...state,
          phase: "VOTING",
          phaseLabel: "Quem é o espião?",
          deadlineAt: now + settingsFrom(ctx).voteSeconds * 1000,
        };
      case "VOTING":
        return resolveRound(state, ctx);
      default:
        return state;
    }
  },

  isFinished(state) {
    return state.phase === "GAME_RESULT";
  },

  score(state): ScoreResult {
    const scores = state.result?.scores ?? {};
    const roundScores = Object.entries(scores)
      .map(([playerId, delta]) => ({ playerId, delta }))
      .sort((a, b) => b.delta - a.delta);
    const top = roundScores[0]?.delta ?? 0;
    const winners = top <= 0 ? [] : roundScores.filter((r) => r.delta === top).map((r) => r.playerId);
    return {
      roundScores,
      titles: winners.length
        ? Object.fromEntries(winners.map((id) => [id, "🏆 Mestre da Dedução"]))
        : undefined,
      awards:
        winners.length === 1
          ? [{ kind: "winner", label: "Leitor de mentiras", playerIds: winners }]
          : winners.length > 1
            ? [{ kind: "tie", label: "Empate na dedução", playerIds: winners }]
            : undefined,
    };
  },

  serialize(state) {
    return JSON.parse(JSON.stringify(state));
  },

  deserialize(value) {
    return value as SpyRoomState;
  },
});

export default spyRoomPlugin;

/* ---------------- transitions (pure) ---------------- */

/**
 * Resolve voting. Pure — derives everything from the state snapshot.
 * (a) unique most-voted == spy ⇒ group wins (+100 per non-spy, spy 0);
 * (b) otherwise (tie at top, spy less voted, or no votes) ⇒ spy escapes (+150).
 * A correct SPY_GUESS adds +50 to the spy in ANY scenario.
 */
function resolveRound(state: SpyRoomState, ctx: GameContext): SpyRoomState {
  if (state.phase === "GAME_RESULT" || state.spyId === undefined) return state;

  const tally: Record<string, number> = {};
  for (const target of Object.values(state.votes)) {
    tally[target] = (tally[target] ?? 0) + 1;
  }

  let topCount = 0;
  for (const count of Object.values(tally)) {
    if (count > topCount) topCount = count;
  }
  const leaders = topCount === 0 ? [] : Object.keys(tally).filter((id) => tally[id] === topCount);
  const groupWins = leaders.length === 1 && leaders[0] === state.spyId;

  const spyGuessCorrect = state.spyGuessLocationId === state.locationId;
  const scores: Record<string, number> = {};
  for (const p of activePlayers(ctx)) {
    scores[p.playerId] = 0;
  }
  if (groupWins) {
    for (const p of activePlayers(ctx)) {
      if (p.playerId !== state.spyId) scores[p.playerId] = 100;
    }
  } else {
    scores[state.spyId] = 150;
  }
  if (spyGuessCorrect) {
    scores[state.spyId] = (scores[state.spyId] ?? 0) + 50;
  }

  const result: SpyRoomResult = {
    spyNickname: nicknameOf(ctx, state.spyId),
    location: locationById(state.locationId)?.name ?? state.locationId,
    tally,
    winner: groupWins ? "group" : "spy",
    spyGuessCorrect,
    scores,
  };

  return {
    ...state,
    phase: "GAME_RESULT",
    phaseLabel: "Revelação!",
    deadlineAt: undefined,
    result,
  };
}
