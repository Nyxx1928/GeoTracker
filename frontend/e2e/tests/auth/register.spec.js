/**
 * E2E Tests: Registration Flow
 *
 * What risks do these tests mitigate?
 * - Form validation prevents bad data from reaching the backend
 * - Registration API integration works end-to-end
 * - OTP screen renders correctly after successful registration
 * - Passwords mismatch error is shown before API call (client-side validation)
 *
 * IMPORTANT: The backend has a rate limiter on /api/register (3 per 60 min).
 * We minimize actual API calls by:
 * - Testing client-side validation first (no API call)
 * - Only doing ONE actual registration per describe block
 * - Testing OTP screen state without actually submitting verification code
 *
 * We do NOT test full OTP verification because:
 * - We can't read actual emails in E2E tests
 * - The OTP code is random (6 digits generated server-side)
 * - Full verification is tested by backend feature tests (EmailVerificationTest.php)
 */
const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../../pages/RegisterPage');
const { LoginPage } = require('../../pages/LoginPage');
const { generateTestEmail, TEST_PASSWORD } = require('../../fixtures/auth.fixture');

test.describe('Registration Page', () => {
  // ===================================================================
  // CLIENT-SIDE VALIDATION (no API calls)
  // ===================================================================

  test('shows error when passwords do not match', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    // ACT: Fill form with mismatched passwords
    await registerPage.fillForm({
      name: 'Test User',
      email: generateTestEmail('mismatch'),
      password: 'StrongP@ss1!',
    });
    // Override confirm with different password
    await registerPage.fillConfirmPassword('DifferentP@ss2!');
    await registerPage.clickCreateAccount();

    // ASSERT: Error should appear (client-side check, no API call)
    await registerPage.waitForError();
    const errorText = await registerPage.getErrorMessage();
    expect(errorText).toContain('Passwords do not match');
  });

  // ===================================================================
  // SUCCESSFUL REGISTRATION → OTP SCREEN
  // ===================================================================

  test('successful registration shows OTP verification screen', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    const testEmail = generateTestEmail('otpflow');

    // ACT: Fill and submit the registration form
    await registerPage.register({
      name: 'OTP Test User',
      email: testEmail,
      password: TEST_PASSWORD,
    });

    // ASSERT: OTP screen should appear (step transitions from 'form' to 'otp')
    await registerPage.waitForOtpScreen();

    // The displayed email should match what we entered
    const displayedEmail = await registerPage.getDisplayedEmail();
    expect(displayedEmail).toBe(testEmail);

    // OTP inputs should be visible (6 digits)
    const otpInputs = registerPage.otpDigits();
    await expect(otpInputs.first()).toBeVisible();
    expect(await otpInputs.count()).toBe(6);
  });

  // ===================================================================
  // OTP SCREEN: "Use different email" goes back to form
  // ===================================================================

  test('"Use a different email" returns to registration form', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    // ARRANGE: Complete registration to reach OTP screen
    await registerPage.register({
      name: 'Back Test',
      email: generateTestEmail('back'),
      password: TEST_PASSWORD,
    });
    await registerPage.waitForOtpScreen();

    // ACT: Click "Use a different email"
    await registerPage.clickBackToEmail();

    // ASSERT: Registration form should be visible again
    await expect(registerPage.heading()).toBeVisible();
    await expect(registerPage.emailInput()).toBeVisible();
  });

  // ===================================================================
  // NAVIGATION: Login → Register
  // ===================================================================

  test('can navigate from login page to register page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // ACT: Click "Create one" (the "Don't have an account?" link)
    await loginPage.clickCreateAccount();

    // ASSERT: Should navigate to /register
    await page.waitForURL('**/register');
    const registerPage = new RegisterPage(page);
    await expect(registerPage.heading()).toBeVisible();
  });

  // ===================================================================
  // NAVIGATION: Register → Login
  // ===================================================================

  test('can navigate from register page to login page', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    // ACT: Click "Sign in" ("Already have an account?" link)
    await registerPage.signInLink().click();

    // ASSERT: Should navigate to /login
    await page.waitForURL('**/login');
    const loginPage = new LoginPage(page);
    await expect(loginPage.heading()).toBeVisible();
  });

  // ===================================================================
  // UX: Password visibility toggles
  // ===================================================================

  test('password visibility toggles work independently for password and confirm', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    // Fill both password fields
    await registerPage.fillPassword('TestPass123!');
    await registerPage.fillConfirmPassword('TestPass123!');

    // Both should start as 'password' type
    const passwordInput = page.getByPlaceholder('Create a password');
    const confirmInput = page.getByPlaceholder('Confirm your password');
    expect(await passwordInput.getAttribute('type')).toBe('password');
    expect(await confirmInput.getAttribute('type')).toBe('password');

    // Toggle password visibility
    await registerPage.passwordToggle().click();
    expect(await passwordInput.getAttribute('type')).toBe('text');
    // Confirm should still be hidden
    expect(await confirmInput.getAttribute('type')).toBe('password');

    // Toggle confirm visibility
    await registerPage.confirmPasswordToggle().click();
    expect(await confirmInput.getAttribute('type')).toBe('text');
  });
});
