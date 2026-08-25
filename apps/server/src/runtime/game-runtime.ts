/**
 * Game runtime — owns one live GameInstance per room.
 * Bridges the pure plugin contract (spec §11) with timers and persistence.
 * Plugins never touch sockets/DB (spec §11 preamble); this class is the bridge.
 */
import type {
  GameBaseState,
  GameContext,
  PartyGamePlugin,
} from "@rs-party/game-engine";
import { RealClock, SeededRng } from "@rs-party/game-engine";
import type { GameInstanceRepository } from "@rs-party/persistence";
import { newId } from "@rs-party/protocol";

export interface RuntimePlayerRef {
  playerId: string;
  nickname: string;
  role: "player" | "spectator";
}

export interface RuntimeActionError extends Error {
  code?: string;
}

export class GameRuntime {
  private timer?: ReturnType<typeof setInterval>;
  private done = false;
  instanceId: string;

  constructor(
    readonly plugin: PartyGamePlugin,
    roomId: string,
    seed: number,
    private readonly games: GameInstanceRepository,
    private readonly playersProvider: () => RuntimePlayerRef[],
    private readonly settingsProvider: () => Record<string, number | boolean | string>,
    private readonly announce: (level: "info" | "success" | "error", text: string) => void,
    private readonly onFinished: (state: GameBaseState) => void,
    private readonly onStateChange?: () => void,
    existingInstanceId?: string,
  ) {
    this.instanceId = existingInstanceId ?? newId("game");
    this.roomId = roomId;

    if (existingInstanceId) {
      this.instanceId = existingInstanceId;
      const row = games.byId(existingInstanceId);
      if (!row) throw new Error(`missing game instance ${existingInstanceId}`);
      const restored = plugin.deserialize(JSON.parse(row.state_json)) as GameBaseState & {
        __rng?: { s: number };
      };
      const rng = new SeededRng(restored.__rng ?? row.seed);
      delete (restored as { __rng?: unknown }).__rng;
      this.rng = rng;
      this.state = restored;
    } else {
      const row = games.create({
        pluginId: plugin.manifest.id,
        roomId,
        seed,
        now: Date.now(),
      });
      this.instanceId = row.id;
      this.rng = new SeededRng(seed);
      this.state = plugin.createInitialState(this.ctx);
    }

    this.persist();
    this.timer = setInterval(() => this.sweep(), 250);
    // don't keep the process alive just for sweeps
    this.timer.unref?.();
  }

  state: GameBaseState;
  private rng: SeededRng;
  readonly roomId: string;

  /** Fresh context each call — always reflects current membership/settings. */
  get ctx(): GameContext {
    return {
      roomId: this.roomId,
      players: this.playersProvider(),
      settings: this.settingsProvider(),
      rng: this.rng,
      clock: new RealClock(),
      announce: this.announce,
    };
  }

  get finished(): boolean {
    return this.done || this.plugin.isFinished(this.state, this.ctx);
  }

  validateOrThrow(action: { type: string; payload: unknown }, actor: { playerId: string; role: string }): void {
    const v = this.plugin.validateAction(
      this.state,
      action as never,
      actor as never,
      this.ctx,
    );
    if (!v.ok) {
      const err = new Error(v.reason ?? v.code) as RuntimeActionError;
      err.code = v.code;
      throw err;
    }
  }

  applyAction(action: { type: string; payload: unknown }, actor: { playerId: string; role: string }): void {
    this.validateOrThrow(action, actor);
    this.state = this.plugin.reduce(
      this.state,
      action as never,
      actor as never,
      this.ctx,
    );
    this.persist();
    this.onStateChange?.();
  }

  /** Periodic advance for deadline-driven phases (spec §11.3). */
  sweep(): void {
    if (this.done) return;
    try {
      const now = Date.now();
      const ticked = this.plugin.tick?.(this.state, now, this.ctx);
      if (ticked !== undefined && ticked !== this.state) {
        this.state = ticked;
        this.persist();
        this.onStateChange?.();
      }
      if (!this.done && this.plugin.isFinished(this.state, this.ctx)) {
        this.finishEarly();
      }
    } catch {
      // a throwing tick must never crash the server loop
    }
  }

  finishEarly(): void {
    if (this.done) return;
    this.done = true;
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
    try {
      const result = this.plugin.score(this.state, this.ctx);
      this.games.update(this.instanceId, {
        ended_at: Date.now(),
        result_json: JSON.stringify(result),
      });
    } finally {
      this.onFinished(this.state);
    }
  }

  /**
   * Silent teardown — stops the sweep timer WITHOUT scoring or firing
   * onFinished. Used when the host abandons the game (return-to-lobby):
   * an orphaned timer would keep persisting and could resolve the NEXT
   * game prematurely via a stale onGameFinished callback.
   */
  dispose(): void {
    this.done = true;
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  score() {
    return this.plugin.score(this.state, this.ctx);
  }

  persist(): void {
    const serializable = this.state as GameBaseState & { __rng?: { s: number } };
    serializable.__rng = this.rng.serialize();
    this.games.update(this.instanceId, {
      phase: this.state.phase,
      round_number: this.state.roundNumber,
      round_total: this.state.roundTotal,
      state_json: JSON.stringify(serializable),
    });
  }
}
