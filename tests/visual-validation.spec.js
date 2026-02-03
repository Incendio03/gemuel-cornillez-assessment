import { test, expect } from "@playwright/test";
import { injectSession } from "../utils/auth.js";
import { InventoryPage } from "../pages/InventoryPage.js";

test.describe("Visual Logic Validation", () => {
  test.beforeEach(async ({ page }) => {
    await injectSession(page, "standard_user");
  });

  test("should change Add to Cart button to Remove with red color", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.goto();
    await inventoryPage.isLoaded();

    const addButton = inventoryPage.getAddToCartButton("Sauce Labs Backpack");
    const removeButton = inventoryPage.getRemoveButton("Sauce Labs Backpack");

    await expect(addButton).toBeVisible();
    await expect(addButton).toHaveText("Add to cart");

    await expect(removeButton).not.toBeVisible();

    await addButton.click();

    await expect(removeButton).toBeVisible();
    await expect(removeButton).toHaveText("Remove");

    await expect(addButton).not.toBeVisible();

    const buttonColor = await removeButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    expect(buttonColor).toBe("rgb(226, 35, 26)");

    await expect(removeButton).toBeEnabled();

    await removeButton.click();

    await expect(addButton).toBeVisible();
    await expect(removeButton).not.toBeVisible();
  });
});
