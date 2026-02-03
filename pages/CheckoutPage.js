/**
 * Checkout Page Object
 *
 * Represents the checkout information and overview pages
 */
export class CheckoutPage {
  constructor(page) {
    this.page = page;

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');

    this.finishButton = page.locator('[data-test="finish"]');
    this.summarySubtotal = page.locator('[data-test="subtotal-label"]');
    this.summaryTax = page.locator('[data-test="tax-label"]');
    this.summaryTotal = page.locator('[data-test="total-label"]');
  }

  async fillCheckoutInfo({ firstName, lastName, postalCode }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async getOrderSummary() {
    const subtotalText = await this.summarySubtotal.textContent();
    const taxText = await this.summaryTax.textContent();
    const totalText = await this.summaryTotal.textContent();

    return {
      subtotal: subtotalText,
      tax: taxText,
      total: totalText,
    };
  }

  async isInfoPageLoaded() {
    await this.firstNameInput.waitFor({ state: "visible" });
  }

  async isOverviewPageLoaded() {
    await this.finishButton.waitFor({ state: "visible" });
  }
}
