# ADR 006 — Same-origin static + WebSocket

**Data:** 2026-08-25
**Status:** Aceite

**Contexto:** Chrome Local Network Access bloqueia página pública acessando IP privado; evitar fetch cross-origin.

**Decisão:** Frontend e realtime no mesmo host/origin local; jogador abre direto `http://IP:3210`; sem app pública intermediária.

**Consequências:** CORS restrito a LAN privada + localhost + allowlist `RS_PARTY_CORS_ORIGINS`; build serve tudo same-origin.
