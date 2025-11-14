import { expect, Locator, Page } from "@playwright/test";

export async function getCartItemCount(
  productItem: ReturnType<Page["locator"]>,
) {
  // Get the quantity from Product list in the cart
  const cartItemCount = await productItem
    .locator("[name='quantity']")
    .inputValue();
  return parseInt(cartItemCount);
}

export async function getPDPItemCount(page: Page) {
  // Get the quantity from Product detail page
  const itemQuantityLocator = page.locator("#itemQuantityButton");
  const PDPItemCount = await itemQuantityLocator
    .locator("[name='quantity']")
    .inputValue();
  return parseInt(PDPItemCount);
}

export async function getCountCartHeader(page: Page): Promise<number> {
  // Get the cart item count from the quantity input field
  const cartHeader = page.locator("#cartHeader");
  const subText = cartHeader.locator("span");
  await expect(cartHeader).toBeVisible();
  const cartHeaderTitle = await subText.nth(1).textContent();
  if (!cartHeaderTitle) return 0;
  const match = cartHeaderTitle.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export async function expectCartHeaderCount(
  page: Page,
  cartHeader: ReturnType<Page["locator"]>,
  expectedCount: number,
) {
  const pattern = new RegExp(`Basket\\(${expectedCount} items?\\)`);
  await cartHeader.filter({ hasText: pattern }).waitFor();
  await expect(cartHeader).toHaveText(pattern);
}

export async function getSubtotal(subtotalLocator: Locator): Promise<number> {
  const subtotalText = await subtotalLocator.textContent();
  return parseFloat(subtotalText?.replace(/[€£]/, "") || "0");
}

export async function getProgressText(
  progressBarLocator: Locator,
): Promise<string> {
  return (await progressBarLocator.textContent()) || "";
}
