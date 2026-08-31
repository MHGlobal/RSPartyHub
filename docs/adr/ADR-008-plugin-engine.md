# ADR 008 — Plugin engine + PRNG seeded + harness

**Data:** 2026-08-25
**Status:** Aceite

**Contexto:** 10+ jogos precisam compartilhar lifecycle, scoring, timers e testes determinísticos sem duplicar código.

**Decisão:** `packages/game-engine` expõe `GameRegistry`, `createRuntime`, `validateConfig`, `getPublicView/getPrivateView`, PRNG `mulberry32` seeded, `FakeClock` e harness headless; cada jogo é pacote `packages/games/*`.

**Consequências:** Scoring ledger append-only; snapshots filtrados por papel; testes 80/80 para 10 jogos + runtime tick.
