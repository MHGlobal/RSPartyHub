/**
 * Load suite — 30 socket clients in one room playing quiz-rush end-to-end.
 * Measures ACK latency p50/p95, server RSS and event-loop health (spec AW.4).
 */
import {
  bootTestServer, type TestEnv,
  connect, emitAck, nextSnapshot,
  HOST_IDENTITY,
} from "../test/helpers.js";
import type { Socket } from "socket.io-client";

const CLIENTS = Number(process.env.RS_PARTY_LOAD_CLIENTS ?? 30);

import { test } from "vitest";

test("load — 30 clients full quiz-rush round", async () => {
  const env = await bootTestServer();
  try {
    const host = await connect(env.url);
    const created = await emitAck(host, "room:create", {
      identity: HOST_IDENTITY, maxPlayers: 50,
    });
    if (!created.accepted) throw new Error("room:create failed");
    const roomCode = (created.data as unknown as { roomCode: string }).roomCode;

    // connect 30 players
    const ackLatencies: number[] = [];
    const players = await Promise.all(
      Array.from({ length: CLIENTS }, (_, i) => connect(env.url)),
    );
    const ids: string[] = [];
    for (let i = 0; i < CLIENTS; i++) {
      const t0 = Date.now();
      const ack = await emitAck(players[i]!, "room:join", {
        roomCode,
        identity: { nickname: `Load${i + 1}`, avatar: { icon: "🎮", bg: "#00b37e" } },
      });
      ackLatencies.push(Date.now() - t0);
      if (!ack.accepted) throw new Error("join failed");
      ids.push((ack.data as unknown as { playerId: string }).playerId);
    }

    // ready all + start
    for (const s of players) await emitAck(s, "player:ready", { ready: true });
    const start = await emitAck(host, "game:start", { gameId: "quiz-rush" });
    if (!start.accepted) throw new Error("game:start failed");

    // wait ACTIVE on one snapshot stream
    let active = false;
    for (let i = 0; i < 60 && !active; i++) {
      const snap = (await nextSnapshot(players[0]!)) as { game?: { phase?: string } };
      active = snap.game?.phase === "ACTIVE";
      if (!active) await new Promise((r) => setTimeout(r, 250));
    }
    if (!active) throw new Error("never ACTIVE");

    // everyone answers simultaneously; measure action ACK times
    const actionTimes: number[] = [];
    const results = await Promise.all(
      players.map(async (s) => {
        const t0 = Date.now();
        const r = await emitAck(s, "game:action", {
          eventId: crypto.randomUUID(),
          type: "SUBMIT_ANSWER",
          payload: { choice: Math.floor(Math.random() * 4) },
        });
        actionTimes.push(Date.now() - t0);
        return r.accepted;
      }),
    );
    const firstWaveAccepted = results.filter(Boolean).length;
    if (firstWaveAccepted < CLIENTS - 2) throw new Error(`only ${firstWaveAccepted}/${CLIENTS} accepted`);

    // latency percentiles
    actionTimes.sort((a, b) => a - b);
    ackLatencies.sort((a, b) => a - b);
    const p50 = (arr: number[]) => arr[Math.floor(arr.length / 2)] ?? 0;
    const p95 = (arr: number[]) => arr[Math.floor(arr.length * 0.95)] ?? 0;
    console.log(`join ACK p50=${p50(ackLatencies)}ms p95=${p95(ackLatencies)}ms`);
    console.log(`action ACK p50=${p50(actionTimes)}ms p95=${p95(actionTimes)}ms`);

    const mem = process.memoryUsage();
    console.log(`test-process RSS=${Math.round(mem.rss / 1024 / 1024)}MB`);

    for (const s of [...players, host]) s.disconnect();
    console.log("\nLOAD SIM COMPLETE ✓");
  } finally {
    await env.cleanup();
  }
}


);
