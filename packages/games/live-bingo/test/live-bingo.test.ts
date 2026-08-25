import { describe, expect, it } from "vitest";
import { GameHarness } from "@rs-party/game-engine";
import type { RoomPlayerRef } from "@rs-party/game-engine";
import liveBingoPlugin from "../src/index.js";
import type { LiveBingoState } from "../src/index.js";

const INTRO_MS = 2000;
const INTERVAL = 2500;

/** Unwrap a ValidationResult for assertions (undefined when ok). */
function codeOf(r: { ok: true } | { ok: false; code: string }): string | undefined {
  return r.ok ? undefined : r.code;
}

function players(n: number): RoomPlayerRef[] {
  return Array.from({ length: n }, (_, i) => ({
    playerId: `p${i + 1}`,
    nickname: `Player${i + 1}`,
    role: "player" as const,
  }));
}

function makeHarness(opts?: {
  playerCount?: number;
  seed?: number;
  withSpectator?: boolean;
}) {
  const roster = [...players(opts?.playerCount ?? 3)];
  if (opts?.withSpectator) {
    roster.push({ playerId: "spec", nickname: "Spectator", role: "spectator" });
  }
  return new GameHarness<LiveBingoState>(liveBingoPlugin, {
    players: roster,
    settings: { drawIntervalMs: INTERVAL },
    seed: opts?.seed ?? 1234,
  });
}

/* --------- deterministic fixture: every card equals numbers 1..24 --------- */

function fixtureCard(): (number | null)[][] {
  return [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, null, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
  ];
}

function fixtureMarked(): boolean[][] {
  return Array.from({ length: 5 }, (_, r) =>
    Array.from({ length: 5 }, (_, c) => r === 2 && c === 2),
  );
}

/** Replace random cards/pool with a fully predictable fixture (test setup only). */
function installFixture(h: ReturnType<typeof makeHarness>) {
  const ids = h.ctx.players.filter((p) => p.role === "player").map((p) => p.playerId);
  h.state = {
    ...h.state,
    cards: Object.fromEntries(ids.map((id) => [id, fixtureCard()])),
    marked: Object.fromEntries(ids.map((id) => [id, fixtureMarked()])),
    remaining: Array.from({ length: 24 }, (_, i) => i + 1),
  };
}

/** INTRO → DRAWING at the current clock position. */
function enterDrawing(h: ReturnType<typeof makeHarness>) {
  h.clock.advance(INTRO_MS + 100);
  h.runTickUntil((s) => s.phase === "DRAWING");
  expect(h.state.phase).toBe("DRAWING");
  expect(h.state.drawn).toEqual([]);
}

/** Advance exactly one draw interval ⇒ exactly one new number. */
function stepDraw(h: ReturnType<typeof makeHarness>): number | undefined {
  const before = h.state.drawn.length;
  h.clock.advance(INTERVAL + 100);
  h.runTickUntil((s) => s.drawn.length > before || s.phase !== "DRAWING");
  return h.state.drawn[h.state.drawn.length - 1];
}

function drawUntilCount(h: ReturnType<typeof makeHarness>, target: number) {
  while (h.state.drawn.length < target && h.state.phase === "DRAWING") {
    stepDraw(h);
  }
}

/** True when any of the 12 lines of `card` is fully contained in `drawn`. */
function anyLineComplete(card: (number | null)[][], drawn: number[]): boolean {
  const set = new Set(drawn);
  const lines: Array<Array<[number, number]>> = [];
  for (let i = 0; i < 5; i++) {
    lines.push([0, 1, 2, 3, 4].map((j) => [i, j] as [number, number]));
    lines.push([0, 1, 2, 3, 4].map((j) => [j, i] as [number, number]));
  }
  lines.push([0, 1, 2, 3, 4].map((i) => [i, i] as [number, number]));
  lines.push([0, 1, 2, 3, 4].map((i) => [i, 4 - i] as [number, number]));
  return lines.some((line) =>
    line.every(([r, c]) => card[r]![c] === null || set.has(card[r]![c] as number)),
  );
}

describe("Live Bingo — spec §14.3 minimum test set", () => {
  it("generates deterministic seeded cards (5×5, 24 unique numbers, FREE centre)", () => {
    const a = makeHarness({ playerCount: 3, seed: 1234 });
    const b = makeHarness({ playerCount: 3, seed: 1234 });
    expect(a.state.cards).toEqual(b.state.cards);

    for (const pid of ["p1", "p2", "p3"]) {
      const card = a.state.cards[pid]!;
      expect(card).toHaveLength(5);
      const flat = card.flat();
      expect(flat[2 * 5 + 2]).toBeNull(); // centre FREE
      const numbers = flat.filter((v): v is number => v !== null);
      expect(numbers).toHaveLength(24);
      expect(new Set(numbers).size).toBe(24);
      for (const n of numbers) {
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(50);
      }
      // centre starts marked, everything else unmarked
      const m = a.state.marked[pid]!;
      expect(m.flat().filter(Boolean)).toHaveLength(1);
      expect(m[2]![2]).toBe(true);
    }
  });

  it("marks a drawn number on your own card; re-marking is an idempotent no-op", () => {
    const h = makeHarness({ playerCount: 3 });
    installFixture(h);
    enterDrawing(h);
    drawUntilCount(h, 3);

    // locate a cell whose number was drawn
    const drawnSet = new Set(h.state.drawn);
    let target: { row: number; col: number; value: number } | null = null;
    const card = h.state.cards["p1"]!;
    for (let r = 0; r < 5 && !target; r++) {
      for (let c = 0; c < 5; c++) {
        const v = card[r]![c];
        if (v !== null && drawnSet.has(v)) {
          target = { row: r, col: c, value: v };
          break;
        }
      }
    }
    expect(target).not.toBeNull();
    const t = target!;

    h.act("MARK", { row: t.row, col: t.col }, "p1");
    expect(h.state.marked["p1"]![t.row]![t.col]).toBe(true);

    // idempotent: ok, no error, SAME state reference
    const before = h.state;
    expect(h.tryAct("MARK", { row: t.row, col: t.col }, "p1").ok).toBe(true);
    expect(h.state).toBe(before);
  });

  it("rejects bad marks: wrong phase, junk payload, undrawn numbers, spectators", () => {
    const h = makeHarness({ playerCount: 3, withSpectator: true });
    expect(codeOf(h.validate("MARK", { row: 0, col: 0 }, "p1"))).toBe("BAD_PHASE"); // INTRO

    installFixture(h);
    enterDrawing(h);
    expect(codeOf(h.validate("MARK", { row: 0, col: 0 }, "spec"))).toBe("FORBIDDEN");
    expect(codeOf(h.validate("MARK", {}, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("MARK", { row: 1.5, col: 0 }, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("MARK", { row: 5, col: 0 }, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("MARK", { row: -1, col: 0 }, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("MARK", { row: "0", col: 0 }, "p1"))).toBe("INVALID_PAYLOAD");
    expect(codeOf(h.validate("MARK", { row: 2, col: 2 }, "p1"))).toBe("INVALID_PAYLOAD"); // FREE cell

    // nothing drawn yet ⇒ every number is "not drawn yet"
    expect(codeOf(h.validate("MARK", { row: 0, col: 0 }, "p1"))).toBe("INVALID_PAYLOAD");

    // host has no card and no player role
    expect(codeOf(h.validate("CLAIM", { kind: "line" }, "spec"))).toBe("FORBIDDEN");
    expect(h.validate("SHOUT", {}).ok).toBe(false);
  });

  it("auto-draws one number per interval and exposes only the last 12 publicly", () => {
    const h = makeHarness({ playerCount: 3 });
    installFixture(h);
    enterDrawing(h);

    let pub = h.publicView() as { drawn: number[]; drawnCount: number; lastNumber: number };
    expect(pub.drawnCount).toBe(0);
    expect(pub.lastNumber).toBe(0);

    const first = stepDraw(h);
    expect(h.state.drawn).toEqual([first]);
    pub = h.publicView() as typeof pub;
    expect(pub.lastNumber).toBe(first);

    drawUntilCount(h, 15);
    pub = h.publicView() as typeof pub;
    expect(pub.drawnCount).toBe(15);
    expect(pub.drawn).toEqual(h.state.drawn.slice(-12));
    expect(pub.drawn).toHaveLength(12);

    // secrecy of the tumbler: no undrawn number appears anywhere in the view
    const pubJson = JSON.stringify(pub);
    for (const n of h.state.remaining) {
      expect(pub.drawn).not.toContain(n);
      expect(pub.lastNumber).not.toBe(n);
    }
    // and the view never embeds other players' cards
    expect(pubJson.includes('"cards"')).toBe(false);
    expect(pubJson.includes('"cells"')).toBe(false);

    // spectator gets status text but never cells
    const specView = h.privateView("spec") as { cells?: unknown };
    expect(specView.cells).toBeUndefined();
  });

  it("awards the two line prizes server-side and forbids a third claim", () => {
    const h = makeHarness({ playerCount: 4 });
    installFixture(h);
    enterDrawing(h);

    expect(codeOf(h.validate("CLAIM", { kind: "line" }, "p1"))).toBe("FORBIDDEN"); // nothing drawn
    expect((h.privateView("p1") as { claimable?: unknown }).claimable).toBeUndefined();

    // wait for the top row {1..5} to be fully drawn (≤ 24 draws)
    const need = new Set([1, 2, 3, 4, 5]);
    let guard = 0;
    while (![...need].every((n) => h.state.drawn.includes(n)) && guard++ < 30) {
      stepDraw(h);
    }
    expect([...need].every((n) => h.state.drawn.includes(n))).toBe(true);
    expect(anyLineComplete(h.state.cards["p1"]!, h.state.drawn)).toBe(true);

    // claimable appears only now that the player is eligible
    const view = h.privateView("p1") as { claimable?: Array<{ kind: string }> };
    expect(view.claimable?.map((c) => c.kind)).toContain("line");

    h.act("CLAIM", { kind: "line" }, "p1");
    expect(h.state.totals["p1"]).toBe(150);
    h.act("CLAIM", { kind: "line" }, "p2");
    expect(h.state.totals["p2"]).toBe(150);
    expect(codeOf(h.validate("CLAIM", { kind: "line" }, "p3"))).toBe("FORBIDDEN"); // prizes gone
    expect((h.privateView("p3") as { claimable?: unknown }).claimable).toBeUndefined();

    expect(h.state.prizes.map((p) => `${p.kind}:${p.nickname}`)).toEqual([
      "line:Player1",
      "line:Player2",
    ]);
  });

  it("finishes instantly on a valid fullhouse claim (+400) and locks further actions", () => {
    const h = makeHarness({ playerCount: 3 });
    installFixture(h);
    enterDrawing(h);
    drawUntilCount(h, 24); // whole fixture pool drained ⇒ everyone's card is full

    const view = h.privateView("p1") as { claimable?: Array<{ kind: string }> };
    expect(view.claimable?.map((c) => c.kind)).toContain("fullhouse");

    h.act("CLAIM", { kind: "fullhouse" }, "p1");
    expect(h.state.totals["p1"]).toBe(400);
    expect(h.state.phase).toBe("GAME_RESULT");
    expect(h.finished()).toBe(true);
    expect(h.state.deadlineAt).toBeUndefined();

    expect(codeOf(h.tryAct("CLAIM", { kind: "fullhouse" }, "p2"))).toBe("BAD_PHASE");
    const s = h.score();
    // only actual scorers appear in roundScores (same contract as bluff-battle)
    expect(Object.fromEntries(s.roundScores.map((r) => [r.playerId, r.delta]))).toEqual({
      p1: 400,
    });
    expect(Object.keys(s.titles ?? {})).toEqual(["p1"]);
  });

  it("accumulates line + fullhouse into the final scoreboard", () => {
    const h = makeHarness({ playerCount: 3 });
    installFixture(h);
    enterDrawing(h);

    const need = new Set([1, 2, 3, 4, 5]);
    let guard = 0;
    while (![...need].every((n) => h.state.drawn.includes(n)) && guard++ < 30) {
      stepDraw(h);
    }
    h.act("CLAIM", { kind: "line" }, "p1");
    h.act("CLAIM", { kind: "line" }, "p2");

    drawUntilCount(h, 24);
    h.act("CLAIM", { kind: "fullhouse" }, "p1"); // 150 + 400

    const s = h.score();
    const deltas = Object.fromEntries(s.roundScores.map((r) => [r.playerId, r.delta]));
    expect(deltas["p1"]).toBe(550);
    expect(deltas["p2"]).toBe(150);
    expect(Object.keys(s.titles ?? {})).toEqual(["p1"]);
    expect(h.state.prizes.map((p) => p.kind)).toEqual(["line", "line", "fullhouse"]);

    const pub = h.publicView() as { prizes: Array<{ kind: string; nickname: string }> };
    expect(pub.prizes.map((p) => p.nickname)).toEqual([
      "Player1",
      "Player2",
      "Player1",
    ]);
  });

  it("ends the game when the 50-number pool is exhausted", () => {
    const h = makeHarness({ playerCount: 2 }); // real random cards, real pool 1..50
    enterDrawing(h);
    let guard = 0;
    while (h.state.phase === "DRAWING" && guard++ < 60) stepDraw(h);

    expect(h.state.phase).toBe("GAME_RESULT");
    expect(h.state.drawn).toHaveLength(50);
    expect(new Set(h.state.drawn).size).toBe(50);
    expect(h.finished()).toBe(true);
    expect(h.score().titles).toBeUndefined(); // nobody claimed anything
  });

  it("declares its manifest contract (grid controller, immediate lateJoin, bounds)", () => {
    expect(liveBingoPlugin.manifest.id).toBe("live-bingo");
    expect(liveBingoPlugin.manifest.controllers).toEqual(["grid"]);
    expect(liveBingoPlugin.manifest.lateJoin).toBe("immediate");
    expect(liveBingoPlugin.manifest.minPlayers).toBe(2);
    expect(liveBingoPlugin.manifest.maxPlayers).toBe(50);
    expect(liveBingoPlugin.manifest.priority).toBe("P0");
    const interval = liveBingoPlugin.manifest.settings.find(
      (s) => s.key === "drawIntervalMs",
    )!;
    expect([interval.default, interval.min, interval.max]).toEqual([2500, 1000, 6000]);
  });
});
