import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  globalSetup: "./e2e/global-setup.ts",
  globalTeardown: "./e2e/global-teardown.ts",
  use: {
    baseURL: "http://127.0.0.1:3211",
    browserName: "chromium",
    ...devices["Desktop Chrome"],
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    command: "RS_PARTY_PORT=3211 RS_PARTY_HOME=.rs-party-e2e RS_PARTY_MDNS=false node --experimental-transform-types --no-warnings --experimental-loader ./e2e/ts-source-loader.mjs apps/server/src/index.ts",
    url: "http://127.0.0.1:3211/api/info",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
