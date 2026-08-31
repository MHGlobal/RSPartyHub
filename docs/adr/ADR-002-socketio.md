# ADR 002 — Socket.IO com ACK e idempotência

**Data:** 2026-08-25
**Status:** Aceite

**Contexto:** Garantias DoD (§10) exigem entrega at most once com recuperação e ordenação; WebSocket puro exigiria protocolo custom.

**Decisão:** Socket.IO com envelopes `eventId/clientSeq ↔ serverSeq/stateVersion`, ACK para ações críticas, janela de idempotência 30s, `maxHttpBufferSize 64KB`.

**Consequências:** Recuperação via `STATE_SYNC` + snapshot completo; duplicate eventId retorna `duplicate:true` sem efeito duplo.
