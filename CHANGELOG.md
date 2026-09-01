# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-PT/1.1.0/);
versão inicial segue [Semantic Versioning](https://semver.org/lang/pt-PT/).

## [0.3.0] — 2026-08-31 — Etapas 20→24 hardening, chaos/load, packaging, docs

### Added
- Etapa 20 — Hardening: CORS LAN allowlist (`RS_PARTY_CORS_ORIGINS`), CSP `base-uri self object-src none`, `Cache-Control no-store`, `maxHttpBufferSize 64KB`, `X-Powered-By`; suite `security.test.ts` (XSS, traversal, headers, admin auth, rate-limit) — 5 testes.
- Etapa 21 — Chaos/resiliência: `chaos.test.ts` (duplicate eventId idempotência, disconnect/resume, restart rehydrate) — 3 testes; load segue `vitest.load.config.ts` (30 clientes).
- Etapa 22 — Packaging: `Dockerfile` + `docker-compose.yml` + `.dockerignore` + `start.sh`/`start.bat` + `HEALTHCHECK /healthz`; `package.json#verify` e `scripts/verify.sh`.
- Etapa 23 — Docs: `docs/adr/ADR-001..008`, `SECURITY.md`, `docs/NETWORKING.md`, `docs/TROUBLESHOOTING.md`, `.env.example` com `RS_PARTY_LOG_LEVEL/CORS_ORIGINS/HOSTNAME`.
- Aliases §180: `GET /api/network`, `/api/v1/network`, `/api/v1/games`, `/api/games/:pluginId`, `/api/v1/admin/diagnostics|doctor|metrics|restore`, `/api/v1/health`; `GET /api/rooms` stub; Doctor checks expandidos (Node, ffmpeg hint, clock, mDNS, firewall, WebSocket).

### Changed
- `http.ts` CSP hardening + headers; `index.ts` CORS validação LAN privada + localhost + allowlist; `doctor.ts` + `diagnostics-routes.ts` expandidos; total **150/150** testes verdes.

## [0.2.0] — 2026-08-31 — Etapas 15→19 completas (100% spec P0 + hardening)

### Added
- Etapa 15 — Content packs: `packages/content` (schemas quiz/survey, pipeline 3 estágios, PackLibrary com quarentena, `GET /api/packs` e `POST /api/admin/packs/import`), injeção `settings.packId→questions` no quiz-rush.
- Etapa 16 — Media upload pipeline + Party Drop: `MediaService` (allowlist, magic-bytes, UUID, path containment, 10MB/500MB quota, SHA256), `POST /api/media/upload` (multipart + JSON base64), `GET /api/media`, `GET /api/media/:id`, `DELETE` admin; Party Drop via HTTP relay LAN; security headers CSP/nosniff.
- Etapa 17 — Photo Wall (`GET /api/photo-wall`, consent withdraw) + Jukebox (`POST /api/jukebox/enqueue` só audio, voto só queued, skip host-only) — migration v2 `media_items` + `jukebox_queue`.
- Etapa 18 — PT/EN i18n (`/api/i18n`, `/api/i18n/:locale`, seletor frontend) + acessibilidade (focus-visible, reduced-motion, high-contrast, skip-link, targets 44px, ARIA).
- Etapa 19 — Diagnostics/Doctor: `GET /api/admin/diagnostics`, `GET /api/admin/doctor` (checks LAN/QR/dirs/DB/packs/quota/port), `GET /api/metrics`, `POST /api/admin/backups`, CLI `node scripts/doctor.mjs` (`pnpm --filter @rs-party/server doctor`).
- Testes: 27 novos (media 8, jukebox/photo 2, i18n 5, diagnostics 5, content 7) — total 132/132; `tsc --noEmit` limpo.

### Security
- (continua 0.1.0) + MIME spoof mitigation, traversal containment, quota, CSP, X-Content-Type-Options nosniff, Referrer/Frame policies.

## [0.1.0] — 2026-08-25

### Added
- Servidor autoritativo Fastify + Socket.IO com bind LAN, descoberta de interfaces,
  QR de entrada (`/api/qr`) e endpoints `healthz`/`readyz` + admin overview protegido.
- Persistência SQLite via `node:sqlite` com WAL, migrations versionadas e
  repositories tipados (rooms, players, game_instances, audit_events).
- Protocolo realtime com envelope `eventId/clientSeq` ↔ `serverSeq/stateVersion`,
  ACK para ações críticas, janela de idempotência, rate limits (§10.8) e
  reconexão por resume-token com hash SHA-256.
- Game engine com contrato de plugins puro, PRNG mulberry32 seeded, FakeClock,
  registry e harness headless de testes.
- 10 jogos P0 completos com testes determinísticos:
  quiz-rush, buzzer-arena, majority-vote, live-bingo, bluff-battle,
  draw-guess, charades, spy-room, hot-potato, survey-says.
- Party Mix com encadeamento automático entre resultados.
- Frontend vanilla (join, controller genérico por ControllerView, palco do
  anfitrião com QR/placar/moderação, admin dashboard) — zero CDN.
- Suite de testes: 105 testes (unidade + integração socket real) +
  simulação de carga standalone para 30 clientes.

### Security
- Tokens de resume guardados apenas como hash; metadados de auditoria sanitizados.
- Allowlist de colunas nas atualizações SQL + queries 100% parametrizadas.
- Validação Zod em todas as entradas realtime; `eventId` limitado a 64 chars.
