import { AddressText } from "@/components/addressText";
import { ArrowRight } from "@/components/icons/arrowRight";
import { ShippingAddressSkeleton } from "@/components/skeletons/shippingAddressSkeleton";
import { Country, StripeAppearance } from "@/constants";
import {
  setShippingAddressAndPaymentToCart,
  SetShippingAddressAndPaymentToCartProps,
} from "@/lib/bff/cart";
import {
  createCTPayment,
  createPaymentIntent,
  getPaymentIntent,
} from "@/lib/bff/payment";
import { StripeAddress } from "@/lib/checkout/checkoutSchemas";
import { CheckoutStep } from "@/lib/checkout/checkoutStep";
import { useCartContext } from "@/lib/context/cartContext";
import { currencyToCountries } from "@/lib/i18n/currency";
import { CartModel } from "@/lib/models/cartModel";
import {
  AddressElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  StripeAddressElementOptions,
  StripeElementLocale,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import Stripe from "stripe";

type Props = {
  step: CheckoutStep;
  setStep: (status: CheckoutStep) => void;
  t: (key: string) => string;
  setStripeOptions: (value: StripeElementsOptions) => void;
  stripeLocale: StripeElementLocale;
};

export type StripeShippingAddressDetails = {
  name: string;
  firstName?: string;
  lastName?: string;
  address: StripeAddress;
  phone?: string;
};

/**
 * Validates whether postalCode is excluded from delivering address.
 * @param postalCode - postal code of address
 * @param countryCode - country code of address
 * @return pass/fail check if postalCode is excluded from delivering address
 */
function excludedPostalCode(postalCode: string, country: string): boolean {
  const excludedPostalCodePrefixes: Record<string, string[]> = {
    ES: ["35", "38", "51", "52"], // Spain postal code are not allowed starts with 35, 38, 51 or 52.
    FR: [
      "971",
      "972",
      "973",
      "974",
      "975",
      "976",
      "984",
      "985",
      "986",
      "987",
      "988",
    ], // France postal code are not allowed starts with 971, 972, 973, 974, 975, 976 or 98.
    IT: ["00120", "22061", "23041", "4789"], // Italy postal code are not allowed for 00120, 22061, 23041 or starts with 4789
    GB: ["BT"], // United Great Britain postal code (specifically, Northern Ireland) are not allowed starts with BT
    DE: ["27498", "78266"], // Germany postal code are not allowed for 27498 and 78266
  };

  const postalCodePrefixes = excludedPostalCodePrefixes[country.toUpperCase()];
  if (postalCodePrefixes) {
    return postalCodePrefixes.some((prefix) => postalCode.startsWith(prefix));
  }

  return false;
}

export function ShippingAddress({
  step,
  setStep,
  t,
  setStripeOptions,
  stripeLocale,
}: Readonly<Props>) {
  const { cart, setCart } = useCartContext();
  const [isAddressTextReady, setIsAddressTextReady] = useState(false);
  // TODO Migrate to a key value for translations
  const [shipAddressError, setShipAddressError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const allowedCountriesForCurrency = getCountriesByCurrency();
  function getCountriesByCurrency(): Country[] {
    const currencyCode = cart.netPrice.currencyIso;
    return currencyToCountries[currencyCode];
  }

  const defaultShipToCountry = getDefaultCountryForLocale();
  function getDefaultCountryForLocale(): Country {
    const countries = getCountriesByCurrency();
    const localeCountry = cart.locale.split("-")[1];
    const defaultCountry =
      countries.find(
        (country) => country.toLowerCase() === localeCountry.toLowerCase(),
      ) || countries[0];
    return defaultCountry;
  }

  const stripe = useStripe();
  const elements = useElements();

  const shippingAddressElementOptions: StripeAddressElementOptions = {
    mode: "shipping",
    allowedCountries: allowedCountriesForCurrency,
    display: { name: "split" },
    autocomplete: { mode: "automatic" },
    fields: {
      phone: "always",
    },
    validation: {
      phone: {
        required: "always",
      },
    },
    defaultValues: {
      firstName: cart.shippingAddress?.firstName,
      lastName: cart.shippingAddress?.lastName,
      phone: cart.shippingAddress?.phone,
      address: {
        line1: cart.shippingAddress?.addressLine1,
        line2: cart.shippingAddress?.addressLine2 || undefined,
        city: cart.shippingAddress?.city,
        state: cart.shippingAddress?.state || undefined,
        postal_code: cart.shippingAddress?.postalCode,
        country: cart.shippingAddress?.country || defaultShipToCountry,
      },
    },
  };

  const isNameValid = (name: string) => {
    const allowedRegex = /^[a-zA-Z-' ]+$/; // Only letters, hyphens, apostrophes, and spaces
    return name.length <= 150 && allowedRegex.test(name);
  };

  type GetOrCreatePaymentIntentReturn = {
    stripePaymentIntent: Stripe.PaymentIntent;
    isNew: boolean;
  };

  async function getOrCreatePaymentIntent(
    cart: CartModel,
  ): Promise<GetOrCreatePaymentIntentReturn> {
    if (cart.paymentIntentId) {
      // get
      const existingStripePaymentIntent = await getPaymentIntent(
        cart.paymentIntentId,
      );
      return {
        stripePaymentIntent: existingStripePaymentIntent!,
        isNew: false,
      };
    } else {
      // create
      const newStripePaymentIntent = await createPaymentIntent(cart.id);
      return {
        stripePaymentIntent: newStripePaymentIntent!,
        isNew: true,
      };
    }
  }

  function sendShipAddressError(message: string) {
    setShipAddressError(message);
    setIsLoading(false);
    return;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setShipAddressError("");

    if (!stripe || !elements) {
      return sendShipAddressError("Issues on checkout page");
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;

    if (!email) {
      return sendShipAddressError("Email is required");
    }

    const shippingAddressElement = elements.getElement("address", {
      mode: "shipping",
    });
    if (!shippingAddressElement) {
      return sendShipAddressError("Address element not found");
    }

    const { value: shippingAddressDetails, complete } =
      await shippingAddressElement.getValue();

    if (!complete) {
      return sendShipAddressError("Address is incomplete");
    }

    // TODO is this even on the server-side
    const excluded = excludedPostalCode(
      shippingAddressDetails.address.postal_code,
      shippingAddressDetails.address.country,
    );
    if (excluded) {
      return sendShipAddressError("Excluded postal code");
    }

    const { firstName, lastName } = shippingAddressDetails;
    if (
      firstName &&
      lastName &&
      (!isNameValid(firstName) || !isNameValid(lastName))
    ) {
      return sendShipAddressError(
        "Use up to 150 characters. Letters, hyphens (-), and apostrophes (') only.",
      );
    }

    // create stripe payment intent
    const { stripePaymentIntent, isNew: isNewPaymentIntent } =
      await getOrCreatePaymentIntent(cart);

    const ctUpdatePayload: SetShippingAddressAndPaymentToCartProps = {
      address: {
        ...shippingAddressDetails,
        email,
      },
    };

    if (isNewPaymentIntent) {
      // create CT payment
      const ctPaymentId = await createCTPayment(
        cart.id,
        stripePaymentIntent.id,
      );
      // set payment onto cart at the same time as shipping address
      ctUpdatePayload.paymentId = ctPaymentId;
    }

    const updatedCart =
      await setShippingAddressAndPaymentToCart(ctUpdatePayload);

    setStep(CheckoutStep.ShippingMethodPaymentAndBilling);
    // set stripeOptions useEffect back onto checkout
    setStripeOptions({
      clientSecret: stripePaymentIntent.client_secret!,
      appearance: StripeAppearance,
      locale: stripeLocale ?? "en-GB",
    });
    setCart(updatedCart);
    setIsLoading(false);
  }

  useEffect(() => {
    if (cart?.shippingAddress) {
      setIsAddressTextReady(true);
    }
  }, [cart?.shippingAddress]);

  return (
    <div className="border-neutral-black-10 flex flex-col gap-4 rounded-sm border-1 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex">
          <h2
            id="labelshippingAddress"
            className="font-roboto-condensed grow text-2xl font-bold uppercase"
          >
            {t("shippingAddress")}
          </h2>
          {step === CheckoutStep.ShippingMethodPaymentAndBilling && (
            <button
              className="font-roboto text-sm underline"
              onClick={() => setStep(CheckoutStep.ShippingAddress)}
            >
              {t("edit")}
            </button>
          )}
        </div>
        {step === CheckoutStep.ShippingAddress && (
          <form
            id="shippingAddressDetails"
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <div
              data-slot="form-item"
              className="flex w-full flex-col items-start gap-1.5"
            >
              <label
                data-slot="form-label"
                className="font-roboto data-[error=true]:text-tertiary-danger-red flex items-center gap-2 text-sm leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:data-[error=true]:text-red-900"
                data-error="false"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                data-slot="form-control"
                className="aria-invalid:border-tertiary-danger-red flex h-10 w-full min-w-0 rounded-xs border border-neutral-200 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-neutral-900 selection:text-neutral-50 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-red-500/20 md:text-sm dark:border-neutral-800 dark:bg-neutral-200/30 dark:dark:bg-neutral-800/30 dark:selection:bg-neutral-50 dark:selection:text-neutral-900 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:aria-invalid:border-red-900 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40"
                aria-required="true"
                id="email"
                aria-describedby="email-description"
                aria-invalid="false"
                type="email"
                name="email"
                defaultValue={cart.shippingAddress?.email}
              />
              <p
                data-slot="form-description"
                id="email-description"
                className="font-roboto text-xs text-neutral-500 dark:text-neutral-400"
              >
                Your email address is used for order confirmation and updates.
              </p>
            </div>
            <AddressElement
              id="stripeShippingAddressElement"
              options={shippingAddressElementOptions}
            />
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full lg:w-auto">
                {shipAddressError && (
                  <div className="font-roboto-condensed text-sm font-normal text-red-700">
                    {shipAddressError}
                  </div>
                )}
              </div>

              <button
                className="border-neutral-black-30 hover:bg-neutral-black disabled:bg-neutral-black-30 disabled:text-neutral-black-60 flex h-10.5 w-full items-center justify-center gap-2 rounded-xs border-[1.5px] p-3 text-base font-bold hover:text-white lg:w-26.5"
                type="submit"
                disabled={isLoading}
              >
                <span className="font-roboto-condensed text-center">
                  {t("continue")}
                </span>
                <ArrowRight
                  className="fill-current"
                  aria-label="Continue"
                  role="presentation"
                />
              </button>
            </div>
          </form>
        )}
        {step === CheckoutStep.ShippingMethodPaymentAndBilling && (
          <div className="text-sm">
            {!isAddressTextReady ? (
              <ShippingAddressSkeleton />
            ) : (
              <AddressText
                address={cart.shippingAddress!}
                boldName={true}
                renderEmailPhone={true}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
