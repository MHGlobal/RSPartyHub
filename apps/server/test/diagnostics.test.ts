import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildHttp } from "../src/http.js";
import { Database } from "@rs-party/persistence";
import { RoomManager } from "../src/rooms/room-manager.js";
import { GameRegistry } from "@rs-party/game-engine";
import { registerAllGames } from "../src/runtime/register-games.js";
import { PackLibrary } from "@rs-party/content";
import { MediaService } from "../src/media/media-service.js";
import { JukeboxService } from "../src/jukebox/jukebox-service.js";

let app: Awaited<ReturnType<typeof buildHttp>>;
let tmpHome: string;
let db: Database;
const adminToken = "test-admin-123";

describe("Etapa 19 — diagnostics/doctor/logs/metrics (spec §19, AC-020)", () => {
  beforeAll(async () => {
    tmpHome = mkdtempSync(join(tmpdir(), "rsparty-diag-"));
    db = new Database(join(tmpHome,"data/rsparty.sqlite"));
    const reg = new GameRegistry(); await registerAllGames(reg);
    const packs = new PackLibrary(join(tmpHome,"library/packs"));
    const rooms = new RoomManager(db, reg, { port:3210, host:"127.0.0.1", homeDir:tmpHome, dbFile:join(tmpHome,"data/rsparty.sqlite"), maxPlayersDefault:12, resultsViewMs:2000, disconnectGraceMs:60000, rateLimitMultiplier:1 } as never, packs);
    const media = new MediaService(db, tmpHome);
    const jukebox = new JukeboxService(db);
    app = await buildHttp({ cfg:{ port:3210, host:"127.0.0.1", homeDir:tmpHome, dbFile:join(tmpHome,"data/rsparty.sqlite"), maxPlayersDefault:12, resultsViewMs:2000, disconnectGraceMs:60000, rateLimitMultiplier:1 } as never, rooms, packs, media, jukebox, adminToken });
  });
  afterAll(async()=>{ await app.close(); db.close(); rmSync(tmpHome,{recursive:true,force:true}); });

  it("GET /api/metrics is public and returns rss/activeRooms", async ()=>{
    const r = await app.inject({ method:"GET", url:"/api/metrics"});
    expect(r.statusCode).toBe(200);
    const j = JSON.parse(r.body) as { rssMb:number; activeRooms:number };
    expect(typeof j.rssMb).toBe("number");
    expect(typeof j.activeRooms).toBe("number");
  });

  it("GET /api/admin/diagnostics requires auth", async ()=>{
    const noAuth = await app.inject({ method:"GET", url:"/api/admin/diagnostics"});
    expect(noAuth.statusCode).toBe(401);
    const withAuth = await app.inject({ method:"GET", url:"/api/admin/diagnostics", headers:{ "x-admin-token": adminToken }});
    expect(withAuth.statusCode).toBe(200);
    const j = JSON.parse(withAuth.body) as { server:{ version:string }; runtime:{ rssMb:number }; storage:{ packsLoaded:number }; network:{ candidates: unknown[] } };
    expect(j.server.version).toBe("0.1.0");
    expect(typeof j.runtime.rssMb).toBe("number");
    expect(Array.isArray(j.network.candidates)).toBe(true);
  });

  it("GET /api/admin/doctor returns checks with pass/warn/fail", async ()=>{
    const r = await app.inject({ method:"GET", url:"/api/admin/doctor", headers:{ "x-admin-token": adminToken }});
    expect(r.statusCode).toBe(200);
    const j = JSON.parse(r.body) as { ok:boolean; checks:{ id:string; status:string }[]; summary:string };
    expect(typeof j.ok).toBe("boolean");
    expect(j.checks.length).toBeGreaterThan(5);
    expect(j.checks.some(c=> c.id==="db")).toBe(true);
    expect(typeof j.summary).toBe("string");
    // doctor without token is 401
    const noAuth = await app.inject({ method:"GET", url:"/api/admin/doctor"});
    expect(noAuth.statusCode).toBe(401);
  });

  it("POST /api/admin/backups returns metadata", async ()=>{
    const r = await app.inject({ method:"POST", url:"/api/admin/backups", headers:{ "x-admin-token": adminToken }});
    expect(r.statusCode).toBe(200);
    const j = JSON.parse(r.body) as { ok:boolean; dbFile:string };
    expect(typeof j.dbFile).toBe("string");
  });

  it("security headers present on diagnostics", async ()=>{
    const r = await app.inject({ method:"GET", url:"/api/metrics"});
    expect(r.headers["x-content-type-options"]).toBe("nosniff");
    expect(String(r.headers["content-security-policy"])).toContain("default-src 'self'");
  });
});
