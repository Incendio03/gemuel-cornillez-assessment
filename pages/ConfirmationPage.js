/**
 * Confirmation Page Object
 *
 * Represents the order confirmation page after successful checkout
 */
export class ConfirmationPage {
  constructor(page) {
    this.page = page;
    this.url = "https://www.saucedemo.com/checkout-complete.html";

    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage = page.locator('[data-test="pony-express"]');
  }

  async getHeaderText() {
    return await this.completeHeader.textContent();
  }

  async getMessageText() {
    return await this.completeText.textContent();
  }

  async backToProducts() {
    await this.backToProductsButton.click();
  }

  async isLoaded() {
    await this.completeHeader.waitFor({ state: "visible" });
  }

  async isThankYouMessageVisible() {
    const headerText = await this.getHeaderText();
    return headerText.includes("Thank you for your order");
  }
}
