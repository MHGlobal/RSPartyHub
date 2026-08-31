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

function importHandler(deps: PackRoutesDeps, body: { json?: string; pack?: unknown } | null) {
  let result;
  if (typeof body?.json === "string") {
    result = importPackString(deps.packs, body.json);
  } else if (body?.pack !== undefined) {
    result = validatePack(body.pack);
    if (result.ok) deps.packs.register(result.pack, "imported");
  } else {
    return { status: 400 as const, body: { error: "INVALID_PAYLOAD", hint: 'send {"json": "<pack json string>"} or {"pack": {...}}' } };
  }
  if (!result.ok) {
    return { status: 422 as const, body: { error: "PACK_REJECTED", stage: result.stage, errors: result.errors } };
  }
  return { status: 200 as const, body: { ok: true, pack: packSummary(deps.packs.byPackId(result.pack.packId)!) } };
}

export function registerPackRoutes(app: FastifyInstance, deps: PackRoutesDeps): void {
  const listHandler = async () => ({ packs: deps.packs.list().map(packSummary) });
  // canonical (spec §180.9) + legacy alias + v1 alias
  app.get("/api/content-packs", listHandler);
  app.get("/api/packs", listHandler);
  app.get("/api/v1/content-packs", listHandler);
  app.get("/api/v1/content/packs", listHandler);

  const importRoute = async (req: import("fastify").FastifyRequest, reply: import("fastify").FastifyReply) => {
    if (!deps.adminToken || req.headers["x-admin-token"] !== deps.adminToken) {
      reply.code(401);
      return { error: "UNAUTHORIZED" };
    }
    const body = req.body as { json?: string; pack?: unknown } | null;
    const res = importHandler(deps, body);
    if (res.status !== 200) {
      reply.code(res.status);
      return res.body;
    }
    return res.body;
  };
  app.post("/api/content-packs/import", importRoute);
  app.post("/api/packs/import", importRoute);
  app.post("/api/admin/packs/import", importRoute);
  app.post("/api/v1/content-packs/import", importRoute);
  app.post("/api/v1/content-packs/validate", async (req, reply) => {
    const body = req.body as { json?: string; pack?: unknown } | null;
    let raw: unknown = body?.pack;
    if (typeof body?.json === "string") { try { raw = JSON.parse(body.json); } catch { reply.code(400); return { error: "INVALID_JSON" }; } }
    if (raw === undefined) { reply.code(400); return { error: "INVALID_PAYLOAD" }; }
    const result = validatePack(raw);
    if (!result.ok) { reply.code(422); return { error: "PACK_REJECTED", stage: result.stage, errors: result.errors }; }
    return { ok: true, packId: result.pack.packId };
  });

  // enable/disable stubs (spec §180.11-12) — pack library is file-based, enable is implicit on import
  const toggleHandler = async (req: import("fastify").FastifyRequest, reply: import("fastify").FastifyReply) => {
    if (!deps.adminToken || req.headers["x-admin-token"] !== deps.adminToken) {
      reply.code(401);
      return { error: "UNAUTHORIZED" };
    }
    const id = String((req.params as { id: string }).id ?? "");
    const found = deps.packs.byPackId(id);
    if (!found) { reply.code(404); return { error: "PACK_NOT_FOUND" }; }
    return { ok: true, packId: id };
  };
  app.post("/api/content-packs/:id/enable", toggleHandler);
  app.post("/api/content-packs/:id/disable", toggleHandler);
  app.post("/api/v1/content-packs/:id/enable", toggleHandler);
  app.post("/api/v1/content-packs/:id/disable", toggleHandler);
}
