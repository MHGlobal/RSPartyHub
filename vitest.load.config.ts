import { defineConfig } from "vitest/config";

/**
 * Dedicated config for the standalone load simulation.
 * Deliberately EXCLUDED from the default suite (`*.test.ts` glob does not
 * match `.load.ts`) so CI stays green on constrained hosts; run manually:
 *   corepack pnpm vitest run --config vitest.load.config.ts
 */
export default defineConfig({
  test: {
    include: ["apps/server/scripts/*.load.ts"],
    environment: "node",
    testTimeout: 180_000,
    hookTimeout: 60_000,
    pool: "forks",
    poolOptions: { forks: { singleFork: true } },
  },
});
