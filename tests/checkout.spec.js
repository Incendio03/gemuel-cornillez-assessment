import { test, expect } from "@playwright/test";
import { injectSession } from "../utils/auth.js";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage.js";
import { CheckoutPage } from "../pages/CheckoutPage.js";
import { ConfirmationPage } from "../pages/ConfirmationPage.js";

test.describe("Checkout Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Programmatic authentication - bypasses UI login for speed
    await injectSession(page, "standard_user");
  });

  test("should complete checkout successfully with Sauce Labs Backpack", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const confirmationPage = new ConfirmationPage(page);

    await inventoryPage.goto();
    await inventoryPage.isLoaded();

    await inventoryPage.addToCart("Sauce Labs Backpack");

    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(1);

    await inventoryPage.goToCart();
    await cartPage.isLoaded();

    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(1);

    await cartPage.proceedToCheckout();
    await checkoutPage.isInfoPageLoaded();

    await checkoutPage.fillCheckoutInfo({
      firstName: "Test",
      lastName: "User",
      postalCode: "12345",
    });

    await checkoutPage.continue();
    await checkoutPage.isOverviewPageLoaded();

    const summary = await checkoutPage.getOrderSummary();
    expect(summary.subtotal).toBeTruthy();
    expect(summary.tax).toBeTruthy();
    expect(summary.total).toBeTruthy();

    await checkoutPage.finish();
    await confirmationPage.isLoaded();

    const isThankYouVisible = await confirmationPage.isThankYouMessageVisible();
    expect(isThankYouVisible).toBe(true);
  });
});
