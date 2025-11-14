"use client";

import { CartEntry } from "@/components/checkout/cartEntry";
import { purchaseEvent } from "@/lib/analytics";
import { CartModel } from "@/lib/models/cartModel";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

type Props = {
  cart: CartModel;
};

export function YourOrder({ cart }: Readonly<Props>) {
  const t = useTranslations("OrderDetails");
  useEffect(() => {
    if (cart) {
      purchaseEvent(cart);
    }
  }, [cart]);
  return (
    <div
      id="contactUs"
      className="bg-neutral-black-3 top-6 flex w-full flex-col gap-4 rounded-sm p-4 md:sticky md:w-75"
    >
      <h2 className="font-roboto-condensed text-2xl font-bold uppercase">
        {t("yourOrder")}
      </h2>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div
            id="subTotalBlock"
            className="font-roboto text-neutral-black flex justify-between text-sm"
          >
            <div className="flex flex-col">
              <div>{t("subtotal")}</div>
              <div className="text-neutral-black-60 text-xs">
                {t("includesVAT")}
              </div>
            </div>
            <div id="subTotalAmt">{cart.subTotal.formattedValue}</div>
          </div>
          {cart.discountCode && cart.discount && (
            <div
              id="discountBlock"
              className="font-roboto text-tertiary-dark-cyan flex justify-between text-sm"
            >
              <div className="flex flex-col">
                <div>{t("discountCode")}</div>
                <div className="text-neutral-black-60 text-xs">
                  {cart.discountCode}
                </div>
              </div>
              <div id="discountAmt">-{cart.discount.amount.formattedValue}</div>
            </div>
          )}
          <div
            id="shippingCostBlock"
            className="font-roboto text-neutral-black flex justify-between text-sm"
          >
            <div>{t("shipping")}</div>
            <div id="shippingCost">
              {cart?.shippingMethod &&
              cart.subTotal.value >= cart?.shippingMethod?.freeShipLevel.value
                ? t("free")
                : cart?.shippingMethod?.deliveryCost.formattedValue}
            </div>
          </div>
        </div>
        <div
          id="netPriceBlock"
          className="font-roboto text-neutral-black flex justify-between text-lg font-bold"
        >
          <div>{t("total")}</div>
          <div id="netPriceAmt">{cart.netPrice.formattedValue}</div>
        </div>
        {cart.discount && (
          <div
            id="totalSavingBlock"
            className="font-roboto text-tertiary-dark-cyan flex justify-between text-sm"
          >
            <div>{t("totalSavings")}</div>
            <div id="totalSavingAmt">{cart.discount.amount.formattedValue}</div>
          </div>
        )}
      </div>
      <div className="border-neutral-black-10 border-t-1 pt-4">
        <div className="mb-4 text-sm font-bold">
          {t("inYourCart", { amount: cart.entries.length })}
        </div>
        <div className="flex max-h-55 flex-col gap-4 overflow-auto">
          {cart.entries.map((entry, index) => {
            return <CartEntry entry={entry} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
}
