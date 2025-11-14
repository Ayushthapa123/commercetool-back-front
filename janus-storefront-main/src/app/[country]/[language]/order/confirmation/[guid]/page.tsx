"use server";

import { ClearCartCookies } from "@/components/clearCartCookies";
import { OrderHeader } from "@/components/order/orderHeader";
import { PaymentMethod } from "@/components/order/paymentMethod";
import { ShippingAddress } from "@/components/order/shippingAddress";
import { YourOrder } from "@/components/order/yourOrder";
import { PaymentStatus } from "@/constants";
import { getCart, unfreezeCart } from "@/lib/bff/cart";
import { getPaymentIntent } from "@/lib/bff/payment";
import baseUrl from "@/lib/i18n/navigation";
import { logger } from "@/lib/logger";
import { CartModel } from "@/lib/models/cartModel";
import { PaymentMethodModel } from "@/lib/models/paymentMethodModel";
import { CartStateValues } from "@commercetools/platform-sdk";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Stripe from "stripe";

type RouteParams = {
  params: Promise<{ guid: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: `${t("OrderDetails.title")} | ${t("Metadata.title")}`,
  };
}

function mapPaymentMethodModel(
  cart: CartModel,
  paymentDetails: Stripe.PaymentIntent,
): PaymentMethodModel {
  const method = isPaymentMethod(paymentDetails.payment_method)
    ? paymentDetails.payment_method
    : null;

  const card = method?.card;
  if (card) {
    return {
      type: card.brand.charAt(0).toUpperCase() + card.brand.slice(1),
      lastFour: Number(card.last4),
      cardType: card.funding.charAt(0).toUpperCase() + card.funding.slice(1),
      description: "",
      date: `${card.exp_month.toString().padStart(2, "0")}/${card.exp_year}`,
      status: paymentDetails.status,
    };
  }

  throw new Error("payment not found");
}

/**
 * Function to narrow available method types returning a type predicate.
 * @param method the payment method
 * @returns a stripe payment method object
 */
function isPaymentMethod(
  method: string | Stripe.PaymentMethod | null,
): method is Stripe.PaymentMethod {
  return (method as Stripe.PaymentMethod).id !== undefined;
}

async function getPaymentMethod(cart: CartModel): Promise<PaymentMethodModel> {
  if (
    (cart.state !== CartStateValues.Ordered &&
      cart.state !== CartStateValues.Frozen) ||
    !cart.paymentIntentId
  ) {
    throw new Error("Invalid cart state or missing payment intent ID.");
  }

  const stripePayment = await getPaymentIntent(cart.paymentIntentId!, true);

  return mapPaymentMethodModel(cart, stripePayment!);
}

export default async function Order({ params }: RouteParams) {
  const { guid } = await params;
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "OrderDetails" });
  const urlBase = await baseUrl();
  const cart = await getCart(guid);
  const paymentMethod = await getPaymentMethod(cart);

  if (paymentMethod.status === PaymentStatus.NOT_INITIATED) {
    logger.warn("payment not initiated");
    await unfreezeCart();
    redirect(`${urlBase}/cart?paymentNotInitiated=true`);
  } else if (
    paymentMethod.status !== PaymentStatus.PAID &&
    paymentMethod.status !== PaymentStatus.SUCCEEDED
  ) {
    logger.warn("payment failed");
    await unfreezeCart();
    redirect(`${urlBase}/checkout?error=paymentFailed`);
  }

  return (
    <>
      <div>
        <ClearCartCookies />
        <div className="flex flex-col gap-6 pt-6 pb-16 md:flex-row md:gap-25 md:pt-0">
          <div className="text-neutral-black flex grow flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold md:text-5xl">
                {t("thankYou")}
              </h1>
              <div className="text-shadow-neutral-black-70 text-base md:text-lg">
                {t("thankYouMessage")}
              </div>
            </div>
            <OrderHeader cart={cart} />

            <ShippingAddress
              shippingAddress={cart.shippingAddress!}
              shippingMethod={cart.shippingMethod!}
            />
            <PaymentMethod
              billingAddress={cart.billingAddress!}
              paymentMethod={paymentMethod!}
            />
          </div>
          <div className="py-4">
            <YourOrder cart={cart} />
          </div>
        </div>
      </div>
    </>
  );
}
