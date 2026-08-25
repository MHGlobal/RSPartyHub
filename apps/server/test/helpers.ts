/**
 * Integration test helpers: boot a real server on an ephemeral port with a
 * temp DB and connect socket.io-client players (spec etapa 21).
 */
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { io, type Socket } from "socket.io-client";
import { startServer, type BootedServer } from "../src/index.js";

export interface TestEnv extends BootedServer {
  url: string;
  cleanup(): Promise<void>;
}

export async function bootTestServer(): Promise<TestEnv> {
  const dir = mkdtempSync(join(tmpdir(), "rsparty-test-"));
  // tests open many sockets from 127.0.0.1 — lift rate limits via env
  process.env.RS_PARTY_RATE_MULT = "1000";
  const server = await startServer({
    dbFile: join(dir, "test.sqlite"),
    port: 0,
  });
  return {
    ...server,
    get url() {
      return (server as BootedServer & { address?: string }).address!;
    },
    async cleanup() {
      await server.close();
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {
        /* best effort */
      }
    },
  } as TestEnv & { url: string };
}

export type ClientSocket = Socket;

export function connect(url: string): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const s = io(url, { transports: ["websocket"], reconnection: false });
    s.on("connect", () => resolve(s));
    s.on("connect_error", reject);
    setTimeout(() => reject(new Error("client connect timeout")), 5000);
  });
}

export function emitAck<T = Record<string, unknown>>(
  socket: Socket,
  channel: string,
  payload?: unknown,
): Promise<T & { accepted: boolean; errorCode?: string; reason?: string; data?: T }> {
  return new Promise((resolve) => {
    socket.emit(channel, payload ?? {}, (ack: unknown) => resolve(ack as never));
  });
}

export function nextSnapshot(socket: Socket, timeoutMs = 4000): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("snapshot timeout")), timeoutMs);
    socket.once("state:snapshot", (snap: Record<string, unknown>) => {
      clearTimeout(t);
      resolve(snap);
    });
    // actively pull a fresh snapshot to avoid missing broadcast races
    socket.emit("state:sync", {});
  });
}

export const HOST_IDENTITY = {
  nickname: "Anfitrião",
  avatar: { icon: "🎤", bg: "#7c5cff" },
};

export function playerIdentity(n: number) {
  return {
    nickname: `Jogador${n}`,
    avatar: { icon: "🎮", bg: "#00b37e" },
  };
}
