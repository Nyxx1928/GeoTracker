/**
 * Page Object for the Login page (/login).
 *
 * WHY a Page Object?
 * - Selectors live in ONE place. If the UI changes, you fix one file, not every test.
 * - Methods represent USER ACTIONS (fillEmail, clickSignIn), not implementation details.
 * - No assertions inside page objects — assertions belong in the test file.
 *   Page objects return values that tests can assert on.
 *
 * Selector strategy (in order of preference):
 * 1. getByLabel() — most resilient (accessibility-based)
 * 2. getByPlaceholder() — good for form fields
 * 3. getByRole() — semantic HTML (button, link, heading)
 * 4. getByText() — visible text content
 * 5. locator() — CSS selector (last resort, brittle to class changes)
 */
class LoginPage {
  constructor(page) {
    this.page = page;

    // ---- Selectors ----
    // Note: The app's labels don't use htmlFor, so getByLabel won't work.
    // We use getByPlaceholder as the next-best resilient selector.
    this.emailInput = () => page.getByPlaceholder('Enter your email');
    this.passwordInput = () => page.getByPlaceholder('Enter your password');
    this.signInButton = () => page.getByRole('button', { name: 'Sign In' });
    this.loadingButton = () => page.getByRole('button', { name: /signing in/i });
    this.errorMessage = () => page.locator('.text-red-300 .font-medium');
    this.errorContainer = () => page.locator('.bg-red-950');
    this.createAccountLink = () => page.getByRole('button', { name: 'Create one' });
    this.passwordToggle = () => page.locator('button[type="button"]').filter({ has: page.locator('svg') }).last();
    this.heading = () => page.getByRole('heading', { name: /welcome/i });
  }

  /**
   * Navigate to the login page.
   * Uses baseURL from playwright.config.js, so '/login' resolves to 'http://localhost:3000/login'
   */
  async goto() {
    await this.page.goto('/login');
    // Wait for the page to be interactive — the heading is a good indicator
    await this.heading().waitFor({ state: 'visible' });
  }

  /**
   * Fill the email field.
   * @param {string} email
   */
  async fillEmail(email) {
    await this.emailInput().fill(email);
  }

  /**
   * Fill the password field.
   * @param {string} password
   */
  async fillPassword(password) {
    await this.passwordInput().fill(password);
  }

  /**
   * Click the Sign In button and wait for navigation or error.
   */
  async clickSignIn() {
    await this.signInButton().click();
  }

  /**
   * Convenience: fill form and submit in one call.
   * This is the most common user flow.
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  /**
   * Get the error message text after failed login.
   * Returns empty string if no error is visible.
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    const error = this.errorMessage();
    // Only try to get text if the element exists and is visible
    if (await error.isVisible().catch(() => false)) {
      return (await error.textContent()) || '';
    }
    return '';
  }

  /**
   * Wait for the error message to appear (useful after a failed login).
   * Throws if no error appears within the timeout.
   */
  async waitForError() {
    await this.errorContainer().waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Click the "Create one" link to navigate to the registration page.
   */
  async clickCreateAccount() {
    await this.createAccountLink().click();
  }

  /**
   * Toggle password visibility (click the eye icon).
   */
  async togglePasswordVisibility() {
    await this.passwordToggle().click();
  }

  /**
   * Get the current type attribute of the password input.
   * 'password' = hidden, 'text' = visible
   * @returns {Promise<string>}
   */
  async getPasswordInputType() {
    return await this.passwordInput().getAttribute('type');
  }

  /**
   * Wait for successful login redirect to /home.
   * @param {number} timeout - ms to wait (default 10s for slow backends)
   */
  async waitForRedirectToHome(timeout = 10_000) {
    await this.page.waitForURL('**/home', { timeout });
  }
}

module.exports = { LoginPage };
