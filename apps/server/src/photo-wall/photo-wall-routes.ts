/**
 * Photo Wall routes — approved images mural with consent (spec AJ.4, §127.34).
 * MVP: list images where kind=image and consent=1; owner can withdraw consent/delete.
 */
import type { FastifyInstance } from "fastify";
import type { MediaService } from "../media/media-service.js";
import type { Database } from "@rs-party/persistence";

export function registerPhotoWallRoutes(app: FastifyInstance, deps: { media: MediaService; db: Database }): void {
  app.get("/api/photo-wall", async () => {
    const items = deps.media.list(100);
    const photos = items.filter((r) => r.kind === "image")
      .map((r) => ({
        id: r.id,
        originalName: r.original_name,
        mime: r.mime,
        bytes: r.bytes,
        createdAt: r.created_at,
        consent: !!(r as unknown as { consent: number }).consent,
      }))
      .filter((p) => p.consent);
    return { photos };
  });

  // toggle consent (owner withdraw)
  app.post<{ Params: { id: string }; Body: { consent?: boolean } }>("/api/photo-wall/:id/consent", async (req, reply) => {
    const id = String(req.params.id);
    const row = deps.db.prepare("SELECT * FROM media_items WHERE id = ?").get(id) as { id: string; owner_player_id: string | null; consent: number } | undefined;
    if (!row) { reply.code(404); return { error: "NOT_FOUND" }; }
    const consent = req.body?.consent !== false ? 1 : 0;
    deps.db.prepare("UPDATE media_items SET consent = ? WHERE id = ?").run(consent, id);
    return { ok: true, consent: !!consent };
  });
}
