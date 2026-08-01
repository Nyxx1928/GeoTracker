// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration for LinkGuard E2E tests.
 *
 * Key design decisions:
 * - Runs against a locally-running frontend (localhost:3000) + backend (localhost:8000)
 * - Chromium as primary browser (covers 90%+ of real users)
 * - Firefox as secondary for cross-browser smoke tests
 * - Screenshots + traces ONLY on failure — keeps CI fast on green runs
 * - 30s test timeout: generous enough for slow analysis API calls
 * - Retries: 0 locally (fail fast), 1 in CI (flaky network mitigation)
 *
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // ---- Test files location ----
  testDir: './tests',

  // ---- Global timeout: 30 seconds per test() ----
  // Individual assertions time out at 5s by default
  timeout: 30_000,

  // ---- Expect timeout: 5 seconds per assertion ----
  // Playwright auto-retries assertions until this timeout
  expect: {
    timeout: 5_000,
  },

  // ---- Fail-fast: stop on first failure (locally) ----
  // In CI we want to see ALL failures, not just the first one
  fullyParallel: true,

  // ---- Retry strategy ----
  // 0 locally = fail fast so you fix immediately
  // 1 in CI = tolerate one flaky run (network blips in Docker)
  retries: process.env.CI ? 1 : 0,

  // ---- Parallel workers ----
  // CI: 2 workers (limited by GitHub Actions resources)
  // Local: half your CPU cores (Playwright default)
  workers: process.env.CI ? 2 : undefined,

  // ---- Reporter: list on terminal, HTML for CI artifacts ----
  reporter: [
    ['list'],                                           // concise terminal output
    ['html', { outputFolder: 'playwright-report', open: 'never' }], // rich HTML report
  ],

  // ---- Shared settings for all projects ----
  use: {
    // The frontend URL — all page.goto('/path') calls resolve relative to this
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',

    // The backend API URL — used by test helpers for auth setup
    // Playwright doesn't have a native "extra config" field, so we use
    // a convention: env vars or process.env
    // (read via test.info().project.use in tests if needed)

    // Collect traces on first retry (NOT on every run — too much data)
    trace: 'on-first-retry',

    // Screenshots only on failure — keeps artifact size small
    screenshot: 'only-on-failure',

    // Videos on failure only (significantly faster than always recording)
    video: 'retain-on-failure',
  },

  // ---- Browser projects ----
  // Each project runs in a fully isolated browser context.
  // localStorage, cookies, IndexedDB are NOT shared between tests.
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Store the backend URL so page objects can reference it
        // Playwright tests access this via test.info().project.use
        backendURL: process.env.E2E_BACKEND_URL || 'http://localhost:8000',
      },
    },

    // Uncomment to add Firefox coverage — adds ~30% runtime for CI
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     backendURL: process.env.E2E_BACKEND_URL || 'http://localhost:8000',
    //   },
    // },
  ],

  // ---- Web server: auto-start the frontend dev server ----
  // Playwright starts this before tests, kills it after.
  // Set E2E_SKIP_WEB_SERVER=1 to manage the server yourself (e.g., docker-compose).
  webServer: process.env.E2E_SKIP_WEB_SERVER
    ? undefined
    : {
        command: 'npm start',
        url: 'http://localhost:3000',
        timeout: 120_000,       // 2 minutes for CRA dev server cold start
        reuseExistingServer: true, // reuse if you already have it running
        cwd: '../',             // run from frontend/ directory
      },

  // ---- Global setup/teardown ----
  // globalSetup: require.resolve('./fixtures/global-setup'),
  // globalTeardown: require.resolve('./fixtures/global-teardown'),
});
