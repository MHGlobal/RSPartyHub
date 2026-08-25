import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "packages/*/test/**/*.test.ts",
      "packages/games/*/test/**/*.test.ts",
      "apps/server/test/**/*.test.ts",
    ],
    environment: "node",
    testTimeout: 15000,
    hookTimeout: 20000,
    // keep memory low on small hosts
    pool: "forks",
    poolOptions: { forks: { singleFork: false, maxForks: 2 } },
  },
});
