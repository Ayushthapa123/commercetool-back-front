import { expect, test } from "@playwright/test";

/**
 * Before each test
 * To run locally, see README.md
 *
 * Validate the various elements and functionality:
 * - Graco Logo
 * - Search bar
 * - search field
 * - Search results page
 */

test.describe("Validate Janus homepage", () => {
  test.beforeEach("Go to Janus homepage", async ({ page }) => {
    await page.goto("/gb/en.html");
    const oneTrustAcceptButton = page.getByRole("button", {
      name: "Accept Cookies",
      exact: true,
    });
    await oneTrustAcceptButton.click();
  });

  test("Validate homepage elements", async ({ page }) => {
    // Header elements
    await expect(
      page.getByRole("img", { name: "Graco logo", exact: true }),
    ).toBeVisible();
    // await expect(page.getByRole("img", { name: "Search icon" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Cart Icon" })).toBeVisible();
    // await expect(
    //   page.getByRole("button", { name: "Item 1 Plus Icon" }),
    // ).toBeVisible();

    // Carousel elements
    await page.locator("div").filter({ hasText: /^1$/ }).nth(3).click();
    await page.getByRole("button", { name: "Next slide" }).click();
    await page.getByRole("button", { name: "Previous slide" }).click();
  });

  test("Footer Elements", async ({ page }) => {
    //Graco Logo
    await expect(
      page.getByAltText("Graco logo horizontal tagline"),
    ).toBeVisible();

    //Back to Top
    await expect(page.getByText("Back to Top")).toBeVisible();

    //Home Projects
    await expect(page.locator("li", { hasText: "Decks" })).toBeVisible();
    await expect(
      page.locator("li", { hasText: "Interior Rooms" }),
    ).toBeVisible();
    await expect(page.locator("li", { hasText: "Fences" })).toBeVisible();
    await expect(page.locator("li", { hasText: "All Projects" })).toBeVisible();

    // How to Buy
    await expect(
      page.locator("li", { hasText: "Find a Retailer" }),
    ).toBeVisible();

    // Owner Support
    await expect(
      page.locator("li", { hasText: "Find Manuals & Parts" }),
    ).toBeVisible();
    await expect(
      page.locator("li", { hasText: "Education Centre" }),
    ).toBeVisible();
    await page.getByRole("listitem").filter({ hasText: "Contact Us" });

    // Products and Solutions -- vehicle is currently spelled incorrectly
    await expect(page.locator("li", { hasText: "Contractor" })).toBeVisible();
    await expect(
      page.locator("li", { hasText: "Vehicle Service & Heavy" }),
    ).toBeVisible();
    await expect(
      page.locator("li", { hasText: "Industrial, Manufacturing & " }),
    ).toBeVisible();

    // Navigation
    await expect(
      page.locator("li", { hasText: "Privacy Notice" }),
    ).toBeVisible();
    await expect(
      page.locator("li", { hasText: "Terms of Service" }),
    ).toBeVisible();
    await expect(page.locator("li", { hasText: "Trademarks" })).toBeVisible();
    await expect(page.locator("li", { hasText: "Patents" })).toBeVisible();
    await expect(
      page.locator("li", { hasText: "Privacy Preferences" }),
    ).toBeVisible();
    // await expect(
    //   page.getByRole("listitem").filter({ hasText: "All Social" }),
    // ).toBeVisible();
  });

  test("Validate Search Field and Placeholder text ", async ({ page }) => {
    //Search place holder text and validate text field
    const searchIcon = page.locator("#search-icon");
    await expect(searchIcon).toBeVisible();
    searchIcon.click();
    await expect(page.locator("#site-search-field")).toBeVisible();
  });

  test("Validate the functionality of language dropdown", async ({ page }) => {
    // Functionality 1: Validate click on language selector causes dropdown menu to appear
    await page.getByRole("img", { name: "Globe icon" }).click();
    const regionAndLanguageMenu = page
      .getByRole("menu")
      .filter({ hasText: "Select Region and Language" });
    await expect(regionAndLanguageMenu).toBeVisible();
    await page
      .getByRole("button", { name: "Europe, Middle East and Africa" })
      .click();
    const languageDropdown = page
      .locator('div[data-state="open"]')
      .getByRole("region");
    await expect(languageDropdown).toBeVisible();

    /* Functionality 2: Validate the desired list of languages is visible.
       Note that ES/ES : Spanish (Espanol) is not present in the dropdown UI.
       Once implemented, automation script can be updated accordingly. */

    await expect(languageDropdown.getByText("English")).toBeVisible();
    await expect(languageDropdown.getByText("Nederlands")).toBeVisible();
    await expect(languageDropdown.getByText("Deutsch")).toBeVisible();
    await expect(languageDropdown.getByText("Français")).toBeVisible();
    await expect(languageDropdown.getByText("Italiano")).toBeVisible();
    await expect(languageDropdown.getByText("Dansk")).toBeVisible();

    // Functionality 3: Validate Region and Language dropdown menu closes with outside click
    await page.mouse.click(10, 10);
    await expect(regionAndLanguageMenu).toBeHidden();
  });

  test("Click of language navigation closes any open navigation item", async ({
    page,
  }) => {
    // Prerequisite: Open a navigation dropdown
    await page.getByRole("button", { name: "Projects" }).click();
    const navDropdown = page.getByRole("link", {
      name: "Home Projects",
    });
    await expect(navDropdown).toBeVisible();

    // Open the language navigation
    await page.getByRole("img", { name: "Globe icon" }).click();
    await expect(
      page.getByRole("menu").filter({ hasText: "Select Region and Language" }),
    ).toBeVisible();

    // Validate that any previously opened navigation dropdown is now closed
    await expect(navDropdown).toBeHidden();
  });

  test("Selecting a language updates the current page", async ({ page }) => {
    test.setTimeout(60000);
    /* The desired languages are defined with their names, codes and labels.
       The code is used to verify the URL, and the label is used to verify the text on the page.
       ES/ES : Spanish (Espanol) is not present in the dropdown.
       DK/DA : Danish (Dansk) is present in the dropdown but language translation code is not yet developed.
       Once implemented, automation script for Espanol and Dansk can be updated accordingly. */
    test.setTimeout(60000); // Increased test timeout to avoid webkit timeout error
    const languages = [
      {
        name: "Nederlands",
        code: "nl",
        label: "Dutch",
      },
      {
        name: "Deutsch",
        code: "de",
        label: "German",
      },
      {
        name: "Français",
        code: "fr",
        label: "French",
      },
      {
        name: "Italiano",
        code: "it",
        label: "Italian",
      },
      {
        name: "English",
        code: "en",
        label: "English",
      },
    ];

    for (const lang of languages) {
      // Open the language dropdown
      await page.getByRole("img", { name: "Globe icon" }).click();
      const regionAndLanguageMenu = page.locator("#languageSelectorHeader");
      await expect(regionAndLanguageMenu).toBeVisible();

      // Click on the second accordian item to open the desired language dropdown
      await regionAndLanguageMenu
        .locator("[data-slot='accordion-item']")
        .nth(1)
        .click();
      const dropdown = page
        .locator('div[data-state="open"]')
        .getByRole("region");
      await expect(dropdown).toBeVisible();

      // Select the language
      await dropdown.getByText(lang.name).click();

      // Verify the URL and label
      await page.waitForURL(new RegExp(`${lang.code}`));
      await expect(page).toHaveURL(new RegExp(`${lang.code}`));
      await expect(page.getByText(lang.name, { exact: true })).toBeVisible();
    }
  });

  test("Validate Header Elements", async ({ page }) => {
    // Logo
    await expect(
      page.getByRole("img", { name: "Graco logo", exact: true }),
    ).toBeVisible();

    //Primary Navigation
    await expect(page.getByRole("button", { name: "Products" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Projects" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "How to Buy" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Owner Support" }),
    ).toBeVisible();

    //SearchIcon
    const searchIcon = page.locator("#search-icon");
    await expect(searchIcon).toBeVisible();

    //Language and Dropdown Placeholders
    await expect(page.getByRole("img", { name: "Globe icon" })).toBeVisible();

    //CartIcon
    await expect(page.getByLabel("Cart Icon")).toBeVisible();
  });

  test("Validate Navigation dropdown", async ({ page }) => {
    test.setTimeout(60000);
    //Validate Nav functionality
    await expect(page.getByRole("button", { name: "Products" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Projects" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "How to Buy" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Owner Support" }),
    ).toBeVisible();
    //Validate nav dropdown menu opens on one click and closes on two clicks
    const products = page.getByRole("button", { name: "Products" });
    const homeownerProducts = page.locator(
      "//a[contains(@class, 'font-roboto') and contains(text(), 'Homeowner Products')]",
    );
    const projects = page.getByRole("button", { name: "Projects" });
    const homeProjects = page.locator(
      "//a[contains(@class, 'font-roboto') and contains(text(), 'Ceilings')]",
    );

    const buy = page.getByRole("button", { name: "How to Buy" });
    const howToBuy = page.locator(
      "//a[contains(@class, 'font-roboto') and contains(text(), 'Buy online')]",
    );

    const owner = page.getByRole("button", { name: "Owner Support" });
    const ownerSupport = page.locator(
      "//a[contains(@class, 'font-roboto') and contains(text(), 'Articles & advice')]",
    );
    await products.click();
    await expect(homeownerProducts).toBeVisible();
    await products.click();

    await projects.click();
    await expect(homeProjects).toBeVisible();
    await projects.click();
    expect(await homeProjects.isVisible()).toBeFalsy();

    await buy.click();
    await expect(howToBuy).toBeVisible();
    await buy.click();
    expect(await howToBuy.isVisible()).toBeFalsy();

    await owner.click();
    await expect(ownerSupport).toBeVisible();
    await owner.click();

    //Validate nav dropdown menu closes on outside click
    await page.waitForTimeout(6000);
    await projects.click();
    await expect(homeProjects).toBeVisible();
    await page.getByRole("button", { name: "£ - GBP" }).click();
    expect(await homeownerProducts.isVisible()).toBeFalsy();
    await page.waitForTimeout(6000);

    //Nav menu and Language menu cannot be opened at the same time
    await page.locator("html").click();
    await page.waitForTimeout(2000);
    await page.getByRole("img", { name: "Globe icon" }).click();
    const regionAndLanguageMenu = page.getByRole("button", {
      name: "Europe, Middle East and Africa",
    });
    await expect(regionAndLanguageMenu).toBeVisible();
  });
});
