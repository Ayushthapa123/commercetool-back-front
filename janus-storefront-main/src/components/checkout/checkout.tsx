"use client";

import { CartSuspense } from "@/components/cartSuspense";
import { PaymentDetails } from "@/components/checkout/paymentDetails";
import { ShippingAddress } from "@/components/checkout/shippingAddress";
import { ShippingMethod } from "@/components/checkout/shippingMethod";
import { YourOrder } from "@/components/checkout/yourOrder";
import { ShippingAddressSkeleton } from "@/components/skeletons/shippingAddressSkeleton";
import { StripeAppearance } from "@/constants";
import { cartWorkflowEvent } from "@/lib/analytics";
import { CheckoutStep } from "@/lib/checkout/checkoutStep";
import { useCartContext } from "@/lib/context/cartContext";
import { useCurrencyContext } from "@/lib/context/currencyContext";
import { Elements } from "@stripe/react-stripe-js";
import {
  loadStripe,
  StripeElementLocale,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  urlBase: string;
};

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
const stripePromise = loadStripe(publishableKey);

export function Checkout({ urlBase }: Props) {
  const { cart } = useCartContext();
  const [errorMessage] = useState<string | null>(null);
  const t = useTranslations("Checkout");
  const searchParams = useSearchParams();
  const stripeLocale = cart.locale as StripeElementLocale;
  const { currency } = useCurrencyContext();

  const [step, setStep] = useState<CheckoutStep>(CheckoutStep.ShippingAddress);
  const [isPaymentDisabled, handleIsPaymentDisabled] = useState(true);
  const [paymentError, setPaymentError] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [stripeOptions, setStripeOptions] = useState<StripeElementsOptions>({
    mode: "setup",
    appearance: StripeAppearance,
    locale: stripeLocale ?? "en-GB",
    currency: currency.isoCode.toLowerCase(),
  });

  useEffect(() => {
    setError(searchParams.get("error"));
  }, [searchParams]);

  useEffect(() => {
    cartWorkflowEvent("checkout", cart.id);
  }, [cart.id]);

  return (
    <div className="flex flex-col gap-6 pb-16 md:flex-row lg:gap-20 lg:pt-6">
      <div className="flex grow flex-col gap-6">
        {error && (
          <div className="mt-4 rounded-lg border border-red-300 bg-red-100 p-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}
        <CartSuspense fallback={<ShippingAddressSkeleton />}>
          <Elements
            stripe={stripePromise}
            options={stripeOptions}
            key={stripeOptions.clientSecret}
          >
            <ShippingAddress
              step={step}
              setStep={setStep}
              t={t}
              setStripeOptions={setStripeOptions}
              stripeLocale={stripeLocale}
            />
            <ShippingMethod step={step} t={t} />
            <PaymentDetails
              step={step}
              t={t}
              handleIsPaymentDisabled={handleIsPaymentDisabled}
              setPaymentError={setPaymentError}
              urlBase={urlBase}
              errorMessage={errorMessage}
            />
          </Elements>
        </CartSuspense>
      </div>
      <div>
        <YourOrder
          isPaymentDisabled={isPaymentDisabled}
          paymentError={paymentError}
        />
      </div>
    </div>
  );
}
