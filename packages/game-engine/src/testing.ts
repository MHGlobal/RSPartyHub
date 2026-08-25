import type { Actor } from "@rs-party/protocol";
import { FakeClock } from "./clock.js";
import { SeededRng } from "./rng.js";
import type {
  GameContext,
  GameSettingsValues,
  PartyGamePlugin,
  RoomPlayerRef,
  ScoreResult,
} from "./types.js";

/**
 * Headless harness used by unit tests to drive any plugin deterministically
 * (spec §31.1, etapa 10 "fake clock").
 */
export class GameHarness<State extends import("./types.js").GameBaseState> {
  readonly clock = new FakeClock();
  rng: SeededRng;
  ctx: GameContext;
  state: State;

  constructor(
    readonly plugin: PartyGamePlugin<State, any, any, any>,
    opts: {
      players?: RoomPlayerRef[];
      settings?: GameSettingsValues;
      seed?: number;
    } = {},
  ) {
    const players: RoomPlayerRef[] =
      opts.players ??
      Array.from({ length: plugin.manifest.minPlayers }, (_, i) => ({
        playerId: `p${i + 1}`,
        nickname: `Player${i + 1}`,
        role: "player" as const,
      }));
    this.rng = new SeededRng(opts.seed ?? 42);
    this.ctx = {
      roomId: "ROOM",
      players,
      settings: opts.settings ?? {},
      rng: this.rng,
      clock: this.clock,
      announce: () => {}, // tests can spy via override
    };
    this.state = plugin.createInitialState(this.ctx);
  }

  actor(playerId: string): Actor {
    return { playerId, role: this.isPlayer(playerId) ? "player" : "host" };
  }

  isPlayer(playerId: string): boolean {
    return this.ctx.players.some((p) => p.playerId === playerId && p.role === "player");
  }

  validate(actionType: string, payload: unknown, playerId = "p1") {
    return this.plugin.validateAction(this.state, { type: actionType, payload } as any, this.actor(playerId), this.ctx);
  }

  act(actionType: string, payload: unknown, playerId = "p1"): State {
    const action = { type: actionType, payload } as any;
    const v = this.plugin.validateAction(this.state, action, this.actor(playerId), this.ctx);
    if (!v.ok) throw new Error(`action rejected: ${v.code} ${v.reason ?? ""}`);
    this.state = this.plugin.reduce(this.state, action, this.actor(playerId), this.ctx);
    this.runTick();
    return this.state;
  }

  tryAct(actionType: string, payload: unknown, playerId = "p1"):
    | { ok: true; state: State }
    | { ok: false; code: string; reason?: string } {
    const action = { type: actionType, payload } as any;
    const v = this.plugin.validateAction(this.state, action, this.actor(playerId), this.ctx);
    if (!v.ok) return { ok: false, code: v.code, reason: v.reason };
    this.state = this.plugin.reduce(this.state, action, this.actor(playerId), this.ctx);
    this.runTick();
    return { ok: true, state: this.state };
  }

  runTick(): void {
    if (!this.plugin.tick) return;
    let guard = 0;
    while (guard++ < 10_000) {
      const next = this.plugin.tick(this.state, this.clock.now(), this.ctx);
      if (next === undefined || next === this.state) break;
      this.state = next;
    }
  }

  /** Repeatedly ticks until predicate holds or the step budget is exhausted. */
  runTickUntil(predicate: (state: State) => boolean, maxSteps = 64): void {
    if (!this.plugin.tick) return;
    let guard = 0;
    while (guard++ < maxSteps && !predicate(this.state)) {
      const next = this.plugin.tick(this.state, this.clock.now(), this.ctx);
      if (next === undefined || next === this.state) {
        // no progress at current time — stop to avoid infinite loop
        break;
      }
      this.state = next;
    }
  }

  advanceTime(ms: number): void {
    this.clock.advance(ms);
    this.runTick();
  }

  publicView() {
    return this.plugin.getPublicView(this.state, this.ctx);
  }

  privateView(playerId: string) {
    return this.plugin.getPrivateView(this.state, playerId, this.ctx);
  }

  finished(): boolean {
    return this.plugin.isFinished(this.state, this.ctx);
  }

  score(): ScoreResult {
    return this.plugin.score(this.state, this.ctx);
  }
}
