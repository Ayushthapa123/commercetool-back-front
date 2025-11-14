import { describe, expect, it } from "vitest";
import { PriceModel } from "./priceModel";
import { mapPriceModel } from "./utils";

describe("mapPriceModel", () => {
  const locale = "en-GB";
  const currency = "EUR";
  const price = 10000;

  const expected: PriceModel = {
    currencyIso: "EUR",
    formattedValue: "€100.00",
    value: 10000,
  };

  it("happy path - curry all arguments", () => {
    // when
    const result = mapPriceModel(locale)(currency)(price);

    // then
    expect(result).toEqual(expected);
  });

  it("happy path - curry first two args", () => {
    // given
    const mapPricing = mapPriceModel(locale)(currency);

    // when
    const result = mapPricing(price);

    // then
    expect(result).toEqual(expected);
  });

  it("happy path - curry one arg", () => {
    // given
    const formatCurrency = mapPriceModel(locale);
    const mapPricing = formatCurrency(currency);

    // when
    const result = mapPricing(price);

    // then
    expect(result).toEqual(expected);
  });
});
