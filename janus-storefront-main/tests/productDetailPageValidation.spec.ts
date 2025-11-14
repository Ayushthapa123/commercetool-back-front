import { expect, test } from "@playwright/test";
import * as PDPHelpers from "./utils/PDPHelpers";

test.describe("Validate the functionality of PDP Page", () => {
  test.beforeEach("Go to Product Detail page", async ({ page }) => {
    await page.goto(
      "/gb/en/homeowner/product/26d361-truecoat-360-cordless-connect.html",
    );
    const oneTrustAcceptButton = page.getByRole("button", {
      name: "Accept Cookies",
      exact: true,
    });
    await oneTrustAcceptButton.click();
    // going back to gb/en to avoid maxmind redirect
    await page.goto(
      "/gb/en/homeowner/product/26d361-truecoat-360-cordless-connect.html",
    );
  });

  test("Open-Accordion_QuickLinks", async ({ page }) => {
    //open accordion for Manuals & Documents
    // await page.getByText("Manuals & Documents").first().click();
    // await expect(
    //   page.getByRole("button", { name: "Manuals & Documents" }),
    // ).toBeVisible();
    // await expect(
    //   page.getByRole("button", { name: "Manuals & Documents Collapse" }),
    // ).toBeVisible();
    // console.log("Manuals & Documents accordion is open");
    //open accordion for Specifications
    await page.getByText("Specifications").first().click();
    await expect(
      page.getByRole("button", { name: "Specifications" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Specifications Collapse" }),
    ).toBeVisible();
    console.log("Specifications accordion is open");
    //open accordion for Product Details
    await page.getByText("Product Details").first().click();
    await expect(
      page.getByRole("button", { name: "Product Details" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Product Details Collapse" }),
    ).toBeVisible({ timeout: 10000 });
    console.log("Product Details accordion is open");
  });
  test("Currency Dropdown", async ({ page }) => {
    const euroButton = page.getByRole("button", { name: "£ - GBP" });
    const gbpRadio = page.getByRole("radio", { name: "£ - GBP" });
    const euroRadio = page.getByRole("radio", { name: "€ - EUR" });
    //currency selector opens on single click
    await euroButton.click();
    expect(gbpRadio).toBeVisible();
    console.log("GBP Currency is visible");
    expect(euroRadio).toBeVisible();
    console.log("Euro Currency is visible");

    //selecting EUR currency
    await euroRadio.click();
    await expect(page.getByRole("button", { name: "€ - EUR" })).toBeVisible();

    //outside click to close the dropdown
    await page.getByRole("button", { name: "€ - EUR" }).click();
    await page.locator("html").click();
    await expect(gbpRadio).toBeHidden();
  });
  test("Validate the key specs in PDP Page", async ({ page }) => {
    // Key Specs Section under product details
    const specList = page.locator("#productSpecsSection").nth(0);
    await expect(specList).toBeVisible();

    //Key specs items check
    await expect(page.getByText("Maximum Tip Size (in)").nth(0)).toBeVisible();
    // await expect(
    //   page.getByText("Maximum Working Pressure (bar)").nth(0),
    // ).toBeVisible();
    await expect(page.getByText("Compatible Material").nth(0)).toBeVisible();
    await expect(page.getByText("Frame Configuration").nth(0)).toBeVisible();

    //Arrow icon check
    const tickMark = specList.locator("svg[role= 'presentation']");
    const tickCount = await tickMark.count();
    for (let i = 0; i < tickCount; i++) {
      const isVisible = await tickMark.nth(i).isVisible();
      expect(isVisible, `Tick mark #${i} is not visible`).toBe(true);
    }
    // Log the number of tick marks
    console.log(`Number of tick marks: ${tickCount}`);

    //boldness check
    const boldSpecItems = specList.locator(
      "//div[@class= 'font-roboto w-60 text-sm font-bold']",
    );
    const count = await boldSpecItems.count();
    for (let i = 0; i < count; i++) {
      const weight = await boldSpecItems
        .nth(i)
        .evaluate((el) => getComputedStyle(el).fontWeight);
      const numeric = Number.parseInt(weight as string, 10);
      const isBold =
        weight === "bold" || (Number.isFinite(numeric) && numeric >= 600);
      expect(isBold, `Element #${i} not bold; font-weight=${weight}`).toBe(
        true,
      );
    }

    //Number or text check
    const divs = await page.$$("div.font-roboto.text-sm");

    for (const div of divs) {
      const content = await div.textContent();
      const trimmed = content ? content.trim() : "";

      const isNumber = !isNaN(Number(trimmed));
      const isText = typeof trimmed === "string" && trimmed.length > 0;

      expect(isNumber || isText).toBeTruthy();
    }
  });

  test("Add to cart actually adds to cart", async ({ page }) => {
    const addToCartButton = page.locator('button:has-text("Add to Basket")');
    await expect(addToCartButton).toBeVisible();
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();
    await page.waitForTimeout(5000);

    // click on cart to go to cart page
    await page.getByRole("link", { name: "Cart" }).first().click();
    await expect(
      page.getByRole("heading", { name: "Your Order" }),
    ).toBeVisible();

    await page.waitForSelector('[id="cartEntries"]', {
      state: "visible",
    });
    // confirm product in cart
    await expect(
      page.getByRole("heading", {
        name: "TrueCoat 360 Cordless Connect Drill Sprayer",
      }),
    ).toBeVisible();
  });

  test("Related Products", async ({ page }) => {
    //Carousel items count
    const caraousel = page
      .locator("//div[@data-slot = 'carousel-content']")
      .nth(2);
    const items = caraousel.locator("//div[@data-slot = 'carousel-item']");
    const itemCount = await items.count();

    if (itemCount === 0) {
      await expect(page.getByText("Related Products")).toBeHidden();
      console.log("No items found in the carousel.");
      return;
    }
    if (itemCount > 0 && itemCount <= 3) {
      // Related Products section
      await expect(page.getByText("Related Products")).toBeVisible();
      console.log("Related Products section is visible");

      console.log(`Number of items in the carousel: ${itemCount}`);

      // Product Titles
      const productTitles = caraousel.locator(
        "//div[contains(@class, 'text-jg font-roboto')]",
      );
      const productTitleCount = await productTitles.count();
      console.log(
        `Number of product titles in the carousel: ${productTitleCount}`,
      );

      // Checking first of the related products to improve speed
      for (let i = 0; i < 1; i++) {
        const product = productTitles.nth(i);
        await expect(product).toBeVisible();

        const productName = await product.textContent();
        console.log(`Product ${i + 1} name: ${productName}`);

        await product.click();
        // Confirm full image is visible- commenting the line as image is  not visible on clicking it
        //await expect(
        //  page.getByRole("img", { name: "Image Title" }).nth(0),
        //).toBeVisible();

        // Product Image Thumbnail
        const imageLocator = items.getByRole("img", {
          name: productName?.trim() || "",
        });
        const imageCount = await imageLocator.count();
        console.log(`Number of images for product ${i + 1}: ${imageCount}`);

        // TODO fix. This was looking for ratings on the subsequent related products page that was clicked and doesn't work reliably.
        // This should probably be instead looking at ratings on the original PDP's related products page.
        // Rating
        // const ratingLocator = items
        //   .locator("//div[@itemprop='aggregateRating']")
        //   .nth(i);
        // await expect(ratingLocator).toBeVisible();
        // const ratingText = await ratingLocator.textContent();
        // console.log(`Rating for product ${i + 1}: ${ratingText}`);

        // TODO fix this is too vague of a selector and is also checking prices on the subsequent related products page that was clicked
        // Price
        // const priceLocator = page.locator(
        //   "//div[contains(@class, 'font-roboto-condensed text-2xl font-bold')]",
        // );
        // const priceCount = await priceLocator.count();
        // console.log(`Number of prices for product ${i + 1}: ${priceCount}`);

        // await expect(priceLocator).toBeVisible();
        // const priceText = await priceLocator.textContent();
        // console.log(`Price for product ${i + 1}: ${priceText}`);
      }
    } else {
      console.log("More than 3 items found in the carousel.");
      await expect(page.getByText("Related Products")).toBeHidden();
      return;
    }
  });

  test("Validate the functionality of Added to Cart Notification", async ({
    page,
  }) => {
    //Element locators
    const notificationBox = page.locator("#borderAddedToCart");
    const checkmarkIcon = notificationBox.locator("#svgVectorStroke");
    const addToCartButton = page.getByRole("button", { name: "Add to Basket" });

    /* Verify whether a notification box is displayed when user clicks main add to cart button from PDP.
       Notification is only shown after a confirmed successful add-to-cart event. 
       The button transitions from "Add to Cart" → "Adding..." → "Add to Cart", and only then the notification appears.*/
    await addToCartButton.click();
    await expect(addToCartButton).not.toHaveText("Adding...", {
      timeout: 10000,
    });
    await expect(notificationBox).toBeVisible();

    // Verify whether the "Item has been added to cart" message is displayed in notification box.
    await expect(notificationBox).toHaveText(/Item has been added to basket/i);

    // Verify whether a checkmark is displayed in the notification box.
    await expect(checkmarkIcon).toBeVisible();
  });

  test("Validate that multiple rapid clicks should not result in stacked 'Added to Cart' notifications", async ({
    page,
  }) => {
    //Element locators
    const addToCartButton = page.getByRole("button", { name: "Add to Basket" });
    const notificationBox = page.locator("#borderAddedToCart");

    // Rapidly click the Add to Cart button multiple times
    await Promise.all([
      addToCartButton.click(),
      addToCartButton.click(),
      addToCartButton.click(),
    ]);

    // Button transitions from "Add to Cart" → "Adding..." → "Add to Cart", and only then the notification appears
    await expect(addToCartButton).not.toHaveText("Adding...", {
      timeout: 10000,
    });

    // Use polling to validate that multiple rapid clicks do not result in stacked "Added to Cart" notifications
    await PDPHelpers.checkSingleNotification(async () => {
      return await notificationBox.count();
    });

    // Notification automatically dismisses after 3–5 seconds.
    await PDPHelpers.pollUntilFadeOut(notificationBox);
  });

  test("Validate that 'Added to Cart' notification should not appear after adding accessories from PDP", async ({
    page,
  }) => {
    //Element locators
    const recommendedAccesoriesSection = page.locator(
      "#borderRecommendAccessories",
    );
    const firstAccessory = recommendedAccesoriesSection
      .locator("#accessory-card")
      .nth(0);
    const addButton = firstAccessory.getByRole("button", {
      name: "Add",
      exact: true,
    });
    const notificationBox = page.locator("#borderAddedToCart");
    const addedButton = firstAccessory.getByRole("button", {
      name: "Added",
      exact: true,
    });

    // Click on Add button of the first accessory
    await expect(addButton).toBeVisible();
    await addButton.click();

    // Wait for the button to change its text to "Added"
    await expect(addedButton).toBeVisible({ timeout: 10000 });

    // Verify notification box is not visible
    await PDPHelpers.verifyNotificationNeverVisible(notificationBox);
  });

  test("Validate that 'Added to Cart' notification should not appear after adding products from Cart page", async ({
    page,
  }) => {
    // Element locators
    const mostViewedProductsSection = page.locator("#mostViewedProductsBlock");
    const recommendedProductsSection = page.locator(
      "#recommendedProductsBlock",
    );
    const firstProduct = mostViewedProductsSection.locator("#card").nth(0);
    const addButton = firstProduct.getByRole("button", {
      name: "Add",
      exact: true,
    });
    const notificationBox = page.locator("#borderAddedToCart");
    const firstAddedProduct = recommendedProductsSection
      .locator("#card")
      .nth(0);
    const addedButton = firstAddedProduct.getByRole("button", {
      name: "Added",
      exact: true,
    });

    // Navigate to Cart page
    await page.getByLabel("Cart Icon").click();
    await page.waitForURL(/.*cart.*/);
    await expect(page).toHaveURL(/.*cart.*/);

    // Click on Add button of the first product under "Most Viewed Products" section
    await addButton.click();
    await page.waitForSelector('[id="cartEntries"]', {
      state: "visible",
    });

    // Wait for the button of the first product to change its text to "Added"
    await expect(addedButton).toBeVisible({ timeout: 10000 });

    // Validate that no notification appears
    await expect(notificationBox).not.toBeVisible();
  });

  test("Cart icon updates quantity after adding item(s) from PDP", async ({
    page,
  }) => {
    // Element locators
    const addButton = page.getByRole("button", { name: "Add to Basket" });
    const cartBadge = page.locator("#cartCountIconLabel");

    // Verify whether the cart icon quantity is not showing when we have empty cart
    await expect(cartBadge).not.toBeVisible();

    // Add a product from Product Info section to the cart and verify cart icon quantity is getting updated
    await addButton.click();
    await expect(addButton).not.toHaveText("Adding...", {
      timeout: 10000,
    });
    await expect(cartBadge).toHaveText("1", { timeout: 10000 });

    // Navigate to another PDP
    await page.goto("/gb/en/homeowner/product/18a886-truecoat-360-filter.html");

    // Add second product to cart and verify cart icon quantity is getting updated
    await addButton.click();
    await expect(addButton).not.toHaveText("Adding...", {
      timeout: 10000,
    });
    await cartBadge.filter({ hasText: "2" }).waitFor();
    await expect(cartBadge).toHaveText("2");
  });

  test("Cart icon updates quantity after increasing quantity from PDP", async ({
    page,
  }) => {
    // Element locators
    const cartBadge = page.locator("#cartCountIconLabel");
    const itemQuantityContainer = page.locator("#itemQuantityButton");
    const productQuantity = itemQuantityContainer.locator("[name='quantity']");

    // Increase quantity to 3 and add the product to the cart
    await page.getByRole("button", { name: "Increase Quantity" }).dblclick();
    await page.waitForTimeout(500);
    const quantity = await productQuantity.inputValue();
    await page.getByRole("button", { name: "Add to Basket" }).click();
    await expect(
      page.getByRole("button", { name: "Add to Basket" }),
    ).not.toHaveText("Adding...", {
      timeout: 10000,
    });
    await cartBadge.filter({ hasText: quantity }).waitFor();
    await expect(cartBadge).toHaveText(quantity);
  });

  test("Verify Product Info", async ({ page }) => {
    // Get the main container using the helper
    const pdpInfoContainer = await PDPHelpers.getProductInfoContainer(page);

    // Validate "New" label is displayed in the product info container
    // const newLabel = pdpInfoContainer.getByText("New", { exact: true });
    // await expect(newLabel).toBeVisible();

    // Validate Product Name is displayed correctly in the product info container
    const productName = pdpInfoContainer.locator("#productNameBlock").first();
    await expect(productName).toBeVisible();

    /* Validate Part Number is displayed correctly in the product info container
       It matches the expected format */
    const partNumber = pdpInfoContainer.locator("#partNumberBlock").nth(0);
    const partNumberRegex = /^Part number:\s*[A-Za-z0-9]+$/;
    await expect(partNumber).toBeVisible();
    const partNumberText = await partNumber.textContent();
    expect(partNumberText).toMatch(partNumberRegex);
  });

  test("Verify Star and Average Ratings, Review & Rating accordion", async ({
    page,
  }) => {
    // Get the main container using the helper
    const pdpInfoContainer = await PDPHelpers.getProductInfoContainer(page);

    // Validate star rating and review count are visible
    const starRating = pdpInfoContainer.locator("[class*='stars_component']");
    await expect(starRating).toBeVisible();
    const reviewCount = pdpInfoContainer.locator("[class*='numReviews_text']");
    await expect(reviewCount).toBeVisible();

    // Get review and rating counts as numbers
    const reviewCountText = await reviewCount.innerText();
    const reviewCountNumber =
      parseInt(reviewCountText.replace(/\D/g, ""), 10) || 0;

    // Check average rating visibility and value
    const averageRating = pdpInfoContainer.locator(
      "[class*='avgRating_component']",
    );
    const averageRatingVisible = await averageRating.isVisible();
    let averageRatingNumber = 0;
    if (averageRatingVisible) {
      const averageRatingText = await averageRating.innerText();
      averageRatingNumber =
        parseFloat(averageRatingText.replace(/[^\d.]/g, "")) || 0;
    }

    /* Validate the hover functionality of the review & rating accordion
       If no reviews exist, average rating should NOT be visible, accordion should NOT open on hover, read button should NOT be visible
       If reviews exist, average rating should be visible, accordion should open on hover, read button should be visible and clickable */
    const ratingAccordion = page.locator("#bv_components_histogram");
    const readAllReviewsButton = ratingAccordion.getByRole("button", {
      name: /Read/i,
    });
    if (reviewCountNumber === 0 && averageRatingNumber === 0) {
      await expect(averageRating).not.toBeVisible();
      await starRating.hover();
      await expect(ratingAccordion).not.toBeVisible();
      await reviewCount.hover();
      await expect(ratingAccordion).not.toBeVisible();
      await expect(readAllReviewsButton).not.toBeVisible();
    } else {
      await expect(averageRating).toBeVisible();
      expect(averageRatingNumber).toBeGreaterThan(0);
      await starRating.hover();
      await expect(ratingAccordion).toBeVisible();
      await averageRating.hover();
      await expect(ratingAccordion).toBeVisible();
      await reviewCount.hover();
      await expect(ratingAccordion).toBeVisible();
      await expect(readAllReviewsButton).toBeVisible();
      await readAllReviewsButton.click();
      const reviewSection = page
        .locator("#reviews")
        .locator("[data-state='open']")
        .nth(2);
      await expect(reviewSection).toBeVisible();
    }
  });

  test("Verify Write a review & Ask a Question", async ({ page }) => {
    // Get the main container using the helper
    const pdpInfoContainer = await PDPHelpers.getProductInfoContainer(page);

    // Validate Write a review button opens the review modal & Ask a question button opens the questions section
    const questionSection = page
      .locator("#questions")
      .locator("[data-state='open']")
      .nth(2);
    const writeReviewButton = pdpInfoContainer.getByRole("button", {
      name: "Write a review",
    });
    await expect(writeReviewButton).toBeVisible();
    await writeReviewButton.click();
    const reviewModal = page.getByRole("dialog").getByText("My Review");
    await expect(reviewModal).toBeVisible();
    await page.getByLabel("Close My review modal.").click();
    const askQuestionButton = pdpInfoContainer.getByRole("button", {
      name: "Ask a question",
    });
    await askQuestionButton.click();
    await expect(questionSection).toBeVisible();
  });

  test("Verify product price, VAT message and correct default currency selection", async ({
    page,
  }) => {
    // Get the main container using the helper
    const pdpInfoContainer = await PDPHelpers.getProductInfoContainer(page);

    // Verify product price, VAT message and price reflects correct default currency selection
    const productPriceLocator = pdpInfoContainer
      .locator("#productPriceBlock")
      .nth(0);
    await expect(productPriceLocator).toBeVisible();
    const vatMessage = pdpInfoContainer.getByText("includes VAT");
    await expect(vatMessage).toBeVisible();
    const currencyDropdown = page.locator("#currencyDropdownBlock");
    await expect(currencyDropdown).toBeVisible();
    await currencyDropdown.click();
    const currencyDropdownMenu = page.locator("#currencyDropdownMenuBlock");
    await expect(currencyDropdownMenu).toBeVisible();
    const price = await productPriceLocator.innerText();
    const currencyRegex = /[^\d\s.,]+/;
    const currencyMatch = currencyRegex.exec(price);
    const currencySymbol = currencyMatch ? currencyMatch[0] : undefined;
    if (currencySymbol === "£") {
      const gbpRadio = currencyDropdownMenu.getByRole("radio", {
        name: "£ - GBP",
      });
      await expect(gbpRadio).toBeVisible();
    } else if (currencySymbol === "€") {
      const euroRadio = currencyDropdownMenu.getByRole("radio", {
        name: "€ - EUR",
      });
      await expect(euroRadio).toBeVisible();
    } else {
      throw new Error(
        `Unexpected currency selected: ${currencySymbol}. Expected 'EUR' or 'GBP'.`,
      );
    }
  });

  test("Add to Cart Functionality", async ({ page }) => {
    // Get the main container using the helper
    const pdpInfoContainer = await PDPHelpers.getProductInfoContainer(page);

    // Get initial item count and product name from PDP
    const initialQuantity = await PDPHelpers.getItemCount(page);
    const productNameOnPDP = await pdpInfoContainer
      .locator("#productNameBlock")
      .first()
      .textContent();

    // Validate quantity selector, increment & decrement buttons in PDP
    const quantitySelector = pdpInfoContainer.locator("[name ='quantity']");
    await expect(quantitySelector).toBeVisible();
    await expect(quantitySelector).toHaveValue("1");
    const decrementButton = pdpInfoContainer.getByLabel("Decrease Quantity");
    await expect(decrementButton).toBeDisabled();
    const incrementButton = pdpInfoContainer.getByLabel("Increase Quantity");
    await incrementButton.click();
    await page.waitForTimeout(500);
    await expect(quantitySelector).toHaveValue("2");
    await decrementButton.click();
    await page.waitForTimeout(500);
    await expect(quantitySelector).toHaveValue("1");

    // Check the in stock message in PDP
    const inStockIcon = pdpInfoContainer.getByAltText("In Stock Icon");
    await expect(inStockIcon).toBeVisible();
    const inStockMessage = pdpInfoContainer.getByText(
      "In stock. FREE shipping on orders over £75+. Estimated delivery in 2–3 business days.",
    );
    await expect(inStockMessage).toBeVisible();

    // Validate that Add to cart adds correct product and quantity to cart from PDP
    await incrementButton.click();
    await page.waitForTimeout(500);
    // get product count after increment is clicked
    const itemCountOnPDP = await PDPHelpers.getItemCount(page);
    expect(itemCountOnPDP).toBeGreaterThan(initialQuantity);
    const addToCartButton = page.getByRole("button", { name: "Add to Basket" });
    await addToCartButton.click();
    await expect(addToCartButton).not.toHaveText("Adding...", {
      timeout: 10000,
    });
    await page.getByLabel("Cart Icon").click();
    await page.waitForURL(/.*cart.*/);
    await expect(page).toHaveURL(/.*cart.*/);
    // Get product name in cart
    const productNameInCart = await page
      .locator("#cartEntries li")
      .locator("h3")
      .textContent();
    // get item count in cart
    const itemCountTextInCart = await page
      .locator("#cartEntries li")
      .locator("[name='quantity']")
      .inputValue();
    const itemCountInCart = Number(itemCountTextInCart.trim());
    console.log(
      `Item count added from PDP: ${itemCountOnPDP}, Item count added in cart: ${itemCountInCart}`,
    );
    expect(itemCountInCart).toEqual(itemCountOnPDP);
    expect(productNameInCart).toEqual(productNameOnPDP);
  });

  test("Verify CTA section", async ({ page }) => {
    const CTASection = page.locator("#questionCtaSectionBlock");
    await expect(CTASection).toBeVisible();
    const headerText = CTASection.getByText("Have questions? Let's talk.");
    await expect(headerText).toBeVisible();
    const callSupportSection = CTASection.getByText("Call Support");
    await expect(callSupportSection).toBeVisible();
    const callSupportInfo = CTASection.getByText(
      "Available 24 hours a day, 7 days a week.",
    ).first();
    await expect(callSupportInfo).toBeVisible();
    const phoneNumberButton = CTASection.getByRole("button", {
      name: "888-541-9788",
    });
    await expect(phoneNumberButton).toBeVisible();
    const emailSupportSection = CTASection.getByText("Email Support");
    await expect(emailSupportSection).toBeVisible();
    const emailSupportInfo = CTASection.getByText(
      "Available 24 hours a day, 7 days a week.",
    ).nth(1);
    await expect(emailSupportInfo).toBeVisible();
    const sendMessageButton = CTASection.getByRole("button", {
      name: "Send a Message",
    });
    await expect(sendMessageButton).toBeVisible();
    const findRetailerSection = CTASection.getByText("Find a Retailer");
    await expect(findRetailerSection).toBeVisible();
    const findRetailerInfo = CTASection.getByText(
      "Get help choosing the right product for your projects.",
    );
    await expect(findRetailerInfo).toBeVisible();
    const searchButton = CTASection.getByRole("button", {
      name: "Search",
    });
    await expect(searchButton).toBeVisible();
  });

  test("Recommended Accessories should appear in an outlined box with 1–3 accessory rows", async ({
    page,
  }) => {
    // Validate the presence of the Recommended Accessories section
    const recommendedAccessoriesSection = page.locator(
      "#borderRecommendAccessories",
    );
    await expect(recommendedAccessoriesSection).toBeVisible();

    // Validate if Recommended Accessories header is visible
    const header = recommendedAccessoriesSection.getByText(
      "Recommended Accessories",
    );
    await expect(header).toBeVisible();

    // Recommended Accessories Section should be displayed in an outlined box
    const borderStyle = await recommendedAccessoriesSection.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.borderStyle;
    });
    expect(borderStyle).toMatch(/solid/);

    // Recommended Accessories Section should display 1 to 3 rows of accessories
    const accessoryCards =
      recommendedAccessoriesSection.locator("#accessory-card");
    const accessoryCount = await accessoryCards.count();
    if (accessoryCount === 0) {
      console.log(
        "No accessories found in the Recommended Accessories section.",
      );
    } else {
      expect(accessoryCount).toBeGreaterThanOrEqual(1);
      expect(accessoryCount).toBeLessThanOrEqual(3);
    }

    // Loop through each accessory item and check for required elements
    for (let i = 0; i < accessoryCount; i++) {
      const item = accessoryCards.nth(i);

      // Required elements: Image, Title, Ratings & Reviews
      await expect(item.locator(".productImage")).toBeVisible();
      await expect(item.locator(".productTitle")).toBeVisible();
      await expect(item.locator("[class*='numReviews']")).toBeVisible();
      await expect(item.locator("[class*='stars_component']")).toBeVisible();

      // Optional: Price
      const priceLocator = item.locator(".productPrice");
      if ((await priceLocator.count()) > 0) {
        await expect(priceLocator).toBeVisible();
      } else {
        console.log(`Price is not available for accessory: ${i + 1}`);
      }

      // Optional: Add button
      const addButton = item.getByRole("button", { name: "Add" });
      if ((await addButton.count()) > 0) {
        await expect(addButton).toBeVisible();
      } else {
        console.log(`Add button is not available for accessory: ${i + 1}`);
      }
    }
  });

  test("Recommended Accessories: Product Image Thumbnail should be clickable and redirect to PDP", async ({
    page,
  }) => {
    // Validate Product Image Thumbnail should be clickable and redirect to PDP
    const recommendedAccessoriesSection = page.locator(
      "#borderRecommendAccessories",
    );
    const accessoryCards =
      recommendedAccessoriesSection.locator("#accessory-card");
    const firstProduct = accessoryCards.nth(0);
    const firstProductImage = firstProduct.locator(".productImage");
    await expect(firstProductImage).toBeVisible();
    const altText = await firstProductImage.getAttribute("alt");
    const imageLink = await firstProduct
      .locator("a:has(.productImage)")
      .getAttribute("href");
    await firstProductImage.click();
    await page.waitForURL(/.*product.*/);
    await expect(page).toHaveURL(new RegExp(imageLink ?? ""));
    const observedTitle = await page.locator("#productNameBlock").textContent();
    expect(observedTitle?.trim()).toEqual(altText?.trim());
  });

  test("Recommended Accessories: Product Title should be clickable and redirect to PDP", async ({
    page,
  }) => {
    // Validate Product title should be clickable and redirect to PDP
    const recommendedAccessoriesSection = page.locator(
      "#borderRecommendAccessories",
    );
    const accessoryCards =
      recommendedAccessoriesSection.locator("#accessory-card");
    const firstProduct = accessoryCards.nth(0);
    const firstProductTitle = firstProduct.locator(".productTitle");
    await expect(firstProductTitle).toBeVisible();
    const altText = await firstProductTitle.textContent();
    const imageLink = await firstProduct
      .locator("a:has(.productTitle)")
      .getAttribute("href");
    await firstProductTitle.click();
    await page.waitForURL(/.*product.*/);
    await expect(page).toHaveURL(new RegExp(imageLink ?? ""));
    const observedTitle = await page.locator("#productNameBlock").textContent();
    expect(observedTitle?.trim()).toEqual(altText?.trim());
  });

  test("Recommended Accessories: Add button should add product to cart", async ({
    page,
  }) => {
    const recommendedAccessorriesSection = page.locator(
      "#borderRecommendAccessories",
    );
    const cards = recommendedAccessorriesSection.locator("#accessory-card");
    const cardCount = await cards.count();

    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const addButton = card.getByRole("button", { name: "Add", exact: true });
      if ((await addButton.count()) > 0 && (await addButton.isVisible())) {
        // Grab the accessory product title from PDP
        const accessoryTitleElement = card.locator(".productTitle");
        const accessoryTitle = (
          await accessoryTitleElement.textContent()
        )?.trim();
        await addButton.click();
        const addedButton = card.getByRole("button", {
          name: "Added",
          exact: true,
        });
        await expect(addedButton).toBeVisible({ timeout: 10000 });
        await page.getByLabel("Cart Icon").click();
        await page.waitForURL(/.*cart.*/);
        await expect(page).toHaveURL(/.*cart.*/);
        await expect(page.getByText("(1 item)")).toBeVisible();

        // Confirm the product added to cart matches the accessory clicked
        const cartProductTitles = page.locator("#cartEntries li h3");
        const cartProductTitle = await cartProductTitles.nth(0).innerText();
        expect(cartProductTitle?.trim()).toEqual(accessoryTitle);
        return;
      }

      // If no Add button was found, log and exit gracefully
      console.log(
        `Product at index ${i} does not have a visible 'Add' button. Skipping to next.`,
      );
    }
  });
  test("Validate front end product information Accordions", async ({
    page,
  }) => {
    //Manual and Documents Accordion scripting on hold as it's not available in localhost

    //Specifications Accordion
    await page.getByText("Specifications").first().click();
    await expect(
      page.getByRole("button", { name: "Specifications" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Specifications Collapse" }),
    ).toBeVisible();
    console.log("Specifications accordion is open");

    const table = page.locator("#specificationTable");
    const borderStyle = await table.evaluate(
      (el) => getComputedStyle(el).border,
    );
    expect(borderStyle).toMatch(/solid/);

    const leftColumnCells = table.locator(".columnAttributeName");
    const cellCount = await leftColumnCells.count();
    expect(cellCount).toBeGreaterThan(0);

    for (let i = 0; i < cellCount; i++) {
      const cell = leftColumnCells.nth(i);

      // Check font weight is bold
      const fontWeight = await cell.evaluate(
        (el) => getComputedStyle(el).fontWeight,
      );
      expect(Number(fontWeight)).toBeGreaterThanOrEqual(600);

      // Check background color is light grey (Neutral/Tertiary)
      const bgColor = await cell.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
      );
      expect(bgColor).toBe("rgb(247, 247, 247)");
    }
    //open accordion for Product Details
    await page.getByText("Product Details").first().click();
    await expect(
      page.getByRole("button", { name: "Product Details" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Product Details Collapse" }),
    ).toBeVisible({ timeout: 10000 });
    console.log("Product Details accordion is open");

    //What’s Included Accordion scripting on hold as it's not available in localhost

    //Repair Parts Accordion scripting on hold as it's not available in localhost
  });

  test("Analysing thumbnail images on PDP", async ({ page }) => {
    await page.locator("[data-slot='carousel-content']").nth(0).waitFor();

    // Check if the "Next" arrow button is present
    const nextArrow = await page.$('button[data-slot="carousel-next"]');
    if (nextArrow) {
      console.log("Next arrow button is present.");
    } else {
      console.log("Next arrow button is NOT present.");
    }

    // Get all carousel items
    const caraouselBlock = page
      .locator("[aria-roledescription= 'carousel']")
      .nth(0);
    await expect(caraouselBlock).toBeVisible();
    const carouselItems = await caraouselBlock
      .locator('[data-slot="carousel-item"]')
      .elementHandles();

    for (let i = 0; i < carouselItems.length - 1; i++) {
      const item = carouselItems[i];

      // Click the carousel item
      await item.click();
      await page.waitForTimeout(1000); // Wait for image to update

      // Get the product image src
      const productImage = await page.$('img[alt="Product Image"].rounded-xs');
      const imageSrc = await productImage?.getAttribute("src");

      console.log(`Item ${i + 1}: Product Image URL → ${imageSrc}`);
    }
  });
});

test.describe("Error Message for Max Quantity Added to Cart", () => {
  const maxQuantity = 10;
  test.beforeEach("Go to Product Detail page", async ({ page }) => {
    await page.goto(
      "/gb/en/homeowner/product/26d361-truecoat-360-cordless-connect.html",
    );
    const oneTrustAcceptButton = page.getByRole("button", {
      name: "Accept Cookies",
      exact: true,
    });
    await oneTrustAcceptButton.click();
    // going back to gb/en to avoid maxmind redirect
    await page.goto(
      "/gb/en/homeowner/product/26d361-truecoat-360-cordless-connect.html",
    );
  });
  test("When a user has not yet added the max quantity to their cart", async ({
    page,
  }) => {
    const quantityIncreaseButton = page.locator("#quantityIncreaseBlock");
    //+ quantifier is not getting disabled - initial check
    await expect(quantityIncreaseButton).not.toBeDisabled();
    const addToCartButton = page.locator('button:has-text("Add to Basket")');
    await expect(addToCartButton).toBeVisible();
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();
    const cartIcon = page.getByLabel("Cart Icon");
    await cartIcon.click();
    await page.waitForURL(/.*cart.*/);
    const cartQuantityElement = page.locator("#cartCountIconLabel");
    const cartQuantityText = await cartQuantityElement.textContent();
    const cartQuantity = parseInt(cartQuantityText || "0");
    console.log("Cart Quantity:", cartQuantity);
    await page.goBack();

    await page.waitForSelector("#quantityIncreaseBlock", {
      state: "visible",
    });
    await page.waitForTimeout(3000);

    const itemQuantityContainer = page.locator("#itemQuantityButton");
    for (let i = 1; i <= maxQuantity; i++) {
      await quantityIncreaseButton.click();
    }
    const productQuantityLocator =
      itemQuantityContainer.locator("[name='quantity']");
    const productQuantityText = await productQuantityLocator.inputValue();
    const productQuantity = parseInt(productQuantityText || "0");
    console.log("Product Quantity : ", productQuantity);
    const totalQuantity = cartQuantity + productQuantity;
    console.log("Total Quantity : ", totalQuantity);
    const errorMessage = page.getByText(
      `You've reached the maximum limit of ${maxQuantity} for this product in your basket.`,
    );
    //Error message visible above add to cart button
    if (totalQuantity >= maxQuantity) {
      await expect(errorMessage).toBeVisible();
    } else {
      await expect(errorMessage).not.toBeVisible({ timeout: 10000 });
    }
    //add To Cart Button is disabled
    if (totalQuantity > maxQuantity) {
      await expect(addToCartButton).toBeDisabled();
    } else {
      await expect(addToCartButton).not.toBeDisabled({ timeout: 10000 });
    }

    //+ quantifier is not getting disabled
    await expect(quantityIncreaseButton).not.toBeDisabled();
  });

  test("When a user has already added the max quantity to their cart", async ({
    page,
  }) => {
    const quantityIncreaseButton = page.locator("#quantityIncreaseBlock");
    //+ quantifier is not getting disabled - initial check
    await expect(quantityIncreaseButton).not.toBeDisabled();
    for (let i = 1; i <= maxQuantity; i++) {
      await quantityIncreaseButton.click();
    }
    const addToCartButton = page.locator('button:has-text("Add to Basket")');
    await addToCartButton.click();
    const cartIcon = page.getByLabel("Cart Icon");
    await cartIcon.click();
    await page.waitForURL(/.*cart.*/);
    const cartQuantityElement = page.locator("#cartCountIconLabel");
    const cartQuantityText = await cartQuantityElement.textContent();
    const cartQuantity = parseInt(cartQuantityText || "0");
    console.log("Cart Quantity:", cartQuantity);
    const errorMessage = page.getByText(
      `You've reached the maximum limit of ${maxQuantity} for this product in your basket.`,
    );

    await page.goBack();
    if (cartQuantity >= maxQuantity) {
      //Error message visible above add to cart button
      await expect(errorMessage).toBeVisible();
      //add To Cart Button is disabled
      await expect(addToCartButton).toBeDisabled();
    } else {
      await expect(errorMessage).not.toBeVisible({ timeout: 10000 });
      await expect(addToCartButton).not.toBeDisabled({ timeout: 10000 });
    }
    //+ quantifier is not getting disabled
    await expect(quantityIncreaseButton).not.toBeDisabled();
  });
});
