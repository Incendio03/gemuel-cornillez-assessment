# Test Plan – Checkout Flow (SauceDemo)

## 1. Objective

The objective of this test plan is to validate the **end-to-end Checkout Flow** of the SauceDemo e-commerce application, ensuring functional correctness, UI reliability, and responsiveness while optimizing execution speed through programmatic session handling.

This plan focuses on the **Checkout experience starting from an authenticated Inventory state**, aligning with the goal of reducing UI login bottlenecks in CI environments.

---

## 2. Scope

### In Scope

- Programmatic authentication and session injection
- Inventory page interactions
- Cart management
- Checkout workflow
- Order confirmation validation
- UI state changes related to user actions
- Mobile responsiveness of the checkout flow

### Out of Scope

- Login UI validation
- User account management
- Backend API correctness
- Payment gateway integrations (not applicable in SauceDemo)

---

## 3. Test Approach

### Authentication Strategy

- Use **programmatic login** by injecting session state (cookies) directly into the browser context.
- Tests should **start at `/inventory.html` as an authenticated user** (`standard_user`).

### Test Type

- End-to-End Functional Testing
- UI State Validation
- Responsive UI Testing

### Execution Strategy

- Headless execution for CI
- Parallel execution enabled
- Deterministic test data (no dependency on external state)

---

## 4. Test Environment

- **Application:** SauceDemo
- **Browsers:** Chromium (primary), Firefox/WebKit (optional)
- **Viewports:**
  - Desktop (default)
  - Mobile (iPhone 12)
- **Test Framework:** Playwright

---

## 5. Test Data

| Field      | Value               |
| ---------- | ------------------- |
| Username   | standard_user       |
| Password   | secret_sauce        |
| Product    | Sauce Labs Backpack |
| First Name | Test                |
| Last Name  | User                |
| Zip Code   | 12345               |

---

## 6. Test Scenarios

### 6.1 Checkout Flow

**Precondition:**  
User is authenticated via session injection and lands on the Inventory page.

**Steps:**

1. Navigate to `/inventory.html`
2. Add _Sauce Labs Backpack_ to the cart
3. Navigate to Cart
4. Proceed to Checkout
5. Enter valid checkout details
6. Complete the checkout process

**Expected Result:**

- Checkout completes successfully
- Confirmation page is displayed
- “Thank you for your order” message is visible

---

### 6.2 UI State Validation – Add to Cart Button

**Precondition:**  
User is on the Inventory page.

**Steps:**

1. Locate the _Add to Cart_ button for _Sauce Labs Backpack_
2. Click the button
3. Observe the button state change

**Expected Result:**

- Button label changes from **Add to Cart** to **Remove**
- Button text color changes to the site-defined red color
- Button remains clickable and responsive

---

### 6.3 Mobile Checkout Flow

**Precondition:**  
Browser is launched using a mobile viewport (iPhone 12).

**Steps:**

1. Authenticate via session injection
2. Complete the full Checkout Flow on mobile viewport

**Expected Result:**

- No layout breaking or overflow issues
- All checkout steps are accessible
- Order confirmation is displayed successfully

---

## 7. Selector Strategy

- Prefer **data-test attributes**
- Use **ARIA roles** where applicable
- Avoid:
  - Auto-generated IDs
  - Absolute or brittle XPath selectors

---

## 8. Risks & Mitigation

| Risk                                  | Impact | Mitigation                                  |
| ------------------------------------- | ------ | ------------------------------------------- |
| Login UI regression undetected        | Medium | Maintain a dedicated UI Login Smoke Test    |
| UI selector instability               | Medium | Use resilient selectors (data-test / roles) |
| False positives due to bypassed setup | Low    | Validate session injection logic explicitly |

---

## 9. Exit Criteria

- All Checkout Flow tests pass consistently
- UI state validations behave as expected
- Mobile checkout flow completes successfully
- No flaky behavior across multiple runs

---

## 10. Reporting

- HTML test reports generated after execution
- Failures include screenshots and traces
- CI artifacts stored for review

---
