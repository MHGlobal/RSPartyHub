/**
 * Draw & Guess — um desenhista, todos adivinham por texto (spec §14.6, P0).
 * O canvas vive no cliente; o plugin gere turnos, palavras secretas e chutes.
 * Transições puras; a palavra secreta nunca sai do estado do servidor antes
 * do reveal e os chutes nunca são expostos como texto no publicView.
 */
import { defineGame } from "@rs-party/game-engine";
import type {
  GameBaseState,
  GameContext,
  PartyGamePlugin,
  ScoreResult,
} from "@rs-party/game-engine";
import type { Actor, GameManifest } from "@rs-party/protocol";
import { wordBank } from "./bank.js";

/* ---------------- types ---------------- */

export interface DrawGuessState extends GameBaseState {
  phase: "ROUND_PREP" | "DRAWING" | "ROUND_RESULT" | "GAME_RESULT";
  /** words for the whole match (shuffled once, no repeats) */
  words: string[];
  current: number;
  /** rng-chosen rotation start so the first artist is not always p1 */
  artistOffset: number;
  /** playerId -> normalised guesses already tried this round */
  guesses: Record<string, string[]>;
  attempts: number;
  lastRound?: {
    word: string;
    winnerId: string | null;
  };
  totals: Record<string, number>;
}

export interface DrawGuessPublicView {
  artistNickname: string | null;
  attempts: number;
  solved: boolean;
  /** only set in ROUND_RESULT/GAME_RESULT reveal */
  word?: string;
  winnerNickname?: string | null;
  prompt: string | null;
  playerCount: number;
  scoreboard: Array<{ playerId: string; nickname: string; total: number }>;
  finished: boolean;
  finalScores?: Array<{ playerId: string; total: number }>;
}

export interface DrawGuessPrivateView {
  textInput?: boolean;
  textPlaceholder?: string;
  statusText?: string;
  disabledText?: string;
}

type DrawGuessAction = { type: "TEXT"; payload: { text: string } };

/* ---------------- timing & settings ---------------- */

const PREP_MS = 2000;
const RESULT_MS = 3000;

const WIN_POINTS = 120;
const ARTIST_POINTS = 80;

function settingsFrom(ctx: GameContext) {
  const s = ctx.settings;
  return {
    rounds: clampInt(Number(s.rounds ?? 3), 1, 10),
    drawSeconds: clampInt(Number(s.drawSeconds ?? 60), 20, 180),
  };
}

function clampInt(v: number, min: number, max: number): number {
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, Math.round(v)));
}

/* ---------------- helpers ---------------- */

function isControlCodePoint(c: number): boolean {
  return c <= 0x1f || c === 0x7f;
}

/** Sanitised free text: NFC, no control chars, trimmed, 1..40 chars. */
function sanitizeText(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let out = "";
  for (const ch of raw.normalize("NFC")) {
    if (!isControlCodePoint(ch.codePointAt(0)!)) out += ch;
  }
  const cleaned = out.trim();
  return cleaned.length >= 1 && cleaned.length <= 40 ? cleaned : null;
}

/**
 * Guess comparison key: case-insensitive, accent-insensitive
 * (NFD + strip combining marks U+0300–U+036F), trimmed.
 */
function normGuess(s: string): string {
  let out = "";
  for (const ch of s.normalize("NFD")) {
    const c = ch.codePointAt(0)!;
    if (c >= 0x300 && c <= 0x36f) continue;
    out += ch;
  }
  return out.toLowerCase().trim();
}

function activePlayers(ctx: GameContext) {
  return ctx.players.filter((p) => p.role === "player");
}

function artistOf(state: DrawGuessState, ctx: GameContext) {
  const players = activePlayers(ctx);
  const idx = (state.artistOffset + state.current) % Math.max(players.length, 1);
  return players[idx] ?? null;
}

function nicknameOf(ctx: GameContext, playerId: string): string | null {
  return ctx.players.find((p) => p.playerId === playerId)?.nickname ?? null;
}

function scoreboardOf(state: DrawGuessState, ctx: GameContext) {
  return activePlayers(ctx)
    .map((p) => ({
      playerId: p.playerId,
      nickname: p.nickname,
      total: state.totals[p.playerId] ?? 0,
    }))
    .sort((a, b) => b.total - a.total);
}

/* ---------------- plugin ---------------- */

export const drawGuessPlugin: PartyGamePlugin<
  DrawGuessState,
  DrawGuessPublicView,
  DrawGuessPrivateView,
  DrawGuessAction
> & { manifest: GameManifest } = defineGame({
  manifest: {
    id: "draw-guess",
    name: "Draw & Guess",
    description: "Desenha no telefone, todos adivinham por texto no ecrã.",
    minPlayers: 3,
    maxPlayers: 12,
    avgDurationMinutes: 8,
    tags: ["draw", "guess"],
    contentRating: "family",
    requiresBigScreen: true,
    supportsTableMode: false,
    lateJoin: "spectatorUntilRound",
    spectatorSupport: true,
    teamSupport: false,
    controllers: ["draw", "text"],
    settings: [
      {
        key: "rounds",
        label: "Número de rondas",
        kind: "number",
        default: 3,
        min: 1,
        max: 10,
        step: 1,
      },
      {
        key: "drawSeconds",
        label: "Segundos para desenhar",
        kind: "number",
        default: 60,
        min: 20,
        max: 180,
        step: 10,
      },
    ],
    priority: "P0",
  },

  createInitialState(ctx): DrawGuessState {
    const { rounds } = settingsFrom(ctx);
    // no word repeats within a match (bank ≥ 24 > rounds max)
    const shuffled = ctx.rng.shuffle(wordBank);
    const words: string[] = [];
    for (let i = 0; i < rounds; i++) {
      words.push(shuffled[i % shuffled.length]!);
    }
    return {
      phase: "ROUND_PREP",
      phaseLabel: "A preparar a ronda…",
      roundNumber: 1,
      roundTotal: rounds,
      deadlineAt: ctx.clock.now() + PREP_MS,
      words,
      current: 0,
      artistOffset: ctx.rng.int(0, Math.max(activePlayers(ctx).length - 1, 0)),
      guesses: {},
      attempts: 0,
      totals: {},
    };
  },

  getPublicView(state, ctx) {
    const playerCount = activePlayers(ctx).length;
    const scoreboard = scoreboardOf(state, ctx);
    const artist = artistOf(state, ctx);

    if (state.phase === "GAME_RESULT") {
      return {
        artistNickname: null,
        attempts: 0,
        solved: false,
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
        artistNickname: artist?.nickname ?? null,
        attempts: state.attempts,
        solved: lr.winnerId !== null,
        word: lr.word, // revealed after the round closes (anti-cheat safe)
        winnerNickname: lr.winnerId ? nicknameOf(ctx, lr.winnerId) : null,
        prompt: "Palavra revelada!",
        playerCount,
        scoreboard,
        finished: false,
      };
    }

    // ROUND_PREP/DRAWING: never the word, never guess texts (anti-cheat)
    return {
      artistNickname: artist?.nickname ?? null,
      attempts: state.attempts,
      solved: false,
      prompt:
        state.phase === "DRAWING"
          ? `🎭 ${artist?.nickname ?? "?"} está a desenhar — adivinha!`
          : `${artist?.nickname ?? "?"} vai desenhar…`,
      playerCount,
      scoreboard,
      finished: false,
    };
  },

  getPrivateView(state, playerId, ctx) {
    const artist = artistOf(state, ctx);
    const isArtist = artist?.playerId === playerId;
    const word = state.words[state.current];

    switch (state.phase) {
      case "ROUND_PREP":
        if (isArtist) {
          return {
            statusText: `Decora a tua palavra: "${word}" — começas já!`,
          };
        }
        return {
          statusText: `${artist?.nickname ?? "?"} vai desenhar. Prepara-te para adivinhar!`,
        };
      case "DRAWING":
        if (isArtist) {
          return {
            statusText: `Desenha: ${word}`,
            disabledText: "Estás a desenhar — não podes adivinhar esta ronda.",
          };
        }
        return {
          textInput: true,
          textPlaceholder: "A tua tentativa…",
          statusText:
            state.attempts === 1 ? "1 tentativa" : `${state.attempts} tentativas`,
        };
      case "ROUND_RESULT": {
        const lr = state.lastRound!;
        return {
          statusText: lr.winnerId
            ? lr.winnerId === playerId
              ? "Acertaste! 🎉"
              : `A palavra era "${lr.word}"`
            : `Ninguém acertou — a palavra era "${lr.word}"`,
        };
      }
      case "GAME_RESULT":
        return { statusText: "Fim do jogo" };
    }
  },

  validateAction(state, action, actor, ctx) {
    if (actor.role !== "player") {
      return { ok: false, code: "FORBIDDEN", reason: "spectators cannot guess" };
    }
    switch (action.type) {
      case "TEXT": {
        if (state.phase !== "DRAWING") return { ok: false, code: "BAD_PHASE" };
        const artist = artistOf(state, ctx);
        if (artist?.playerId === actor.playerId) {
          return { ok: false, code: "FORBIDDEN", reason: "the artist cannot guess" };
        }
        if (sanitizeText((action.payload as { text?: unknown })?.text) === null) {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "text must be 1..40 chars" };
        }
        const key = normGuess(String(action.payload.text));
        const mine = state.guesses[actor.playerId] ?? [];
        if (mine.includes(key)) {
          return { ok: false, code: "DUPLICATE_ACTION", reason: "identical guess already sent" };
        }
        return { ok: true };
      }
      default:
        return { ok: false, code: "INVALID_PAYLOAD" };
    }
  },

  reduce(state, action, actor, ctx) {
    switch (action.type) {
      case "TEXT": {
        const text = sanitizeText(action.payload.text)!;
        const key = normGuess(text);
        const word = state.words[state.current];
        const next: DrawGuessState = {
          ...state,
          guesses: {
            ...state.guesses,
            [actor.playerId]: [...(state.guesses[actor.playerId] ?? []), key],
          },
          attempts: state.attempts + 1,
        };

        if (key !== normGuess(word)) return next;

        // correct guess closes the round immediately: first hit scores only
        const artist = artistOf(state, ctx);
        const totals = { ...next.totals };
        totals[actor.playerId] = (totals[actor.playerId] ?? 0) + WIN_POINTS;
        if (artist && artist.playerId !== actor.playerId) {
          totals[artist.playerId] = (totals[artist.playerId] ?? 0) + ARTIST_POINTS;
        }
        return {
          ...next,
          totals,
          phase: "ROUND_RESULT",
          phaseLabel: "Acertaram!",
          deadlineAt: ctx.clock.now() + RESULT_MS,
          lastRound: { word, winnerId: actor.playerId },
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
          phase: "DRAWING",
          phaseLabel: "Adivinha o desenho!",
          deadlineAt: now + settingsFrom(ctx).drawSeconds * 1000,
        };
      case "DRAWING":
        // nobody got it: round closes with no points
        return {
          ...state,
          phase: "ROUND_RESULT",
          phaseLabel: "Tempo esgotado",
          deadlineAt: now + RESULT_MS,
          lastRound: { word: state.words[state.current], winnerId: null },
        };
      case "ROUND_RESULT": {
        if (state.current + 1 >= state.words.length) {
          return {
            ...state,
            phase: "GAME_RESULT",
            phaseLabel: "Fim do jogo",
            deadlineAt: undefined,
          };
        }
        return {
          ...state,
          phase: "ROUND_PREP",
          phaseLabel: "A preparar a ronda…",
          current: state.current + 1,
          roundNumber: state.current + 2,
          guesses: {},
          attempts: 0,
          lastRound: undefined,
          deadlineAt: now + PREP_MS,
        };
      }
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
        ? Object.fromEntries(winners.map((id) => [id, "🏆 Artista Supremo"]))
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
    return value as DrawGuessState;
  },
});

export default drawGuessPlugin;
