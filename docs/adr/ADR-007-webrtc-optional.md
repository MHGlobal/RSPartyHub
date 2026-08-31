# ADR 007 — WebRTC opcional, relay HTTP como baseline

**Data:** 2026-08-25
**Status:** Aceite

**Contexto:** Party Drop cross-platform (PairDrop/Snapdrop) mostra que WebRTC DataChannel otimiza P2P mas falha em LAN restritiva.

**Decisão:** Baseline relay HTTP via `/api/media/upload` + `GET /api/media/:id` confiável em LAN; WebRTC é otimização futura, não requisito de funcionamento.

**Consequências:** Latência maior mas sem necessidade de STUN/TURN; Jukebox/Photo Wall usam media service existente.
