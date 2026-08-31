# ADR 001 — Servidor autoritativo

**Data:** 2026-08-25
**Status:** Aceite

**Contexto:** Jogo local-first com 3-30 clientes em LAN instável precisa de fonte única de verdade para evitar cheating e divergência.

**Decisão:** Node.js + Fastify + Socket.IO como autoridade única; todas as transições, timers (deadlines server-side) e scoring são calculados no servidor; cliente envia intenções validadas por Zod.

**Consequências:** Latência de ACK inclui validação mas fan-out coalescido 50ms; reconexão exige snapshot filtrado por papel.

