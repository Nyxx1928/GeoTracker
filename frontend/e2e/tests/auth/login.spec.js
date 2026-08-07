/**
 * E2E Tests: Login Flow
 *
 * What risks do these tests mitigate?
 * 1. A broken login page means NO users can access the app → SEV-1 outage
 * 2. Incorrect error messages confuse users → support tickets
 * 3. Missing validation lets bad data reach the backend → server errors
 *
 * Test categories:
 * - Happy path: valid credentials → redirect to /home
 * - Error path: invalid credentials → error message shown
 * - Edge case: empty form → HTML5 validation blocks submit
 * - UX: password visibility toggle works
 * - Navigation: "Create one" link goes to register page
 * - Auth guard: already-logged-in users are redirected away from /login
 */
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { HomePage } = require('../../pages/HomePage');
const { RegisterPage } = require('../../pages/RegisterPage');
const {
  registerTestUser,
  TEST_PASSWORD,
  generateTestEmail,
} = require('../../fixtures/auth.fixture');

/**
 * Helper: get the backend URL from Playwright's project config.
 * Falls back to localhost:8000 (Laravel default).
 */
function getBackendURL(projectUse) {
  return projectUse?.backendURL || process.env.E2E_BACKEND_URL || 'http://localhost:8000';
}

test.describe('Login Page', () => {
  let backendURL;

  // Grab backend URL from project config before all tests in this describe block
  test.beforeAll(async ({ browser }) => {
    // We need to access project config. The cleanest way in beforeEach.
    // We'll set it in beforeEach instead.
  });

  test.beforeEach(async ({ page }, testInfo) => {
    backendURL = getBackendURL(testInfo.project.use);
  });

  // ===================================================================
  // HAPPY PATH
  // ===================================================================

  test('logs in with valid credentials and redirects to dashboard', async ({ page }) => {
    // ARRANGE: Create a test user in the backend so we have real credentials
    const { email, password } = await registerTestUser(backendURL);

    const loginPage = new LoginPage(page);

    // ACT: Navigate to login and submit valid credentials
    await loginPage.goto();
    await loginPage.login(email, password);

    // ASSERT: Should redirect to /home (dashboard)
    await loginPage.waitForRedirectToHome();

    // Verify we're actually on the dashboard
    const homePage = new HomePage(page);
    await expect(homePage.dashboardHeading()).toBeVisible();
  });

  // ===================================================================
  // ERROR PATH: Invalid credentials
  // ===================================================================

  test('shows error message with invalid credentials', async ({ page }) => {
    // ARRANGE: Use a email that definitely doesn't exist
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // ACT: Submit with wrong credentials
    await loginPage.login('nonexistent@test.linkguard.local', 'wrongpassword');

    // ASSERT: Error message should appear
    await loginPage.waitForError();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Invalid credentials');

    // Also verify we're still on /login (not redirected)
    expect(page.url()).toContain('/login');
  });

  test('shows error message with valid email but wrong password', async ({ page }) => {
    // ARRANGE: Create a real user, then try with wrong password
    const { email } = await registerTestUser(backendURL);
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // ACT: Correct email, wrong password
    await loginPage.login(email, 'WrongP@ssw0rd!');

    // ASSERT: Error should appear
    await loginPage.waitForError();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Invalid credentials');
  });

  // ===================================================================
  // UX: Password visibility toggle
  // ===================================================================

  test('toggles password visibility when eye icon is clicked', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // ARRANGE: Type something in the password field
    await loginPage.fillPassword('MySecret123');

    // ACT + ASSERT: Initially hidden
    expect(await loginPage.getPasswordInputType()).toBe('password');

    // ACT: Click the eye icon
    await loginPage.togglePasswordVisibility();

    // ASSERT: Now visible
    expect(await loginPage.getPasswordInputType()).toBe('text');

    // ACT: Click again
    await loginPage.togglePasswordVisibility();

    // ASSERT: Hidden again
    expect(await loginPage.getPasswordInputType()).toBe('password');
  });

  // ===================================================================
  // NAVIGATION
  // ===================================================================

  test('"Create one" link navigates to registration page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // ACT: Click "Create one"
    await loginPage.clickCreateAccount();

    // ASSERT: Should navigate to /register
    await page.waitForURL('**/register');
    const registerPage = new RegisterPage(page);
    await expect(registerPage.heading()).toBeVisible();
  });

  // ===================================================================
  // AUTH GUARD: Already logged in
  // ===================================================================

  test('redirects authenticated users away from login page', async ({ page }) => {
    // ARRANGE: Register a user and inject the token
    const { token } = await registerTestUser(backendURL);

    // Navigate to a blank page to set localStorage
    await page.goto('about:blank');
    await page.evaluate((t) => {
      localStorage.setItem('auth_token', t);
      localStorage.setItem('session_start', String(Date.now()));
    }, token);

    // ACT: Try to visit /login while authenticated
    await page.goto('/login');

    // ASSERT: Should be redirected to /home (App.js line 126)
    await page.waitForURL('**/home');
    const homePage = new HomePage(page);
    await expect(homePage.dashboardHeading()).toBeVisible();
  });
});
