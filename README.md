# QA Automation Assessment – SauceDemo

This repository contains the automated test suite for the **Project SpeedLabs** assessment. The solution focuses on **speed**, **stability**, and **avoiding UI bottlenecks** using **Playwright**.

---

## Test Strategy & Architecture

### Framework Choice: Playwright (JavaScript)

Why Playwright is well-suited for a high-speed, modern CI environment:

First, its architecture allows Playwright to communicate directly with the browser using protocols such as the Chrome DevTools Protocol (CDP). This direct connection significantly reduces execution time and minimizes the overhead commonly seen in traditional WebDriver-based frameworks.

Second, Playwright’s built-in auto-waiting mechanism automatically waits for elements to be present and actionable before performing interactions. This removes the need for flaky explicit waits or hardcoded sleep statements, resulting in a more stable test suite even under variable CI conditions.

Lastly, Playwright provides native parallel execution by default, allowing tests to run across multiple workers simultaneously. This is especially advantageous for this assessment, which includes validating mobile UI responsiveness alongside desktop scenarios, without increasing overall execution time.

---

### Hybrid Approach (Risk vs. Reward)

The primary reward of this hybrid approach is a significant reduction in test execution time. UI-based login flows are inherently slow; if each login takes around five seconds and is repeated across many tests, it can add several minutes to a single CI run. Since the main objective is to validate the Checkout functionality, not the Login feature—tests are executed in isolation by bypassing the login UI. This ensures that failures in the Login UI do not block validation of critical downstream functionality.

The main drawback of this approach is the coverage gap it introduces. If the Login flow fails in production, most of the test suite would still pass because the login step is bypassed.

---

### Test Plan

A detailed test plan for the Checkout Flow is available in:

- [TEST_PLAN.md](./TEST_PLAN.md)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 16 or higher recommended)
  [https://nodejs.org/](https://nodejs.org/)

---

### Installation

```bash
git clone https://github.com/yourusername/sauce-demo.git
cd sauce-demo
npm install
npx playwright install
```

---

## 🔐 Session Injection Mechanism (Programmatic Login)

### How It Works

SauceDemo stores authentication state in **Cookies** under the key `session-username`. Instead of interacting with the login UI for every test, we inject this session directly into the browser context.

**Step-by-Step Process:**

1. **Inject session cookie** - Add `session-username` cookie to browser context
2. **Navigate to protected page** - Go to `/inventory.html` directly
3. **Application recognizes authentication** - User is logged in without UI interaction

**Implementation Location:** [utils/auth.js](utils/auth.js)

```javascript
export async function injectSession(page, username = "standard_user") {
  await page.context().addCookies([
    {
      name: "session-username",
      value: username,
      domain: "www.saucedemo.com",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}
```

**Benefits:**

- **10x faster** than UI login (~500ms vs 5s per test)
- **Reduces flakiness** - No form interactions, network delays, or element wait times
- **CI/CD optimized** - Parallel execution without login bottlenecks

**Trade-offs:**

- **No login UI coverage** - Requires separate smoke test
- **Session mechanism dependency** - Tests break if Cookies structure changes

### Reverse Engineering Process

To discover the session mechanism:

1. Open DevTools → Application Tab → Cookies
2. Login manually via UI
3. Observe `session-username` key being set
4. Clear cookies and refresh → redirected to login
5. Manually set `session-username` → access to protected pages restored

This confirms SauceDemo uses client-side Cookies for authentication, making programmatic injection viable.

---

## Running the Tests

## Running the Tests

### Run All Tests

Run all tests in headless mode (recommended for CI/CD):

```bash
npm test
# or
npx playwright test
```

### Run Specific Test Suites

```bash
# Checkout flow tests only
npx playwright test checkout.spec.js

# Visual validation tests
npx playwright test visual-validation.spec.js

# Mobile responsiveness tests
npx playwright test mobile-responsiveness.spec.js

# Run only on Chromium
npm run test:chromium

# Run mobile tests only
npm run test:mobile
```

### Interactive Testing

Run tests in interactive UI mode:

```bash
npm run test:ui
# or
npx playwright test --ui
```

Run in headed mode (see browser):

```bash
npm run test:headed
# or
npx playwright test --headed
```

Debug a specific test:

```bash
npm run test:debug
# or
npx playwright test --debug
```

### View Test Reports

View the HTML test report:

```bash
npm run test:report
# or
npx playwright show-report
```

---

## Test Coverage

### Implement Test Scenarios

1. **Checkout Flow**
   - Complete checkout with single item
   - Session injection (programmatic login)
   - Data-test selector usage (resilient selectors)

2. **Visual Validation**
   - Add to Cart button Color change verification (RGB 226, 35, 26 - red)

3. **Mobile Responsiveness**
   - iPhone 12/13 checkout flow

---

## CI/CD Pipeline

The repository includes a GitHub Actions workflow that:

- Runs on push/PR to main, master, and develop branches
- Tests on multiple browsers (Chromium, Mobile Chrome)
- Matrix strategy for parallel execution
- Generates HTML reports as downloadable artifacts
- Stores screenshots, videos, and traces on failure
- 30-day artifact retention

**Workflow file:** [.github/workflows/playwright.yml](.github/workflows/playwright.yml)

---

## Selector Strategy

All tests use **resilient selectors** following best practices:

1. **Priority 1:** `data-test` attributes

   ```javascript
   page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
   ```

2. **Priority 2:** ARIA roles and accessible attributes

   ```javascript
   page.getByRole("button", { name: "Add to cart" });
   ```

3. **Avoid:**
   - Auto-generated IDs
   - Brittle XPath selectors
   - CSS selectors tied to styling

---

## Page Object Model (POM)

The test suite follows the **Page Object Model** pattern for:

- **Maintainability** - Centralized element locators
- **Reusability** - Shared methods across tests
- **Readability** - Tests focus on behavior, not implementation
- **Scalability** - Easy to extend with new pages/features

Each page object encapsulates:

- Element locators
- Page-specific actions
- Navigation methods
- Validation helpers

---
