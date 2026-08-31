# ADR 004 — Frontend vanilla ES-modules same-origin

**Data:** 2026-08-25
**Status:** Aceite

**Contexto:** Zero CDN/offline-first (§7) e compatibilidade com HTTP local sem HTTPS; frameworks pesados aumentam bundle e exigem build.

**Decisão:** HTML/CSS/JS vanilla servido por `@fastify/static` mesma origem, controllers contextuais por `ControllerView`, host big-screen e admin separados.

**Consequências:** Sem dependência de rede externa; CSP `connect-src self ws: wss:`; i18n via `/api/i18n`.
