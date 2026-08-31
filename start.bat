@echo off
REM RS Party Hub — launcher Windows (spec §AO.1)
echo RS Party Hub — a iniciar...
where node >nul 2>nul || (echo Node.js >=22 nao encontrado & exit /b 1)
call corepack enable 2>nul
call pnpm install --frozen-lockfile 2>nul || call pnpm install
call pnpm --filter @rs-party/server dev
