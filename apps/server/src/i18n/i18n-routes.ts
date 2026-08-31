/**
 * i18n routes — Etapa 18.
 * GET /api/i18n/:locale → dict
 * POST /api/i18n/select → validate locale (stores preference client-side, server is stateless)
 */
import type { FastifyInstance } from "fastify";
import { DICTS } from "./dict.js";

export function registerI18nRoutes(app: FastifyInstance): void {
  app.get<{ Params: { locale: string } }>("/api/i18n/:locale", async (req, reply) => {
    const loc = String(req.params.locale).toLowerCase().slice(0,2) as "pt" | "en";
    const dict = (DICTS as Record<string, unknown>)[loc];
    if (!dict) { reply.code(404); return { error:"LOCALE_NOT_FOUND" }; }
    return { locale: loc, dict };
  });
  app.get("/api/i18n", async () => {
    return { locales: Object.keys(DICTS), defaultLocale: "pt" };
  });
}
