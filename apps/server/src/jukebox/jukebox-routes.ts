/**
 * Jukebox REST routes (spec §180 jukebox:*).
 */
import type { FastifyInstance } from "fastify";
import type { JukeboxService } from "./jukebox-service.js";

export interface JukeboxDeps { jukebox: JukeboxService; adminToken?: string; }

export function registerJukeboxRoutes(app: FastifyInstance, deps: JukeboxDeps): void {
  app.get("/api/jukebox", async () => {
    return { queue: deps.jukebox.list() };
  });

  app.post<{ Body: { mediaId?: string; proposerId?: string } }>("/api/jukebox/enqueue", async (req, reply) => {
    const mediaId = String(req.body?.mediaId ?? "");
    if (!mediaId) { reply.code(400); return { error: "MISSING_MEDIA_ID" }; }
    try {
      const row = deps.jukebox.enqueue(mediaId, req.body?.proposerId ?? null);
      reply.code(201);
      return { ok: true, item: row };
    } catch (err) {
      const code = (err as { code?: string }).code ?? "INTERNAL";
      const status = code === "MEDIA_NOT_FOUND" ? 404 : code === "NOT_AUDIO" ? 422 : 500;
      reply.code(status);
      return { error: code };
    }
  });

  app.post<{ Params: { id: string }; Body: { delta?: number } }>("/api/jukebox/:id/vote", async (req, reply) => {
    try {
      deps.jukebox.vote(String(req.params.id), Number(req.body?.delta ?? 1));
      return { ok: true };
    } catch (err) {
      const code = (err as { code?: string }).code ?? "INTERNAL";
      const status = code === "NOT_FOUND" ? 404 : code === "NOT_QUEUED" ? 409 : 400;
      reply.code(status);
      return { error: code };
    }
  });

  app.post<{ Params: { id: string } }>("/api/jukebox/:id/skip", async (req, reply) => {
    if (!deps.adminToken || req.headers["x-admin-token"] !== deps.adminToken) {
      reply.code(401); return { error: "UNAUTHORIZED" };
    }
    try { deps.jukebox.skip(String(req.params.id)); return { ok: true }; }
    catch (err) {
      const code = (err as { code?: string }).code ?? "INTERNAL";
      reply.code(code === "NOT_FOUND" ? 404 : 500);
      return { error: code };
    }
  });

  app.delete<{ Params: { id: string } }>("/api/jukebox/:id", async (req, reply) => {
    if (!deps.adminToken || req.headers["x-admin-token"] !== deps.adminToken) {
      reply.code(401); return { error: "UNAUTHORIZED" };
    }
    deps.jukebox.remove(String(req.params.id));
    return { ok: true };
  });
}
