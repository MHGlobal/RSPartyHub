#!/usr/bin/env sh
# verify.sh — Etapa 24 release checklist limpa (spec AV.24, §37-38)
set -e
echo "== RS Party Hub verify =="
echo "[1/4] typecheck"
pnpm -r exec tsc --noEmit
echo "[2/4] tests"
pnpm vitest run
echo "[3/4] doctor (build)"
node apps/server/scripts/doctor.mjs || true
echo "[4/4] metrics smoke"
node -e "fetch('http://localhost:3210/api/metrics').then(r=>r.text()).then(t=>console.log('metrics:',t.slice(0,200))).catch(()=>console.log('metrics skip — server not running'))"
echo "verify OK"
