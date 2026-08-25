# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-PT/1.1.0/);
versão inicial segue [Semantic Versioning](https://semver.org/lang/pt-PT/).

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
