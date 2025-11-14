import { AddressModel } from "@/lib/models/addressModel";
import { EntryModel } from "@/lib/models/cartModel";
import { DiscountModel } from "@/lib/models/discountModel";
import { MarketingConsent } from "@/lib/models/orderModel";
import { PriceModel } from "@/lib/models/priceModel";
import { mapProductModelFromLineItem } from "@/lib/product";
import { Optional } from "@/lib/types";
import { Address, FieldContainer, LineItem } from "@commercetools/platform-sdk";

/**
 * Function that accepts a price value and returns a {@link PriceModel}.
 */
export type PricingFunction = (price: number) => PriceModel;

/**
 * Function that accepts a currency and returns a function accepting a price value.
 */
export type CurrencyFunction = (currency: string) => PricingFunction;

/**
 * Performs currying for a 3 argument function to allow for partial application
 * of parameters in order to return a clean {@link PriceModel}.
 *
 * @example
 * const [locale, currency, price] = ["en-GB", "GBP", 2000];
 * const mapPricing: PricingFunction = mapPriceModel(locale)(currency);
 * const priceModel = mapPricing(price);
 *
 * @example
 * const locale = "en-GB";
 * const formatCurrency: CurrencyFunction = mapPriceModel(locale);
 * const obj = mapValue(value, formatCurrency);
 * function mapValue(value: any, formatCurrency: CurrencyFunction) {
 *   const priceInfo = value.price;
 *   const priceModel = formatCurrency(priceInfo.currencyCode)(priceInfo.centAmount);
 * }
 *
 * @param locale the locale
 * @returns a currying function to map pricing information
 */
export function mapPriceModel(locale: string): CurrencyFunction {
  return function (currency: string): PricingFunction {
    return function (price: number): PriceModel {
      const formatted = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      }).format(price / 100);

      return {
        currencyIso: currency,
        formattedValue: formatted,
        value: price,
      };
    };
  };
}

/**
 * Maps discount information into a cleaned {@link DiscountModel}.
 *
 * @param netPrice the net price value of the cart
 * @param amount the discount value on the total price
 * @param mapPricing function to map pricing information
 * @returns a discount model
 */
export function mapDiscountModel(
  netPrice: number,
  amount: number,
  mapPricing: PricingFunction,
): DiscountModel {
  const discountedAmount = mapPricing(amount);
  const percentage = discountedAmount
    ? Math.round(((netPrice - discountedAmount.value) / netPrice) * 100)
    : 0;
  return {
    amount: discountedAmount,
    percentage: percentage,
  };
}

/**
 * Maps a commercetools {@link Address} into a cleaned {@link AddressModel}.
 *
 * @param address the commercetools address
 * @returns cleaned address model
 */
export function mapAddressModel(
  address: Optional<Address>,
): Optional<AddressModel> {
  if (address) {
    return {
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      email: address.email || "",
      addressLine1: address.streetName || "",
      addressLine2: address.additionalStreetInfo || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country,
      phone: address.phone || "",
    };
  }
}

/**
 * Maps information from a {@link LineItem} from a commercetools (Cart/Order)
 * object to a clean {@link EntryModel}.
 *
 * @param item the line item from a commercetools cart/order object
 * @param locale the locale
 * @param formatCurrency a function to map a price to a {@link PriceModel}
 * @returns an entry model
 */
export function mapEntryModel(
  item: LineItem,
  locale: string,
  formatCurrency: CurrencyFunction,
): EntryModel {
  const base = item.price.value;
  const net = item.totalPrice;
  return {
    id: item.id, // line item/cart entry id
    product: mapProductModelFromLineItem(item, locale, formatCurrency),
    quantity: item.quantity,
    basePrice: formatCurrency(base.currencyCode)(base.centAmount),
    netPrice: formatCurrency(net.currencyCode)(net.centAmount),
  };
}

/**
 * Type guard to check if the provided custom field is a {@link MarketingConsent} custom field.
 * @param fields the field container
 * @returns a type predicate
 */
export function isMarketingConsent(
  fields: FieldContainer | undefined,
): fields is MarketingConsent {
  return fields !== undefined ? fields.marketingConsent !== undefined : false;
}
