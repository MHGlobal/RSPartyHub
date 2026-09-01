import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { existsSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { buildHttp } from "../src/http.js";
import { Database } from "@rs-party/persistence";
import { RoomManager } from "../src/rooms/room-manager.js";
import { GameRegistry } from "@rs-party/game-engine";
import { registerAllGames } from "../src/runtime/register-games.js";
import { PackLibrary } from "@rs-party/content";
import { MediaService } from "../src/media/media-service.js";
import { JukeboxService } from "../src/jukebox/jukebox-service.js";
import {
  BACKUP_MAX_BYTES,
  createBackupSerializer,
  hasBackupCapacity,
  selectBackupArtifactsForRemoval,
  type BackupArtifact,
} from "../src/diagnostics/diagnostics-routes.js";

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

  it("POST /api/admin/backups requires admin authentication", async ()=>{
    const backupDirectory = join(tmpHome, "backups");
    expect(existsSync(backupDirectory)).toBe(false);
    const noAuth = await app.inject({ method:"POST", url:"/api/admin/backups" });
    const wrongAuth = await app.inject({ method:"POST", url:"/api/admin/backups", headers:{ "x-admin-token": "wrong" }});
    expect(noAuth.statusCode).toBe(401);
    expect(wrongAuth.statusCode).toBe(401);
    expect(existsSync(backupDirectory)).toBe(false);
  });

  it("POST /api/admin/backups creates a safe, consistent SQLite artifact", async ()=>{
    const marker = "backup-integrity-marker";
    db.prepare("INSERT INTO kv (key, value) VALUES (?, ?)").run("backup-test", marker);
    const r = await app.inject({ method:"POST", url:"/api/admin/backups", headers:{ "x-admin-token": adminToken }});
    expect(r.statusCode).toBe(200);
    const j = JSON.parse(r.body) as { ok:boolean; filename:string; bytes:number; pages:number; createdAt:number };
    expect(j.ok).toBe(true);
    expect(j.filename).toMatch(/^rsparty-\d{17}-[a-f0-9]{32}\.sqlite$/);
    expect(j.filename.length).toBeLessThanOrEqual(80);
    expect(j.filename).not.toContain("/");
    expect(j.bytes).toBeGreaterThan(0);
    expect(j.pages).toBeGreaterThan(0);
    expect(r.body).not.toContain(tmpHome);

    const artifact = join(tmpHome, "backups", j.filename);
    expect(statSync(artifact).size).toBe(j.bytes);
    const copied = new DatabaseSync(artifact, { readOnly: true });
    try {
      expect(copied.prepare("SELECT value FROM kv WHERE key = ?").get("backup-test")).toEqual({ value: marker });
      expect(copied.prepare("PRAGMA integrity_check").get()).toEqual({ integrity_check: "ok" });
    } finally {
      copied.close();
    }
  });

  it("retains the newest backup while deterministically enforcing count and byte limits", () => {
    const artifacts: BackupArtifact[] = [
      { filename: "rsparty-20260901000000000-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.sqlite", path: "/backup/a", bytes: 30, mtimeMs: 1 },
      { filename: "rsparty-20260901000000001-bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.sqlite", path: "/backup/b", bytes: 30, mtimeMs: 2 },
      { filename: "rsparty-20260901000000002-cccccccccccccccccccccccccccccccc.sqlite", path: "/backup/c", bytes: 30, mtimeMs: 3 },
    ];
    expect(selectBackupArtifactsForRemoval(artifacts, artifacts[2]!.filename, 2, 50).map((artifact) => artifact.path))
      .toEqual(["/backup/b", "/backup/a"]);
    expect(selectBackupArtifactsForRemoval(artifacts, artifacts[2]!.filename, 5, BACKUP_MAX_BYTES)).toEqual([]);
  });

  it("serializes backup work and continues after a failed operation", async () => {
    const serialize = createBackupSerializer();
    const events: string[] = [];
    let releaseFirst!: () => void;
    const first = serialize(async () => {
      events.push("first-start");
      await new Promise<void>((resolve) => { releaseFirst = resolve; });
      events.push("first-end");
    });
    const second = serialize(async () => { events.push("second"); });
    await Promise.resolve();
    expect(events).toEqual(["first-start"]);
    releaseFirst();
    await Promise.all([first, second]);
    await expect(serialize(async () => { throw new Error("expected"); })).rejects.toThrow("expected");
    await serialize(async () => { events.push("after-failure"); });
    expect(events).toEqual(["first-start", "first-end", "second", "after-failure"]);
  });

  it("checks backup capacity from statfs values without touching the disk", () => {
    expect(hasBackupCapacity({ bavail: 64 * 1024, bsize: 1024 }, 1)).toBe(true);
    expect(hasBackupCapacity({ bavail: 1, bsize: 1024 }, 1)).toBe(false);
  });

  it("security headers present on diagnostics", async ()=>{
    const r = await app.inject({ method:"GET", url:"/api/metrics"});
    expect(r.headers["x-content-type-options"]).toBe("nosniff");
    expect(String(r.headers["content-security-policy"])).toContain("default-src 'self'");
  });
});
