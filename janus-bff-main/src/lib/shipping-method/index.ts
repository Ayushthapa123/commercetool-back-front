import { emptyPrice } from "@/lib/models/priceModel";
import { ShippingMethodModel } from "@/lib/models/shippingMethodModel";
import { mapPriceModel } from "@/lib/models/utils";
import { ShippingMethod, ShippingRate } from "@commercetools/platform-sdk";

/**
 * Helper function to find a matching shipping rate for a given cart, location or currency.
 *
 * @param method the shipping method
 * @param currency the currency code (optional)
 * @returns the matching shipping rate
 */
export function mapMatchingRate(
  method: ShippingMethod,
  currency?: string,
): ShippingRate {
  const matchingRate = method.zoneRates
    .flatMap((zoneRate) => zoneRate.shippingRates)
    .find((rate) => rate.isMatching || rate.price.currencyCode === currency);

  if (!matchingRate) {
    throw new Error("Unable to find matching shipping rate.");
  }

  return matchingRate;
}

/**
 * Maps a commercetools {@link ShippingMethod} into a cleaned {@link ShippingMethodModel}.
 *
 * @param method the commercetools shipping method
 * @param rate the shipping rate
 * @param locale the locale
 * @returns cleaned shipping method model
 */
export function mapShippingMethodModel(
  method: ShippingMethod,
  rate: ShippingRate,
  locale: string,
): ShippingMethodModel {
  const description = method.localizedDescription
    ? method.localizedDescription[locale]
    : method.name;
  const mapPricing = mapPriceModel(locale)(rate.price.currencyCode);
  const cost = mapPricing(rate.price.centAmount);
  const freeAbove = rate.freeAbove
    ? mapPricing(rate.freeAbove.centAmount)
    : emptyPrice();

  return {
    id: method.id,
    deliveryCost: cost,
    description: description,
    name: method.name,
    freeShipLevel: freeAbove,
  };
}
