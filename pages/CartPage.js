/**
 * Cart Page Object
 *
 * Represents the shopping cart page where users review items before checkout
 */
export class CartPage {
  constructor(page) {
    this.page = page;
    this.url = "https://www.saucedemo.com/cart.html";

    this.cartList = page.locator('[data-test="cart-list"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]',
    );
    this.cartItems = page.locator('[data-test="inventory-item"]');
  }

  async goto() {
    await this.page.goto(this.url);
  }

  getRemoveButton(productName) {
    const dataTestId = `remove-${productName.toLowerCase().replace(/\s+/g, "-")}`;
    return this.page.locator(`[data-test="${dataTestId}"]`);
  }

  async removeItem(productName) {
    await this.getRemoveButton(productName).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async getItemCount() {
    return await this.cartItems.count();
  }

  async isLoaded() {
    await this.cartList.waitFor({ state: "visible" });
  }
}
