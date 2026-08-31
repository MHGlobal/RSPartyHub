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

describe("Etapa 18 — PT/EN + a11y (spec AC-009, §13.5)", () => {
  beforeAll(async () => {
    tmpHome = mkdtempSync(join(tmpdir(), "rsparty-i18n-"));
    db = new Database(join(tmpHome,"data/rsparty.sqlite"));
    const reg = new GameRegistry(); await registerAllGames(reg);
    const packs = new PackLibrary(join(tmpHome,"library/packs"));
    const rooms = new RoomManager(db, reg, { port:3210, host:"127.0.0.1", homeDir:tmpHome, dbFile:join(tmpHome,"data/rsparty.sqlite"), maxPlayersDefault:12, resultsViewMs:2000, disconnectGraceMs:60000, rateLimitMultiplier:1} as never, packs);
    const media = new MediaService(db, tmpHome);
    const jukebox = new JukeboxService(db);
    app = await buildHttp({ cfg:{ port:3210, host:"127.0.0.1", homeDir:tmpHome, dbFile:join(tmpHome,"data/rsparty.sqlite"), maxPlayersDefault:12, resultsViewMs:2000, disconnectGraceMs:60000, rateLimitMultiplier:1} as never, rooms, packs, media, jukebox });
  });
  afterAll(async()=>{ await app.close(); db.close(); rmSync(tmpHome,{recursive:true,force:true}); });

  it("GET /api/i18n lists locales", async ()=>{
    const r = await app.inject({ method:"GET", url:"/api/i18n"});
    expect(r.statusCode).toBe(200);
    const j = JSON.parse(r.body) as { locales:string[]; defaultLocale:string };
    expect(j.locales).toContain("pt");
    expect(j.locales).toContain("en");
    expect(j.defaultLocale).toBe("pt");
  });
  it("GET /api/i18n/pt returns PT dict with core keys", async ()=>{
    const r = await app.inject({ method:"GET", url:"/api/i18n/pt"});
    expect(r.statusCode).toBe(200);
    const j = JSON.parse(r.body) as { locale:string; dict: Record<string,string> };
    expect(j.locale).toBe("pt");
    expect(j.dict["join.enter"]).toBe("Entrar");
    expect(j.dict["lobby.ready"]).toBe("Pronto");
  });
  it("GET /api/i18n/en returns EN dict", async ()=>{
    const r = await app.inject({ method:"GET", url:"/api/i18n/en"});
    expect(r.statusCode).toBe(200);
    const j = JSON.parse(r.body) as { dict:Record<string,string> };
    expect(j.dict["join.enter"]).toBe("Join");
  });
  it("unknown locale 404", async ()=>{
    const r = await app.inject({ method:"GET", url:"/api/i18n/fr"});
    expect(r.statusCode).toBe(404);
  });
  it("security headers are present on i18n endpoint", async ()=>{
    const r = await app.inject({ method:"GET", url:"/api/i18n/pt"});
    expect(r.headers["x-content-type-options"]).toBe("nosniff");
  });
});
