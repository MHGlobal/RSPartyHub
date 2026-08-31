#!/usr/bin/env sh
# RS Party Hub — launcher Linux/macOS (spec §AO.1)
set -e
echo "RS Party Hub — a iniciar..."
if ! command -v node >/dev/null 2>&1; then echo "Node.js >=22 não encontrado"; exit 1; fi
if ! command -v pnpm >/dev/null 2>&1; then corepack enable; fi
pnpm install --frozen-lockfile 2>/dev/null || pnpm install
pnpm --filter @rs-party/server dev
