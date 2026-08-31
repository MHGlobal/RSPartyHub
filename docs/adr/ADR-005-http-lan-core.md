# ADR 005 — Core HTTP LAN + progressive enhancement

**Data:** 2026-08-25
**Status:** Aceite

**Contexto:** APIs Secure Context (Service Worker, Wake Lock, sensores) exigem HTTPS e falham em `http://IP_LOCAL`; festa não pode depender disso.

**Decisão:** Baseline `http://<IP>:3210` com WebSocket; HTTPS local opcional; features sensíveis (Wake Lock, sensores) são enhancement com fallback.

**Consequências:** Discovery via enumeração de interfaces + QR; mDNS best-effort, nunca dependente.
