/**
 * Live Bingo — bingo local com cartela única seeded por jogador, sorteio
 * automático e validação server-side (spec §14.3, P0).
 *
 * Cartela 5×5: 24 números únicos de 1..50 + centro FREE (null). Os jogadores
 * marcam as células (MARK é idempotente), mas os CLAIMs são sempre
 * revalidados contra a cartela + números sorteados — marcações são UX, nunca
 * fonte de verdade. Prémios: primeiras 2 linhas +150 cada; cartela cheia
 * +400 e termina o jogo. O jogo também termina quando o pool de 50 esgota.
 * Transições puras — estados aninhados são sempre copiados.
 */
import { defineGame } from "@rs-party/game-engine";
import type {
  GameBaseState,
  GameContext,
  PartyGamePlugin,
  ScoreResult,
  SeededRng,
} from "@rs-party/game-engine";
import type { Actor, GameManifest } from "@rs-party/protocol";

/* ---------------- types ---------------- */

export type Cell = number | null;

export interface PrizeRow {
  kind: "line" | "fullhouse";
  playerId: string;
  nickname: string;
}

export interface LiveBingoState extends GameBaseState {
  phase: "INTRO" | "DRAWING" | "GAME_RESULT";
  /** playerId -> 5×5 card; centre cell is null (FREE) */
  cards: Record<string, Cell[][]>;
  /** playerId -> 5×5 marked flags (centre starts marked) */
  marked: Record<string, boolean[][]>;
  /** drawn numbers in draw order */
  drawn: number[];
  /** numbers still in the tumbler */
  remaining: number[];
  prizes: PrizeRow[];
  totals: Record<string, number>;
}

export interface BingoPublicView {
  prompt: string;
  /** last 12 drawn numbers, oldest first */
  drawn: number[];
  drawnCount: number;
  lastNumber: number;
  prizes: Array<{ kind: string; nickname: string }>;
  scoreboard: Array<{ playerId: string; nickname: string; total: number }>;
  finished: boolean;
  finalScores?: Array<{ playerId: string; total: number }>;
}

export interface BingoPrivateView {
  cells?: Array<{ id: string; label: string; marked: boolean }>;
  claimable?: Array<{ kind: string; label: string }>;
  statusText?: string;
}

type BingoAction =
  | { type: "MARK"; payload: { row: number; col: number } }
  | { type: "CLAIM"; payload: { kind: string } };

/* ---------------- timing & settings ---------------- */

const INTRO_MS = 2000;

const NUMBERS_TOTAL = 50;
const GRID = 5;
const LINE_PRIZES = 2;

const LINE_POINTS = 150;
const FULLHOUSE_POINTS = 400;

function settingsFrom(ctx: GameContext) {
  const s = ctx.settings;
  return {
    drawIntervalMs: clampInt(Number(s.drawIntervalMs ?? 2500), 1000, 6000),
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

/** The 12 winnable lines of a 5×5 card: rows, columns and both diagonals. */
const LINES: Array<Array<[number, number]>> = (() => {
  const lines: Array<Array<[number, number]>> = [];
  for (let r = 0; r < GRID; r++) {
    lines.push(Array.from({ length: GRID }, (_, c) => [r, c] as [number, number]));
  }
  for (let c = 0; c < GRID; c++) {
    lines.push(Array.from({ length: GRID }, (_, r) => [r, c] as [number, number]));
  }
  lines.push(Array.from({ length: GRID }, (_, i) => [i, i] as [number, number]));
  lines.push(Array.from({ length: GRID }, (_, i) => [i, GRID - 1 - i] as [number, number]));
  return lines;
})();

function drawnSet(state: LiveBingoState): Set<number> {
  return new Set(state.drawn);
}

/** A line is valid purely against card+drawn — marks are never trusted. */
function hasValidLine(card: Cell[][], drawn: Set<number>): boolean {
  return LINES.some((line) =>
    line.every(([r, c]) => {
      const v = card[r]![c]!;
      return v === null || drawn.has(v);
    }),
  );
}

function isFullHouse(card: Cell[][], drawn: Set<number>): boolean {
  return card.every((row) =>
    row.every((v) => v === null || drawn.has(v)),
  );
}

function linePrizesLeft(state: LiveBingoState): number {
  return LINE_PRIZES - state.prizes.filter((p) => p.kind === "line").length;
}

function generateCard(rng: SeededRng): { card: Cell[][]; marked: boolean[][] } {
  const pool = Array.from({ length: NUMBERS_TOTAL }, (_, i) => i + 1);
  const picked = rng.shuffle(pool).slice(0, GRID * GRID - 1).sort((a, b) => a - b);
  const card: Cell[][] = [];
  const marked: boolean[][] = [];
  let k = 0;
  for (let r = 0; r < GRID; r++) {
    const row: Cell[] = [];
    const mrow: boolean[] = [];
    for (let c = 0; c < GRID; c++) {
      if (r === 2 && c === 2) {
        row.push(null); // FREE centre
        mrow.push(true);
      } else {
        row.push(picked[k++]!);
        mrow.push(false);
      }
    }
    card.push(row);
    marked.push(mrow);
  }
  return { card, marked };
}

function activePlayers(ctx: GameContext) {
  return ctx.players.filter((p) => p.role === "player");
}

function nicknameOf(ctx: GameContext, playerId: string): string {
  return ctx.players.find((p) => p.playerId === playerId)?.nickname ?? "?";
}

/* ---------------- plugin ---------------- */

export const liveBingoPlugin: PartyGamePlugin<
  LiveBingoState,
  BingoPublicView,
  BingoPrivateView,
  BingoAction
> & { manifest: GameManifest } = defineGame({
  manifest: {
    id: "live-bingo",
    name: "Live Bingo",
    description:
      "Bingo local com cartelas seeded, sorteio automático e prémios validados no servidor.",
    minPlayers: 2,
    maxPlayers: 50,
    avgDurationMinutes: 6,
    tags: ["bingo", "party"],
    contentRating: "family",
    requiresBigScreen: true,
    supportsTableMode: false,
    lateJoin: "immediate",
    spectatorSupport: true,
    teamSupport: false,
    controllers: ["grid"],
    settings: [
      {
        key: "drawIntervalMs",
        label: "Intervalo entre números (ms)",
        kind: "number",
        default: 2500,
        min: 1000,
        max: 6000,
        step: 500,
      },
    ],
    priority: "P0",
  },

  createInitialState(ctx): LiveBingoState {
    const cards: Record<string, Cell[][]> = {};
    const marked: Record<string, boolean[][]> = {};
    for (const p of activePlayers(ctx)) {
      const gen = generateCard(ctx.rng);
      cards[p.playerId] = gen.card;
      marked[p.playerId] = gen.marked;
    }
    return {
      phase: "INTRO",
      phaseLabel: "Cartelas distribuídas!",
      roundNumber: 1,
      roundTotal: 1,
      deadlineAt: ctx.clock.now() + INTRO_MS,
      cards,
      marked,
      drawn: [],
      remaining: Array.from({ length: NUMBERS_TOTAL }, (_, i) => i + 1),
      prizes: [],
      totals: {},
    };
  },

  getPublicView(state, ctx) {
    const scoreboard = scoreboardOf(state, ctx);

    if (state.phase === "GAME_RESULT") {
      return {
        prompt: "Bingo terminado!",
        drawn: state.drawn.slice(-12),
        drawnCount: state.drawn.length,
        lastNumber: state.drawn[state.drawn.length - 1] ?? 0,
        prizes: state.prizes.map((p) => ({ kind: p.kind, nickname: p.nickname })),
        scoreboard,
        finished: true,
        finalScores: scoreboard.map((r) => ({ playerId: r.playerId, total: r.total })),
      };
    }

    return {
      prompt:
        state.phase === "INTRO"
          ? "As cartelas foram distribuídas…"
          : `Número ${state.drawn.length + 1} a caminho!`,
      drawn: state.drawn.slice(-12),
      drawnCount: state.drawn.length,
      lastNumber: state.drawn[state.drawn.length - 1] ?? 0,
      prizes: state.prizes.map((p) => ({ kind: p.kind, nickname: p.nickname })),
      scoreboard,
      finished: false,
    };
  },

  getPrivateView(state, playerId, ctx) {
    const card = state.cards[playerId];
    if (!card) {
      // spectators / late joiners without a card watch the draws only
      return {
        statusText:
          state.phase === "GAME_RESULT"
            ? "Fim do jogo"
            : `Último número: ${state.drawn[state.drawn.length - 1] ?? 0}`,
      };
    }

    switch (state.phase) {
      case "INTRO":
        return { statusText: "Decora a tua cartela — o sorteio vai começar!" };
      case "DRAWING": {
        const drawn = drawnSet(state);
        const cells: NonNullable<BingoPrivateView["cells"]> = [];
        for (let r = 0; r < GRID; r++) {
          for (let c = 0; c < GRID; c++) {
            const v = card[r]![c]!;
            cells.push({
              id: `${r}-${c}`,
              label: v === null ? "FREE" : String(v),
              marked: state.marked[playerId]![r]![c]!,
            });
          }
        }

        const claimable: NonNullable<BingoPrivateView["claimable"]> = [];
        if (hasValidLine(card, drawn) && linePrizesLeft(state) > 0) {
          claimable.push({ kind: "line", label: `Linha! +${LINE_POINTS}` });
        }
        if (isFullHouse(card, drawn)) {
          claimable.push({ kind: "fullhouse", label: `Cartela cheia! +${FULLHOUSE_POINTS}` });
        }

        return {
          cells,
          ...(claimable.length > 0 ? { claimable } : {}),
          statusText:
            claimable.length > 0
              ? "Tens bingo para reclamar!"
              : `Último número: ${state.drawn[state.drawn.length - 1] ?? 0}`,
        };
      }
      case "GAME_RESULT":
        return { statusText: `Fim do jogo — ${nicknameOf(ctx, playerId)}: ${state.totals[playerId] ?? 0} pontos` };
    }
  },

  validateAction(state, action, actor) {
    if (actor.role !== "player") {
      return { ok: false, code: "FORBIDDEN", reason: "spectators cannot act" };
    }
    switch (action.type) {
      case "MARK": {
        if (state.phase !== "DRAWING") return { ok: false, code: "BAD_PHASE" };
        const p = (isPlainObject(action.payload) ? action.payload : {}) as {
          row?: unknown;
          col?: unknown;
        };
        const row = p.row;
        const col = p.col;
        if (
          typeof row !== "number" ||
          typeof col !== "number" ||
          !Number.isInteger(row) ||
          !Number.isInteger(col) ||
          row < 0 ||
          row >= GRID ||
          col < 0 ||
          col >= GRID
        ) {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "row/col must be integers 0..4" };
        }
        if (!state.cards[actor.playerId]) {
          return { ok: false, code: "FORBIDDEN", reason: "no card for this player" };
        }
        const value = state.cards[actor.playerId]![row]![col];
        if (value === null) {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "cannot mark the FREE cell" };
        }
        if (!state.drawn.includes(value)) {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "number not drawn yet" };
        }
        // marking an already-marked cell is idempotent ⇒ still ok
        return { ok: true };
      }
      case "CLAIM": {
        if (state.phase !== "DRAWING") return { ok: false, code: "BAD_PHASE" };
        const kind = (action.payload as { kind?: unknown })?.kind;
        if (kind !== "line" && kind !== "fullhouse") {
          return { ok: false, code: "INVALID_PAYLOAD", reason: 'kind must be "line"|"fullhouse"' };
        }
        if (!state.cards[actor.playerId]) {
          return { ok: false, code: "FORBIDDEN", reason: "no card for this player" };
        }
        const drawn = drawnSet(state);
        const card = state.cards[actor.playerId]!;
        if (kind === "line") {
          if (!hasValidLine(card, drawn)) {
            return { ok: false, code: "FORBIDDEN", reason: "no completed line on your card" };
          }
          if (linePrizesLeft(state) <= 0) {
            return { ok: false, code: "FORBIDDEN", reason: "line prizes already claimed" };
          }
        } else if (!isFullHouse(card, drawn)) {
          return { ok: false, code: "FORBIDDEN", reason: "your card is not full yet" };
        }
        return { ok: true };
      }
      default:
        return { ok: false, code: "INVALID_PAYLOAD" };
    }
  },

  reduce(state, action, actor, ctx) {
    switch (action.type) {
      case "MARK": {
        const { row, col } = action.payload;
        if (state.marked[actor.playerId]![row]![col]) return state; // idempotent no-op
        // copy the nested arrays before writing (states are never mutated)
        const marked: Record<string, boolean[][]> = {
          ...state.marked,
          [actor.playerId]: state.marked[actor.playerId]!.map((r, ri) =>
            ri === row ? r.map((m, ci) => (ci === col ? true : m)) : [...r],
          ),
        };
        return { ...state, marked };
      }
      case "CLAIM":
        return action.payload.kind === "line"
          ? claimLine(state, actor.playerId, ctx)
          : claimFullHouse(state, actor.playerId, ctx);
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
      case "INTRO":
        return startDrawing(state, ctx, now);
      case "DRAWING": {
        if (state.remaining.length === 0 || state.drawn.length >= NUMBERS_TOTAL) {
          return finish(state);
        }
        // one automatic draw per interval, straight from the seeded tumbler
        const value = ctx.rng.pick(state.remaining);
        const next: LiveBingoState = {
          ...state,
          drawn: [...state.drawn, value],
          remaining: state.remaining.filter((n) => n !== value),
        };
        return next.drawn.length >= NUMBERS_TOTAL ? finish(next) : scheduleDraw(next, ctx, now);
      }
      default:
        return state;
    }
  },

  isFinished(state) {
    return state.phase === "GAME_RESULT"; // fullhouse claimed or pool exhausted
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
        ? Object.fromEntries(winners.map((id) => [id, "🏆 Rei do Bingo"]))
        : undefined,
      awards:
        winners.length === 1
          ? [{ kind: "winner", label: "Cartela mais sortuda da noite", playerIds: winners }]
          : winners.length > 1
            ? [{ kind: "tie", label: "Empate no topo", playerIds: winners }]
            : undefined,
    };
  },

  serialize(state) {
    return JSON.parse(JSON.stringify(state));
  },

  deserialize(value) {
    return value as LiveBingoState;
  },
});

export default liveBingoPlugin;

/* ---------------- transitions (pure) ---------------- */

/** First/second valid line claim ⇒ +150 while prizes last (validated earlier). */
function claimLine(state: LiveBingoState, playerId: string, ctx: GameContext): LiveBingoState {
  return {
    ...state,
    totals: { ...state.totals, [playerId]: (state.totals[playerId] ?? 0) + LINE_POINTS },
    prizes: [
      ...state.prizes,
      { kind: "line", playerId, nickname: nicknameOf(ctx, playerId) },
    ],
  };
}

/** Valid fullhouse ⇒ +400 and the game ends immediately. */
function claimFullHouse(state: LiveBingoState, playerId: string, ctx: GameContext): LiveBingoState {
  return finish({
    ...state,
    totals: { ...state.totals, [playerId]: (state.totals[playerId] ?? 0) + FULLHOUSE_POINTS },
    prizes: [
      ...state.prizes,
      { kind: "fullhouse", playerId, nickname: nicknameOf(ctx, playerId) },
    ],
  });
}

function startDrawing(state: LiveBingoState, ctx: GameContext, now: number): LiveBingoState {
  return scheduleDraw(
    { ...state, phase: "DRAWING", phaseLabel: "Sorteio em curso…" },
    ctx,
    now,
  );
}

function scheduleDraw(state: LiveBingoState, ctx: GameContext, now: number): LiveBingoState {
  return { ...state, deadlineAt: now + settingsFrom(ctx).drawIntervalMs };
}

function finish(state: LiveBingoState): LiveBingoState {
  return { ...state, phase: "GAME_RESULT", phaseLabel: "Fim do jogo", deadlineAt: undefined };
}

/* ---------------- view helpers ---------------- */

function scoreboardOf(
  state: LiveBingoState,
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
