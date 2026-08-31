/**
 * Content pack REST endpoints + bootstrap wiring (etapa 15).
 * GET  /api/packs            — public catalog (id, title, kind, locale, counts)
 * POST /api/admin/packs/import — admin-only JSON pack import with validation
 */
import type { FastifyInstance } from "fastify";
import type { PackLibrary } from "@rs-party/content";
import { importPackString, validatePack, type LoadedPack } from "@rs-party/content";

export interface PackRoutesDeps {
  packs: PackLibrary;
  adminToken?: string;
}

function packSummary(l: LoadedPack) {
  const p = l.pack;
  return {
    packId: p.packId,
    kind: p.kind,
    title: p.title,
    locale: p.locale,
    rating: p.rating,
    version: p.version,
    items: p.kind === "quiz" ? p.questions.length : p.items.length,
    source: l.source,
    checksum: l.checksum.slice(0, 12),
  };
}

export function registerPackRoutes(app: FastifyInstance, deps: PackRoutesDeps): void {
  app.get("/api/packs", async () => {
    return { packs: deps.packs.list().map(packSummary) };
  });

  app.post("/api/admin/packs/import", async (req, reply) => {
    if (!deps.adminToken || req.headers["x-admin-token"] !== deps.adminToken) {
      reply.code(401);
      return { error: "UNAUTHORIZED" };
    }
    // bodyLimit already capped at server level (5MB); parse body as raw JSON
    const body = req.body as { json?: string; pack?: unknown } | null;
    let result;
    if (typeof body?.json === "string") {
      result = importPackString(deps.packs, body.json);
    } else if (body?.pack !== undefined) {
      result = validatePack(body.pack);
      if (result.ok) deps.packs.register(result.pack, "imported");
    } else {
      reply.code(400);
      return { error: "INVALID_PAYLOAD", hint: 'send {"json": "<pack json string>"} or {"pack": {...}}' };
    }
    if (!result.ok) {
      reply.code(422);
      return { error: "PACK_REJECTED", stage: result.stage, errors: result.errors };
    }
    return { ok: true, pack: packSummary(deps.packs.byPackId(result.pack.packId)!) };
  });
}
