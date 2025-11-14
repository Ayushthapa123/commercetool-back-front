import { DEFAULT_LOCALE } from "@/lib/constants";
import { OrderModel } from "@/lib/models/orderModel";
import {
  isMarketingConsent,
  mapAddressModel,
  mapEntryModel,
  mapPriceModel,
} from "@/lib/models/utils";
import { mapShippingMethodModel } from "@/lib/shipping-method";
import { calculateDiscount } from "@/lib/utils";
import { Order } from "@commercetools/platform-sdk";

/**
 * Builds the query string containing required expansion parameters in order to
 * perform reference expansion on objects within a {@link Order} object.
 *
 * @returns search params object containing required parameters
 */
export function getOrderExpansionParameters(): URLSearchParams {
  const EXPAND = "expand";
  const params = new URLSearchParams();
  params.append(EXPAND, "discountCodes[*].discountCode");
  params.append(EXPAND, "shippingInfo.shippingMethod");
  params.append(EXPAND, "lineItems[*].variant.prices.discounted.discount");
  return params;
}

export function mapOrderModel(order: Order): OrderModel {
  const locale = order.locale || DEFAULT_LOCALE;
  const currency = order.totalPrice.currencyCode;
  const formatCurrency = mapPriceModel(locale);
  const mapPricing = formatCurrency(currency);

  const subTotalValue = order.lineItems
    .map((item) => item.totalPrice.centAmount)
    .reduce((prev, curr) => prev + curr, 0);
  const subTotal = mapPricing(subTotalValue);
  const netPrice = mapPricing(order.totalPrice.centAmount);
  const discountAmount = calculateDiscount(
    order.discountOnTotalPrice,
    order.lineItems,
  );
  const discount = discountAmount != 0 ? mapPricing(discountAmount) : undefined;
  const code = order?.discountCodes?.[0]?.discountCode?.obj?.code ?? undefined;
  const optIn = isMarketingConsent(order.custom?.fields)
    ? order.custom.fields.marketingConsent
    : false;

  const createdAt = new Date(order.createdAt);
  const date = new Intl.DateTimeFormat(locale).format(createdAt);
  const entries = order.lineItems.map((item) =>
    mapEntryModel(item, locale, formatCurrency),
  );

  const shippingAddress = mapAddressModel(order.shippingAddress);
  const billingAddress = mapAddressModel(order.billingAddress);
  const shippingMethod = order.shippingInfo?.shippingMethod?.obj
    ? mapShippingMethodModel(
        order.shippingInfo.shippingMethod?.obj,
        order.shippingInfo.shippingRate,
        locale,
      )
    : undefined;

  return {
    id: order.id,
    version: order.version,
    date: date,
    orderNumber: order.orderNumber!,
    purchaseOrderNumber: order.purchaseOrderNumber,
    email: order.customerEmail!,
    marketingConsent: optIn,
    shippingAddress: shippingAddress,
    billingAddress: billingAddress,
    shippingMethod: shippingMethod,
    subTotal: subTotal,
    netPrice: netPrice,
    discount: discount,
    discountCode: code,
    entries: entries,
  };
}
