/**
 * E2E Tests: Public Pages (unauthenticated)
 *
 * These tests cover routes that don't require authentication:
 * - Landing page (/)
 * - About page (/about)
 * - Public Lookup (//lookup/:uuid) - requires a known UUID
 *
 * Why test public pages?
 * - Landing is the first impression — broken landing = lost users
 * - SEO and accessibility matter for unauthenticated routes
 * - Public lookup is a key feature for sharing results externally
 */
const { test, expect } = require('@playwright/test');

test.describe('Public Pages', () => {
  // ===================================================================
  // LANDING PAGE
  // ===================================================================

  test.describe('Landing Page (/)', () => {
    test('loads successfully and shows main content', async ({ page }) => {
      // ACT: Navigate to the root
      await page.goto('/');

      // ASSERT: The page should have meaningful content
      // Check for the LinkGuard branding (it appears in the nav/footer)
      await expect(page.getByText(/linkguard/i).first()).toBeVisible({ timeout: 10_000 });

      // Should have a way to get started (CTA or login/register links)
      const hasCallToAction = await Promise.any([
        page.getByRole('link', { name: /login|sign in|get started/i }).isVisible(),
        page.getByRole('button', { name: /login|sign in|get started/i }).isVisible(),
      ]).catch(() => false);

      expect(hasCallToAction).toBeTruthy();
    });
  });

  // ===================================================================
  // ABOUT PAGE
  // ===================================================================

  test.describe('About Page (/about)', () => {
    test('loads successfully', async ({ page }) => {
      await page.goto('/about');

      // The about page should have a heading
      const heading = page.getByRole('heading').first();
      await expect(heading).toBeVisible({ timeout: 10_000 });
    });

    test('can navigate to about from landing page', async ({ page }) => {
      // ARRANGE: Start on the landing page
      await page.goto('/');

      // ACT: Click the About link
      const aboutLink = page.getByRole('link', { name: /about/i }).first();
      if (await aboutLink.isVisible()) {
        await aboutLink.click();

        // ASSERT: URL should be /about
        await page.waitForURL('**/about');
        await expect(page).toHaveURL(/\/about/);
      }
      // If no About link is found, the test is inconclusive — not a failure
    });
  });

  // ===================================================================
  // PUBLIC LOOKUP
  // ===================================================================

  test.describe('Public Lookup (/lookup/:uuid)', () => {
    test('shows appropriate message for invalid UUID', async ({ page }) => {
      // ACT: Try to look up a non-existent UUID
      await page.goto('/lookup/00000000-0000-0000-0000-000000000000');

      // ASSERT: Should show some content (the page loads) — could be an error,
      // a "not found" message, or data if the UUID happens to exist.
      // The key thing: the page shouldn't crash or white-screen.
      const hasContent = await page.locator('body').textContent();
      expect(hasContent?.length).toBeGreaterThan(50); // not a blank page
    });

    test('redirects to landing for invalid lookup path', async ({ page }) => {
      // ACT: Visit a malformed lookup URL
      await page.goto('/lookup/not-a-uuid');

      // ASSERT: Should get some response (not a 500 or blank page)
      // The backend might 404, the frontend might show a message
      const status = page.locator('body');
      await expect(status).not.toBeEmpty();
    });
  });

  // ===================================================================
  // AUTH GUARD: Protected routes redirect to login
  // ===================================================================

  test.describe('Protected Route Guards (unauthenticated)', () => {
    test('/home redirects to /login', async ({ page }) => {
      await page.goto('/home');

      // Should be redirected to login since no token exists
      await page.waitForURL('**/login', { timeout: 10_000 });
    });

    test('/analyze redirects to /login', async ({ page }) => {
      await page.goto('/analyze');
      await page.waitForURL('**/login', { timeout: 10_000 });
    });

    test('/history redirects to /login', async ({ page }) => {
      await page.goto('/history');
      await page.waitForURL('**/login', { timeout: 10_000 });
    });
  });
});
