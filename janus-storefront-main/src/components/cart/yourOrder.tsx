"use client";

import { FreeShipPromo } from "@/components/cart/freeShipPromo";
import {
  OutOfStockItemsModal,
  OutOfStockModalProps,
} from "@/components/cart/outOfStockItemsModal";
import { DiscountCodeAccordion } from "@/components/discountCodeAccordion";
import { FreeShipPromoSkeleton } from "@/components/skeletons/freeShipPromoSkeleton";
import { getShippingMethod } from "@/lib/bff/shippingMethods";
import { useCartContext } from "@/lib/context/cartContext";
import { useCurrencyContext } from "@/lib/context/currencyContext";
import { useModal } from "@/lib/hooks/useModal";
import { emptyPrice } from "@/lib/models/priceModel";
import { STANDARD_SHIPPING } from "@/lib/models/shippingMethodModel";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  urlBase: string;
};

export function YourOrder({ urlBase }: Readonly<Props>) {
  const { cart, loading } = useCartContext();
  const { currency } = useCurrencyContext();
  const [freeShipLevel, setFreeShipLevel] = useState(0);
  const [freeShipping, setFreeShipping] = useState<boolean>(false);
  const t = useTranslations("Cart");

  useEffect(() => {
    if (freeShipLevel === 0) {
      getShippingMethod(STANDARD_SHIPPING, currency.isoCode).then((method) =>
        setFreeShipLevel(method?.freeShipLevel.value ?? 0),
      );
    }

    if (freeShipLevel > 0) {
      const free = freeShipLevel > 0 && cart.subTotal.value >= freeShipLevel;
      setFreeShipping(free);
    }
  }, [cart.subTotal.value, currency.isoCode, freeShipLevel]);

  const discountAmount =
    cart.discountCode && cart.discount ? cart.discount.amount : emptyPrice();

  const { openModal, modal } = useModal<boolean, OutOfStockModalProps>(
    (props) => <OutOfStockItemsModal {...props} />,
  );

  const router = useRouter();

  async function validateNavigation(e: { preventDefault: () => void }) {
    const outOfStockItems = cart.entries
      .filter((entry) => !entry.product.inStock)
      .map((entry) => entry.product);

    // Prevent navigation if out of stock items are present
    if (outOfStockItems.length > 0) {
      e.preventDefault();
      let outOfStockConfirm = false;

      try {
        const props: OutOfStockModalProps = {
          outOfStockItems: outOfStockItems,
        };
        outOfStockConfirm = await openModal(props);
      } catch (error) {
        console.info("Error in modal: ", error);
        outOfStockConfirm = false;
      }

      if (outOfStockConfirm) {
        // Logic to remove out of stock items from the cart
        router.push(`${urlBase}/checkout.html`); // Redirect to checkout or handle accordingly
      }
    }
  }

  return (
    <div
      id="yourOrderBlock"
      className="bg-neutral-black-3 top-6 flex w-full flex-col gap-4 rounded-sm p-4 md:sticky md:w-[298px]"
    >
      <h2
        id="yourOrderHeader"
        className="font-roboto-condensed text-2xl font-bold capitalize"
      >
        {t("yourOrder")}
      </h2>
      {freeShipLevel > 0 && !loading ? (
        <FreeShipPromo freeShipLevel={freeShipLevel} free={freeShipping} />
      ) : (
        <FreeShipPromoSkeleton />
      )}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          {cart.subTotal.value > 0 && (
            <div className="flex flex-col gap-2">
              <div
                id="subTotalBlock"
                className="font-roboto text-neutral-black flex justify-between text-sm"
              >
                <div className="flex flex-col">
                  <div>{t("subtotal")}</div>
                  <div className="text-neutral-black-60 text-xs capitalize">
                    {t("includesVAT")}
                  </div>
                </div>
                <div id={"subTotalAmt"}>{cart.subTotal.formattedValue}</div>
              </div>
              {cart.discountCode && cart.discountCode != "" && (
                <div
                  id="discountBlock"
                  className="font-roboto text-tertiary-dark-cyan flex justify-between text-sm"
                >
                  <div className="flex flex-col">
                    <div>{t("discountCode")}</div>
                    <div
                      className="text-neutral-black-60 text-xs"
                      id="appliedDiscountCodeBlock"
                    >
                      {cart.discountCode}
                    </div>
                  </div>
                  <div id="discountAmt">-{discountAmount.formattedValue}</div>
                </div>
              )}
              <div
                id="shippingRateBlock"
                className="font-roboto text-neutral-black flex justify-between text-sm"
              >
                <div>{t("shipping")}</div>
                <div id="subRateAmt">
                  {freeShipping ? t("free") : t("toBeCalculated")}
                </div>
              </div>
              <div className="border-neutral-black-10 border-t-1">
                <DiscountCodeAccordion />
              </div>
            </div>
          )}
          <div
            id="estCartTotalBorder"
            className="font-roboto text-neutral-black border-neutral-black-10 flex justify-between border-t-1 pt-4 text-lg font-bold"
          >
            <div>{t("total")}</div>
            <div id="netPriceAmt">{cart.netPrice.formattedValue}</div>
          </div>
          {cart.discount && cart.discount.amount.value > 0 && (
            <div
              id="totalSavingBorder"
              className="font-roboto text-tertiary-dark-cyan flex justify-between text-sm"
            >
              <div>{t("totalSavings")}</div>
              <div id="totalSavingAmt">
                {cart.discount.amount.formattedValue}
              </div>
            </div>
          )}
        </div>
        {cart.subTotal.value > 0 ? (
          <div className="flex max-h-10.5 flex-col gap-4">
            <Link
              id="checkoutButton"
              href={`${urlBase}/checkout.html`}
              onNavigate={validateNavigation}
              className="bg-tertiary-dark-cyan hover:bg-secondary-cyan font-roboto-condensed disabled:bg-neutral-black-30 rounded-xs px-6 py-3 text-center text-base font-bold text-white"
            >
              {t("checkout")}
            </Link>
          </div>
        ) : (
          <a
            href={`${urlBase}/homeowner.html`}
            className="font-roboto-condensed hover:bg-neutral-black text-neutral-black border-neutral-black-30 rounded-xs border-[1.5px] bg-transparent px-4 py-3 text-center text-base font-bold hover:text-white"
          >
            {t("continueShopping")}
          </a>
        )}
      </div>
      {modal}
    </div>
  );
}
