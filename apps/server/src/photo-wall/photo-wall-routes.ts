/**
 * Photo Wall routes — approved images mural with consent (spec AJ.4, §127.34).
 * Consent mutations are permitted for the media owner with a validated resume
 * token, or for an administrator performing moderation.
 */
import type { FastifyInstance } from "fastify";
import type { MediaService } from "../media/media-service.js";
import type { Database } from "@rs-party/persistence";
import { sha256 } from "@rs-party/persistence";

export function registerPhotoWallRoutes(app: FastifyInstance, deps: { media: MediaService; db: Database; adminToken?: string }): void {
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

  // The player ID alone is forgeable. Pair it with the resume token and verify
  // its stored hash before allowing the owner to change consent.
  app.post<{ Params: { id: string }; Body: { consent?: boolean } }>("/api/photo-wall/:id/consent", async (req, reply) => {
    const id = String(req.params.id);
    const row = deps.db.prepare("SELECT * FROM media_items WHERE id = ?").get(id) as { id: string; owner_player_id: string | null; consent: number } | undefined;
    if (!row) { reply.code(404); return { error: "NOT_FOUND" }; }

    const isAdmin = !!deps.adminToken && req.headers["x-admin-token"] === deps.adminToken;
    if (!isAdmin) {
      const playerId = req.headers["x-player-id"];
      const resumeToken = req.headers["x-resume-token"];
      if (typeof playerId !== "string" || typeof resumeToken !== "string" || !playerId || !resumeToken) {
        reply.code(401);
        return { error: "UNAUTHORIZED" };
      }
      const player = deps.db.prepare(
        "SELECT id FROM players WHERE id = ? AND resume_token_hash = ? AND kicked = 0",
      ).get(playerId, sha256(resumeToken)) as { id: string } | undefined;
      if (!player || row.owner_player_id !== player.id) {
        reply.code(403);
        return { error: "FORBIDDEN" };
      }
    }
    const consent = req.body?.consent !== false ? 1 : 0;
    deps.db.prepare("UPDATE media_items SET consent = ? WHERE id = ?").run(consent, id);
    return { ok: true, consent: !!consent };
  });
}
