/**
 * Charades — mímica com palavra secreta e timer central (spec §14.11, P0).
 * Só o ator vê a palavra; a equipa nunca a vê. Cada ronda é o turno de um
 * ator (rotação); acertos +100 para o ator; passar gasta tempo (-0 pontos,
 * máx. 3 por turno). Transições puras — estados aninhados são sempre copiados.
 */
import { defineGame } from "@rs-party/game-engine";
import type {
  GameBaseState,
  GameContext,
  PartyGamePlugin,
  ScoreResult,
} from "@rs-party/game-engine";
import type { Actor, GameManifest } from "@rs-party/protocol";
import { charadeWords } from "./bank.js";

/* ---------------- types ---------------- */

export interface CharadesState extends GameBaseState {
  phase: "ROUND_PREP" | "ACTING" | "ROUND_RESULT" | "GAME_RESULT";
  /** words still to be drawn, shuffled once via ctx.rng */
  deck: string[];
  /** played words, recycled (reshuffled) when the deck runs dry */
  discard: string[];
  currentWord: string;
  /** rng-chosen rotation start so the first actor is not always p1 */
  actorOffset: number;
  /** rotation slot of the CURRENT turn among active players */
  actorSlot: number;
  solvedCount: number;
  passedCount: number;
  passesLeft: number;
  /** double-fire guard: identical target within the same millisecond */
  lastTap?: { target: TapTarget; at: number };
  lastRound?: {
    actorId: string;
    word: string;
    solvedCount: number;
    passedCount: number;
    deltas: Record<string, number>;
  };
  totals: Record<string, number>;
}

type TapTarget = "correct" | "pass";

export interface CharadesPublicView {
  actorNickname: string | null;
  solvedCount: number;
  passedCount: number;
  wordsLeft: number;
  prompt: string | null;
  playerCount: number;
  scoreboard: Array<{ playerId: string; nickname: string; total: number }>;
  /** only set in ROUND_RESULT/GAME_RESULT reveal */
  word?: string;
  finished: boolean;
  finalScores?: Array<{ playerId: string; total: number }>;
}

export interface CharadesPrivateView {
  targets?: Array<{ id: string; label: string; style?: "good" | "bad" | "neutral" }>;
  statusText?: string;
  disabledText?: string;
}

type CharadesAction = { type: "TAP"; payload: { target?: string } };

/* ---------------- timing & settings ---------------- */

const PREP_MS = 2000;
const RESULT_MS = 3000;

const CORRECT_POINTS = 100;
const MAX_PASSES = 3;

function settingsFrom(ctx: GameContext) {
  const s = ctx.settings;
  return {
    actorTurnSeconds: clampInt(Number(s.actorTurnSeconds ?? 60), 30, 180),
  };
}

function clampInt(v: number, min: number, max: number): number {
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, Math.round(v)));
}

/* ---------------- helpers ---------------- */

function activePlayers(ctx: GameContext) {
  return ctx.players.filter((p) => p.role === "player");
}

function actorIdOf(state: CharadesState, ctx: GameContext): string | null {
  const players = activePlayers(ctx);
  if (players.length === 0) return null;
  // rotation starts at the rng-chosen offset; slot counts completed turns
  const idx = (state.actorOffset + state.actorSlot) % players.length;
  return players[idx]?.playerId ?? null;
}

function nicknameOf(ctx: GameContext, playerId: string): string | null {
  return ctx.players.find((p) => p.playerId === playerId)?.nickname ?? null;
}

function scoreboardOf(state: CharadesState, ctx: GameContext) {
  return activePlayers(ctx)
    .map((p) => ({
      playerId: p.playerId,
      nickname: p.nickname,
      total: state.totals[p.playerId] ?? 0,
    }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Draw the next word (pure): recycles the discard pile — excluding the word
 * on screen — reshuffled via ctx.rng when the deck runs dry.
 * Returns null only when no word other than the current one exists.
 */
function drawNextWord(
  state: CharadesState,
  ctx: GameContext,
): Pick<CharadesState, "deck" | "discard"> & { word: string | null } {
  let deck = [...state.deck];
  let discard = [...state.discard];
  if (deck.length === 0) {
    deck = ctx.rng.shuffle(discard.filter((w) => w !== state.currentWord));
    discard = [];
    if (deck.length === 0) return { deck, discard, word: null }; // baralho vazio
  }
  const word = deck.shift()!;
  return { deck, discard, word };
}

/** Close the acting turn → ROUND_RESULT reveal. */
function finishTurn(state: CharadesState, ctx: GameContext, now?: number): CharadesState {
  const at = now ?? ctx.clock.now();
  const actorId = actorIdOf(state, ctx);
  const gained = state.solvedCount * CORRECT_POINTS;
  return {
    ...state,
    phase: "ROUND_RESULT",
    phaseLabel: "Palavra revelada",
    deadlineAt: at + RESULT_MS,
    discard: [...state.discard, state.currentWord],
    lastTap: undefined,
    lastRound: {
      actorId: actorId ?? "",
      word: state.currentWord,
      solvedCount: state.solvedCount,
      passedCount: state.passedCount,
      deltas: actorId ? { [actorId]: gained } : {},
    },
  };
}

/** ROUND_RESULT → next actor's ROUND_PREP or GAME_RESULT when all played once. */
function advanceTurn(state: CharadesState, ctx: GameContext, now?: number): CharadesState {
  const at = now ?? ctx.clock.now();
  const players = activePlayers(ctx);
  if (state.actorSlot + 1 >= players.length) {
    return { ...state, phase: "GAME_RESULT", phaseLabel: "Fim do jogo", deadlineAt: undefined };
  }
  const drawn = drawNextWord(state, ctx);
  if (drawn.word === null) {
    // baralho vazio sem reciclagem possível — termina a partida
    return { ...state, phase: "GAME_RESULT", phaseLabel: "Fim do jogo", deadlineAt: undefined };
  }
  return {
    ...state,
    phase: "ROUND_PREP",
    phaseLabel: "A preparar o próximo ator…",
    actorSlot: state.actorSlot + 1,
    roundNumber: state.actorSlot + 2,
    deck: drawn.deck,
    discard: drawn.discard,
    currentWord: drawn.word,
    solvedCount: 0,
    passedCount: 0,
    passesLeft: MAX_PASSES,
    lastTap: undefined,
    lastRound: undefined,
    deadlineAt: at + PREP_MS,
  };
}

/* ---------------- plugin ---------------- */

export const charadesPlugin: PartyGamePlugin<
  CharadesState,
  CharadesPublicView,
  CharadesPrivateView,
  CharadesAction
> & { manifest: GameManifest } = defineGame({
  manifest: {
    id: "charades",
    name: "Charades",
    description: "Mímica com palavra secreta e timer central no ecrã.",
    minPlayers: 2,
    maxPlayers: 12,
    avgDurationMinutes: 6,
    tags: ["mime", "party"],
    contentRating: "family",
    requiresBigScreen: true,
    supportsTableMode: false,
    lateJoin: "spectatorUntilRound",
    spectatorSupport: true,
    teamSupport: false,
    controllers: ["tap"],
    settings: [
      {
        key: "actorTurnSeconds",
        label: "Segundos por turno do ator",
        kind: "number",
        default: 60,
        min: 30,
        max: 180,
        step: 15,
      },
    ],
    priority: "P0",
  },

  createInitialState(ctx): CharadesState {
    const players = activePlayers(ctx);
    const deck = ctx.rng.shuffle(charadeWords);
    const firstWord = deck.shift()!;
    return {
      phase: "ROUND_PREP",
      phaseLabel: "A preparar o primeiro ator…",
      roundNumber: 1,
      roundTotal: players.length,
      deadlineAt: ctx.clock.now() + PREP_MS,
      deck,
      discard: [],
      currentWord: firstWord,
      actorOffset: ctx.rng.int(0, Math.max(players.length - 1, 0)),
      actorSlot: 0,
      solvedCount: 0,
      passedCount: 0,
      passesLeft: MAX_PASSES,
      totals: {},
    };
  },

  getPublicView(state, ctx) {
    const playerCount = activePlayers(ctx).length;
    const scoreboard = scoreboardOf(state, ctx);
    const actorNickname = nicknameOf(ctx, actorIdOf(state, ctx) ?? "");

    if (state.phase === "GAME_RESULT") {
      return {
        actorNickname: null,
        solvedCount: 0,
        passedCount: 0,
        wordsLeft: 0,
        prompt: null,
        playerCount,
        scoreboard,
        finished: true,
        finalScores: scoreboard.map((r) => ({ playerId: r.playerId, total: r.total })),
      };
    }

    if (state.phase === "ROUND_RESULT") {
      const lr = state.lastRound!;
      return {
        actorNickname,
        solvedCount: lr.solvedCount,
        passedCount: lr.passedCount,
        wordsLeft: state.deck.length,
        prompt: "Palavra revelada!",
        playerCount,
        scoreboard,
        word: lr.word, // revealed after the turn ends
        finished: false,
      };
    }

    // ROUND_PREP/ACTING: countdown comes from deadlineAt; NEVER the word here
    return {
      actorNickname,
      solvedCount: state.solvedCount,
      passedCount: state.passedCount,
      wordsLeft: state.deck.length,
      prompt:
        state.phase === "ACTING"
          ? "🎭 em ação"
          : `${actorNickname ?? "?"} prepara-se…`,
      playerCount,
      scoreboard,
      finished: false,
    };
  },

  getPrivateView(state, playerId, ctx) {
    const actorId = actorIdOf(state, ctx);
    const isActor = actorId === playerId;

    switch (state.phase) {
      case "ROUND_PREP":
        if (isActor) {
          return {
            statusText: `Decora a tua palavra: "${state.currentWord}" — vais representá-la!`,
          };
        }
        return {
          disabledText: `🎭 ${nicknameOf(ctx, actorId ?? "") ?? "?"} vai representar…`,
        };
      case "ACTING":
        if (isActor) {
          return {
            targets: [
              { id: "correct", label: "✅ Acertou!", style: "good" },
              { id: "pass", label: "⏭ Passar", style: "neutral" },
            ],
            prompt: state.currentWord, // secret word: actor's phone only
            statusText: `${state.passesLeft} passes restantes`,
          };
        }
        return {
          statusText: `🎭 ${nicknameOf(ctx, actorId ?? "") ?? "?"} está representando — não digas a palavra!`,
        };
      case "ROUND_RESULT": {
        const lr = state.lastRound!;
        return {
          statusText: `A palavra era "${lr.word}" — ${lr.solvedCount} acertos, ${lr.passedCount} passes`,
        };
      }
      case "GAME_RESULT":
        return { statusText: "Fim do jogo" };
    }
  },

  validateAction(state, action, actor, ctx) {
    if (actor.role !== "player") {
      return { ok: false, code: "FORBIDDEN", reason: "spectators cannot act" };
    }
    switch (action.type) {
      case "TAP": {
        if (state.phase !== "ACTING") return { ok: false, code: "BAD_PHASE" };
        if (actorIdOf(state, ctx) !== actor.playerId) {
          return { ok: false, code: "FORBIDDEN", reason: "only the actor may tap" };
        }
        const target = (action.payload as { target?: unknown })?.target;
        if (target !== "correct" && target !== "pass") {
          return { ok: false, code: "INVALID_PAYLOAD", reason: 'target must be "correct" or "pass"' };
        }
        if (target === "pass" && state.passesLeft <= 0) {
          return { ok: false, code: "FORBIDDEN", reason: "no passes left this turn" };
        }
        if (
          state.lastTap &&
          state.lastTap.target === target &&
          state.lastTap.at === ctx.clock.now()
        ) {
          return { ok: false, code: "DUPLICATE_ACTION", reason: "double tap" };
        }
        return { ok: true };
      }
      default:
        return { ok: false, code: "INVALID_PAYLOAD" };
    }
  },

  reduce(state, action, actor, ctx) {
    switch (action.type) {
      case "TAP": {
        const target = action.payload.target as TapTarget;
        const now = ctx.clock.now();

        if (target === "correct") {
          const totals = { ...state.totals };
          totals[actor.playerId] = (totals[actor.playerId] ?? 0) + CORRECT_POINTS;
          const moved: CharadesState = {
            ...state,
            totals,
            solvedCount: state.solvedCount + 1,
            discard: [...state.discard, state.currentWord],
          };
          const drawn = drawNextWord(moved, ctx);
          if (drawn.word === null) return finishTurn(moved, ctx, now); // baralho vazio
          return {
            ...moved,
            deck: drawn.deck,
            discard: drawn.discard,
            currentWord: drawn.word,
            lastTap: { target, at: now },
          };
        }

        // pass: -0 points but burns time; current word goes to discard pile
        const moved: CharadesState = {
          ...state,
          passedCount: state.passedCount + 1,
          passesLeft: state.passesLeft - 1,
          discard: [...state.discard, state.currentWord],
        };
        const drawn = drawNextWord(moved, ctx);
        if (drawn.word === null) return finishTurn(moved, ctx, now); // baralho vazio
        return {
          ...moved,
          deck: drawn.deck,
          discard: drawn.discard,
          currentWord: drawn.word,
          lastTap: { target, at: now },
        };
      }
    }
  },

  /** Same-reference no-op tick (runtime compares by reference; see bluff-battle note). */
  tick(state, now, ctx) {
    if (state.deadlineAt === undefined || now < state.deadlineAt) return state;
    switch (state.phase) {
      case "ROUND_PREP":
        return {
          ...state,
          phase: "ACTING",
          phaseLabel: "🎭 em ação",
          deadlineAt: now + settingsFrom(ctx).actorTurnSeconds * 1000,
        };
      case "ACTING":
        return finishTurn(state, ctx, now);
      case "ROUND_RESULT":
        return advanceTurn(state, ctx, now);
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
    const winners = sorted.filter((r) => r.delta === top).map((r) => r.playerId);
    return {
      roundScores,
      titles: winners.length
        ? Object.fromEntries(winners.map((id) => [id, "🏆 Mímico-Mor"]))
        : undefined,
      awards:
        winners.length === 1
          ? [{ kind: "winner", label: "Vencedor da partida", playerIds: winners }]
          : winners.length > 1
            ? [{ kind: "tie", label: "Empate no topo", playerIds: winners }]
            : undefined,
    };
  },

  serialize(state) {
    return JSON.parse(JSON.stringify(state));
  },

  deserialize(value) {
    return value as CharadesState;
  },
});

export default charadesPlugin;
