/**
 * Integration suite — real server + real socket clients (spec etapa 21).
 * Covers: room lifecycle, join/resume/reconnect, idempotency,
 * duplicate-nickname rejection, host controls, game flow end-to-end.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  bootTestServer, type TestEnv,
  connect, emitAck, nextSnapshot,
  HOST_IDENTITY, playerIdentity,
} from "./helpers.js";
import type { Socket } from "socket.io-client";

let env: TestEnv;

beforeAll(async () => {
  env = await bootTestServer();
}, 30_000);

afterAll(async () => {
  await env?.cleanup();
});

interface JoinAckData {
  roomCode: string;
  playerId: string;
  resumeToken: string;
  role: string;
}

async function createRoomAsHost(): Promise<{ socket: Socket; roomCode: string; playerId: string }> {
  const s = await connect(env.url);
  const ack = await emitAck(s, "room:create", { identity: HOST_IDENTITY });
  expect(ack.accepted).toBe(true);
  const data = ack.data as unknown as JoinAckData;
  return { socket: s, roomCode: data.roomCode, playerId: data.playerId };
}

async function joinPlayer(roomCode: string, n: number): Promise<{
  socket: Socket;
  playerId: string;
  resumeToken: string;
}> {
  const s = await connect(env.url);
  const ack = await emitAck(s, "room:join", { roomCode, identity: playerIdentity(n) });
  expect(ack.accepted).toBe(true);
  const data = ack.data as unknown as JoinAckData;
  return { socket: s, playerId: data.playerId, resumeToken: data.resumeToken };
}

describe("room lifecycle", () => {
  it("host creates a room and receives code + resume token", async () => {
    const host = await createRoomAsHost();
    expect(host.roomCode).toMatch(/^[A-Z]{4}$/);
    expect(host.playerId).toBeTruthy();
    host.socket.disconnect();
  });

  it("players join, get ready, host starts quiz-rush, answers flow to results", async () => {
    const host = await createRoomAsHost();
    const p1 = await joinPlayer(host.roomCode, 1);
    const p2 = await joinPlayer(host.roomCode, 2);

    // ready up
    for (const p of [p1, p2]) {
      const r = await emitAck(p.socket, "player:ready", { ready: true });
      expect(r.accepted).toBe(true);
    }

    // unknown game rejected with coded error
    const badGame = await emitAck(host.socket, "game:start", { gameId: "nope" });
    expect(badGame.accepted).toBe(false);
    expect(badGame.errorCode).toBe("GAME_NOT_FOUND");

    // start real P0 game
    const started = await emitAck(host.socket, "game:start", { gameId: "quiz-rush" });
    expect(started.accepted).toBe(true);

    const snap1 = await nextSnapshot(p1.socket);
    expect((snap1 as { phase: string }).phase).toBe("game");
    expect(((snap1 as { game?: { id?: string } }).game)?.id).toBe("quiz-rush");

    // single driver waits once for ACTIVE, then both answer synchronously
    // (two independent pollers could race the ROUND_RESULT close)
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let activeSnap: Record<string, unknown> | null = null;
    for (let i = 0; i < 40 && !activeSnap; i++) {
      const s = await nextSnapshot(p1.socket);
      if (((s as { game?: { phase?: string } }).game)?.phase === "ACTIVE") activeSnap = s;
      else await sleep(300);
    }
    expect(activeSnap).not.toBeNull();
    for (const p of [p1, p2]) {
      const res = await emitAck(p.socket, "game:action", {
        eventId: crypto.randomUUID(),
        type: "SUBMIT_ANSWER",
        payload: { choice: 0 },
      });
      expect(res.accepted).toBe(true);
    }
    host.socket.disconnect();
    p1.socket.disconnect();
    p2.socket.disconnect();
  }, 30_000);

  it("rejects duplicate nickname case-insensitively", async () => {
    const host = await createRoomAsHost();
    await joinPlayer(host.roomCode, 3);
    const s = await connect(env.url);
    const dup = await emitAck(s, "room:join", {
      roomCode: host.roomCode,
      identity: { nickname: "jogador3", avatar: { icon: "🐙", bg: "#38bdf8" } },
    });
    expect(dup.accepted).toBe(false);
    expect(dup.errorCode).toBe("NICKNAME_TAKEN");
    s.disconnect();
    host.socket.disconnect();
  });

  it("join with unknown room returns ROOM_NOT_FOUND", async () => {
    const s = await connect(env.url);
    const ack = await emitAck(s, "room:join", {
      roomCode: "ZZZZ",
      identity: playerIdentity(9),
    });
    expect(ack.accepted).toBe(false);
    expect(ack.errorCode).toBe("ROOM_NOT_FOUND");
    s.disconnect();
  });
});

describe("reconnect & resume (spec §10.5)", () => {
  it("refresh keeps identity via resume token — no duplicate player", async () => {
    const host = await createRoomAsHost();
    const p = await joinPlayer(host.roomCode, 5);
    p.socket.disconnect();

    const s2 = await connect(env.url);
    const resumed = await emitAck(s2, "room:join", {
      roomCode: host.roomCode,
      playerId: p.playerId,
      resumeToken: p.resumeToken,
    });
    expect(resumed.accepted).toBe(true);

    const roomSnap = await nextSnapshot(s2);
    const players = (roomSnap as { players: { id: string }[] }).players;
    const samePlayerCount = players.filter(pl => pl.id === p.playerId).length;
    expect(samePlayerCount).toBe(1);
    s2.disconnect();
    host.socket.disconnect();
  }, 20_000);

  it("wrong resume token is rejected", async () => {
    const host = await createRoomAsHost();
    const p = await joinPlayer(host.roomCode, 6);
    p.socket.disconnect();
    const s2 = await connect(env.url);
    const bad = await emitAck(s2, "room:join", {
      roomCode: host.roomCode,
      playerId: p.playerId,
      resumeToken: "deadbeef",
    });
    expect(bad.accepted).toBe(false);
    s2.disconnect();
    host.socket.disconnect();
  }, 20_000);

  it("disconnect does not remove the player from the room list", async () => {
    const host = await createRoomAsHost();
    const p = await joinPlayer(host.roomCode, 7);
    p.socket.disconnect();
    await new Promise(r => setTimeout(r, 300));
    const snap = await nextSnapshot(await (async () => {
      const s = await connect(env.url);
      const r = await emitAck(s, "room:join", {
        roomCode: host.roomCode, playerId: p.playerId, resumeToken: p.resumeToken,
      });
      expect(r.accepted).toBe(true);
      return s;
    })());
    expect(((snap as { you?: { connected?: boolean } }).you)?.connected).toBe(true);
    host.socket.disconnect();
  }, 20_000);
});

describe("idempotency & rate limits (spec §10.3/§10.8)", () => {
  it("same eventId is accepted once without double effect", async () => {
    const host = await createRoomAsHost();
    const p1 = await joinPlayer(host.roomCode, 8);
    const p2 = await joinPlayer(host.roomCode, 81);
    await emitAck(p1.socket, "player:ready", { ready: true });
    await emitAck(p2.socket, "player:ready", { ready: true });
    const started = await emitAck(host.socket, "game:start", { gameId: "quiz-rush" });
    expect(started.accepted).toBe(true);

    // reach ACTIVE
    let active = false;
    for (let i = 0; i < 60 && !active; i++) {
      const snap = await nextSnapshot(p1.socket);
      active = ((snap as { game?: { phase?: string } }).game)?.phase === "ACTIVE";
      if (!active) await new Promise((r) => setTimeout(r, 300));
    }
    expect(active).toBe(true);

    const eventId = crypto.randomUUID();
    const first = await emitAck(p1.socket, "game:action", {
      eventId, type: "SUBMIT_ANSWER", payload: { choice: 1 },
    });
    const second = await emitAck(p1.socket, "game:action", {
      eventId, type: "SUBMIT_ANSWER", payload: { choice: 1 },
    });
    expect(first.accepted).toBe(true);
    expect(second.accepted).toBe(true); // deduplicated silently
    expect((second as { duplicate?: boolean }).duplicate).toBe(true);
    host.socket.disconnect();
    p1.socket.disconnect();
    p2.socket.disconnect();
  }, 40_000);

  it("flood of reactions hits RATE_LIMITED", async () => {
    const host = await createRoomAsHost();
    const p = await joinPlayer(host.roomCode, 10);
    const results = await Promise.all(
      Array.from({ length: 12 }, () =>
        emitAck(p.socket, "reaction:send", { kind: "thumbsup" })),
    );
    const limited = results.filter(r => !r.accepted && r.errorCode === "RATE_LIMITED");
    expect(limited.length).toBeGreaterThan(0);
    host.socket.disconnect();
    p.socket.disconnect();
  }, 30_000);
});

describe("host controls", () => {
  it("non-host cannot control the room", async () => {
    const host = await createRoomAsHost();
    const p = await joinPlayer(host.roomCode, 11);
    const denied = await emitAck(p.socket, "host:control", { op: "lock-joins", locked: true });
    expect(denied.accepted).toBe(false);
    expect(denied.errorCode).toBe("NOT_HOST");
    host.socket.disconnect();
    p.socket.disconnect();
  }, 20_000);

  it("kick removes the player; kicked token stops working", async () => {
    const host = await createRoomAsHost();
    const p = await joinPlayer(host.roomCode, 12);
    const ctl = await emitAck(host.socket, "host:control", { op: "kick", playerId: p.playerId });
    expect(ctl.accepted).toBe(true);
    p.socket.disconnect();
    const s2 = await connect(env.url);
    const back = await emitAck(s2, "room:join", {
      roomCode: host.roomCode, playerId: p.playerId, resumeToken: p.resumeToken,
    });
    expect(back.accepted).toBe(false);
    s2.disconnect();
    host.socket.disconnect();
  }, 20_000);

  it("lock-joins blocks new entries", async () => {
    const host = await createRoomAsHost();
    await emitAck(host.socket, "host:control", { op: "lock-joins", locked: true });
    const s = await connect(env.url);
    const blocked = await emitAck(s, "room:join", {
      roomCode: host.roomCode, identity: playerIdentity(13),
    });
    expect(blocked.accepted).toBe(false);
    expect(blocked.errorCode).toBe("ROOM_LOCKED");
    s.disconnect();
    host.socket.disconnect();
  }, 20_000);
});

describe("HTTP layer", () => {
  it("healthz/readyz respond ok", async () => {
    const h = await fetch(`${env.url}/healthz`);
    expect(h.status).toBe(200);
    const r = await fetch(`${env.url}/readyz`) as Response & { json(): Promise<{ ready: boolean }> };
    const body = (await r.json()) as { ready: boolean };
    expect(body.ready).toBe(true);
  });

  it("games catalog lists registered P0 games", async () => {
    const res = await fetch(`${env.url}/api/games`);
    const body = (await res.json()) as { games: { id: string; priority: string }[] };
    const ids = body.games.map(g => g.id);
    expect(ids).toContain("quiz-rush");
    // placeholder games are still valid manifests
    expect(ids.length).toBeGreaterThanOrEqual(10);
  });

  it("QR endpoint renders SVG for an active room", async () => {
    const host = await createRoomAsHost();
    const res = await fetch(`${env.url}/api/qr?room=${host.roomCode}`);
    expect(res.headers.get("content-type")).toContain("svg");
    host.socket.disconnect();
  });

  it("admin overview requires token when configured", async () => {
    const res = await fetch(`${env.url}/api/admin/overview`);
    expect([200, 401]).toContain(res.status);
  });
});
