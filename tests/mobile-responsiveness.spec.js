import { test, expect } from "@playwright/test";
import { injectSession } from "../utils/auth.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { CartPage } from "../pages/CartPage.js";
import { CheckoutPage } from "../pages/CheckoutPage.js";
import { ConfirmationPage } from "../pages/ConfirmationPage.js";

test.describe("Mobile Checkout Flow", () => {
  test.beforeEach(async ({ page }) => {
    await injectSession(page, "standard_user");
  });

  test("should complete checkout successfully on mobile viewport", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const confirmationPage = new ConfirmationPage(page);

    await inventoryPage.goto();
    await inventoryPage.isLoaded();

    await expect(inventoryPage.inventoryContainer).toBeVisible();

    await inventoryPage.addToCart("Sauce Labs Backpack");

    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(1);

    await inventoryPage.goToCart();
    await cartPage.isLoaded();

    await expect(cartPage.cartList).toBeVisible();

    await cartPage.proceedToCheckout();
    await checkoutPage.isInfoPageLoaded();

    await expect(checkoutPage.firstNameInput).toBeVisible();
    await expect(checkoutPage.lastNameInput).toBeVisible();
    await expect(checkoutPage.postalCodeInput).toBeVisible();

    await checkoutPage.fillCheckoutInfo({
      firstName: "Mobile",
      lastName: "User",
      postalCode: "99999",
    });

    await checkoutPage.continue();
    await checkoutPage.isOverviewPageLoaded();

    await expect(checkoutPage.finishButton).toBeVisible();

    await checkoutPage.finish();
    await confirmationPage.isLoaded();

    const isThankYouVisible = await confirmationPage.isThankYouMessageVisible();
    expect(isThankYouVisible).toBe(true);

    await expect(confirmationPage.completeHeader).toBeVisible();
    await expect(confirmationPage.completeText).toBeVisible();
    await expect(confirmationPage.backToProductsButton).toBeVisible();
  });
});
