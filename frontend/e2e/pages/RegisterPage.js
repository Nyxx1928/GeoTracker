/**
 * Page Object for the Register page (/register).
 *
 * Two-step flow:
 * 1. Registration form (name, email, password, confirm password)
 * 2. OTP verification (6-digit code entry)
 *
 * The OTP screen is rendered INLINE (same component, different `step` state),
 * so there's no navigation between the two steps.
 */
class RegisterPage {
  constructor(page) {
    this.page = page;

    // ---- Registration Form ----
    this.usernameInput = () => page.getByPlaceholder('Enter your username');
    this.emailInput = () => page.getByPlaceholder('Enter your email');
    this.passwordInput = () => page.getByPlaceholder('Create a password');
    this.confirmPasswordInput = () => page.getByPlaceholder('Confirm your password');
    this.createAccountButton = () => page.getByRole('button', { name: 'Create Account' });
    this.loadingButton = () => page.getByRole('button', { name: /creating account/i });
    this.errorMessage = () => page.locator('.text-red-300 .font-medium');
    this.heading = () => page.getByRole('heading', { name: /get started/i });

    // Password visibility toggles
    this.passwordToggle = () => this.passwordInput().locator('..').locator('button[type="button"]').first();
    this.confirmPasswordToggle = () => this.confirmPasswordInput().locator('..').locator('button[type="button"]').first();

    // Navigation
    this.signInLink = () => page.getByRole('button', { name: 'Sign in' });

    // ---- OTP Verification Screen ----
    this.otpHeading = () => page.getByRole('heading', { name: /check your email/i });
    this.otpDigits = () => page.locator('input[inputmode="numeric"]');
    this.verifyEmailButton = () => page.getByRole('button', { name: 'Verify Email' });
    this.verifyingButton = () => page.getByRole('button', { name: /verifying/i });
    this.resendButton = () => page.getByRole('button', { name: 'Resend code' });
    this.resendCooldown = () => page.getByText(/resend code in \d+s/i);
    this.otpError = () => page.locator('.bg-red-950 .text-red-300');
    this.backToEmailButton = () => page.getByRole('button', { name: /use a different email/i });
    this.emailDisplay = () => page.locator('strong.text-gray-200');
  }

  /**
   * Navigate to the registration page.
   */
  async goto() {
    await this.page.goto('/register');
    await this.heading().waitFor({ state: 'visible' });
  }

  // ---- Form Actions ----

  async fillUsername(name) {
    await this.usernameInput().fill(name);
  }

  async fillEmail(email) {
    await this.emailInput().fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput().fill(password);
  }

  async fillConfirmPassword(password) {
    await this.confirmPasswordInput().fill(password);
  }

  /**
   * Convenience: fill all registration fields.
   * @param {object} opts
   * @param {string} [opts.name]
   * @param {string} opts.email
   * @param {string} opts.password
   */
  async fillForm({ name = '', email, password } = {}) {
    if (name) await this.fillUsername(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(password);
  }

  async clickCreateAccount() {
    await this.createAccountButton().click();
  }

  /**
   * Register with the given credentials and wait for OTP screen.
   * @param {object} opts
   * @param {string} [opts.name]
   * @param {string} opts.email
   * @param {string} opts.password
   */
  async register({ name = '', email, password } = {}) {
    await this.fillForm({ name, email, password });
    await this.clickCreateAccount();
  }

  // ---- Error Handling ----

  async getErrorMessage() {
    const error = this.errorMessage();
    if (await error.isVisible().catch(() => false)) {
      return (await error.textContent()) || '';
    }
    return '';
  }

  async waitForError() {
    await this.errorMessage().waitFor({ state: 'visible', timeout: 5000 });
  }

  // ---- OTP Screen ----

  /**
   * Wait for the OTP verification screen to appear.
   */
  async waitForOtpScreen() {
    await this.otpHeading().waitFor({ state: 'visible', timeout: 10_000 });
  }

  /**
   * Check if the OTP screen is currently visible.
   * @returns {Promise<boolean>}
   */
  async isOtpScreen() {
    return await this.otpHeading().isVisible().catch(() => false);
  }

  /**
   * Fill the 6 OTP digits one by one.
   * @param {string} code - 6-digit code as string (e.g., "123456")
   */
  async fillOtpDigits(code) {
    const digits = String(code).split('');
    const inputs = this.otpDigits();

    for (let i = 0; i < digits.length; i++) {
      await inputs.nth(i).fill(digits[i]);
    }
  }

  /**
   * Get the email displayed on the OTP screen.
   * @returns {Promise<string>}
   */
  async getDisplayedEmail() {
    const el = this.emailDisplay();
    if (await el.isVisible().catch(() => false)) {
      return (await el.textContent()) || '';
    }
    return '';
  }

  async clickVerifyEmail() {
    await this.verifyEmailButton().click();
  }

  async clickResendCode() {
    await this.resendButton().click();
  }

  async getOtpError() {
    const error = this.otpError();
    if (await error.isVisible().catch(() => false)) {
      return (await error.textContent()) || '';
    }
    return '';
  }

  /**
   * Wait for redirect to home after successful verification.
   */
  async waitForRedirectToHome() {
    await this.page.waitForURL('**/home', { timeout: 10_000 });
  }

  /**
   * Click "Use a different email" to go back to the registration form.
   */
  async clickBackToEmail() {
    await this.backToEmailButton().click();
  }
}

module.exports = { RegisterPage };
