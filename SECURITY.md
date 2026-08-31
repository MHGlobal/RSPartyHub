# Security — RS Party Hub

**Modelo de ameaças (§25):** rede local não é confiável; browser malicioso, brute de código, XSS via nickname/chat/pack, DoS via upload, CSWSH.

**Mitigações implementadas:**
- Validação Zod em todas as fronteiras (Socket.IO + HTTP) + `eventId ≤64` + janela idempotência + rate limits por IP/sessão (`gateway.ts`, `protocol`).
- Upload: allowlist MIME, sniff magic bytes, UUID storageKey, path containment, `10MB/file 500MB quota`, SHA256, sanitized name, `nosniff` (`media-service.ts`, `media.test.ts` 8 testes).
- Headers: `X-Content-Type-Options nosniff`, `Referrer no-referrer`, `X-Frame SAMEORIGIN`, `Permissions-Policy`, `CSP base-uri self object-src none` (`http.ts`).
- CORS: allowlist `RS_PARTY_CORS_ORIGINS` + validação LAN privada + localhost (`index.ts`).
- Admin: token `RS_PARTY_ADMIN_TOKEN` via `x-admin-token` header; endpoints `/api/admin/*` exigem token quando configurado (401 sem).
- Logs: tokens nunca em plaintext nos audits (hash SHA-256 para resume tokens).
- SQL: queries 100% parametrizadas + allowlist de colunas (`persistence`).

**Hardening pendente (roadmap):**
- Hash Argon2id para admin + sessão revogável + rate limit específico admin (§25.2).
- Proteção `image/svg+xml` XSS e ZIP bomb (§AK.2, #5).
- `HttpOnly/Secure` quando HTTPS futuro.

**Reportar vulnerabilidade:** abrir issue privada ou contactar maintainer do repo com PoC sem exfiltrar dados.
