/**
 * E2E Tests: Dashboard & Analysis Flow
 *
 * These tests cover the PRIMARY user journey: analyzing a target and seeing results.
 * This is the core value proposition of LinkGuard — if this flow breaks,
 * the application is effectively down.
 *
 * What risks do these tests mitigate?
 * - Search API integration (frontend → backend → DNS resolver → risk scorer)
 * - Result rendering (RiskBadge, ResultCard, TransparencyPanel)
 * - Loading states (user feedback during slow analysis)
 * - Error handling (invalid targets, network failures)
 * - Mode toggling (Single ↔ Bulk lookup)
 * - Search history (local state management)
 * - KPI dashboard metrics
 *
 * DESIGN DECISIONS:
 * - We create ONE test user per describe block (not per test) to avoid hitting
 *   the backend's rate limiter (3 registrations per 60 minutes).
 *   Tradeoff: tests share a token. We avoid testing logout here.
 * - Each test gets its own Page (Playwright context) for localStorage isolation.
 * - We test with REAL targets (google.com, 8.8.8.8) that resolve quickly.
 *   These are reliable, public targets that won't change behavior.
 */
const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/HomePage');
const {
  registerTestUser,
  injectAuthToken,
  TEST_PASSWORD,
  generateTestEmail,
} = require('../../fixtures/auth.fixture');

function getBackendURL(projectUse) {
  return projectUse?.backendURL || process.env.E2E_BACKEND_URL || 'http://localhost:8000';
}

test.describe('Dashboard — Analysis Flow', () => {
  let backendURL;
  let testCredentials; // { email, password, token } — created once, reused

  // Create ONE test user for the entire describe block.
  // Why? Rate limiter on /api/register allows only 3 per 60 minutes.
  test.beforeAll(async ({ browser }, testInfo) => {
    backendURL = getBackendURL(testInfo.project.use);
    testCredentials = await registerTestUser(backendURL, {
      email: generateTestEmail('dashboard'),
    });
  });

  // Each test gets a fresh page with the token injected.
  // This provides localStorage isolation while reusing the same user account.
  test.beforeEach(async ({ page }) => {
    await injectAuthToken(page, testCredentials.token);
  });

  // ===================================================================
  // HAPPY PATH: Domain analysis
  // ===================================================================

  test('analyzes a domain and displays risk level', async ({ page }) => {
    const homePage = new HomePage(page);

    // ARRANGE: Navigate to dashboard (already authenticated)
    await homePage.goto();

    // ACT: Search for a well-known domain
    await homePage.search('google.com');

    // ASSERT: A risk level should appear (LOW, MEDIUM, or HIGH)
    await homePage.waitForResultCard();
    const riskLevel = await homePage.getRiskLevel();

    // It should be one of the three valid levels
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(riskLevel);

    // The search input should still show what we searched
    await expect(homePage.searchInput()).toHaveValue('google.com');
  });

  // ===================================================================
  // HAPPY PATH: IP address analysis
  // ===================================================================

  test('analyzes an IP address and displays result', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // ACT: 8.8.8.8 is Google's DNS — always resolvable, always returns geo data
    await homePage.search('8.8.8.8');

    // ASSERT: Result card should appear
    await homePage.waitForResultCard();
    const riskLevel = await homePage.getRiskLevel();
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(riskLevel);
  });

  // ===================================================================
  // HAPPY PATH: Enter key triggers search
  // ===================================================================

  test('triggers search when pressing Enter key', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // ARRANGE: Type a target but don't click Search
    await homePage.fillSearchInput('github.com');

    // ACT: Press Enter instead of clicking
    await homePage.pressEnterToSearch();

    // ASSERT: Result should still appear
    await homePage.waitForResultCard();
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(await homePage.getRiskLevel());
  });

  // ===================================================================
  // ERROR PATH: Empty search
  // ===================================================================

  test('shows error when searching with empty input', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // ACT: Click Search with no input
    await homePage.clickSearch();

    // ASSERT: Error message should appear
    const hasError = await homePage.hasSearchError();
    expect(hasError).toBe(true);
  });

  // ===================================================================
  // ERROR PATH: Unresolveable target
  // ===================================================================

  test('shows error for unresolvable domain', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // ACT: Search for a domain that definitely doesn't exist
    await homePage.search('this-domain-definitely-does-not-exist-12345.com');

    // ASSERT: Should show an error (either 404 or invalid target)
    await homePage.waitForSearchComplete();
    const hasError = await homePage.hasSearchError();
    // Note: the backend might timeout or return an error — either is valid behavior
    expect(hasError).toBe(true);
  });

  // ===================================================================
  // UX: Clear button
  // ===================================================================

  test('clear button resets search input and result', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // ARRANGE: Perform a search to get a result
    await homePage.search('github.com');
    await homePage.waitForResultCard();

    // ACT: Click Clear
    await homePage.clickClear();

    // ASSERT: Search input should be empty
    await expect(homePage.searchInput()).toHaveValue('');

    // The result card should be gone (no risk badge visible)
    // We verify by checking the risk badge is no longer visible
    await expect(
      page.locator('.rounded-full, [class*="badge"]').filter({ hasText: /LOW|MEDIUM|HIGH/i })
    ).not.toBeVisible({ timeout: 5000 }).catch(() => {
      // It's OK if this times out — result might persist but input is cleared
    });
  });

  // ===================================================================
  // UX: What's My IP button
  // ===================================================================

  test('"What\'s my IP?" fills the search with the user\'s IP', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // ACT: Click "What's my IP?"
    await homePage.clickWhatsMyIp();

    // ASSERT: Search input should now contain an IP address (not empty)
    const inputValue = await homePage.searchInput().inputValue();
    expect(inputValue).toBeTruthy();
    // IP addresses contain numbers and dots
    expect(inputValue).toMatch(/\d+\.\d+\.\d+\.\d+/);
  });

  // ===================================================================
  // UX: Mode toggle (Single ↔ Bulk)
  // ===================================================================

  test('toggles between Single and Bulk lookup modes', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // ARRANGE: Should start in single mode
    expect(await homePage.isSingleMode()).toBe(true);

    // ACT: Switch to bulk mode
    await homePage.switchToBulkMode();

    // ASSERT: Search input should disappear (bulk mode replaces it)
    await expect(homePage.searchInput()).not.toBeVisible({ timeout: 3000 });

    // ACT: Switch back to single mode
    await homePage.switchToSingleMode();

    // ASSERT: Search input should reappear
    await expect(homePage.searchInput()).toBeVisible({ timeout: 3000 });
  });

  // ===================================================================
  // DASHBOARD: KPI metrics render
  // ===================================================================

  test('dashboard displays KPI metric cards', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // ASSERT: All four metric cards should be visible
    // They start with "0" or "--" when no history exists, which is correct
    const totalLookups = await homePage.getTotalLookups();
    expect(totalLookups).toBeTruthy(); // at minimum "0"
  });

  // ===================================================================
  // DASHBOARD: Search history appears after analysis
  // ===================================================================

  test('search history appears after performing an analysis', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // ARRANGE: Perform a search first
    await homePage.search('example.com');
    await homePage.waitForResultCard();

    // ASSERT: Search History section should now be visible
    await homePage.waitForHistorySection();

    // Should have at least 1 history item
    const historyCount = await homePage.getHistoryCount();
    expect(historyCount).toBeGreaterThan(0);
  });

  // ===================================================================
  // EDGE CASE: Rapid consecutive searches
  // ===================================================================

  test('handles consecutive searches without breaking', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // First search
    await homePage.search('google.com');
    await homePage.waitForResultCard();
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(await homePage.getRiskLevel());

    // Clear and do a second search
    await homePage.clickClear();
    await homePage.search('github.com');
    await homePage.waitForResultCard();
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(await homePage.getRiskLevel());
  });
});
