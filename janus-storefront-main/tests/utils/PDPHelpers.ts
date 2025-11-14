import { expect, Locator, Page } from "@playwright/test";

/**
 * Polls a value every 500ms for 3 seconds.
 * Fails immediately if the value exceeds 1.
 * Continues polling even if the condition is met early.
 *
 * @param getValueFn - Async function that returns a number to monitor.
 */
export async function checkSingleNotification(
  getValueFn: () => Promise<number>,
) {
  const timeout = 3000;
  const interval = 500;
  const startTime = Date.now();
  let notificationCount: number | undefined;

  // Initial check: count should be exactly 1
  const initialCount = await getValueFn();
  expect(initialCount).toBe(1);

  while (Date.now() - startTime < timeout) {
    notificationCount = await getValueFn();
    if (notificationCount > 1) {
      throw new Error(
        `Condition violated during polling: ${notificationCount}`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

/**
 * Verifies that a notification fades out (opacity becomes 0) within 3–5 seconds.
 * @param notificationBox - Locator for the notification element.
 */
export async function pollUntilFadeOut(notificationBox: Locator) {
  await expect
    .poll(
      async () => {
        return await notificationBox.evaluate(
          (el) => getComputedStyle(el).opacity,
        );
      },
      {
        timeout: 5000,
        intervals: [100],
        message: "Notification should fade out (opacity: 0) after 3–5 seconds",
      },
    )
    .toBe("0");
}

/**
 * Verifies that a notification never becomes visually visible (opacity: 1)
 * during a 3-second polling window.
 * @param notificationBox - Locator for the notification element.
 */
export async function verifyNotificationNeverVisible(notificationBox: Locator) {
  const timeout = 3000;
  const interval = 100;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const opacity = await notificationBox.evaluate(
      (el) => getComputedStyle(el).opacity,
    );

    if (opacity === "1") {
      throw new Error("Notification became visible during the polling window.");
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

// Returns the main product info container locator
export async function getProductInfoContainer(page: Page): Promise<Locator> {
  const productInfoContainer = page.locator("main #pdpInfoContainerBlock");
  await expect(productInfoContainer).toBeVisible();
  return productInfoContainer;
}

// Returns the item count from PDP
export async function getItemCount(page: Page): Promise<number> {
  const pdpInfoContainer = await getProductInfoContainer(page);
  const countText = await pdpInfoContainer
    .locator("[name ='quantity']")
    .inputValue();
  return Number(countText.trim());
}
