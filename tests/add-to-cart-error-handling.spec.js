import { test, expect } from "@playwright/test";
import { injectSession } from "../utils/auth.js";
import { InventoryPage } from "../pages/InventoryPage.js";

test.describe("Add to Cart - Network Error Handling", () => {
  test.beforeEach(async ({ page }) => {
    // Programmatic authentication - bypasses UI login for speed
    await injectSession(page, "standard_user");
  });

  test("should handle server error (500) when adding item to cart", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.goto();
    await inventoryPage.isLoaded();

    // Intercept and return 500 error
    await page.route("**/*", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Internal Server Error",
        }),
      });
    });

    const productName = "Sauce Labs Backpack";

    await inventoryPage.addToCart(productName);

    // Check for error handling in UI
    const errorMessage = page.locator('[data-test="error"]');
    const errorAlert = page.locator('.error-message, [role="alert"]');

    const hasError =
      (await errorMessage.isVisible().catch(() => false)) ||
      (await errorAlert.isVisible().catch(() => false));

    // Fail the test if no error UI is displayed
    expect(hasError).toBe(true);

    if (hasError) {
      console.log("UI handles 500 error properly");
    }
  });
});
