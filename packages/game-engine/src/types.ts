import type { Actor, ErrorCode, GameManifest } from "@rs-party/protocol";
import type { SeededRng } from "./rng.js";
import type { GameClock } from "./clock.js";

/**
 * Minimal base every game state extends.
 * Runtime relies on these fields for snapshot assembly (spec §10.4).
 */
export interface GameBaseState {
  /** semantic machine phase, e.g. "ACTIVE" */
  phase: string;
  /** human label shown on host stage */
  phaseLabel: string;
  /** absolute epoch ms; undefined when untimed */
  deadlineAt?: number;
  paused?: boolean;
  roundNumber: number;
  roundTotal: number;
}

export interface RoomPlayerRef {
  playerId: string;
  nickname: string;
  role: "player" | "spectator";
}

export interface GameSettingsValues {
  [key: string]: number | boolean | string;
}

/**
 * Ports provided by the engine. Plugins never touch sockets or DB
 * directly (spec §11 preamble).
 */
export interface GameContext {
  roomId: string;
  players: readonly RoomPlayerRef[];
  settings: Readonly<GameSettingsValues>;
  rng: SeededRng;
  clock: GameClock;
  /** server-driven announcement to all clients */
  announce(level: "info" | "success" | "error", text: string): void;
}

export type ValidationResult =
  | { ok: true }
  | { ok: false; code: ErrorCode; reason?: string };

export interface RoundScoreRow {
  playerId: string;
  delta: number;
}

export interface ScoreResult {
  /** per-round deltas applied by the runtime */
  roundScores: RoundScoreRow[];
  /** final titles, e.g. winner */
  titles?: Record<string, string>;
  awards?: { kind: string; label: string; playerIds: string[] }[];
}

/**
 * Contract every minijogo implements (spec §11).
 * State transitions are pure; randomness comes only from ctx.rng.
 */
export interface PartyGamePlugin<
  State extends GameBaseState = GameBaseState,
  PublicView = unknown,
  PrivateView = unknown,
  Action = unknown,
> {
  manifest: GameManifest;

  createInitialState(ctx: GameContext): State;
  getPublicView(state: State, ctx: GameContext): PublicView;
  getPrivateView(state: State, playerId: string, ctx: GameContext): PrivateView;
  validateAction(
    state: State,
    action: Action,
    actor: Actor,
    ctx: GameContext,
  ): ValidationResult;
  reduce(state: State, action: Action, actor: Actor, ctx: GameContext): State;
  /**
   * Advance time-based transitions. CONTRACT: when nothing changes, return
   * the SAME reference (never undefined). Runtime and harness detect progress
   * by identity comparison — a new object means "state changed".
   */
  tick?(state: State, now: number, ctx: GameContext): State;
  isFinished(state: State, ctx: GameContext): boolean;
  score(state: State, ctx: GameContext): ScoreResult;
  serialize(state: State): unknown;
  deserialize(value: unknown): State;
}

/** Helper to build typed plugins without repeating generics everywhere. */
export function defineGame<
  S extends GameBaseState,
  P,
  V,
  A,
>(plugin: PartyGamePlugin<S, P, V, A>): PartyGamePlugin<S, P, V, A> {
  return plugin;
}
