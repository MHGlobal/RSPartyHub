# RS Party Hub — Dockerfile (spec §AO.3, Etapa 22)
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps ./apps
COPY tsconfig.base.json vitest.config.ts ./
RUN pnpm install --frozen-lockfile
RUN pnpm -r exec tsc --noEmit

FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps ./apps
COPY tsconfig.base.json ./
RUN pnpm install --frozen-lockfile --prod=false
ENV RS_PARTY_HOME=/data
ENV RS_PARTY_PORT=3210
ENV RS_PARTY_BIND=0.0.0.0
VOLUME ["/data"]
EXPOSE 3210
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost:3210/healthz || exit 1
CMD ["node", "--experimental-strip-types", "--no-warnings", "apps/server/src/index.ts"]
