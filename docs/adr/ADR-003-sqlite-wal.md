# ADR 003 — SQLite WAL + migrations versionadas

**Data:** 2026-08-25
**Status:** Aceite

**Contexto:** Persistência local precisa ser simples, transacional e portável para Windows/Linux/Docker sem serviço externo.

**Decisão:** `node:sqlite` com WAL, `journal_mode=WAL`, migrations em `packages/persistence/src/migrations.ts`, repositories tipados e reidratação de `game_instances` no boot.

**Consequências:** Backup é cópia de ficheiro sqlite; `library/` nunca apagada pela app; `temp/` TTL 24h.
