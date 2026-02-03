/**
 * Inventory Page Object
 *
 * Represents the product inventory page where users can browse and add items to cart
 */
export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.url = "https://www.saucedemo.com/inventory.html";

    // Using data-test attributes for selectors
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async goto() {
    await this.page.goto(this.url);
  }

  getAddToCartButton(productName) {
    // Convert product name to data-test attribute format
    // Example: "Sauce Labs Backpack" -> "add-to-cart-sauce-labs-backpack"
    const dataTestId = `add-to-cart-${productName.toLowerCase().replace(/\s+/g, "-")}`;
    return this.page.locator(`[data-test="${dataTestId}"]`);
  }

  getRemoveButton(productName) {
    const dataTestId = `remove-${productName.toLowerCase().replace(/\s+/g, "-")}`;
    return this.page.locator(`[data-test="${dataTestId}"]`);
  }

  async addToCart(productName) {
    await this.getAddToCartButton(productName).click();
  }

  async removeFromCart(productName) {
    await this.getRemoveButton(productName).click();
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }

  async getCartCount() {
    const badge = this.shoppingCartBadge;
    if (await badge.isVisible()) {
      const text = await badge.textContent();
      return parseInt(text || "0", 10);
    }
    return 0;
  }

  async isLoaded() {
    await this.inventoryContainer.waitFor({ state: "visible" });
  }
}
