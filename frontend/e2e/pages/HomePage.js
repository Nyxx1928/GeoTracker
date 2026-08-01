/**
 * Page Object for the Home/Dashboard page (/home).
 *
 * This is the most complex page in the app. It contains:
 * - KPI metric cards (Total Lookups, Clean Rate, High Risk, Latest Risk)
 * - Risk distribution chart
 * - Single/Bulk lookup mode toggle
 * - Search input with Search, Clear, and "What's my IP?" buttons
 * - ResultCard (shows after successful analysis)
 * - Search History list
 * - Persistent HistoryList
 * - TransparencyPanel
 *
 * Selector priority: getByRole > getByPlaceholder > getByText > locator
 */
class HomePage {
  constructor(page) {
    this.page = page;

    // ---- Navigation ----
    this.logoutButton = () => page.getByRole('button', { name: 'Logout' });
    this.dashboardHeading = () => page.getByRole('heading', { name: /recent analysis/i });

    // ---- Mode Toggle (Single / Bulk) ----
    this.singleLookupButton = () => page.getByRole('button', { name: 'Single Lookup' });
    this.bulkLookupButton = () => page.getByRole('button', { name: 'Bulk Lookup' });

    // ---- Search Controls ----
    this.searchInput = () => page.getByPlaceholder(/enter ip, domain, url, or email/i);
    this.searchButton = () => page.getByRole('button', { name: 'Search' });
    this.clearButton = () => page.getByRole('button', { name: 'Clear' });
    this.whatsMyIpButton = () => page.getByRole('button', { name: /what's my ip/i });

    // ---- Loading State ----
    this.loadingState = () => page.getByText(/analyzing target/i);

    // ---- Result Display ----
    // The ResultCard component should appear after a successful analysis
    this.resultCard = () => page.locator('[class*="risk"]').first();
    // RiskBadge shows LOW/MEDIUM/HIGH
    this.riskBadge = () => page.locator('.rounded-full, [class*="badge"]').filter({ hasText: /LOW|MEDIUM|HIGH/i });

    // ---- Error Messages ----
    this.searchError = () => page.getByText(/please enter an ip address/i);
    this.invalidTargetError = () => page.getByText(/invalid target|unable to resolve/i);
    this.apiError = () => page.getByText(/failed to analyze/i);

    // ---- Search History ----
    this.searchHistorySection = () => page.getByRole('heading', { name: 'Search History' });
    this.selectAllCheckbox = () => page.getByRole('checkbox').first();
    this.deleteSelectedButton = () => page.getByRole('button', { name: /delete selected/i });
    this.historyItems = () => page.locator('.space-y-2 > div').filter({ has: page.locator('input[type="checkbox"]') });

    // ---- KPI Metric Cards ----
    this.totalLookups = () => page.getByText(/total lookups/i).locator('..');
    this.cleanRate = () => page.getByText(/clean rate/i).locator('..');
    this.highRiskMetric = () => page.getByText(/high risk/i).locator('..');

    // ---- Loading State (appears during analysis) ----
    this.searchingText = () => page.getByText(/searching/i);
  }

  /**
   * Navigate to the home/dashboard page.
   * REQUIRES authentication token in localStorage BEFORE calling this.
   */
  async goto() {
    await this.page.goto('/home');
    // The dashboard heading is the most reliable indicator that the page loaded
    await this.dashboardHeading().waitFor({ state: 'visible', timeout: 10_000 });
  }

  // ---- Search Actions ----

  /**
   * Type a target into the search input.
   * @param {string} target - domain, IP, URL, or email to analyze
   */
  async fillSearchInput(target) {
    await this.searchInput().fill(target);
  }

  /**
   * Click the Search button.
   */
  async clickSearch() {
    await this.searchButton().click();
  }

  /**
   * Convenience: fill search and click search in one call.
   * @param {string} target
   */
  async search(target) {
    await this.fillSearchInput(target);
    await this.clickSearch();
  }

  /**
   * Press Enter in the search input (keyboard shortcut).
   */
  async pressEnterToSearch() {
    await this.searchInput().press('Enter');
  }

  /**
   * Click the Clear button to reset search state.
   */
  async clickClear() {
    await this.clearButton().click();
  }

  /**
   * Click "What's my IP?" to auto-fill the search with the user's IP.
   */
  async clickWhatsMyIp() {
    await this.whatsMyIpButton().click();
  }

  // ---- Result Assertions ----

  /**
   * Wait for the ResultCard to appear after a successful analysis.
   * The analysis API can take several seconds, so we use a generous timeout.
   * @param {number} timeout - ms to wait
   */
  async waitForResultCard(timeout = 15_000) {
    // Wait for the result card to contain risk level text
    await this.page.getByText(/HIGH|MEDIUM|LOW/i).first().waitFor({ state: 'visible', timeout });
  }

  /**
   * Get the displayed risk level from the result.
   * @returns {Promise<string>} "LOW", "MEDIUM", or "HIGH"
   */
  async getRiskLevel() {
    const badge = this.page.locator('.rounded-full, [class*="badge"]').filter({ hasText: /LOW|MEDIUM|HIGH/i }).first();
    const text = await badge.textContent();
    return text?.trim() || '';
  }

  /**
   * Check if the search input has an error state.
   * @returns {Promise<boolean>}
   */
  async hasSearchError() {
    return await this.searchError().isVisible().catch(() => false) ||
           await this.invalidTargetError().isVisible().catch(() => false) ||
           await this.apiError().isVisible().catch(() => false);
  }

  /**
   * Get the search error text.
   * @returns {Promise<string>}
   */
  async getSearchErrorText() {
    const error = this.page.locator('[class*="error"], .text-red-300, .text-destructive').first();
    if (await error.isVisible().catch(() => false)) {
      return (await error.textContent()) || '';
    }
    return '';
  }

  /**
   * Wait for the search to complete (loading state disappears).
   * @param {number} timeout
   */
  async waitForSearchComplete(timeout = 20_000) {
    // The loading state or searching text should disappear
    await this.searchingText().waitFor({ state: 'hidden', timeout }).catch(() => {});
    await this.loadingState().waitFor({ state: 'hidden', timeout }).catch(() => {});
  }

  // ---- Mode Toggle ----

  /**
   * Switch to Bulk Lookup mode.
   */
  async switchToBulkMode() {
    await this.bulkLookupButton().click();
  }

  /**
   * Switch to Single Lookup mode.
   */
  async switchToSingleMode() {
    await this.singleLookupButton().click();
  }

  /**
   * Check if we're in single lookup mode.
   * @returns {Promise<boolean>}
   */
  async isSingleMode() {
    return await this.searchInput().isVisible().catch(() => false);
  }

  // ---- Search History ----

  /**
   * Wait for the search history section to appear.
   */
  async waitForHistorySection() {
    await this.searchHistorySection().waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Click "Reload" on a specific history item.
   * @param {string} target - the target text to find and reload
   */
  async clickHistoryReload(target) {
    const item = this.page.locator('.space-y-2 > div').filter({ hasText: target });
    await item.getByRole('button', { name: 'Reload' }).click();
  }

  /**
   * Get the count of history items currently visible.
   * @returns {Promise<number>}
   */
  async getHistoryCount() {
    return await this.historyItems().count();
  }

  // ---- Logout ----

  /**
   * Click the Logout button in the navigation.
   */
  async clickLogout() {
    await this.logoutButton().click();
  }

  /**
   * Wait for redirect to login page after logout.
   */
  async waitForLogoutRedirect() {
    await this.page.waitForURL('**/login', { timeout: 10_000 });
  }

  // ---- KPI Metrics ----

  /**
   * Get the Total Lookups metric value.
   * @returns {Promise<string>}
   */
  async getTotalLookups() {
    const container = this.totalLookups();
    const value = await container.locator('.text-2xl').textContent();
    return value?.trim() || '0';
  }
}

module.exports = { HomePage };
