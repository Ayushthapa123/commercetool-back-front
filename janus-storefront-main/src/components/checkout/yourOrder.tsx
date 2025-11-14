import { CartEntry } from "@/components/checkout/cartEntry";
import { DiscountCodeAccordion } from "@/components/discountCodeAccordion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { cartExpandEvent } from "@/lib/analytics";
import { setMarketingConsent } from "@/lib/bff/cart";
import { getShippingMethod } from "@/lib/bff/shippingMethods";
import { useCartContext } from "@/lib/context/cartContext";
import { useCurrencyContext } from "@/lib/context/currencyContext";
import { emptyPrice } from "@/lib/models/priceModel";
import { STANDARD_SHIPPING } from "@/lib/models/shippingMethodModel";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

type Props = {
  paymentError: string;
  isPaymentDisabled: boolean;
};

export function YourOrder({ paymentError, isPaymentDisabled }: Props) {
  const t = useTranslations("Checkout");
  const { cart, loading } = useCartContext();
  const [isClicked, setIsClicked] = useState(false);
  const { currency } = useCurrencyContext();
  const [freeShipping, setFreeShipping] = useState<boolean>(false);

  const checkedHandler = (checked: CheckedState) => {
    if (checked !== "indeterminate") {
      setMarketingConsent(checked);
    }
  };

  useEffect(() => {
    if (paymentError) {
      setIsClicked(false);
    }
  }, [paymentError]);

  const discountAmount =
    cart.discountCode && cart.discount ? cart.discount.amount : emptyPrice();
  const shippingMethod = useMemo(
    () => cart.shippingMethod,
    [cart.shippingMethod],
  );

  useEffect(() => {
    getShippingMethod(STANDARD_SHIPPING, currency.isoCode).then((method) =>
      setFreeShipping(
        cart.subTotal.value >= (method?.freeShipLevel.value ?? 0),
      ),
    );
  }, []);

  return (
    <div
      id="checkoutYourOrderBlock"
      className="bg-neutral-black-3 top-6 flex w-full flex-col gap-4 rounded-sm p-4 md:sticky md:w-80"
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
              <div
                id="checkoutVATLabel"
                className="text-neutral-black-60 text-xs"
              >
                {t("includesVAT")}
              </div>
            </div>
            <div id="subTotalAmt">{cart.subTotal.formattedValue}</div>
          </div>
          {cart.discountCode && cart.discount && (
            <div
              id="discountCodeBlock"
              className="font-roboto text-tertiary-dark-cyan flex justify-between text-sm"
            >
              <div className="flex flex-col">
                <div>{t("discountCode")}</div>
                <div className="text-neutral-black-60 text-xs">
                  {cart.discountCode}
                </div>
              </div>
              <div id="discountAmt">-{discountAmount.formattedValue}</div>
            </div>
          )}
          <div className="font-roboto text-neutral-black flex justify-between text-sm">
            <div id="checkoutShippingLabel">{t("shipping")}</div>
            <div id="shippingRateAmt">
              {freeShipping
                ? t("free")
                : shippingMethod
                  ? shippingMethod.deliveryCost.formattedValue
                  : t("toBeCalculated")}
            </div>
          </div>
        </div>
        <div className="border-neutral-black-10 border-y-1">
          <DiscountCodeAccordion />
        </div>
        <div
          id="netPriceBlock"
          className="font-roboto text-neutral-black flex justify-between text-lg font-bold"
        >
          <div id={"checkoutTotalLabel"}>{t("total")}</div>
          <div id="netPriceAmt">{cart.netPrice.formattedValue}</div>
        </div>
        {cart.discount && (
          <div
            id="totalSaving"
            className="font-roboto text-tertiary-dark-cyan flex justify-between text-sm"
          >
            <div>{t("totalSavings")}</div>
            <div id="totalAmtSaving">{cart.discount.amount.formattedValue}</div>
          </div>
        )}
      </div>
      <form className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {!loading && (
            <Checkbox
              id="marketingTerms"
              onCheckedChange={checkedHandler}
              defaultChecked={cart.marketingConsent}
            />
          )}
          <label htmlFor="marketingTerms" className="font-roboto text-xs">
            {t.rich("marketTerms", {
              privacyLink: (chunks) => (
                <a
                  href="https://www.graco.com/us/en/privacy-policy.html"
                  className="text-primary-blue"
                >
                  {chunks}
                </a>
              ),
            })}
          </label>
        </div>
        <button
          id="placeOrderButton"
          type="submit"
          form="paymentDetails"
          className="bg-tertiary-dark-cyan hover:bg-secondary-cyan font-roboto-condensed disabled:bg-neutral-black-30 disabled:text-neutral-black-60 rounded-xs p-[9px] text-base font-bold text-white"
          disabled={isClicked || isPaymentDisabled}
        >
          {t("placeOrder")}
        </button>
        {paymentError && (
          <div className="font-roboto-condensed flex justify-start text-sm font-normal text-red-700">
            {paymentError}
          </div>
        )}
      </form>
      <p id="checkoutDisclaimer" className="font-roboto text-xs">
        {t.rich("disclaimer", {
          termsLink: (chunks) => (
            <a href="#" className="text-primary-blue">
              {chunks}
            </a>
          ),
          privacyLink: (chunks) => (
            <a
              href="https://www.graco.com/us/en/privacy-policy.html"
              className="text-primary-blue"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
      <div className="border-neutral-black-10 border-t-1 pt-4">
        <Accordion
          type="multiple"
          onValueChange={(expandedValues) => {
            if (expandedValues.includes("discount")) {
              cartExpandEvent(cart);
            }
          }}
        >
          <AccordionItem id="discount" value="discount">
            <AccordionTrigger className="font-roboto text-sm font-bold hover:no-underline">
              {t("inYourCart", { amount: cart.totalItems })}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex max-h-55 flex-col gap-4 overflow-auto">
                {cart.entries.map((entry, index) => {
                  return <CartEntry entry={entry} key={index} />;
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
