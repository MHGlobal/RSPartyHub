/**
 * Regression for review finding C1: the gateway must forward the REAL
 * actor role, so host-only actions (buzzer-arena JUDGE) work through the
 * actual socket stack, not just in unit harnesses.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  bootTestServer, type TestEnv,
  connect, emitAck, nextSnapshot,
  HOST_IDENTITY,
} from "./helpers.js";

let env: TestEnv;
beforeAll(async () => { env = await bootTestServer(); }, 30_000);
afterAll(async () => { await env?.cleanup(); });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function waitForPhase(socket: ReturnType<typeof connect> extends Promise<infer S> ? S : never, phase: string, maxMs = 15_000) {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    const snap = (await nextSnapshot(socket)) as { game?: { phase?: string } };
    if (snap.game?.phase === phase) return true;
    await sleep(250);
  }
  return false;
}

describe("host-role actions reach plugins (C1 regression)", () => {
  it("buzzer-arena: player buzzes, host JUDGES correct → +100 through real sockets", async () => {
    const host = await connect(env.url);
    const created = await emitAck(host, "room:create", { identity: HOST_IDENTITY });
    expect(created.accepted).toBe(true);
    const roomCode = (created.data as unknown as { roomCode: string }).roomCode;

    const p1 = await connect(env.url);
    const joined = await emitAck(p1, "room:join", {
      roomCode,
      identity: { nickname: "Buzzer1", avatar: { icon: "🔔", bg: "#ff4d8d" } },
    });
    expect(joined.accepted).toBe(true);

    const p2 = await connect(env.url);
    const joined2 = await emitAck(p2, "room:join", {
      roomCode,
      identity: { nickname: "Buzzer2", avatar: { icon: "🥁", bg: "#38bdf8" } },
    });
    expect(joined2.accepted).toBe(true);

    const start = await emitAck(host, "game:start", { gameId: "buzzer-arena" });
    expect(start.accepted).toBe(true);

    expect(await waitForPhase(p1, "ACTIVE")).toBe(true);

    // first buzz locks the round
    const buzz = await emitAck(p1, "game:action", {
      eventId: crypto.randomUUID(), type: "BUZZ", payload: {},
    });
    expect(buzz.accepted).toBe(true);

    expect(await waitForPhase(host, "LOCKED")).toBe(true);

    // host judges CORRECT — only possible if role==="host" survived transport
    const judge = await emitAck(host, "game:action", {
      eventId: crypto.randomUUID(),
      type: "JUDGE",
      payload: { correct: true },
    });
    expect(judge.accepted).toBe(true);

    host.disconnect();
    p1.disconnect();
    p2.disconnect();
  }, 45_000);

  it("oversized eventId is rejected without indexing (H3 regression)", async () => {
    const host = await connect(env.url);
    const created = await emitAck(host, "room:create", { identity: HOST_IDENTITY });
    const roomCode = (created.data as unknown as { roomCode: string }).roomCode;

    const p1 = await connect(env.url);
    await emitAck(p1, "room:join", {
      roomCode,
      identity: { nickname: "Ev", avatar: { icon: "🛡", bg: "#00b37e" } },
    });
    const p2b = await connect(env.url);
    await emitAck(p2b, "room:join", {
      roomCode,
      identity: { nickname: "Buzzer3", avatar: { icon: "🎺", bg: "#ffb84d" } },
    });
    const started = await emitAck(host, "game:start", { gameId: "buzzer-arena" });
    expect(started.accepted).toBe(true);
    expect(await waitForPhase(p1, "ACTIVE")).toBe(true);

    const huge = "x".repeat(5000);
    const res = await emitAck(p1, "game:action", {
      eventId: huge, type: "BUZZ", payload: {},
    });
    expect(res.accepted).toBe(false);
    expect(res.errorCode).toBe("INVALID_PAYLOAD");

    host.disconnect();
    p1.disconnect();
    p2b.disconnect();
  }, 45_000);
});
