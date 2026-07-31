# QA Test Analysis — LinkGuard (JLabs3)

> **Date:** 2026-07-30
> **Project:** Full-stack monorepo (Laravel 12 backend + React 19 frontend)
> **Purpose:** Security analysis dashboard — domain/IP/URL risk scoring

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Test Inventory](#test-inventory)
3. [Test Pyramid Assessment](#test-pyramid-assessment)
4. [Frontend Test Deep Dive](#frontend-test-deep-dive)
5. [Backend Test Deep Dive](#backend-test-deep-dive)
6. [Critical Gaps — What's Missing](#critical-gaps--whats-missing)
7. [Anti-Patterns Found](#anti-patterns-found)
8. [Actionable Improvement Plan (Priority-Ordered)](#actionable-improvement-plan-priority-ordered)
9. [Best Practices Checklist](#best-practices-checklist)
10. [Recommended Tooling](#recommended-tooling)

---

## Executive Summary

The LinkGuard project has **~185 tests across 28 test files** (16 frontend, 12 backend meaningful). The backend test suite is surprisingly solid — the risk scoring engine is well-tested with good unit coverage of the core algorithm, resolver, and geolocation provider. The frontend has tests for the most critical pages (Login, Register, Home, VerifyEmail) and a handful of UI primitives.

**Overall grade: C+**

*What's good:* Backend unit tests on the risk scoring pipeline are thorough and well-structured. The frontend tests use modern patterns (Testing Library, mocking strategies). Test naming is generally clear.

*What's concerning:* Over 25 frontend components have zero tests. Zero E2E tests exist. No CI/CD pipeline enforces tests. Several API endpoints have no integration tests whatsoever. There are no tests for error states across most components.

> **The biggest risk:** If a developer changes the risk scoring algorithm or refactors the analyze flow, the only safety net is the unit tests on the scorer. There's no end-to-end validation that `POST /api/analyze` returns the correct risk_level for a known-malicious domain.

---

## Test Inventory

### Frontend (16 test files, ~97 individual tests)

| File | Category | Test Count | What It Tests |
|------|----------|-----------|---------------|
| `__tests__/api.test.js` | Unit (interceptor logic) | 8 | 401 interceptor whitelist behavior |
| `pages/Login.test.js` | Component/Integration | 3 | Login form rendering, submit, error |
| `pages/Register.test.js` | Component/Integration | 4 | Registration form, password mismatch, error |
| `pages/Home.test.js` | Component/Integration | 4 | Dashboard load, search, logout |
| `pages/VerifyEmail.test.js` | Component/Integration | 3 | Verification panel, resend button, success |
| `components/ui/ThemeToggle.test.js` | Component | 10 | Theme toggle, localStorage, system preference, a11y |
| `components/ui/Input.test.js` | Component | 13 | Input rendering, validation, icons, refs, disabled state |
| `components/ui/Badge.test.js` | Component | 7 | Badge variants, sizes, icons, styling |
| `components/layout/PageHeader.test.js` | Component + Snapshot | 10 + 3 snapshots | Header branding, auth states, actions, logout |
| `components/layout/PageContainer.test.js` | Component + Snapshot | 8 + 2 snapshots | Container rendering, padding, max-width, snapshots |
| `components/layout/MobileNav.test.js` | Component + Snapshot | 6 + 2 snapshots | Mobile menu, auth states, touch targets, a11y |
| `components/ErrorDisplay.test.js` | Component | 20 | All 5 error types, custom content, actions, sizing, a11y |
| `components/auth/VerificationBanner.test.js` | Component/Integration | 7 | Banner visibility, resend, success, error |

### Backend (12 meaningful test files + 2 placeholders, ~94 tests)

| File | Category | Test Count | What It Tests |
|------|----------|-----------|---------------|
| `Unit/RiskScorerTest.php` | Unit | 12 | Risk scoring: proxy, hosting, blocklist, known services, suspicious TLD, clamping, breakdown math, null checks |
| `Unit/ResolverTest.php` | Unit | 17 | Target resolution: IPv4, IPv6, domain, URL, email, private IP rejection (all 3 ranges), loopback, DNS failure, invalid formats |
| `Unit/IpApiProviderTest.php` | Unit | 7 | Geolocation provider: success, failure, HTTP error, timeout, partial response, toArray, endpoint/fields |
| `Unit/Risk/TyposquattingDetectorTest.php` | Unit | 6 | Typo detection: exact match, typo similarity, unrelated domain, legitimate similar |
| `Unit/Risk/KnownServicesWhitelistTest.php` | Unit | 7 | Whitelist: exact match, subdomain, deep subdomain, unknown, case-insensitive, partial mismatch, getServices |
| `Unit/Risk/DomainReputationCheckerTest.php` | Unit | 9 | Domain reputation: suspicious TLD (.xyz, .top), SSL check, age, null safety |
| `Unit/Risk/BlocklistCheckerTest.php` | Unit | 4 | Blocklist: disabled check, empty API key, exception safety, result object |
| `Unit/Auth/TimingSafeLoginTest.php` | Feature-like Unit | 5 | Login: wrong email, wrong password, correct password, error message |
| `Feature/Auth/MultiDeviceTest.php` | Feature | 3 | Multi-device: login creates token, revoke others, single session revoke |
| `Feature/Auth/EmailVerificationTest.php` | Feature | 9 | Verification: unverified after register, valid OTP, invalid OTP, expired OTP, already verified, resend, missing email, resend if verified, login flow with email verified_at |
| `Feature/AnalyzeControllerTest.php` | Feature | 8 | Analyze: auth required, validation, domain success, IP success, private IP rejection, DNS failure, risk level, unique UUIDs |
| `Unit/ExampleTest.php` | Placeholder | 1 | `assertTrue(true)` — boilerplate |
| `Feature/ExampleTest.php` | Placeholder | 1 | `GET /` returns 200 — boilerplate |

---

## Test Pyramid Assessment

### Unit Tests (Base)

**Status: Moderate — needs expansion**

- **Backend:** The risk scoring pipeline is solidly tested. 12 tests on `RiskScorer`, 17 on `Resolver`, 7 on `IpApiProvider`. The Signal → Weight mapping from the documentation (proxy=+25, hosting=+8, blocklist=+40, etc.) are covered.
- **Frontend:** `ThemeToggle` (10 tests), `Input` (13 tests), `ErrorDisplay` (20 tests), `Badge` (7 tests) are well-tested. But critically, **the Button component (wrapping shadcn), Card component, CardNav, and all domain-specific components have zero unit tests.**

### Integration Tests (Middle)

**Status: Thin — the weakest layer**

- **Backend:** `AnalyzeControllerTest` is the only true integration test touching the controller → service → database flow. `EmailVerificationTest` tests the full OTP verification flow. `TimingSafeLoginTest` tests login. But:
  - No tests for `HistoryController` (index, update, destroy, destroyAll)
  - No tests for `SessionController` (logout, revoke-others)
  - No tests for `POST /api/geo` or `GET /api/geo/{ip}`
  - No tests for `POST /api/analyze/public` (the unauthenticated endpoint!)
  - No tests for `GET /api/lookup/{uuid}`
  - No tests for registration validation edge cases (password too short, missing special char, etc.)
- **Frontend:** The page tests (Login, Register, Home, VerifyEmail) are pseudo-integration — they mock `api.post/get` but test the component+API interaction at the boundary. This is good but incomplete. No tests verify that an actual network error or timeout is handled gracefully.

### E2E Tests (Top)

**Status: Non-existent — critical gap**

Zero end-to-end tests. This means:
- No test that a user can register → verify email → login → analyze a URL → see results
- No test that a public user can visit the public lookup page
- No cross-browser testing
- No mobile responsive testing verification

**This is the single biggest gap.** The risk score documentation says "HIGH ≥ 65, MEDIUM ≥ 30, LOW < 30" — but nothing verifies this end-to-end.

---

## Frontend Test Deep Dive

### What's Good

1. **Testing Library patterns are correct.** Tests use `getByRole`, `getByPlaceholderText`, `getByText` instead of test-ids. This makes tests resilient to CSS/class changes.

2. **AAA pattern is followed.** Arrange → Act → Assert is visible in most tests.

3. **Mocking strategy is sensible.** Each test mocks dependencies at the boundary (`api`, `react-router-dom`, sub-components). CardNav, Button, and other complex sub-components are mocked as simple renderables — this is correct for testing the component in isolation.

4. **Snapshot tests are used appropriately.** `PageHeader`, `PageContainer`, and `MobileNav` have snapshot tests. These are limited in number and only on stable layout components — good.

5. **Accessibility assertions exist.** `ErrorDisplay` tests `role="alert"` and `aria-live`. `MobileNav` tests touch target sizing (`min-h-[44px]`). `ThemeToggle` tests `aria-label`. `Input` tests error message with `role="alert"`.

6. **Edge cases covered (where tested).** `ErrorDisplay` tests all 5 error types, string AND array details, custom actions, all 3 sizes. `ThemeToggle` tests localStorage errors gracefully. `Input` tests disabled, clearable, ref forwarding.

7. **Good test isolation.** Each test file has `beforeEach` to reset mocks and localStorage.

### What's Concerning

1. **The bad: `PageContainer.test.js` has 8 tests that all assert the exact same thing.** Tests like "applies default max-width constraint" and "applies background gradient" and "centers content with mx-auto" all just check `expect(screen.getByText('Content')).toBeInTheDocument()`. They don't actually verify the max-width class, the gradient class, or the mx-auto class. **These tests provide false confidence** — they'd pass even if you removed the CSS classes entirely.

2. **The ugly: No test for the `Button` component.** The Button is used by virtually every page. It wraps shadcn's button, maps variant names, handles loading/icon states. Zero tests. If the variant mapping breaks, every page's buttons break silently.

3. **`CardNav.js` has zero tests.** It's 215 lines with GSAP animations, responsive logic, menu toggling, navigation — and zero coverage.

4. **No tests for utility functions.** The `src/lib/utils.js` `cn()` function (classname merging) has no tests. It's used everywhere.

5. **`Badge.test.js` tests "renders children" but not that variant classes are applied.** It maps old names to shadcn variants internally but never asserts the CSS class output.

6. **`Home.test.js` has a "logs out" test that doesn't actually test logout.** It renders the page, checks that `setIsLoggedIn` is defined, checks localStorage has a token — but never clicks logout or verifies the token is cleared.

---

## Backend Test Deep Dive

### What's Good

1. **`RiskScorerTest` is the gold standard in this codebase.** It tests:
   - Individual signal weights (proxy, hosting, blocklist, known_service_bonus, suspicious TLD)
   - Boundary conditions (score clamped to [0, 100])
   - Composite scenarios (all good → LOW, all bad → HIGH)
   - Data integrity (breakdown sum equals total score, allowing for clamping)
   - Null safety (null geo doesn't crash)
   - Result object structure (`toArray()` returns expected keys)

2. **`ResolverTest` is thorough.** Covers IPv4, IPv6, domain, URL (with query params), email (with MX check), all three private IP ranges, loopback, DNS failure, invalid formats, whitespace trimming.

3. **`IpApiProviderTest` uses `Http::fake()` correctly.** Tests success, failure, HTTP error, timeout, partial response, and `toArray()`. The `test_requests_correct_endpoint_and_fields` test uses `Http::assertSent()` — this is excellent.

4. **`EmailVerificationTest` covers the full OTP lifecycle.** Registration creates unverified user, valid OTP verifies, invalid OTP rejects, expired OTP rejects, already-verified rejects, resend generates new code, login with unverified returns 403, login with verified returns token, `/api/me` includes `email_verified_at`.

5. **`TimingSafeLoginTest` correctly tests that error messages don't leak info.** Asserts that both wrong-email and wrong-password return the same generic message. This is a security-aware test.

6. **`AnalyzeControllerTest` verifies database persistence.** After a successful analyze, it checks `assertDatabaseHas()` for the history record. It also verifies `assertDatabaseMissing()` for failed lookups.

7. **`RefreshDatabase` trait is used correctly** in feature tests. SQLite :memory: ensures fast, isolated tests.

### What's Concerning

1. **`DomainReputationCheckerTest` makes real external network calls.** Tests like `test_ssl_check_for_known_good_domain` call `$this->checker->check('google.com')` which actually connects to Google. This means:
   - Tests fail if you're offline or Google is down
   - Tests are slow (network latency)
   - Tests depend on Google's SSL not expiring
   - This is an **anti-pattern** — HTTP clients should be faked like `IpApiProviderTest` does

2. **`BlocklistCheckerTest` only tests the "all disabled" case.** It never tests what happens when a blocklist is actually checked. The comments in the code suggest it's waiting for API keys. This is fine for now but means the blocklist integration is effectively untested.

3. **`KnownServicesWhitelistTest` creates a temporary JSON file in `setUp()` but never cleans it up.** This could leak state between test runs if `RefreshDatabase` doesn't handle files.

4. **`ExampleTest.php` (both Unit and Feature) are dead weight.** `assertTrue(true)` teaches nothing and adds zero value. The Feature one (`GET /` returns 200) is slightly useful as a smoke test but shouldn't be the *only* test on the root route.

5. **`RiskScorerTest` has a potential flaky test.** `test_all_bad_signals_gives_high_score` constructs a domain `'go0gle.xyz'` and expects `HIGH` — but the blocklist, reputation, and typosquatting are all mocked. This is fine. But `test_all_good_signals_gives_low_score` uses `'resend.com'` with real services — if `resend.com` ever gets flagged on a blocklist, this test breaks.

---

## Critical Gaps — What's Missing

### 1. E2E Tests (P0 — Critical)

**Risk:** A regression in the analyze pipeline, email verification, or auth flow could ship to production undetected.

**Missing E2E scenarios:**
```
- User registers → verifies email via OTP → logs in → analyzes "google.com" → sees LOW risk
- User analyzes "go0gle.xyz" → sees HIGH risk with typosquatting signal in breakdown
- User logs in on phone → logs in on desktop → revokes other sessions → phone session is invalid
- Public user visits /public/lookup → enters IP → sees geo data
- User exceeds rate limit (5 login attempts/min) → gets 429
- Email verification flow: resend → receive new OTP → verify with new OTP
```

### 2. Missing Backend Integration Tests (P0)

**Untested API endpoints:**
| Endpoint | Controller Method | Risk |
|----------|-------------------|------|
| `POST /api/register` | AuthController@register | Registration can break |
| `POST /api/logout` | AuthController@logout | Session cleanup can break |
| `GET /api/me` | AuthController@me | User data leak potential |
| `GET /api/history` | HistoryController@index | Core feature untested |
| `PATCH /api/history/{id}` | HistoryController@update | Data mutation untested |
| `DELETE /api/history/{id}` | HistoryController@destroy | Data deletion untested |
| `DELETE /api/history` | HistoryController@destroyAll | Bulk deletion untested |
| `POST /api/analyze/public` | AnalyzeController@analyzePublic | Public API untested |
| `GET /api/lookup/{uuid}` | HistoryController@show | Public lookup untested |
| `GET /api/geo` | (Closure) | Geo endpoint untested |
| `GET /api/geo/{ip}` | (Closure) | Geo lookup untested |

### 3. Missing Frontend Component Tests (P1)

**Untested components (zero coverage):**

| Component | Lines | Risk |
|-----------|-------|------|
| `Button.js` | 80 | Used everywhere. Variant/size mapping critical. |
| `Card.js` | 115 | Used on every dashboard page. |
| `CardNav.js` | 215 | Complex GSAP animations, responsive logic. |
| `ResultCard.js` | — | Displays analysis results to user. |
| `RiskDisplay.js` | — | Shows risk level/score. Core UX. |
| `RiskChart.js` | — | Recharts integration. Easy to break. |
| `AnalysisForm.js` | — | Main search input. |
| `HistoryList.js` / `HistoryItem.js` | — | Core history feature. |
| `BulkLookup.js` | — | Batch analysis feature. |
| `GeoMap.js` | — | MapLibre integration. |
| `TransparencyPanel.js` | — | Explains risk signals to users. |
| `CopyButton.js` | — | Clipboard API interaction. |
| `EducationalTooltip.js` | — | User education. |
| `NetworkInfo.js` | — | DNS record display. |

**Untested pages:**
- `Landing.js` — Marketing page, likely high traffic
- `PublicLookup.js` — Unauthenticated entry point
- `History.js` — Core authenticated feature
- `Analyze.js` — Single-item analysis page
- `About.js` — Informational page

### 4. Validation & Error Handling (P1)

- No tests for registration password validation (8+ chars, upper, lower, digit, special)
- No tests for `422` validation error responses from the backend
- No tests for what happens when `api.post` throws a network error (not just a rejection with `response`)
- No tests for concurrent requests (double-click submit protection)
- No tests for empty states (history is empty, no analysis results yet)

### 5. Rate Limiting Tests (P1)

The API documents rate limits but nothing tests them:
- Register: 3 per 60 minutes
- Login: 5 per 1 minute
- Resend verification: 1 per 1 minute
- Public analyze: 10 per 1 minute

### 6. Infrastructure & CI/CD (P0)

- **No GitHub Actions workflow.** Tests are not enforced on PR or push.
- **No test coverage reporting.** You don't know what percentage of code is covered.
- **No `jest.config.js` file.** Configuration is inline in `package.json` — fine for small projects, but limits configuration.
- **No test parallelization or splitting** for faster CI runs.
- **No Docker-based test execution** for consistent environments.

### 7. Non-Functional Testing (P2)

- **No accessibility (a11y) tests.** No `jest-axe` or `pa11y` integration.
- **No visual regression tests.** No Percy, Chromatic, or Storybook integration.
- **No performance tests.** No load testing on the analyze endpoint.
- **No security tests.** No dependency vulnerability scanning in CI.

---

## Anti-Patterns Found

### 1. Hollow Assertions (PageContainer.test.js) — SEVERITY: HIGH

```javascript
// This test says "applies background gradient" but only checks children render
it('applies background gradient', () => {
    render(<PageContainer><div>Content</div></PageContainer>);
    expect(screen.getByText('Content')).toBeInTheDocument();
    // Where's the gradient check???
});
```

**Fix:** Either delete these tests (they add no value) or verify the className:
```javascript
it('applies background gradient', () => {
    const { container } = render(<PageContainer><div>Content</div></PageContainer>);
    expect(container.firstChild).toHaveClass('bg-gradient-to-b');
});
```

### 2. Real External Network Calls in Tests (DomainReputationCheckerTest.php) — SEVERITY: HIGH

Tests should never depend on external network availability. Use `Http::fake()` or a mock.

### 3. Dead Placeholder Tests (ExampleTest.php) — SEVERITY: LOW

`assertTrue(true)` and the default Laravel example tests should be deleted. They create noise and offer zero risk mitigation.

### 4. Logout Test That Doesn't Test Logout (Home.test.js) — SEVERITY: MEDIUM

```javascript
test('logs out and clears auth token', async () => {
    // ... sets up localStorage with a token
    expect(localStorage.getItem('auth_token')).toBe('existing-token');
    // Never clicks logout. Never asserts token was removed.
});
```

### 5. Inconsistent Testing Styles — SEVERITY: LOW

Some test files use `test()` (Jest), others use `it()`. Some use `describe()` blocks for grouping, others don't. Some PHP tests use docblock comments, others don't. Set a standard and enforce it.

### 6. Mocking Implementation Details in `api.test.js` — SEVERITY: MEDIUM

The entire `simulateInterceptor` function is a duplicate of the real interceptor logic. If the real `api.js` changes its whitelist or logic, this test won't catch it because it tests a copy, not the original. This is a **false positive risk**.

---

## Actionable Improvement Plan (Priority-Ordered)

### Phase 1: Immediate Fixes (This Week)

1. **Delete the hollow PageContainer tests** or rewrite them to actually assert CSS classes.
2. **Delete `ExampleTest.php` files** (both Unit and Feature).
3. **Fix the `Home.test.js` logout test** so it actually clicks logout and asserts token removal.
4. **Mock external HTTP in `DomainReputationCheckerTest.php`** — use `Http::fake()` like `IpApiProviderTest` does.
5. **Fix the `api.test.js` interceptor test** — import and test the real interceptor function, don't duplicate it.

### Phase 2: Critical Coverage (Next 2 Weeks)

6. **Add Button component tests** (variant mapping, loading state, icon positions, disabled state).
7. **Add Analyze page tests** (the authenticated single-analysis page).
8. **Add PublicLookup page tests** (the unauthenticated entry point).
9. **Add tests for all remaining API endpoints** (History CRUD, logout, geo, public analyze).
10. **Add History page tests** (list, empty state, filtering, deletion).
11. **Add rate limiting tests** for all throttled endpoints.

### Phase 3: Test Infrastructure (Next Month)

12. **Set up a GitHub Actions CI pipeline** that runs both `php artisan test` and `npm test` on every PR.
13. **Add test coverage reporting** (PHPUnit coverage HTML, Jest `--coverage`).
14. **Add 3-5 E2E tests with Playwright or Cypress** covering the critical user journeys.
15. **Add `jest-axe` for automated accessibility checks** on all rendered components.

### Phase 4: Advanced (Ongoing)

16. **Add visual regression tests** for stable UI components.
17. **Add load/performance tests** on `/api/analyze` with k6 or Artillery.
18. **Add contract tests** between frontend API client expectations and backend response shapes.
19. **Set up test data factories** (frontend) to reduce boilerplate in page tests.
20. **Add Storybook + Chromatic** for component visual documentation and testing.

---

## Best Practices Checklist

Here's a self-assessment guide — run through this before writing any new test:

### For Every Test You Write, Ask:

- [ ] **What risk does this test mitigate?** If the answer is "nothing specific," don't write it.
- [ ] **Does it follow AAA?** Arrange → Act → Assert. The 3 parts should be visually separable.
- [ ] **Is the test name specific?** `it('returns 422 when email is missing')` not `it('test register validation')`.
- [ ] **Is it deterministic?** Would it pass 100/100 times with no code changes? No random data, no date dependencies, no network calls.
- [ ] **Does it test behavior, not implementation?** If refactoring the code without changing behavior would break the test, it's the wrong test.
- [ ] **Is it isolated?** Doesn't depend on other tests running first. Can run in any order.
- [ ] **Is the assertion meaningful?** `expect(screen.getByText('Content')).toBeInTheDocument()` is NOT meaningful for a CSS class test.

### For Frontend Tests Specifically:

- [ ] **Prefer `getByRole`** over `getByTestId`. Use `getByLabelText`, `getByPlaceholderText`, `getByText` as fallbacks.
- [ ] **Only use `data-testid`** when no other query works (e.g., for decorative elements without accessible roles).
- [ ] **Mock at the boundary.** Mock `api`, mock `react-router-dom`, mock complex sub-components. Don't mock React internals.
- [ ] **Test loading states.** Render the component in loading state, verify spinner/skeleton renders.
- [ ] **Test error states.** Mock a rejected API call, verify error message renders.
- [ ] **Test empty states.** Render with empty data, verify empty state message renders.
- [ ] **One assertion concept per test.** Multiple `expect()` calls are fine if they test the same user-visible outcome.

### For Backend Tests Specifically:

- [ ] **Use `RefreshDatabase`** for any test touching the database.
- [ ] **Use `Http::fake()`** for any test touching external APIs. Never make real HTTP calls in tests.
- [ ] **Test the "happy path" AND at least one error path** for every endpoint.
- [ ] **Verify database state**, not just HTTP response status. `assertDatabaseHas()` / `assertDatabaseMissing()`.
- [ ] **Test authorization** — unauthenticated request gets 401, unauthorized gets 403.
- [ ] **Test validation** — missing required fields get 422 with specific error messages.

### Anti-Patterns to Avoid:

- ❌ Testing third-party libraries (don't test that shadcn renders a button correctly)
- ❌ Mocking the system under test (don't mock the class you're testing)
- ❌ Tests with no assertions (they always pass — they provide no safety)
- ❌ Sleep-based waits (`setTimeout`, `sleep()`) — use `waitFor`, `await`, or event-based waiting
- ❌ Testing CSS classes as primary assertions (test visible behavior instead)
- ❌ Shared mutable state between tests (use `beforeEach` to reset)
- ❌ The "ice cream cone" anti-pattern (tons of E2E, few unit tests, no integration tests)

---

## Recommended Tooling

### Essential (Add Now)

| Tool | Purpose | Config |
|------|---------|--------|
| **GitHub Actions** | CI pipeline | `.github/workflows/tests.yml` running both test suites |
| **PHPUnit coverage** | Backend coverage | `phpunit.xml` with `<coverage>` config |
| **Jest coverage** | Frontend coverage | `--coverage` flag in `npm test` |
| **jest-axe** | Accessibility testing | Add to Jest setup, run on every component render |

### Recommended (Add Soon)

| Tool | Purpose |
|------|---------|
| **Playwright** | E2E testing (better than Cypress for multi-tab/multi-device scenarios) |
| **Laravel Pint** | PHP code style enforcement (already installed, add to CI) |
| **Husky + lint-staged** | Pre-commit hooks for linting + tests |
| **k6 or Artillery** | API load/performance testing |

### Nice to Have (Future)

| Tool | Purpose |
|------|---------|
| **Storybook** | Component isolation + visual testing |
| **Chromatic / Percy** | Visual regression testing |
| **Dependabot** | Automated dependency updates |
| **SonarQube** | Code quality + security scanning |
| **Pact** | Consumer-driven contract tests |

---

## Conclusion

This project has a solid foundation — the backend risk scoring engine is well-tested, and the frontend testing patterns are modern and correct. The priority now is:

1. **Close the E2E gap** — 3-5 critical user journey tests would catch regressions that unit tests never will.
2. **Fill backend integration gaps** — the History and Auth endpoints are essentially untested.
3. **Stop writing hollow tests** — every test should verify something specific and meaningful.
4. **Add CI/CD** — tests that don't run on every PR provide zero value.
5. **Test your Button** — it's embarrassing that the most-used component has no tests.

> **Remember:** The purpose of testing is not to get 100% coverage. It's to give you **confidence to refactor and deploy without fear**. Focus your effort on the code paths that would be most catastrophic if they broke.
