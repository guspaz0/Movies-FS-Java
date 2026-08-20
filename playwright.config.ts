import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for the Movies-FS-Java frontend.
 *
 * - `pnpm dev` serves the SPA on http://localhost:5173 (Vite dev server).
 * - The SPA calls the Java backend on http://localhost:8080 (VITE_DB_HOST),
 *   so `docker compose up` (MySQL + app) must be running for the API tests.
 *
 * The Playwright CDN is not reachable from this machine, so tests run
 * against an already-installed Chrome build (Brave or Edge). Override with
 * PLAYWRIGHT_CHANNEL=chrome to use a downloaded Chromium instead.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  globalSetup: "./tests/globalSetup.ts",
  globalTeardown: "./tests/globalTeardown.ts",
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.VITE_BASE_URL ?? "http://localhost:8080",
    headless: true,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
