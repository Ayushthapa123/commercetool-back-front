import { expect, test } from "@playwright/test";

test.describe("i18n", () => {
  test("Switch language from English to German via URL and verify text on the page", async ({
    page,
  }) => {
    await page.goto("/gb/en");
    await expect(page.getByText("English", { exact: true })).toBeVisible();

    await page.goto("/de/de");
    await expect(page.getByText("Deutsch", { exact: true })).toBeVisible();
  });
});
