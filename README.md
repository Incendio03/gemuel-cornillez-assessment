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

## Getting Started

### Prerequisites

- **Node.js** (version 16 or higher recommended)
  [https://nodejs.org/](https://nodejs.org/)

---

### Installation

```bash
git clone https://github.com/Incendio03/gemuel-cornillez-assessment.git
cd gemuel-cornillez-assessment
npm install
npx playwright install
```

---

## Running the Tests

### Run All Tests

```bash
# Headless mode (CI/CD)
npm test

# Headed mode (watch browser)
npm run test:headed

# Interactive UI mode
npm run test:ui

# Debug mode
npm run test:debug
```

### Run Specific Test Suites

```bash
# Checkout flow tests
npm run test:checkout              # headless
npm run test:checkout:headed       # headed

# Mobile responsiveness tests
npm run test:mobile                # headless
npm run test:mobile:headed         # headed

# Visual validation tests
npm run test:visual                # headless
npm run test:visual:headed         # headed
```

### Run on Specific Browsers

```bash
# Chromium (all tests)
npm run test:chromium              # headless
npm run test:chromium:headed       # headed

# Mobile Safari (all tests)
npm run test:mobile-safari         # headless
npm run test:mobile-safari:headed  # headed
```

### Run Specific Suite on Specific Browser

```bash
# Checkout on Chromium
npm run test:checkout:chromium              # headless
npm run test:checkout:chromium:headed       # headed

# Mobile on Chromium
npm run test:mobile:chromium                # headless
npm run test:mobile:chromium:headed         # headed

# Visual on Chromium
npm run test:visual:chromium                # headless
npm run test:visual:chromium:headed         # headed
```

### Advanced Playwright Commands

```bash
# Run specific test file
npx playwright test checkout.spec.js

# Run with specific project
npx playwright test --project=chromium

# Run tests matching pattern
npx playwright test --grep "checkout"

# Show test report
npm run test:report
# or
npx playwright show-report
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
