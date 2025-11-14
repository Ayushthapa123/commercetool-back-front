import { DEFAULT_LOCALE } from "@/lib/constants";
import { CartModel } from "@/lib/models/cartModel";
import {
  isMarketingConsent,
  mapAddressModel,
  mapDiscountModel,
  mapEntryModel,
  mapPriceModel,
} from "@/lib/models/utils";
import { mapShippingMethodModel } from "@/lib/shipping-method";
import { calculateDiscount, getServiceAuthToken, logError } from "@/lib/utils";
import { Cart, ShippingMethod } from "@commercetools/platform-sdk";
import axios, { AxiosRequestConfig } from "axios";

/**
 * Builds the query string containing required expansion parameters in order to
 * perform reference expansion on objects within a {@link Cart} object.
 *
 * @returns search params object containing required parameters
 */
export function getCartExpansionParameters() {
  const EXPAND = "expand";
  const params = new URLSearchParams();
  params.append(EXPAND, "discountCodes[*].discountCode");
  params.append(EXPAND, "shippingInfo.shippingMethod");
  params.append(EXPAND, "lineItems[*].variant.prices.discounted.discount");
  params.append(EXPAND, "paymentInfo.payments[*]");
  return params;
}

/**
 * Maps a commercetools {@link Cart} object into a cleaned {@link CartModel}.
 *
 * @param cart the commercetools cart object
 * @returns a cart model
 */
export async function mapCartModel(cart: Cart): Promise<CartModel> {
  const locale = cart.locale || DEFAULT_LOCALE;
  const currency = cart.totalPrice.currencyCode;
  const formatCurrency = mapPriceModel(locale);
  const mapPricing = formatCurrency(currency);

  const subTotalValue = cart.lineItems
    .map((item) => item.totalPrice.centAmount)
    .reduce((prev, curr) => prev + curr, 0);
  const subTotal = mapPricing(subTotalValue);
  const netPrice = mapPricing(cart.totalPrice.centAmount);
  const discountAmount = calculateDiscount(
    cart.discountOnTotalPrice,
    cart.lineItems,
  );
  const discount =
    discountAmount != 0
      ? mapDiscountModel(netPrice.value, discountAmount, mapPricing)
      : undefined;
  const optIn = isMarketingConsent(cart.custom?.fields)
    ? cart.custom.fields.marketingConsent
    : false;

  const createdAt = new Date(cart.createdAt);
  const date = new Intl.DateTimeFormat(locale).format(createdAt);
  const cartModifiedAt = new Date(cart.lastModifiedAt);
  const cartModifiedDate = new Intl.DateTimeFormat(locale).format(
    cartModifiedAt,
  );
  // Only one discount code may be present on a cart, these are non-stacking
  let discountCode = undefined;
  let discountId = undefined;
  if (
    cart.discountCodes.length > 0 &&
    cart.discountCodes[0].discountCode.obj != null
  ) {
    discountCode = cart.discountCodes[0].discountCode.obj?.code;
    discountId = cart.discountCodes[0].discountCode.id;
  }

  const entries = cart.lineItems.map((item) =>
    mapEntryModel(item, locale, formatCurrency),
  );
  const totalItemQuantity = cart.lineItems
    .map((item) => item.quantity)
    .reduce((prev, curr) => prev + curr, 0);

  const shippingAddress = mapAddressModel(cart.shippingAddress);
  const billingAddress = mapAddressModel(cart.billingAddress);
  const shippingMethod = cart.shippingInfo?.shippingMethod?.obj
    ? mapShippingMethodModel(
        cart.shippingInfo.shippingMethod.obj,
        cart.shippingInfo.shippingRate,
        locale,
      )
    : undefined;

  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;
  const token = await getServiceAuthToken();
  const options: AxiosRequestConfig = {
    method: "GET",
    url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/shipping-methods/key=standard-shipping`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // TODO Remove free ship level from cart model, should be using shipping method
  let freeShipLevel = 0;
  try {
    const { data } = await axios.request<ShippingMethod>(options);

    const rates = data.zoneRates[0].shippingRates.filter(
      (rate) => rate.price.currencyCode === currency,
    );
    freeShipLevel = rates[0].freeAbove?.centAmount ?? 0;
  } catch (error: unknown) {
    logError(
      error,
      `Error getting shipping method of standard shipping for cartId: ${cart.id}`,
    );
  }

  const paymentIntentId = cart?.paymentInfo?.payments?.[0]?.obj?.interfaceId;

  const state = cart.cartState;

  return {
    id: cart.id,
    version: cart.version,
    totalItems: totalItemQuantity,
    orderNumber: cart.key!,
    date: date,
    cartModifiedDate: cartModifiedDate,
    entries: entries,
    discount: discount,
    discountCode: discountCode,
    discountId: discountId,
    locale: locale,
    subTotal: subTotal,
    netPrice: netPrice,
    email: cart.customerEmail,
    marketingConsent: optIn,
    shippingAddress: shippingAddress,
    billingAddress: billingAddress,
    shippingMethod: shippingMethod,
    // paymentMethod: paymentMethod,
    freeShipLevel: freeShipLevel,
    paymentIntentId,
    state,
  };
}

type GetCartPayload = { cart: CartModel; status: number };

export async function getCart(cartId: string): Promise<GetCartPayload> {
  const { CTP_API_URL, CTP_PROJECT_KEY } = process.env;

  const token = await getServiceAuthToken();
  const params = getCartExpansionParameters();

  const options: AxiosRequestConfig = {
    method: "GET",
    url: `${CTP_API_URL}/${CTP_PROJECT_KEY}/carts/${cartId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    params: params,
  };

  const { data, status } = await axios.request<Cart>(options);

  const cart = await mapCartModel(data);

  return { cart, status };
}
