# Troubleshooting — RS Party Hub

## Telefones não encontram o host
1. `pnpm --filter @rs-party/server doctor` ou `GET /api/admin/doctor` (com token) — verifica `lan`, `port`, `qr`.
2. Confirma mesma rede Wi-Fi/hotspot; desativa dados móveis no telefone.
3. Tenta IP literal do `GET /api/info` em vez de `.local`.
4. Verifica firewall (Windows: permitir Node) e AP isolation no router.

## Porta em uso
`RS_PARTY_PORT=3210` (env) ou `doctor` check `port`. Muda porta e reinicia.

## DB corrupta
`PRAGMA integrity_check` via `sqlite3`; Doctor `db` fail orienta não apagar `library/`. Restaura backup `data/rsparty.sqlite` com servidor parado.

## Packs rejeitados
`GET /api/packs` e `GET /api/admin/diagnostics` listam `packsLoaded` e `packs-quarantine`. Valida JSON via `POST /api/admin/packs/import`.

## Media quota cheia
`GET /api/admin/diagnostics` mostra `mediaBytes`. Apaga via `DELETE /api/media/:id` (admin) ou limpa `uploads/approved`.

## Logs
`$RS_PARTY_HOME/logs/` (quando habilitado) + `auditRecent` em diagnostics. Tokens nunca em plaintext.

## Restart sem perder festa
Salas com jogo ativo reidratam após restart (ver `chaos.test.ts`); lobby puro não reidrata — limitação documentada.
