/**
 * Authentication fixture for E2E tests.
 *
 * PROBLEM: Every authenticated page test would need to go through the login
 * flow (navigate → fill email → fill password → click → wait for redirect).
 * This is slow, repetitive, and makes tests brittle (if login breaks, every
 * test breaks — a "cascading failure" anti-pattern).
 *
 * SOLUTION: Programmatic auth setup via the backend API. We call the API
 * directly (just like the frontend does), get a token, and inject it into
 * localStorage. This is still an INTEGRATION with the real backend — we're
 * just using the API path, not the UI path.
 *
 * WHY THIS IS SAFE:
 * - We still test the REAL backend auth system (token generation, validation)
 * - We're not mocking anything — the token is real
 * - The token gets attached by the real axios interceptor on every request
 * - If the backend auth breaks, this fixture ALSO breaks (correct behavior)
 *
 * FLOW:
 * 1. Make HTTP request to POST /api/register (or /api/login) to get a token
 * 2. Set the token + session_start in localStorage
 * 3. Navigate to the target page — the app reads the token and validates with GET /api/me
 * 4. If /api/me succeeds, the user is authenticated and the page renders
 */

const TEST_USER_PREFIX = 'e2e_test_';
const TEST_PASSWORD = 'TestP@ss123!';

/**
 * Generate a unique email for a test user.
 * Using timestamps + random ensures no collisions between parallel test runs.
 * @param {string} [suffix=''] - Optional identifier for the test
 * @returns {string}
 */
function generateTestEmail(suffix = '') {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 6);
  const name = suffix ? `${suffix}_${ts}_${rand}` : `${ts}_${rand}`;
  return `${TEST_USER_PREFIX}${name}@test.linkguard.local`;
}

/**
 * Register a new test user via the backend API.
 *
 * Note: The backend's /api/register endpoint returns a token immediately.
 * The user will be unverified (email not confirmed), but the token is valid
 * for accessing protected routes. A VerificationBanner will appear, but
 * it doesn't block page interaction.
 *
 * @param {string} backendURL - e.g., 'http://localhost:8000'
 * @param {object} [opts]
 * @param {string} [opts.email] - if not provided, generates a unique one
 * @param {string} [opts.password] - defaults to TEST_PASSWORD
 * @param {string} [opts.name] - display name for the user
 * @returns {Promise<{email: string, password: string, token: string}>}
 */
async function registerTestUser(backendURL, { email, password, name } = {}) {
  const userEmail = email || generateTestEmail();
  const userPassword = password || TEST_PASSWORD;

  // Use Node.js built-in fetch (available in Node 18+ which Playwright requires)
  const response = await fetch(`${backendURL}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      name: name || 'E2E Test User',
      email: userEmail,
      password: userPassword,
      password_confirmation: userPassword,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to register test user (${response.status}): ${body}`
    );
  }

  const data = await response.json();

  if (!data.token) {
    throw new Error(
      `Registration succeeded but no token returned. Response: ${JSON.stringify(data)}`
    );
  }

  return {
    email: userEmail,
    password: userPassword,
    token: data.token,
    user: data.user || null,
  };
}

/**
 * Login an existing test user via the backend API.
 *
 * Use this when you need to test login-related flows where you want a
 * pre-existing user (not freshly registered).
 *
 * @param {string} backendURL
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
async function loginTestUser(backendURL, email, password) {
  const response = await fetch(`${backendURL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to login test user (${response.status}): ${body}`
    );
  }

  const data = await response.json();

  if (!data.token) {
    throw new Error(
      `Login succeeded but no token returned. Response: ${JSON.stringify(data)}`
    );
  }

  return {
    token: data.token,
    user: data.user || null,
  };
}

/**
 * Inject authentication into a Playwright page's localStorage.
 *
 * This is the key function — it sets the exact same localStorage values
 * that the real login/register flow would set, tricking the React app
 * into thinking the user is already authenticated.
 *
 * IMPORTANT: Must be called BEFORE navigating to any page, because the
 * React app checks localStorage on mount (App.js useEffect).
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} token - the Bearer token from the backend
 */
async function injectAuthToken(page, token) {
  // Navigate to a blank page first — localStorage requires a page context
  await page.goto('about:blank');

  await page.evaluate((authToken) => {
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('session_start', String(Date.now()));
  }, token);
}

/**
 * Create a fully authenticated Playwright page.
 *
 * This is the primary helper for authenticated tests. It:
 * 1. Registers a new test user via the API
 * 2. Gets the token
 * 3. Injects it into localStorage
 * 4. Returns everything the test needs
 *
 * USAGE IN TESTS:
 * ```js
 * const { page, credentials } = await createAuthenticatedPage(browser, backendURL);
 * const homePage = new HomePage(page);
 * await homePage.goto();
 * // ... test authenticated features
 * ```
 *
 * @param {import('@playwright/test').Browser} browser
 * @param {string} backendURL
 * @param {object} [opts]
 * @returns {Promise<{page: Page, credentials: {email, password, token}}>}
 */
async function createAuthenticatedPage(browser, backendURL, opts = {}) {
  // Create a new isolated browser context
  // Each context has its own localStorage — no cross-test contamination
  const context = await browser.newContext();
  const page = await context.newPage();

  // Register user and get token
  const { email, password, token } = await registerTestUser(backendURL, opts);

  // Inject token into localStorage
  await injectAuthToken(page, token);

  return {
    page,
    context,
    credentials: { email, password, token },
    // Convenience cleanup function
    cleanup: async () => {
      await context.close();
    },
  };
}

module.exports = {
  registerTestUser,
  loginTestUser,
  injectAuthToken,
  createAuthenticatedPage,
  generateTestEmail,
  TEST_PASSWORD,
  TEST_USER_PREFIX,
};
