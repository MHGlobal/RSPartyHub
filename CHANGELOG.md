# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-PT/1.1.0/);
versão inicial segue [Semantic Versioning](https://semver.org/lang/pt-PT/).

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
