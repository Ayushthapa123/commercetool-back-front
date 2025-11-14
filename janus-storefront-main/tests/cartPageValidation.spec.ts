import { BrowserContext, expect, Page, test } from "@playwright/test";
import * as CartHelpers from "./utils/CartPageHelpers";

test.describe("When the user clicks the cart icon with no items added", () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    await page.goto(
      "/gb/en/homeowner/product/26d361-truecoat-360-cordless-connect.html",
    );
    const oneTrustAcceptButton = page.getByRole("button", {
      name: "Accept Cookies",
      exact: true,
    });
    await oneTrustAcceptButton.click();
    await page.getByLabel("Cart Icon").click();
    await page.waitForURL(/.*cart.*/);
  });

  test.afterAll(async () => {
    await context.close();
  });

  test("Verify whether the empty cart is displayed", async () => {
    // Element locators
    const cartEntries = page.locator("#cartEntries");
    const continueShoppingButton = page.getByRole("link", {
      name: "Continue Shopping",
    });

    // Verify whether the header-"Your Cart is Empty" is getting displayed for Empty cart
    await expect(page.getByText("Your Basket is Empty")).toBeVisible();

    // Verify whether the text "Add a product in order to checkout" is displayed.
    await expect(
      page.getByText("Add a product in order to check out"),
    ).toBeVisible();

    // Verify whether the cart items list is empty
    expect(await cartEntries.count()).toBe(0);

    // Verify whether Continue Shopping button is present in Empty cart screen.
    await expect(continueShoppingButton.first()).toBeVisible();
  });

  test("Verification of Help Bar in empty cart page", async () => {
    // Element locators
    const helpBar = page.locator("#contactUsBlock");
    const needHelpText = helpBar.getByText("Need help?");

    // Verify Help Bar displays a text "Need help?"
    await expect(needHelpText).toBeVisible();

    // Display a grey Help bar.Assert the background color is rgb(247, 247, 247)
    const backgroundColor = await helpBar.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );
    expect(backgroundColor).toBe("rgb(247, 247, 247)");

    // Verify Contact us and Find a Retailer links are present in Help Bar
    await expect(
      helpBar.getByRole("link", { name: "Contact us" }),
    ).toBeVisible();
    await expect(
      helpBar.getByRole("link", { name: "Find a Retailer" }),
    ).toBeVisible();
  });

  test("Verification of Order Summary section in empty cart page", async () => {
    // Element locators
    const orderSummarySection = page.locator("#yourOrderBlock").nth(1);
    const yourOrderHeader = orderSummarySection.locator("#yourOrderHeader");
    const checkoutButton = orderSummarySection.getByRole("button", {
      name: "Checkout",
    });
    const continueShoppingButton = orderSummarySection.getByRole("link", {
      name: "Continue Shopping",
    });
    /* Commented below code due to bug# 1226
    const price = orderSummarySection.locator("#netPriceAmt");
    const progressBarText = orderSummarySection.getByText(
      "50.00 away from FREE Shipping",
    ); */

    // Verify "Your Order" header is displayed within order summary section in cart page
    await expect(orderSummarySection).toBeVisible();
    await expect(yourOrderHeader).toBeVisible({ timeout: 10000 });

    // Verify checkout button is not present in empty cart page
    await expect(checkoutButton).toHaveCount(0);

    // Verify Continue Shopping button is present
    await expect(continueShoppingButton).toBeVisible();

    /*Commented below code due to bug# 1226
    Verify Cart Total displays '0.00'
    await expect(price).toContainText("0.00");

    Verify progress bar displays "XXX amount away from FREE Shipping"
    await expect(progressBarText).toBeVisible();*/
  });
});

test.describe("When the user clears all items using 'Remove all' button within the cart", () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    await page.goto(
      "/gb/en/homeowner/product/26d361-truecoat-360-cordless-connect.html",
    );
    const oneTrustAcceptButton = page.getByRole("button", {
      name: "Accept Cookies",
      exact: true,
    });
    await oneTrustAcceptButton.click();
    await page.getByRole("button", { name: "Add to Basket" }).click();
    await expect(
      page.getByRole("button", { name: "Add to Basket" }),
    ).not.toBeDisabled({ timeout: 10000 });
    await page.getByLabel("Cart Icon").click();
    await page.waitForURL(/.*cart.*/);
    await expect(page).toHaveURL(/.*cart.*/);
    await expect(page.getByText("(1 item)")).toBeVisible();
    const removeAll = page.getByRole("button", { name: "Remove All" });
    await expect(removeAll).toBeVisible();
    await removeAll.click();
    await page
      .locator("text=Your Basket is Empty")
      .waitFor({ state: "attached" });
    await expect(page.getByText("Your Basket is Empty")).toBeVisible();
  });

  test.afterAll(async () => {
    await context.close();
  });

  test("Verify that the messaging on empty cart screen is correct", async () => {
    // Element locators
    const cartEntries = page.locator("#cartEntries");
    const continueShoppingButton = page.getByRole("link", {
      name: "Continue Shopping",
    });

    // Verify whether the text "Add a product in order to checkout" is displayed.
    await expect(
      page.getByText("Add a product in order to check out"),
    ).toBeVisible();

    // Verify whether the cart items list is empty
    await expect(cartEntries).toHaveCount(0);

    // Verify whether Continue Shopping button is present in Empty cart screen.
    await expect(continueShoppingButton.first()).toBeVisible();
  });

  test("Verification of Help Bar in empty cart page", async () => {
    // Element locators
    const helpBar = page.locator("#contactUsBlock");
    const needHelpText = helpBar.getByText("Need help?");

    // Verify Help Bar displays a text "Need help?"
    await expect(needHelpText).toBeVisible();

    // Display a grey Help bar.Assert the background color is rgb(247, 247, 247)
    const backgroundColor = await helpBar.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );
    expect(backgroundColor).toBe("rgb(247, 247, 247)");

    // Verify Contact us and Find a Retailer links are present in Help Bar
    await expect(
      helpBar.getByRole("link", { name: "Contact us" }),
    ).toBeVisible();
    await expect(
      helpBar.getByRole("link", { name: "Find a Retailer" }),
    ).toBeVisible();
  });

  test("Verification of Order Summary section in empty cart page", async () => {
    // Element locators
    const orderSummarySection = page.locator("#yourOrderBlock").nth(1);
    const yourOrderHeader = orderSummarySection.locator("#yourOrderHeader");
    const price = orderSummarySection.locator("#netPriceAmt");
    const checkoutButton = orderSummarySection.getByRole("button", {
      name: "Checkout",
    });
    const continueShoppingButton = orderSummarySection.getByRole("link", {
      name: "Continue Shopping",
    });
    const progressBarText = orderSummarySection.locator(
      "#freeShippingTrackingBlock",
    );

    // Verify "Your Order" header is displayed within order summary section in cart page
    await expect(orderSummarySection).toBeVisible();
    await expect(yourOrderHeader).toBeVisible();

    // Verify Cart Total displays '0.00'
    await expect(price).toContainText("0.00");

    // Verify checkout button is not present
    await expect(checkoutButton).toHaveCount(0);

    // Verify Continue Shopping button is present
    await expect(continueShoppingButton).toBeVisible();

    // Verify progress bar displays "XXX amount away from FREE Shipping"
    await expect(progressBarText).toBeVisible();
  });
});

test.describe("Validate behavior of cart page when items are added", () => {
  test.beforeEach(
    "Add a product from PDP and navigate to cart page",
    async ({ page }) => {
      // Navigate to PDP
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

      // Click on Add to Cart button
      await page.getByRole("button", { name: "Add to Basket" }).click();
      await expect(
        page.getByRole("button", { name: "Add to Basket" }),
      ).not.toBeDisabled({ timeout: 10000 });

      // Click on Cart icon and validate if Cart page appears
      await page.getByLabel("Cart Icon").click();
      await page.waitForURL(/.*cart.*/);
      await expect(page).toHaveURL(/.*cart.*/);
    },
  );

  test("Cart updates correctly on currency switch", async ({ page }) => {
    // Verify product price is displayed in GBP currency by default on cart page
    const cartItem = page.locator("#cartEntries li");
    const priceLocator = cartItem.locator('[id*="productPrice"]');
    await expect(priceLocator).toBeVisible();
    const priceCurrency = await priceLocator.textContent();
    expect(priceCurrency).toContain("£");

    // Store product title for later verification
    const expectedProductTitle = await cartItem.locator("h3").innerText();

    // Change currency to EUR & validate that empty cart is displayed after currency change
    await page.locator("#currencyDropdownBlock").click();
    await page.locator("#currencyDropdownMenuBlock").getByText("EUR").click();
    await page.waitForSelector('[data-testid="cart-empty"]', {
      state: "visible",
    });
    await expect(page.getByText("Your Basket is Empty")).toBeVisible();
    await expect(
      page.getByText("Add a product in order to check out"),
    ).toBeVisible();
    expect(await cartItem.count()).toBe(0);

    // Toggle back to GBP and verify previously added items reappear
    await page.locator("#currencyDropdownBlock").click();
    await page.locator("#currencyDropdownMenuBlock").getByText("GBP").click();
    const observedProductTitle = await cartItem.locator("h3").innerText();
    expect(observedProductTitle).toBe(expectedProductTitle);
    expect(await cartItem.count()).toBeGreaterThan(0);

    // Add another product in same currency and validate both products are displayed with correct currency in cart
    const productsSection = page.locator("#recommendedProductsBlock").nth(0);
    const firstRecommendedProduct = productsSection.locator("#card").nth(0);
    const addButton = firstRecommendedProduct.getByRole("button", {
      name: "Add",
    });
    await expect(addButton).toBeVisible();
    await addButton.click();
    const addedButton = firstRecommendedProduct.getByRole("button", {
      name: "Added",
    });
    await expect(addedButton).toBeVisible({ timeout: 10000 });
    const itemCount = await cartItem.count();
    expect(itemCount).toBe(2);
    for (let i = 0; i < itemCount; i++) {
      const itemPriceLocator = cartItem.nth(i).locator('[id*="productPrice"]');
      await expect(itemPriceLocator).toBeVisible();
      const itemPriceCurrency = await itemPriceLocator.textContent();
      expect(itemPriceCurrency).toContain("£");
    }
  });

  test("Product list in Cart Screen", async ({ page }) => {
    const cartItem = page.locator("#cartEntries");
    //Product Name
    const productName = cartItem.getByText(
      "TrueCoat 360 Cordless Connect Drill Sprayer",
    );

    console.log(
      "Product Name is visible in Cart Screen: ",
      productName.textContent(),
    );

    //Product Image
    const image = cartItem.getByRole("img", {
      name: "TrueCoat 360 Cordless Connect Drill Sprayer",
    });
    await expect(image).toBeVisible();
    console.log("Product Image is visible in Cart Screen");

    //Product Part Number
    const productPartNumber = cartItem.getByText("Part Number: 26D361");
    const partNumberText = await productPartNumber.textContent();
    console.log(
      "Product Part Number is visible in Cart Screen: ",
      partNumberText,
    );

    //Product Price
    const productPrice = cartItem.locator("#productPrice-26D361");
    const priceText = await productPrice.textContent();
    console.log("Product Price is visible in Cart Screen: ", priceText);

    //InStock
    await expect(cartItem.getByRole("img", { name: "In Stock" })).toBeVisible();

    //Remove
    await expect(page.locator("#removeAllBtn").nth(0)).toBeVisible();
    await expect(
      cartItem.getByRole("button", { name: "Remove" }),
    ).toBeVisible();

    //Product Quantity
    await expect(
      cartItem.locator("[aria-label= 'Decrease Quantity']"),
    ).toBeVisible();
    await expect(
      cartItem.locator("[aria-label= 'Increase Quantity']"),
    ).toBeVisible();
    await expect(cartItem.locator("//input[@name= 'quantity']")).toBeVisible();
  });
  test("Purchase Limit Validation", async ({ page }) => {
    const cartItem = page.locator("#cartEntries li");
    const count = await cartItem.count();
    console.log("Number of products in Cart Screen: ", count);
    for (let i = 0; i < count; i++) {
      const increaseButton = cartItem
        .locator("[aria-label= 'Increase Quantity']")
        .nth(i);
      //purchase limit is getting displayed when the item is having any purchase limit in cart screen
      for (let i = 0; i < 10; i++) {
        console.log(`Attempting to add product to cart: ${i + 1}`);

        // Check if button is enabled before clicking
        if (await increaseButton.isEnabled()) {
          await increaseButton.click();
        } else {
          console.log("Increase button is disabled before reaching 9 clicks.");
        }

        // After 9 clicks, check if button is disabled and message is visible
        const maxLimitMessage = cartItem
          .getByText("This product has a limit of 10 per order.")
          .nth(1);
        await page.waitForTimeout(300); // Wait for message to appear
        if (await maxLimitMessage.isVisible()) {
          console.log(await maxLimitMessage.textContent());
        } else {
          console.log("Max limit message not found.");
        }
      }
    }
  });

  test("Redirect to PDP page from Cart Screen", async ({ page }) => {
    const cartItem = page.locator("#cartEntries li");
    const count = await cartItem.count();
    console.log("Number of products in Cart Screen: ", count);
    for (let i = 0; i < count; i++) {
      //Product Name
      const productName = cartItem.getByText(
        "TrueCoat 360 Cordless Connect Drill Sprayer",
      );
      const productNameText = await productName.textContent();
      console.log("Product Name is visible in Cart Screen: ", productNameText);

      //Product Image
      const productImage = cartItem.getByRole("img", {
        name: productNameText?.trim() || "",
      });
      await expect(productImage).toBeVisible();
      console.log("Product Image is visible in Cart Screen");

      //Redirecting to pdp page from cart screen
      await productName.click();

      //Clicing on product image in cart screen to redirect to PDP page
      await page.getByRole("link", { name: "Cart Icon" }).click();
      await productImage.click();
      await expect(
        page.getByRole("img", { name: productNameText?.trim() || "" }).nth(0),
      ).toBeVisible();
      await page.getByRole("link", { name: "Cart Icon" }).click();
    }
  });

  test("Verify elements of Order Summary Section in cart page", async ({
    page,
  }) => {
    const orderSummarySection = page.locator("#yourOrderBlock").nth(1);

    // Verify Order Summary Section is visible in cart page
    await expect(orderSummarySection).toBeVisible();

    // Verify "Your Order" header is displayed within order summary section in cart page
    const yourOrderHeader = orderSummarySection.locator("#yourOrderHeader");
    await expect(yourOrderHeader).toBeVisible();

    // Verify "Shipping Promotion Progress Bar Component" is displayed within order summary section in cart page
    const shippingPromotionComponent = orderSummarySection.locator(
      "#freeShippingTrackingBlock",
    );
    await expect(shippingPromotionComponent).toBeVisible({ timeout: 10000 });

    // Assert that the Subtotal label is visible
    const subTotalBlock = orderSummarySection.locator("#subTotalBlock");
    const subtotalLabel = subTotalBlock.getByText("Subtotalincludes VAT");
    const subtotalValue = subTotalBlock.locator("#subTotalAmt");
    await expect(subtotalLabel).toBeVisible();

    // Assert that the Subtotal value is visible and not empty
    await expect(subtotalValue).toBeVisible();
    await expect(subtotalValue).not.toHaveText("");

    // Verify whether the Promo Code Field is displayed in  Order Summary Section in cart screen
    const applyPromoCode = orderSummarySection.getByText("Apply Discount Code");

    // Enter the promocode and Verify whether the Applied Discount Code is displayed in Order Summary Section in cart screen
    await applyPromoCode.click();
    const testingDiscountCode = "SAVE10";
    const enterCodeInputField =
      orderSummarySection.getByPlaceholder("Enter Code");
    await enterCodeInputField.fill(testingDiscountCode);
    const applyButton = orderSummarySection.locator("#applyDiscountCodeButton");

    const recommendedProductsBlock = page
      .locator("#recommendedProductsBlock")
      .nth(0);
    await expect(recommendedProductsBlock).toBeVisible();

    await applyButton.click();

    // Assert that the Discount value is visible and not empty
    const discountValue = page.locator("#discountAmt").nth(1);
    await expect(discountValue).toHaveText(/.*-.*/, { timeout: 15000 });

    // Verify whether the Estimated Total label & value is getting displayed in  Order Summary Section in cart screen
    const estimatedTotalBlock = orderSummarySection.locator(
      "#estCartTotalBorder",
    );
    const estimatedTotalLabel = estimatedTotalBlock.getByText("Est. Total");
    const estimatedTotalValue = estimatedTotalBlock.locator("#netPriceAmt");
    await expect(estimatedTotalLabel).toBeVisible();
    await expect(estimatedTotalValue).toBeVisible();
    await expect(estimatedTotalValue).not.toHaveText("");

    // Verify whether the Total Savings Label & value is displayed in  Order Summary Section in cart screen
    const totalSavingsLabel = orderSummarySection.getByText("Total Savings");
    const totalSavingsValue = orderSummarySection.locator("#totalSavingAmt");
    await expect(totalSavingsLabel).toBeVisible();
    await expect(totalSavingsValue).toBeVisible();
    await expect(totalSavingsValue).not.toHaveText("");

    // Verfy whether the Shipping label is getting displayed in  Order Summary Section in cart screen
    const shippingLabel = orderSummarySection.getByText("Est. Shipping", {
      exact: true,
    });
    await expect(shippingLabel).toBeVisible();

    // Verify whether the checkout button is getting displayed in  Order Summary Section in cart screen
    const checkoutButton = orderSummarySection.getByRole("link", {
      name: "Checkout",
    });
    await expect(checkoutButton).toBeVisible();
  });

  test("Order Summary section - Verify Subtotal reflects sum of all cart item prices", async ({
    page,
  }) => {
    // Define locators
    const productsSection = page.locator("#recommendedProductsBlock").nth(0);
    const firstRecommendedProduct = productsSection.locator("#card").nth(0);
    const addButton = firstRecommendedProduct.getByRole("button", {
      name: "Add",
    });
    const addedButton = firstRecommendedProduct.getByRole("button", {
      name: "Added",
    });
    const cartEntries = page.locator("#cartEntries li");
    const orderSummarySection = page.locator("#yourOrderBlock").nth(1);
    const subtotalValue = orderSummarySection.locator("#subTotalAmt");

    // Add another product from Recommended Products section to the cart
    await expect(productsSection).toBeVisible({ timeout: 10000 });
    await expect(addButton).toBeVisible();
    await addButton.click();
    await addedButton.waitFor({ state: "visible" });
    await expect(addedButton).toBeVisible();

    // Get individual item prices
    const itemCount = await cartEntries.count();
    let expectedSubtotal = 0;

    for (let i = 0; i < itemCount; i++) {
      const priceText = await cartEntries
        .nth(i)
        .locator('[id*="productPrice"]')
        .textContent();

      const itemPrice = parseFloat(priceText?.replace(/[^0-9.]/g, "") || "0");
      expectedSubtotal += itemPrice;
    }

    // Get displayed subtotal value
    const subtotalText = await subtotalValue.textContent();
    const displayedSubtotal = parseFloat(
      subtotalText?.replace(/[^0-9.]/g, "") || "0",
    );

    // Assert subtotal matches sum of item prices
    expect(displayedSubtotal.toFixed(2)).toBe(expectedSubtotal.toFixed(2));
  });
  test("Discount in Cart Page", async ({ page }) => {
    //Apply Discount is present
    const orderBlock = page.locator("#yourOrderBlock").nth(1);
    const applyPromoCode = orderBlock.getByText("Apply Discount Code");
    await expect(applyPromoCode).toBeVisible();

    await applyPromoCode.click();
    const testingDiscountCode = "save10"; //checking that lowercase inputs are converted to uppercase and pass happy path
    const enterCodeInputField = orderBlock.getByPlaceholder("Enter Code");
    await enterCodeInputField.fill(testingDiscountCode);

    //Action on discount code
    const applyButton = orderBlock.locator("#applyDiscountCodeButton");
    await applyButton.click({ force: true });
    // Assert that the Discount value is visible and not empty
    const discountValue = page.locator("#shippingRateBlock").nth(1);
    await expect(discountValue).toBeVisible();

    // Assert discount badge is visible
    const discountBadge = page.getByTestId("discount-badge");
    await page.waitForSelector('[data-testid="discount-badge"]', {
      state: "visible",
    });
    await expect(discountBadge).toHaveText("SAVE10");
    const appliedMessage = page.getByTestId("applied-discount-code");
    await expect(appliedMessage).toHaveText(
      "This discount code was applied successfully!",
    );

    // Assert duplicate discount code messaging
    await applyButton.click();
    const duplicatePromoCodeMessage = orderBlock.getByText(
      "This discount code was already applied.",
    );
    await expect(duplicatePromoCodeMessage).toBeVisible();

    // Assert invalid discount code messaging
    await enterCodeInputField.clear();
    const invalidCode = "SAVE1";
    await enterCodeInputField.fill(invalidCode);
    await applyButton.click();

    const invalidCodeMessage = orderBlock.getByText(
      "This discount code has expired or is invalid.",
    );
    await expect(invalidCodeMessage).toBeVisible();
  });

  test("Verify Recommended Products section", async ({ page }) => {
    // Verify whether the header -Recommended products is getting displayed in cart screen
    const header = page.getByText("Recommended products", { exact: true });
    await expect(header.nth(0)).toBeVisible();

    // Verify whether maximum of five product cards are getting displayed in  cart screen
    const recommendedProductsBlock = page
      .locator("#recommendedProductsBlock")
      .nth(0);
    await expect(recommendedProductsBlock).toBeVisible({ timeout: 10000 });
    const productCards = recommendedProductsBlock.locator("#card");
    const firstProduct = productCards.nth(0);
    await expect(firstProduct).toBeVisible();
    const count = await productCards.count();
    expect(count).toBeLessThanOrEqual(5);

    // Verify each product card has required elements
    for (let i = 0; i < count; i++) {
      const card = productCards.nth(i);

      // Required elements: Image, Title, Ratings & Reviews
      await expect(card.locator("#productImage")).toBeVisible();
      await expect(card.locator("#productTitle")).toBeVisible();
      await expect(card.locator("[class*='stars_component']")).toBeVisible();
      await expect(card.locator("[class*='numReviews']")).toBeVisible();

      // Optional: Price
      const priceLocator = card.locator("#productPrice");
      if ((await priceLocator.count()) > 0) {
        await expect(priceLocator).toBeVisible();
      } else {
        console.log(`Price is not available for item: ${i + 1}`);
      }

      // Optional: Add button
      const addButton = card.getByRole("button", { name: "Add" });
      if ((await addButton.count()) > 0) {
        await expect(addButton).toBeVisible();
      } else {
        console.log(`Add button is not available for item: ${i + 1}`);
      }
    }

    // Verify Add to cart functionality in Recommended products section
    const firstAddToCartButton = firstProduct.getByRole("button", {
      name: "Add",
    });
    const initialCountCartHeader = await CartHelpers.getCountCartHeader(page);
    await firstAddToCartButton.click();
    const addedButton = firstProduct.getByRole("button", { name: "Added" });
    await expect(addedButton).toBeVisible({ timeout: 10000 });
    const cartHeader = page.locator("#cartHeader");
    const expectedCount = initialCountCartHeader + 1;
    await CartHelpers.expectCartHeaderCount(page, cartHeader, expectedCount);

    // Verify whether the Product Image in the Recommended products is clickable and redirects to Product PDP.
    const imageLink = await firstProduct
      .locator("a:has(#productImage)")
      .getAttribute("href");
    await firstProduct.locator("#productImage").click();
    await page.waitForURL(/.*product.*/);
    await expect(page).toHaveURL(new RegExp(imageLink ?? ""));

    // Go back to the previous page
    await page.goBack();
    await page.waitForLoadState("domcontentloaded");

    // Verify whether the Product Title in the Recommended products is clickable and redirects to Product PDP.
    const titleLink = await firstProduct
      .locator("a:has(#productTitle)")
      .getAttribute("href");
    await firstProduct.locator("#productTitle").click();
    await page.waitForURL(/.*product.*/);
    await expect(page).toHaveURL(new RegExp(titleLink ?? ""));
  });
});

test.describe("Cart Title with Inventory Count & Remove All Functionality", () => {
  let firstProductQuantity: number;
  let secondProductQuantity: number;

  test.beforeEach("Add two products to cart", async ({ page }) => {
    // Element locators
    const oneTrustAcceptButton = page.getByRole("button", {
      name: "Accept Cookies",
      exact: true,
    });

    // Navigate to the first PDP
    await page.goto(
      "/gb/en/homeowner/product/26d361-truecoat-360-cordless-connect.html",
    );
    await oneTrustAcceptButton.click();

    // Increase the item quantity and add the first product to the cart
    await page.getByRole("button", { name: "Increase Quantity" }).click();
    await page.waitForTimeout(500);
    firstProductQuantity = await CartHelpers.getPDPItemCount(page);
    await page.getByRole("button", { name: "Add to Basket" }).click();
    await expect(
      page.getByRole("button", { name: "Add to Basket" }),
    ).not.toBeDisabled({ timeout: 10000 });

    // Navigate to the second PDP
    await page.goto("/gb/en/homeowner/product/18a886-truecoat-360-filter.html");

    // Add second product to cart
    await page.getByRole("button", { name: "Add to Basket" }).click();
    secondProductQuantity = await CartHelpers.getPDPItemCount(page);
    await expect(
      page.getByRole("button", { name: "Add to Basket" }),
    ).not.toBeDisabled({ timeout: 10000 });

    // Navigate to Cart page
    await page.getByLabel("Cart Icon").click();
    await page.waitForURL(/.*cart.*/);
    await expect(page).toHaveURL(/.*cart.*/);
  });

  test("Validate the functionality of cart title with inventory count", async ({
    page,
  }) => {
    // Element locators
    const cartHeader = page.locator("#cartHeader");
    const totalQuantity = firstProductQuantity + secondProductQuantity;
    const expectedPattern = new RegExp(`Basket\\(${totalQuantity} items?\\)`);
    const productList = page.locator("#cartEntries li");
    const expectedQuantities = [firstProductQuantity, secondProductQuantity];
    let cartItemCount;
    let initialCountCartHeader;
    let expectedCount;

    // Verify total quantity of all the added products is displayed in the cart title header
    await expect(cartHeader).toBeVisible();
    await expect(cartHeader).toHaveText(expectedPattern);

    // Verify correct quantity is displayed for the added products in product list
    const productCount = await productList.count();
    for (let i = 0; i < productCount; i++) {
      cartItemCount = await CartHelpers.getCartItemCount(productList.nth(i));
      expect(cartItemCount).toBe(expectedQuantities[i]);
    }

    // Verify item count increases in cart title header when quantity is increased in product list
    initialCountCartHeader = await CartHelpers.getCountCartHeader(page);
    const beforeIncreaseCount = await CartHelpers.getCartItemCount(
      productList.nth(0),
    );
    await productList.nth(0).getByLabel("Increase Quantity").click();
    await page.waitForTimeout(500);
    const afterIncreaseCount = await CartHelpers.getCartItemCount(
      productList.nth(0),
    );
    expect(afterIncreaseCount).toBeGreaterThan(beforeIncreaseCount);
    expectedCount = initialCountCartHeader + 1;
    await CartHelpers.expectCartHeaderCount(page, cartHeader, expectedCount);

    // Verify item count decreases in cart title header when quantity is decreased in product list
    initialCountCartHeader = await CartHelpers.getCountCartHeader(page);
    const beforeDecreaseCount = await CartHelpers.getCartItemCount(
      productList.nth(0),
    );
    await productList.nth(0).getByLabel("Decrease Quantity").click();
    await page.waitForTimeout(500);
    const afterDecreaseCount = await CartHelpers.getCartItemCount(
      productList.nth(0),
    );
    expect(afterDecreaseCount).toBeLessThan(beforeDecreaseCount);
    expectedCount = initialCountCartHeader - 1;
    await CartHelpers.expectCartHeaderCount(page, cartHeader, expectedCount);
  });

  test("Validate the cart title with Remove & Remove All functionality", async ({
    page,
  }) => {
    // Element locators
    const removeAll = page.getByRole("button", { name: "Remove All" });
    const cartHeader = page.locator("#cartHeader");
    const cartItems = page.locator("#cartEntries li");
    const continueShoppingButton = page.getByRole("link", {
      name: "Continue Shopping",
    });
    const orderSummarySection = page.locator("#yourOrderBlock").nth(1);
    const priceSection = orderSummarySection.locator("#estCartTotalBorder");
    const price = orderSummarySection.locator("#netPriceAmt");
    const checkoutButton = orderSummarySection.getByRole("button", {
      name: "Checkout",
    });
    const removeButton = page.getByRole("button", {
      name: "Remove",
      exact: true,
    });
    const productList = page.locator("#cartEntries li");

    // Verify item count decreases in cart title header when product is removed
    const countCartHeader = await CartHelpers.getCountCartHeader(page);
    const itemCountFirstProduct = await CartHelpers.getCartItemCount(
      productList.nth(0),
    );
    await removeButton.nth(0).click();
    const expectedCount = countCartHeader - itemCountFirstProduct;
    await CartHelpers.expectCartHeaderCount(page, cartHeader, expectedCount);

    // Verify clicking "Remove All" removes all items from the cart (Empty cart experience)
    await expect(removeAll).toBeVisible();
    await removeAll.click();
    await page.waitForSelector("text=(0 items)");
    await expect(cartHeader).toContainText("Basket(0 items)");
    await expect(page.getByText("Your Basket is Empty")).toBeVisible();
    await expect(
      page.getByText("Add a product in order to check out"),
    ).toBeVisible();
    await expect(cartItems).toHaveCount(0);
    await expect(continueShoppingButton.first()).toBeVisible();
    await expect(priceSection).toBeVisible();
    await expect(price).toContainText("0.00");
    await expect(checkoutButton).toHaveCount(0);
  });
});

test.describe("Cart Quantity Count Icon in Cart Page", () => {
  test.beforeEach(
    "Add a product from PDP and navigate to cart page",
    async ({ page }) => {
      // Navigate to PDP
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

      //Add a product to cart & navigate to cart page
      await page.getByRole("button", { name: "Add to Basket" }).click();
      await expect(
        page.getByRole("button", { name: "Add to Basket" }),
      ).not.toBeDisabled({ timeout: 10000 });
      await page.getByLabel("Cart Icon").click();
      await page.waitForURL(/.*cart.*/);
    },
  );

  test("Cart icon updates quantity after adding item(s)/removing item(s) from Cart Page", async ({
    page,
  }) => {
    // Element locators
    const productsSection = page.locator("#recommendedProductsBlock");
    const cartEntries = page.locator("#cartEntries li");
    const firstCartItem = cartEntries.nth(0);
    const firstRecommendedProduct = productsSection.locator("#card").nth(0);
    const addButton = firstRecommendedProduct.getByRole("button", {
      name: "Add",
    });
    const addedButton = firstRecommendedProduct.getByRole("button", {
      name: "Added",
    });
    const cartBadge = page.locator("#cartCountIconLabel");
    const removeButton = firstCartItem.getByRole("button", {
      name: "Remove",
      exact: true,
    });

    // Verify whether the cart icon quantity is showing 1 when we have 1 item in cart
    await expect(cartBadge).toHaveText("1");

    // Increase quantity to 3 from product list in cart page and verify cart icon quantity is getting updated
    await firstCartItem
      .getByRole("button", { name: "Increase Quantity" })
      .dblclick();
    await cartBadge.filter({ hasText: "3" }).waitFor();
    await expect(cartBadge).toHaveText("3");

    // Add another product from Recommended Products section to the cart and verify cart icon quantity is getting updated
    await expect(addButton).toBeVisible();
    await addButton.click();
    await expect(addedButton).toBeVisible();
    await cartBadge.filter({ hasText: "4" }).waitFor();
    await expect(cartBadge).toHaveText("4");

    // Decrease quantity of first product by 1 from product list in cart page and verify cart icon quantity is getting updated
    await firstCartItem
      .getByRole("button", { name: "Decrease Quantity" })
      .click();
    await cartBadge.filter({ hasText: "3" }).waitFor();
    await expect(cartBadge).toHaveText("3");

    // Remove first product from product list in cart page and verify cart icon quantity is getting updated
    await removeButton.click();
    await cartBadge.filter({ hasText: "1" }).waitFor();
    await expect(cartBadge).toHaveText("1");

    // Remove the remaining product from cart and verify cart icon quantity is not showing when we have empty cart
    const removeAll = page.getByRole("button", { name: "Remove All" });
    await expect(removeAll).toBeVisible();
    await removeAll.click();
    await expect(cartBadge).not.toBeVisible({ timeout: 10000 });
  });
});

test.describe("Validate Shipping Promotion Variant in Cart Page", () => {
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

  test("When subtotal is zero and free shipping threshold is present.", async ({
    page,
  }) => {
    const addToCartButton = page.locator('button:has-text("Add to Basket")');
    await expect(addToCartButton).toBeVisible();
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();
    const cartIcon = page.getByLabel("Cart Icon");
    await cartIcon.click();
    await page.waitForURL(/.*cart.*/);
    const removeAll = page.locator("#removeAllBtn");
    await removeAll.waitFor({ state: "visible" });
    await expect(removeAll).toBeVisible();
    await removeAll.click();
    const orderSummarySection = page.locator("#yourOrderBlock").nth(1);
    const subtotalLocator = orderSummarySection.locator("#netPriceAmt");
    const progressBarLocator = orderSummarySection.locator(
      "#freeShippingTrackingBlock",
    );

    await expect(subtotalLocator).toHaveText(new RegExp(`[£€]0\\.00`));
    const subtotal = await CartHelpers.getSubtotal(subtotalLocator);
    expect(subtotal).toBe(0);

    const thresholdText = await orderSummarySection
      .locator("#freeShippingThreshold")
      .textContent();
    const thresholdAmount = parseFloat(
      thresholdText?.replace(/[€£]/, "") || "0",
    );

    const progressText = await CartHelpers.getProgressText(progressBarLocator);
    expect(progressText).toMatch(/away from FREE Shipping/);
    expect(progressText).toMatch(
      new RegExp(`[€£]${thresholdAmount.toFixed(2)}`),
    );
    console.log(progressText);
  });

  test("When subtotal is present and free shipping threshold is present", async ({
    page,
  }) => {
    const cartIcon = page.getByLabel("Cart Icon");
    await cartIcon.click();
    await page.waitForURL(/.*cart.*/);
    const mostViewedProductsBlock = page
      .locator("#mostViewedProductsBlock")
      .nth(0);
    const firstMostViewedProduct = mostViewedProductsBlock
      .locator("#card")
      .nth(0);
    const addButton = firstMostViewedProduct.getByRole("button", {
      name: "Add",
    });
    await addButton.click();
    const firstRecommendedProducts = page.locator("#recommendedProductsBlock");
    const addedButton = firstRecommendedProducts.getByRole("button", {
      name: "Added",
    });
    await addedButton.waitFor({ state: "visible" });
    await expect(addedButton).toBeVisible();
    const orderSummarySection = page.locator("#yourOrderBlock").nth(1);
    const subtotalLocator = orderSummarySection.locator("#netPriceAmt");
    const progressBarLocator = orderSummarySection.locator(
      "#freeShippingTrackingBlock",
    );

    const thresholdText = await orderSummarySection
      .locator("#freeShippingThreshold")
      .textContent();
    const thresholdAmount = parseFloat(
      thresholdText?.replace(/[€£]/, "") || "0",
    );
    const subtotal = await CartHelpers.getSubtotal(subtotalLocator);
    expect(subtotal).toBeGreaterThan(0);
    expect(subtotal).toBeLessThan(thresholdAmount);

    const remaining = (thresholdAmount - subtotal).toFixed(2);
    const progressText = await CartHelpers.getProgressText(progressBarLocator);
    expect(progressText).toMatch(/away from FREE Shipping/);
    expect(progressText).toMatch(new RegExp(`[£€]${remaining}`));
    console.log(progressText);
  });

  test("When progress bar displays You’ve earned FREE Shipping", async ({
    page,
  }) => {
    const addToCartButton = page.locator('button:has-text("Add to Basket")');
    await expect(addToCartButton).toBeVisible();
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();
    const cartIcon = page.getByLabel("Cart Icon");
    await cartIcon.click();
    await page.waitForURL(/.*cart.*/);
    const orderSummarySection = page.locator("#yourOrderBlock").nth(1);
    const subtotalLocator = orderSummarySection.locator("#netPriceAmt");
    const progressBarLocator = orderSummarySection.locator(
      "#freeShippingTrackingBlock",
    );
    const thresholdText = await orderSummarySection
      .locator("#freeShippingThreshold")
      .textContent();
    const thresholdAmount = parseFloat(
      thresholdText?.replace(/[€£]/, "") || "0",
    );
    await page.waitForSelector('[id="cartEntries"]', {
      state: "visible",
    });
    await expect(page.locator("#cartHeader")).toContainText("Basket(1 item)");
    const subtotal = await CartHelpers.getSubtotal(subtotalLocator);
    expect(subtotal).toBeGreaterThanOrEqual(thresholdAmount);

    const progressText = await CartHelpers.getProgressText(progressBarLocator);
    expect(progressText).toMatch(/You['’]ve earned FREE Shipping/);
    console.log(progressText);
  });
});

test.describe("Validate Most Viewed Products in Empty Cart", () => {
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

  //empty cart validation for most viewed products - flow 1
  test("Empty Cart Validation", async ({ page }) => {
    const cartIcon = page.getByLabel("Cart Icon");
    await cartIcon.click();
    await page.waitForURL(/.*cart.*/);
    const header = page.getByText("Your Basket is Empty");
    await expect(header).toBeVisible();
    const body = page.getByText("Add a product in order to check out.");
    await expect(body).toBeVisible();
    const mostViewedProducts = page.getByText("Most Viewed Products").nth(0);
    await expect(mostViewedProducts).toBeVisible();
    const mostViewedProductsBlock = page
      .locator("#mostViewedProductsBlock")
      .nth(0);
    const productCards = mostViewedProductsBlock.locator("#card");
    await productCards.first().waitFor({ state: "visible" });
    const cardsCount = await productCards.count();
    console.log(cardsCount);

    //Verify whether five product cards are getting displayed in  cart screen
    await expect(productCards).toHaveCount(cardsCount);

    for (let i = 0; i < cardsCount; i++) {
      const card = productCards.nth(i);
      //productImageThumbnail, productName, ratingAndReview - Required
      const productImageThumbnail = card.locator("#productImage");
      await expect(productImageThumbnail).toBeVisible();
      const productName = card.locator("#productTitle");
      await expect(productName).toBeVisible();
      const ratingAndReview = card.locator("#productInlineRatingBlock");
      await ratingAndReview.waitFor({ state: "visible", timeout: 10000 });
      await expect(ratingAndReview).toBeVisible();
      //productPrice - Optional
      const productPrice = card.locator("#productPrice");
      const isPriceVisible = await productPrice.isVisible().catch(() => false);
      if (!isPriceVisible) {
        console.log(`${i}: Product price not visible.`);
      }
      //addToCartBtn - Optional
      const addToCartBtn = card.getByRole("button", { name: "Add" });
      const isAddBtnVisible = await addToCartBtn.isVisible().catch(() => false);

      if (!isAddBtnVisible) {
        console.log(`${i}: Add to Cart button not visible.`);
      }
    }

    //Verify whether the Product Image Thumbnail image in the Most viewed products is clickable and redirects to Product PDP.
    const productThumbnail = productCards.locator("#productImage").nth(0);
    await productThumbnail.click();
    await expect(page).toHaveURL(/\/product\/[a-zA-Z0-9\-]+$/);
    await page.goBack();
    await page.waitForURL(/.*cart.*/);

    //Verify whether the Product Title in the Most viewed products is clickable and redirects to Product PDP.
    const productTitle = productCards.locator("#productTitle").nth(0);
    await productTitle.click();
    await expect(page).toHaveURL(/\/product\/[a-zA-Z0-9\-]+(\.html)?$/);

    //adding product from recommended block to cart
    await page.goBack();
    await page.waitForURL(/.*cart.*/);
    await mostViewedProductsBlock
      .locator("#card")
      .first()
      .waitFor({ state: "visible" });
    let addedCardIndex = -1;
    for (let i = 0; i < cardsCount; i++) {
      const card = productCards.nth(i);
      const addButton = card.getByRole("button", {
        name: "Add",
      });
      if ((await addButton.isVisible()) && (await addButton.isEnabled())) {
        await addButton.scrollIntoViewIfNeeded();
        await addButton.click();
        console.log(`Added product from card index ${i}`);
        addedCardIndex = i;
        break;
      }
    }
    const recommendedProductBlock = page
      .locator("#recommendedProductsBlock")
      .nth(addedCardIndex);
    const addedButton = recommendedProductBlock.getByRole("button", {
      name: "Added",
    });
    await addedButton.waitFor({ state: "visible" });
    await expect(addedButton).toBeVisible();
  });

  //Verify whether the empty cart is getting displayed when there all items present in cart is removed with Remove all link. -Flow 2
  test("Empty Cart Validation with Remove all link", async ({ page }) => {
    const addToCartButton = page.locator('button:has-text("Add to Basket")');
    await expect(addToCartButton).toBeVisible();
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();
    const cartIcon = page.getByLabel("Cart Icon");
    await cartIcon.click();
    await page.waitForURL(/.*cart.*/);
    const removeAll = page.locator("#removeAllBtn");
    await removeAll.waitFor({ state: "visible" });
    await expect(removeAll).toBeVisible();
    await removeAll.click();

    const header = page.getByText("Your Basket is Empty");
    await expect(header).toBeVisible();
    const body = page.getByText("Add a product in order to check out.");
    await expect(body).toBeVisible();
    const mostViewedProducts = page.getByText("Most Viewed Products").nth(0);
    await expect(mostViewedProducts).toBeVisible();
    const mostViewedProductsBlock = page
      .locator("#mostViewedProductsBlock")
      .nth(0);
    const productCards = mostViewedProductsBlock.locator("#card");
    await productCards.first().waitFor({ state: "visible", timeout: 10000 });
    const cardsCount = await productCards.count();
    console.log(cardsCount);
    //Verify whether five product cards are getting displayed in  cart screen
    await expect(productCards).toHaveCount(cardsCount);

    for (let i = 0; i < cardsCount; i++) {
      const card = productCards.nth(i);
      //productImageThumbnail, productName, ratingAndReview - Required
      const productImageThumbnail = card.locator("#productImage");
      await expect(productImageThumbnail).toBeVisible();
      const productName = card.locator("#productTitle");
      await expect(productName).toBeVisible();
      const ratingAndReview = card.locator("#productInlineRatingBlock");
      await ratingAndReview.waitFor({ state: "visible", timeout: 10000 });
      await expect(ratingAndReview).toBeVisible();
      //productPrice - Optional
      const productPrice = card.locator("#productPrice");
      const isPriceVisible = await productPrice.isVisible().catch(() => false);
      if (!isPriceVisible) {
        console.log(`${i}: Product price not visible.`);
      }
      //addToCartBtn - Optional
      const addToCartBtn = card.getByRole("button", { name: "Add" });
      const isAddBtnVisible = await addToCartBtn.isVisible().catch(() => false);

      if (!isAddBtnVisible) {
        console.log(`${i}: Add to Cart button not visible.`);
      }
    }

    //Verify whether the Product Image Thumbnail image in the Most viewed products is clickable and redirects to Product PDP.
    const productThumbnail = productCards.locator("#productImage").nth(0);
    await productThumbnail.click();
    await expect(page).toHaveURL(/\/product\/[a-zA-Z0-9\-]+$/);
    await page.goBack();
    await page.waitForURL(/.*cart.*/);
    //Verify whether the Product Title in the Most viewed products is clickable and redirects to Product PDP.
    const productTitle = productCards.locator("#productTitle").nth(0);
    await productTitle.click();
    await expect(page).toHaveURL(/\/product\/[a-zA-Z0-9\-]+(\.html)?$/);

    //adding product from recommended block to cart
    await page.goBack();
    await page.waitForURL(/.*cart.*/);
    await mostViewedProductsBlock
      .locator("#card")
      .first()
      .waitFor({ state: "visible" });
    let addedCardIndex = -1;
    for (let i = 0; i < cardsCount; i++) {
      const card = productCards.nth(i);
      const addButton = card.getByRole("button", {
        name: "Add",
      });
      if ((await addButton.isVisible()) && (await addButton.isEnabled())) {
        await addButton.scrollIntoViewIfNeeded();
        await addButton.click();
        console.log(`Added product from card index ${i}`);
        addedCardIndex = i;
        break;
      }
    }
    const recommendedProductBlock = page
      .locator("#recommendedProductsBlock")
      .nth(addedCardIndex);
    const addedButton = recommendedProductBlock.getByRole("button", {
      name: "Added",
    });
    await expect(addedButton).toBeVisible({ timeout: 10000 });
  });
});
