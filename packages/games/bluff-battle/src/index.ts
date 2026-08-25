/**
 * Bluff Battle — escreve bluffs plausíveis e encontra a verdade (spec §14.5, P0).
 * O servidor mistura a resposta correta com os bluffs, filtra duplicados
 * (case/acento-insensitive; duplicados exatos são descartados sem penalização)
 * e todos votam. Transições puras — estados aninhados são sempre copiados.
 */
import { defineGame } from "@rs-party/game-engine";
import type {
  GameBaseState,
  GameContext,
  PartyGamePlugin,
  ScoreResult,
} from "@rs-party/game-engine";
import type { Actor, GameManifest } from "@rs-party/protocol";
import { promptBank } from "./bank.js";

/* ---------------- types ---------------- */

export interface BluffPrompt {
  id: string;
  prompt: string;
  correctText: string;
}

interface DiscardedSub {
  authorId: string;
  text: string;
}

/** One revealed row of the ROUND_RESULT table (server-side ids → views map). */
export interface RevealEntry {
  text: string;
  /** null for the correct answer */
  authorId: string | null;
  voters: string[];
  /** duplicates dropped before voting (no penalty) */
  discarded?: boolean;
}

export interface BluffBattleState extends GameBaseState {
  phase: "ROUND_PREP" | "WRITING" | "VOTING" | "ROUND_RESULT" | "GAME_RESULT";
  promptIds: string[];
  current: number;
  /** playerId -> submitted bluff (one per round) */
  submissions: Record<string, string>;
  /** shuffled [correct + unique bluffs]; optionId = index as string */
  options: string[];
  /** parallel to options; null marks the correct answer */
  optionAuthors: (string | null)[];
  /** voterId -> optionId */
  votes: Record<string, string>;
  /** exact-duplicate submissions dropped before voting */
  discardedSubs: DiscardedSub[];
  lastRound?: {
    correctText: string;
    entries: RevealEntry[];
    deltas: Record<string, number>;
    impossibleBonusIds: string[];
  };
  totals: Record<string, number>;
}

export interface BluffPublicView {
  prompt: string | null;
  submittedCount: number;
  votedCount: number;
  playerCount: number;
  scoreboard: Array<{ playerId: string; nickname: string; total: number }>;
  /** only set during ROUND_RESULT reveal */
  reveal?: {
    correctText: string;
    submissions: Array<{
      text: string;
      authorNickname: string | null;
      voters: string[];
      discarded?: boolean;
    }>;
    impossibleBonusNicknames: string[];
  };
  finished: boolean;
  finalScores?: Array<{ playerId: string; total: number }>;
}

export interface BluffPrivateView {
  textInput?: boolean;
  textPlaceholder?: string;
  voteOptions?: Array<{ id: string; label: string }>;
  yourVote?: string | null;
  statusText?: string;
  disabledText?: string;
}

type BluffAction =
  | { type: "TEXT"; payload: { text: string } }
  | { type: "VOTE"; payload: { optionId: string } };

/* ---------------- timing & settings ---------------- */

const PREP_MS = 2000;
const RESULT_MS = 4000;

const CORRECT_POINTS = 100;
const BLUFF_VOTE_POINTS = 40;
const IMPOSSIBLE_BONUS = 60;

function settingsFrom(ctx: GameContext) {
  const s = ctx.settings;
  return {
    rounds: clampInt(Number(s.rounds ?? 4), 2, 10),
    writeSeconds: clampInt(Number(s.writeSeconds ?? 30), 10, 90),
    voteSeconds: clampInt(Number(s.voteSeconds ?? 20), 10, 60),
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

/** Sanitised free text: NFC, no control chars, trimmed, 1..80 chars. */
function sanitizeText(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let out = "";
  for (const ch of raw.normalize("NFC")) {
    if (!isControlCodePoint(ch.codePointAt(0)!)) out += ch;
  }
  const cleaned = out.trim();
  return cleaned.length >= 1 && cleaned.length <= 80 ? cleaned : null;
}

/** Case/accent-insensitive comparison key for duplicate detection (PT scope). */
function normText(s: string): string {
  let out = "";
  for (const ch of s.normalize("NFD")) {
    const c = ch.codePointAt(0)!;
    // drop combining diacritical marks (U+0300–U+036F) — enough for PT
    if (c >= 0x300 && c <= 0x36f) continue;
    out += ch;
  }
  return out.toLowerCase().trim();
}

function promptById(id: string): BluffPrompt {
  const found = promptBank.find((p) => p.id === id);
  return found ?? promptBank[0]!;
}

function nicknameOf(ctx: GameContext, playerId: string): string | null {
  return ctx.players.find((p) => p.playerId === playerId)?.nickname ?? null;
}

/* ---------------- plugin ---------------- */

export const bluffBattlePlugin: PartyGamePlugin<
  BluffBattleState,
  BluffPublicView,
  BluffPrivateView,
  BluffAction
> & { manifest: GameManifest } = defineGame({
  manifest: {
    id: "bluff-battle",
    name: "Bluff Battle",
    description:
      "Escreve bluffes plausíveis, destapa mentiras e encontra a verdade.",
    minPlayers: 3,
    maxPlayers: 20,
    avgDurationMinutes: 9,
    tags: ["bluff", "party"],
    contentRating: "family",
    requiresBigScreen: true,
    supportsTableMode: false,
    lateJoin: "spectatorUntilRound",
    spectatorSupport: true,
    teamSupport: false,
    controllers: ["text", "vote"],
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
        key: "writeSeconds",
        label: "Segundos para escrever",
        kind: "number",
        default: 30,
        min: 10,
        max: 90,
        step: 5,
      },
      {
        key: "voteSeconds",
        label: "Segundos para votar",
        kind: "number",
        default: 20,
        min: 10,
        max: 60,
        step: 5,
      },
    ],
    priority: "P0",
  },

  createInitialState(ctx): BluffBattleState {
    const { rounds } = settingsFrom(ctx);
    // prompts without repetition within the match (bank ≥ max rounds)
    const shuffled = ctx.rng.shuffle(promptBank);
    const promptIds: string[] = [];
    for (let i = 0; i < rounds; i++) {
      promptIds.push(shuffled[i % shuffled.length]!.id);
    }
    return {
      phase: "ROUND_PREP",
      phaseLabel: "A preparar a ronda…",
      roundNumber: 1,
      roundTotal: rounds,
      deadlineAt: ctx.clock.now() + PREP_MS,
      promptIds,
      current: 0,
      submissions: {},
      options: [],
      optionAuthors: [],
      votes: {},
      discardedSubs: [],
      totals: {},
    };
  },

  getPublicView(state, ctx) {
    const playerCount = ctx.players.filter((p) => p.role === "player").length;
    const scoreboard = scoreboardOf(state, ctx);

    if (state.phase === "GAME_RESULT") {
      return {
        prompt: null,
        submittedCount: 0,
        votedCount: 0,
        playerCount,
        scoreboard,
        finished: true,
        finalScores: scoreboard.map((r) => ({ playerId: r.playerId, total: r.total })),
      };
    }

    const prompt = promptById(state.promptIds[state.current]).prompt;
    if (state.phase === "ROUND_RESULT") {
      const lr = state.lastRound!;
      return {
        prompt,
        submittedCount: Object.keys(state.submissions).length,
        votedCount: Object.keys(state.votes).length,
        playerCount,
        scoreboard,
        finished: false,
        // authors + correct answer are only exposed AFTER the vote (anti-cheat)
        reveal: {
          correctText: lr.correctText,
          submissions: lr.entries.map((e) => ({
            text: e.text,
            authorNickname: e.authorId ? nicknameOf(ctx, e.authorId) : null,
            voters: e.voters.map((id) => nicknameOf(ctx, id) ?? "?"),
            discarded: e.discarded,
          })),
          impossibleBonusNicknames: lr.impossibleBonusIds.map(
            (id) => nicknameOf(ctx, id) ?? "?",
          ),
        },
      };
    }

    // WRITING/VOTING/ROUND_PREP: never expose the correct text, options or authors
    return {
      prompt,
      submittedCount: Object.keys(state.submissions).length,
      votedCount: Object.keys(state.votes).length,
      playerCount,
      scoreboard,
      finished: false,
    };
  },

  getPrivateView(state, playerId, ctx) {
    const prompt = promptById(state.promptIds[state.current]);
    switch (state.phase) {
      case "ROUND_PREP":
        return {
          statusText: `Prepara-te para escrever o teu bluff sobre: ${prompt.prompt}`,
        };
      case "WRITING": {
        const submitted = state.submissions[playerId];
        if (submitted) {
          return {
            statusText: `"${submitted}" recebido — aguarda os outros`,
            disabledText: "Bluff submetido nesta ronda.",
          };
        }
        return {
          textInput: true,
          textPlaceholder: prompt.prompt,
          statusText: "Escreve uma mentira credível (1–80 caracteres)",
        };
      }
      case "VOTING": {
        const yourVote = state.votes[playerId] ?? null;
        return {
          voteOptions: state.options.map((text, i) => ({
            id: String(i),
            label: text,
          })),
          yourVote,
          statusText: yourVote
            ? "Voto registado — a aguardar os restantes"
            : "Qual será a resposta verdadeira?",
          disabledText: yourVote ? "Já votaste nesta ronda." : undefined,
        };
      }
      case "ROUND_RESULT": {
        const delta = state.lastRound?.deltas[playerId] ?? 0;
        return {
          statusText:
            delta > 0
              ? `Ganhaste ${delta} pontos esta ronda`
              : "Sem pontos esta ronda",
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
      case "TEXT": {
        if (state.phase !== "WRITING") return { ok: false, code: "BAD_PHASE" };
        if (sanitizeText((action.payload as { text?: unknown })?.text) === null) {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "text must be 1..80 chars" };
        }
        if (state.submissions[actor.playerId]) {
          return { ok: false, code: "DUPLICATE_ACTION", reason: "already submitted this round" };
        }
        return { ok: true };
      }
      case "VOTE": {
        if (state.phase !== "VOTING") return { ok: false, code: "BAD_PHASE" };
        const optionId = (action.payload as { optionId?: unknown })?.optionId;
        if (
          typeof optionId !== "string" ||
          !/^\d+$/.test(optionId) ||
          Number(optionId) >= state.options.length
        ) {
          return { ok: false, code: "INVALID_PAYLOAD", reason: "unknown optionId" };
        }
        if (state.votes[actor.playerId]) {
          return { ok: false, code: "DUPLICATE_ACTION", reason: "already voted this round" };
        }
        if (state.optionAuthors[Number(optionId)] === actor.playerId) {
          return { ok: false, code: "FORBIDDEN", reason: "cannot vote own bluff" };
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
        const next: BluffBattleState = {
          ...state,
          submissions: { ...state.submissions, [actor.playerId]: text },
        };
        const active = ctx.players.filter((p) => p.role === "player");
        if (active.every((p) => next.submissions[p.playerId])) {
          return closeWriting(next, ctx);
        }
        return next;
      }
      case "VOTE": {
        const optionId = String(action.payload.optionId);
        const next: BluffBattleState = {
          ...state,
          votes: { ...state.votes, [actor.playerId]: optionId },
        };
        const active = ctx.players.filter((p) => p.role === "player");
        if (active.every((p) => next.votes[p.playerId])) {
          return closeVoting(next, ctx);
        }
        return next;
      }
    }
  },

  /**
   * Returns the SAME state reference when nothing changed — the runtime
   * detects transitions by reference comparison, so this is the type-safe
   * equivalent of a "no-op" tick (PartyGamePlugin.tick cannot return
   * undefined per game-engine types).
   */
  tick(state, now, ctx) {
    if (state.deadlineAt === undefined || now < state.deadlineAt) return state;
    switch (state.phase) {
      case "ROUND_PREP":
        return {
          ...state,
          phase: "WRITING",
          phaseLabel: "Escreve o teu bluff!",
          deadlineAt: now + settingsFrom(ctx).writeSeconds * 1000,
        };
      case "WRITING":
        return closeWriting(state, ctx, now);
      case "VOTING":
        return closeVoting(state, ctx, now);
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
    const winners = sorted.filter((r) => r.delta === top).map((r) => r.playerId);
    return {
      roundScores,
      titles: winners.length
        ? Object.fromEntries(winners.map((id) => [id, "🏆 Mestre da Mentira"]))
        : undefined,
      awards:
        winners.length === 1
          ? [{ kind: "winner", label: "Melhor bluffer da partida", playerIds: winners }]
          : winners.length > 1
            ? [{ kind: "tie", label: "Empate no topo", playerIds: winners }]
            : undefined,
    };
  },

  serialize(state) {
    return JSON.parse(JSON.stringify(state));
  },

  deserialize(value) {
    return value as BluffBattleState;
  },
});

export default bluffBattlePlugin;

/* ---------------- transitions (pure) ---------------- */

/**
 * WRITING → VOTING (or straight to ROUND_RESULT when fewer than 2 distinct
 * bluffs survive dedup — then surviving authors earn the impossible bonus).
 */
function closeWriting(state: BluffBattleState, ctx: GameContext, now?: number): BluffBattleState {
  const prompt = promptById(state.promptIds[state.current]);
  const at = now ?? ctx.clock.now();

  // group submissions by normalised text to drop duplicates (no penalty)
  const groups = new Map<string, string[]>();
  for (const [playerId, text] of Object.entries(state.submissions)) {
    const key = normText(text);
    const list = groups.get(key) ?? [];
    list.push(playerId);
    groups.set(key, list);
  }

  const correctNorm = normText(prompt.correctText);
  const bluffs: Array<{ authorId: string; text: string }> = [];
  const discardedSubs: DiscardedSub[] = [];
  for (const [key, authorIds] of groups) {
    if (authorIds.length > 1 || key === correctNorm) {
      for (const authorId of authorIds) {
        discardedSubs.push({ authorId, text: state.submissions[authorId]! });
      }
      continue;
    }
    bluffs.push({ authorId: authorIds[0]!, text: state.submissions[authorIds[0]!]! });
  }

  const totals = { ...state.totals };

  // <2 distinct bluffs ⇒ skip voting; surviving authors get the bonus
  if (bluffs.length < 2) {
    for (const b of bluffs) {
      totals[b.authorId] = (totals[b.authorId] ?? 0) + IMPOSSIBLE_BONUS;
    }
    return {
      ...state,
      phase: "ROUND_RESULT",
      phaseLabel: "Resultado da ronda",
      deadlineAt: at + RESULT_MS,
      totals,
      discardedSubs,
      lastRound: {
        correctText: prompt.correctText,
        entries: [
          { text: prompt.correctText, authorId: null, voters: [] },
          ...bluffs.map((b) => ({ text: b.text, authorId: b.authorId, voters: [] })),
          ...discardedSubs.map((d) => ({
            text: d.text,
            authorId: d.authorId,
            voters: [],
            discarded: true,
          })),
        ],
        deltas: Object.fromEntries(bluffs.map((b) => [b.authorId, IMPOSSIBLE_BONUS])),
        impossibleBonusIds: bluffs.map((b) => b.authorId),
      },
    };
  }

  // shuffle [correct + bluffs] together so ids stay stable during voting
  const mixed: Array<{ text: string; authorId: string | null }> = ctx.rng.shuffle([
    { text: prompt.correctText, authorId: null },
    ...bluffs.map((b) => ({ text: b.text, authorId: b.authorId })),
  ]);

  return {
    ...state,
    phase: "VOTING",
    phaseLabel: "Encontra a verdade!",
    deadlineAt: at + settingsFrom(ctx).voteSeconds * 1000,
    options: mixed.map((m) => m.text),
    optionAuthors: mixed.map((m) => m.authorId),
    votes: {},
    discardedSubs,
  };
}

/** VOTING → ROUND_RESULT with scoring: correct +100, votes on your bluff +40. */
function closeVoting(state: BluffBattleState, ctx: GameContext, now?: number): BluffBattleState {
  const prompt = promptById(state.promptIds[state.current]);
  const at = now ?? ctx.clock.now();

  const deltas: Record<string, number> = {};
  const addDelta = (playerId: string, points: number) => {
    deltas[playerId] = (deltas[playerId] ?? 0) + points;
  };

  const entries: RevealEntry[] = state.options.map((text, index) => ({
    text,
    authorId: state.optionAuthors[index] ?? null,
    voters: [],
  }));

  for (const [voterId, optionId] of Object.entries(state.votes)) {
    const idx = Number(optionId);
    const entry = entries[idx];
    if (!entry) continue;
    entry.voters.push(voterId);
    if (entry.authorId === null) {
      addDelta(voterId, CORRECT_POINTS); // found the truth
    } else {
      addDelta(entry.authorId, BLUFF_VOTE_POINTS); // fooled someone
    }
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
      correctText: prompt.correctText,
      entries: [
        ...entries,
        ...state.discardedSubs.map((d) => ({
          text: d.text,
          authorId: d.authorId,
          voters: [],
          discarded: true,
        })),
      ],
      deltas,
      impossibleBonusIds: [],
    },
  };
}

function advanceRound(state: BluffBattleState, ctx: GameContext, now?: number): BluffBattleState {
  const at = now ?? ctx.clock.now();
  if (state.current + 1 >= state.promptIds.length) {
    return { ...state, phase: "GAME_RESULT", phaseLabel: "Fim do jogo", deadlineAt: undefined };
  }
  return {
    ...state,
    phase: "ROUND_PREP",
    phaseLabel: "A preparar a ronda…",
    current: state.current + 1,
    roundNumber: state.current + 2,
    submissions: {},
    options: [],
    optionAuthors: [],
    votes: {},
    discardedSubs: [],
    lastRound: undefined,
    deadlineAt: at + PREP_MS,
  };
}

/* ---------------- view helpers ---------------- */

function scoreboardOf(
  state: BluffBattleState,
  ctx: GameContext,
): Array<{ playerId: string; nickname: string; total: number }> {
  return ctx.players
    .filter((p) => p.role === "player")
    .map((p) => ({
      playerId: p.playerId,
      nickname: p.nickname,
      total: state.totals[p.playerId] ?? 0,
    }))
    .sort((a, b) => b.total - a.total);
}
