import { expect, test } from "@playwright/test";

test.describe("Validate the Checkout Page", () => {
  test.beforeEach("Go to Product Detail page", async ({ page }) => {
    await page.goto(
      "/gb/en/homeowner/product/26d361-truecoat-360-cordless-connect.html",
    );
    const oneTrustAcceptButton = page.getByRole("button", {
      name: "Accept Cookies",
      exact: true,
    });
    const checkout = page.getByRole("link", { name: "Checkout" });
    await oneTrustAcceptButton.click();
    await page.getByRole("button", { name: "Add to Basket" }).click();
    await expect(
      page.getByRole("button", { name: "Add to Basket" }),
    ).not.toBeDisabled({ timeout: 10000 });
    await page.getByRole("link", { name: "Cart Icon" }).click();
    // Wait for the cart page to load
    await page.waitForURL("/gb/en/cart.html");
    await expect(page).toHaveURL("/gb/en/cart.html");
    await expect(checkout).toBeVisible();
    await checkout.click();
    await page.waitForURL("/gb/en/checkout.html");
    // Wait for skeleton to disappear
    await page.waitForSelector('[id="shipping-address-skeleton"]', {
      state: "detached",
      timeout: 30000,
    });

    // Wait for shipping form to appear
    await page.waitForSelector('[id="stripeShippingAddressElement"]', {
      state: "visible",
      timeout: 30000,
    });
  });
  test("Validate the maximum character length for first name and last name should be 150", async ({
    page,
  }) => {
    const deliveryMethod = page.locator("#labelshippingAddress");
    await expect(deliveryMethod).toBeVisible();
    await page.locator("#email").fill("rumana_m_shaikhbade@graco.com");
    const frame = page.frameLocator('[title= "Secure address input frame"]');
    const firstName = 'input[name="firstName"]';
    const lastName = 'input[name="lastName"]';

    //Verify max length (150 chars)
    const longName = "A".repeat(150);
    await frame.locator(firstName).fill(longName);
    await frame.locator(lastName).fill(longName);

    const firstNameValue = await frame.locator(firstName).inputValue();
    const lastNameValue = await frame.locator(lastName).inputValue();
    expect(firstNameValue.length).toBeLessThanOrEqual(150);
    expect(lastNameValue.length).toBeLessThanOrEqual(150);

    // Fill in the address
    await frame.locator('input[name="addressLine1"]').fill("26 Downing Street");
    await page.mouse.click(100, 100);
    await frame.locator('input[name = "locality"]').fill("Halesowen");
    await frame.locator('input[name = "postalCode"]').fill("B63 3TA");
    await frame.locator('input[name = "phone"]').fill("020 7946 0958");
    await page.getByRole("button", { name: "Continue Continue" }).click();
    const errorMessageText =
      "Use up to 150 characters. Letters, hyphens (-), and apostrophes (') only.";
    await expect(page.locator(`text=${errorMessageText}`)).not.toBeVisible();
  });

  test("Validate the customer is not allowed to enter invalid characters and more than 150 characters in first and last name fields", async ({
    page,
  }) => {
    const deliveryMethod = page.locator("#labelshippingAddress");
    await expect(deliveryMethod).toBeVisible();
    await page.locator("#email").fill("rumana_m_shaikhbade@graco.com");
    const frame = page.frameLocator('[title= "Secure address input frame"]');
    const firstName = 'input[name="firstName"]';
    const lastName = 'input[name="lastName"]';

    //Verify invalid characters and more than 150 characters are not allowed
    const longName = "RumanaS@#$%^*".repeat(151);
    await frame.locator(firstName).fill(longName);
    await frame.locator(lastName).fill(longName);

    // Fill in the address
    await frame.locator('input[name="addressLine1"]').fill("26 Downing Street");
    await page.mouse.click(100, 100);
    await frame.locator('input[name = "locality"]').fill("Halesowen");
    await frame.locator('input[name = "postalCode"]').fill("B63 3TA");
    await frame.locator('input[name = "phone"]').fill("020 7946 0958");
    await page.getByRole("button", { name: "Continue Continue" }).click();
    const errorMessageText =
      "Use up to 150 characters. Letters, hyphens (-), and apostrophes (') only.";
    await expect(page.locator(`text=${errorMessageText}`)).toBeVisible({
      timeout: 10000,
    });
  });

  test("Verify hyphens (-), and apostrophes (')  in the first and last name fields accepted", async ({
    page,
  }) => {
    const deliveryMethod = page.locator("#labelshippingAddress");
    await expect(deliveryMethod).toBeVisible();
    await page.locator("#email").fill("rumana_m_shaikhbade@graco.com");
    const frame = page.frameLocator('[title= "Secure address input frame"]');
    const firstName = 'input[name="firstName"]';
    const lastName = 'input[name="lastName"]';

    //Verify valid characters are allowed
    const validName = "O'Connor-Smith";
    await frame.locator(firstName).fill(validName);
    await frame.locator(lastName).fill(validName);

    // Fill in the address
    await frame.locator('input[name="addressLine1"]').fill("26 Downing Street");
    await page.mouse.click(100, 100);
    await frame.locator('input[name = "locality"]').fill("Halesowen");
    await frame.locator('input[name = "postalCode"]').fill("B63 3TA");
    await frame.locator('input[name = "phone"]').fill("020 7946 0958");
    await page.getByRole("button", { name: "Continue Continue" }).click();
    const errorMessageText =
      "Use up to 150 characters. Letters, hyphens (-), and apostrophes (') only.";
    await expect(page.locator(`text=${errorMessageText}`)).not.toBeVisible();
  });

  test("Validate responsiveness with max-length input", async ({ page }) => {
    const deliveryMethod = page.locator("#labelshippingAddress");
    await expect(deliveryMethod).toBeVisible();
    await page.locator("#email").fill("rumana_m_shaikhbade@graco.com");
    const frame = page.frameLocator('[title= "Secure address input frame"]');
    const firstName = 'input[name="firstName"]';
    const lastName = 'input[name="lastName"]';

    const longName = "A".repeat(150);
    const firstNameInput = frame.locator(firstName);
    await firstNameInput.fill(longName);
    const lastNameInput = frame.locator(lastName);
    await lastNameInput.fill(longName);

    await expect(firstNameInput).toBeVisible();
    await expect(firstNameInput).toHaveValue(longName);

    await expect(lastNameInput).toBeVisible();
    await expect(lastNameInput).toHaveValue(longName);

    //Testcase - Verify whether the word wrapping is happening when the names are too long.
    //On hold as we have open defect for this case
  });

  test("Delivery Address Exclusions", async ({ page }) => {
    const deliveryMethod = page.locator("#labelshippingAddress");
    await expect(deliveryMethod).toBeVisible();
    await page.locator("#email").fill("rumana_m_shaikhbade@graco.com");
    const frame = await page.frameLocator(
      '[title= "Secure address input frame"]',
    );

    // Fill in the first name
    await frame.locator('input[name="firstName"]').fill("Rumana");

    // Fill in the last name
    await frame.locator('input[name="lastName"]').fill("Shaikhbade");

    // Fill in the address
    await frame.locator('input[name="addressLine1"]').fill("13 GLENHUGH PARK");
    await page.mouse.click(100, 100);
    await frame.locator('input[name = "locality"]').fill("BELFAST");
    await frame.locator('input[name = "postalCode"]').fill("BT8 7PQ");
    await frame.locator('input[name = "phone"]').fill("074 0012 3456");
    await page.getByRole("button", { name: "Continue Continue" }).click();
    await expect(page.getByText("Excluded postal code")).toBeVisible();
  });

  // TODO many of these addresses are now no longer saying no results could be found.
  // test("Checkout Page Validation with correct address", async ({ page }) => {
  //   //Smarty Address modal popup is not getting displayed when the address entered is valid during check out
  //   await page.getByPlaceholder("First Name").fill("Nipun");
  //   await page.getByPlaceholder("Last Name").fill("Graco");
  //   await page.getByPlaceholder("Email").fill("Nipun.Katokota@graco.com");
  //   await page.getByRole("combobox", { name: "Country*" }).click();
  //   await page.getByRole("option", { name: "United Kingdom" }).click();
  //   await page.getByPlaceholder("Street Address", { exact: true }).click();
  //   await page
  //     .getByPlaceholder("Street Address", { exact: true })
  //     .fill("gloucester");
  //   await page
  //     .getByText("Gloucester Avenue Thornton-Cleveleys FY5 2DQ")
  //     .click();
  //   await page
  //     .getByText("1 Gloucester Avenue Thornton-Cleveleys FY5 2DQ", {
  //       exact: true,
  //     })
  //     .click();
  //   await page.locator("#phone").fill("17634445555");
  //   await expect(
  //     page.getByPlaceholder("Street Address", { exact: true }),
  //   ).toHaveValue("1 Gloucester Avenue");
  //   await page.locator("#phone").fill("17634445555");
  //   await page.getByRole("button", { name: "Continue Continue" }).click();
  // });

  // test("Smarty Modal Pop-Up with cancel button", async ({ page }) => {
  //   await page.getByPlaceholder("First Name").fill("Nipun");
  //   await page.getByPlaceholder("Last Name").fill("Graco");
  //   await page.getByPlaceholder("Email").fill("Nipun.Katokota@graco.com");
  //   await page.getByRole("combobox", { name: "Country*" }).click();
  //   await page.getByRole("option", { name: "United Kingdom" }).click();
  //   await page.getByPlaceholder("Street Address", { exact: true }).click();
  //   await page
  //     .getByPlaceholder("Street Address", { exact: true })
  //     .fill("9 Fern");
  //   await page
  //     .getByText("92 Fern Avenue Staveley Chesterfield S43 3RA")
  //     .click();
  //   await page.locator("#phone").fill("17634445555");
  //   await expect(
  //     page.getByPlaceholder("Street Address", { exact: true }),
  //   ).toHaveValue("92 Fern Avenue Staveley");
  //   await page.getByRole("button", { name: "Continue Continue" }).click();
  //   await expect(
  //     page.getByText("We are unable to verify the address as entered."),
  //   ).toBeVisible();
  //   await expect(
  //     page.getByText("Please choose one of the following:"),
  //   ).toBeVisible();
  //   await page.locator("#suggestedAddress").click();
  //   await page.locator("#verifyAddressCancel").click();
  // });

  // test("Smarty Modal Pop-Up with continue button", async ({ page }) => {
  //   await page.getByPlaceholder("First Name").fill("Nipun");
  //   await page.getByPlaceholder("Last Name").fill("Graco");
  //   await page.getByPlaceholder("Email").fill("Nipun.Katokota@graco.com");
  //   await page.getByRole("combobox", { name: "Country*" }).click();
  //   await page.getByRole("option", { name: "United Kingdom" }).click();
  //   await page.getByPlaceholder("Street Address", { exact: true }).click();
  //   await page
  //     .getByPlaceholder("Street Address", { exact: true })
  //     .fill("9 Fern");
  //   await page
  //     .getByText("92 Fern Avenue Staveley Chesterfield S43 3RA")
  //     .click();
  //   await page.locator("#phone").fill("17634445555");
  //   await expect(
  //     page.getByPlaceholder("Street Address", { exact: true }),
  //   ).toHaveValue("92 Fern Avenue Staveley");
  //   await page.getByRole("button", { name: "Continue Continue" }).click();
  //   await expect(
  //     page.getByText("We are unable to verify the address as entered."),
  //   ).toBeVisible();
  //   await expect(
  //     page.getByText("Please choose one of the following:"),
  //   ).toBeVisible();
  //   await page.locator("#suggestedAddress").click();
  //   await page.locator("#verifyAddressContinue").click();
  // });

  // test("Checkout Page Validation with NO Suggested Address", async ({
  //   page,
  // }) => {
  //   //No suggested address case
  //   await page.getByPlaceholder("First Name").fill("Nipun");
  //   await page.getByPlaceholder("Last Name").fill("Graco");
  //   await page.getByPlaceholder("Email").fill("Nipun.Katokota@graco.com");
  //   await page.getByRole("combobox", { name: "Country*" }).click();
  //   await page.getByRole("option", { name: "Belgium" }).click();
  //   await page.getByPlaceholder("Street Address", { exact: true }).click();
  //   await page.getByPlaceholder("Street Address", { exact: true }).fill("add");
  //   await page.getByText("Ad. Delmezstraat 7880 Vloesberg").nth(1).click();
  //   await page.locator("#phone").fill("17634445555");
  //   await expect(
  //     page.getByRole("textbox", { name: "Postal Code*" }),
  //   ).toHaveValue("7880");
  //   await expect(page.getByRole("textbox", { name: "City*" })).toHaveValue(
  //     "Vloesberg",
  //   );
  //   await page.getByRole("button", { name: "Continue Continue" }).click();
  //   await expect(
  //     page.getByText("We are unable to verify the address as entered."),
  //   ).toBeVisible();
  //   await expect(
  //     page.getByText(
  //       "Please review the address you entered before continuing.",
  //     ),
  //   ).toBeVisible();
  //   await expect(
  //     page.getByRole("button", { name: "Edit Address" }),
  //   ).toBeVisible();
  //   await page.getByRole("button", { name: "Edit Address" }).click();
  //   await page.getByRole("button", { name: "Continue Continue" }).click();
  //   await page.getByRole("button", { name: "Continue with Address" }).click();
  // });

  // test("Validate Province Dropdown for supported countries", async ({
  //   page,
  // }) => {
  //   // Element locators
  //   const countryField = page.getByRole("combobox", { name: "Country*" });
  //   const provinceField = page.getByRole("combobox", {
  //     name: "Province*",
  //   });
  //   const countryDropdownMenu = page.locator("#selectPrimitiveViewport");
  //   const provinceDropdownMenu = page
  //     .locator("#selectPrimitiveViewport")
  //     .getByRole("option");

  //   // Iterate over each country and its corresponding list of expected provinces from the countryProvinceMap.
  //   for (const [country, expectedProvinces] of Object.entries(
  //     countryProvinceMap,
  //   )) {
  //     // Cick on country dropdown and select desired country
  //     await expect(countryField).toBeVisible();
  //     await countryField.click();
  //     await countryDropdownMenu.getByRole("option", { name: country }).click();

  //     // Click on province dropdown
  //     await expect(provinceField).toBeEnabled();
  //     await provinceField.click();

  //     // Extract all the province options appearing corresponding to the selected country
  //     await expect(provinceDropdownMenu.first()).toBeVisible();
  //     const actualProvinces = await provinceDropdownMenu.allTextContents();

  //     // Calculate sample indices
  //     const sampleIndices = [
  //       0,
  //       Math.floor(actualProvinces.length / 2),
  //       actualProvinces.length - 1,
  //     ];

  //     /* Validate that the actual provinces contain the expected provinces at the sampled indices.
  //        This approach ensures that we are checking the first, middle, and last provinces
  //        without needing to validate the entire list, making the test efficient yet effective.
  //     */

  //     sampleIndices.forEach((index, i) => {
  //       const actual = actualProvinces[index];
  //       const expected = expectedProvinces[i];
  //       expect(actual).toBe(expected);
  //     });

  //     // Close Province dropdown
  //     await page.keyboard.press("Escape");
  //   }
  // });

  test("Discount Code field validation", async ({ page }) => {
    //Apply Discount is present
    const orderBlock = page.locator("#checkoutYourOrderBlock");
    const discountBlock = orderBlock.locator("#discount");
    const applyDiscount = discountBlock.getByText("Apply Discount Code");
    await applyDiscount.click();
    const testingDiscountCode = "SAVE10";
    const enterCodeInputField = discountBlock.getByPlaceholder("Enter Code");
    await enterCodeInputField.fill(testingDiscountCode);

    //Action on discount cod
    const applyButton = discountBlock.locator("#applyDiscountCodeButton");
    await applyButton.click();
    const discountMessage = discountBlock
      .getByText("This discount code was applied successfully!")
      .nth(0);
    await expect(discountMessage).toBeVisible({ timeout: 12000 });
    const discountPriceBlock = page.locator("#discountCodeBlock");
    await expect(discountPriceBlock).toBeVisible();
    //This discount code was already applied
    await applyButton.click();
    const message1 = discountBlock
      .getByText("This discount code was already applied.")
      .nth(0);
    await expect(message1).toBeVisible();
    //Remove Discount Code
    await enterCodeInputField.clear();
    const invalidCode = "SAVE1";
    await enterCodeInputField.fill(invalidCode);
    await applyButton.click();
  });
  test("Net price calculation", async ({ page }) => {
    const yourOrderBlock = page.locator("#checkoutYourOrderBlock");
    const heading = yourOrderBlock.getByRole("heading", { name: "Your Order" });
    await expect(heading).toBeVisible();
    const subTotal = yourOrderBlock.locator("#subTotalBlock");
    const totalAmt = subTotal.locator("#subTotalAmt");
    const total = await totalAmt.textContent();
    console.log("Total Amount is: " + total);
    const vat = subTotal.locator("#checkoutVATLabel");
    await expect(vat).toHaveText("Includes VAT");
    const shippingAmt = yourOrderBlock.locator("#shippingRateAmt");
    const shippingCostText = await shippingAmt.textContent();
    let shippingCostValue = 0;
    if (shippingCostText === "Free") {
      console.log("Shipping Cost is Free");
      shippingCostValue = 0;
      console.log("Shipping Cost value is: " + shippingCostValue);
    } else {
      shippingCostValue = parseFloat(
        shippingCostText?.replace(/[^0-9.-]+/g, "") || "0",
      );
      console.log("Shipping Cost is: " + shippingCostText);
    }

    const dicountCodeBlock = yourOrderBlock.locator("#discount");
    const applyDiscount = dicountCodeBlock.getByText("Apply Discount Code");
    await expect(applyDiscount).toBeVisible();
    await applyDiscount.click();
    const inputCodeField = dicountCodeBlock.getByPlaceholder("Enter Code");
    await inputCodeField.fill("SAVE10");
    const applyButton = dicountCodeBlock.locator("#applyDiscountCodeButton");
    await applyButton.click();
    const netPriceBlock = yourOrderBlock.locator("#netPriceBlock");
    const netPriceLabel = netPriceBlock.locator("#netPriceAmt");
    const netPriceText = await netPriceLabel.textContent();
    console.log("Net Price after discount is: " + netPriceText);
    const totalSaving = yourOrderBlock.locator("#totalSaving");
    const totalSavingPrice = totalSaving.locator("#totalAmtSaving");
    const savingsText = await totalSavingPrice.textContent();
    console.log("Total Savings is: " + savingsText);

    // Parse all values to numbers
    const totalValue = total ? parseFloat(total.replace(/[^0-9.-]+/g, "")) : 0;
    const savingsValue = savingsText
      ? parseFloat(savingsText.replace(/[^0-9.-]+/g, ""))
      : 0;
    const netPriceValue = netPriceText
      ? parseFloat(netPriceText.replace(/[^0-9.-]+/g, ""))
      : 0;

    if (
      total !== null &&
      !isNaN(totalValue) &&
      !isNaN(savingsValue) &&
      !isNaN(shippingCostValue)
    ) {
      const expectedNetPrice = totalValue - savingsValue + shippingCostValue;
      if (Math.abs(netPriceValue - expectedNetPrice) < 0.01) {
        console.log("Net Price is correctly calculated");
      } else {
        console.log(
          "Net Price calculation mismatch: expected " +
            expectedNetPrice +
            ", got " +
            netPriceValue,
        );
      }
    } else {
      console.log(
        "Could not validate Net Price due to missing or invalid values.",
      );
    }
  });
  test("AddtoCart add-on validation", async ({ page }) => {
    const yourOrderBlock = page.locator("#checkoutYourOrderBlock");
    const addOnSection = yourOrderBlock.getByRole("button", {
      name: "In Your Basket (1 item)",
    });
    await expect(addOnSection).toBeVisible();
    await addOnSection.click();
    const productName = yourOrderBlock.getByText(
      "TrueCoat 360 Cordless Connect Drill Sprayer",
    );
    await expect(productName).toBeVisible();

    try {
      await productName.click({ trial: true }); // trial click doesn't perform the action
      console.log("Element is clickable");
    } catch {
      console.log("Element is NOT clickable");
    }

    const quantity = yourOrderBlock.getByText("Qty: 1");
    await expect(quantity).toBeVisible();
  });
});
