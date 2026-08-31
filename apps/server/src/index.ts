/**
 * RS Party Hub server entrypoint.
 * Boots config → persistence → registry → rooms → HTTP + realtime.
 */
import { Gateway } from "./realtime/gateway.js";
import { buildHttp } from "./http.js";
import { cleanTemp, ensureHomeLayout, loadConfig } from "./config.js";
import { Database } from "@rs-party/persistence";
import { GameRegistry } from "@rs-party/game-engine";
import { RoomManager } from "./rooms/room-manager.js";
import { registerAllGames } from "./runtime/register-games.js";
import { PackLibrary } from "@rs-party/content";
import quizRushPlugin from "@rs-party/games-quiz-rush";
import { Server as SocketServer } from "socket.io";
import { primaryLanAddress } from "./discovery.js";
import { join } from "node:path";

export interface BootedServer {
  close(): Promise<void>;
  port: number;
  /** Bound address URL (useful when port=0 in tests). */
  address?: string;
}

export async function startServer(overrides?: { dbFile?: string; port?: number }): Promise<BootedServer> {
  const cfg = loadConfig();
  if (overrides?.dbFile) cfg.dbFile = overrides.dbFile;
  if (overrides?.port !== undefined) cfg.port = overrides.port;

  ensureHomeLayout(cfg);
  cleanTemp(cfg);

  const db = new Database(cfg.dbFile);
  const registry = new GameRegistry();
  await registerAllGames(registry);

  // Content packs (etapa 15): disk library + built-in PT quiz bank
  const packs = new PackLibrary(join(cfg.homeDir, "library", "packs"));
  packs.loadFromDisk();
  packs.register(
    {
      kind: "quiz",
      packId: "builtin-quiz-pt",
      title: "Quiz PT — Banco interno",
      locale: "pt",
      rating: "family",
      version: 1,
      questions: (quizRushPlugin as unknown as { questionBank?: unknown[] }).questionBank ?? [],
    } as never,
    "builtin",
  );

  const rooms = new RoomManager(db, registry, cfg, packs);
  const rehydrated = rooms.rehydrate();
  if (rehydrated > 0) console.log(`[boot] rehydrated ${rehydrated} game session(s)`);

  const app = await buildHttp({ cfg, rooms, adminToken: cfg.adminToken, packs });

  const io = new SocketServer(app.server, {
    cors: { origin: true, credentials: false },
    pingInterval: 10_000,
    pingTimeout: 20_000,
  });
  const gateway = new Gateway(io, rooms);
  gateway.attach();

  // periodic sweep of runtimes for deadline transitions + stale disconnect marks
  setInterval(() => {
    for (const room of rooms.listActiveRooms()) room.game?.runtime.sweep();
  }, 1000).unref();

  await app.listen({ port: cfg.port, host: cfg.host });
  const bound = app.addresses()[0];
  const address =
    bound && typeof bound === "object"
      ? `http://${bound.address === "::" ? "127.0.0.1" : bound.address}:${bound.port}`
      : undefined;

  const lan = primaryLanAddress();
  console.log(`\n  RS Party Hub`);
  console.log(`  ├─ local : http://localhost:${cfg.port}`);
  console.log(`  └─ LAN   : http://${lan ?? "<sem-rede>"}:${cfg.port}\n`);

  return {
    port: cfg.port,
    address,
    async close() {
      for (const room of rooms.listActiveRooms()) room.game?.runtime.finishEarly();
      await io.close();
      await app.close();
      db.close();
    },
  };
}

// CLI entrypoint (not used when imported by tests)
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop() ?? "")) {
  startServer().catch((err) => {
    console.error("[boot] fatal:", err);
    process.exit(1);
  });
}
