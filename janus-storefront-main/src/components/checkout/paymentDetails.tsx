import { BillingAddress } from "@/components/checkout/billingAddress";
import { placeOrderClickEvent } from "@/lib/analytics";
import {
  setOrderNumberBillingAddressAndFreezeCart,
  SetOrderNumberBillingAddressAndFreezeCartProps,
  unfreezeCart,
} from "@/lib/bff/cart";
import { getNextOrderNumber } from "@/lib/bff/order";
import { updatePaymentIntent } from "@/lib/bff/payment";
import {
  StripeAddress,
  StripeAddressDetails,
} from "@/lib/checkout/checkoutSchemas";
import { CheckoutStep } from "@/lib/checkout/checkoutStep";
import { useCartContext } from "@/lib/context/cartContext";
import { AddressModel } from "@/lib/models/addressModel";
import { cn } from "@/lib/utils";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  PaymentMethodCreateParams,
  StripeElements,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";
import { useEffect, useState } from "react";

type Props = {
  step: CheckoutStep;
  t: (key: string) => string;
  handleIsPaymentDisabled: (value: boolean) => void;
  setPaymentError: (value: string) => void;
  urlBase: string;
  errorMessage: string | null;
};

/**
 * Returns the full billing address information given fields filled out on the page (including email and assessing Same as Shipping checkbox)
 *
 * @param elements
 * @param isBillingSameAsShipping
 * @param addressEmail
 * @returns billing address
 */
async function mapStripeBillingAddressDetails(
  elements: StripeElements,
  isBillingSameAsShipping: boolean,
  shippingAddress: AddressModel,
): Promise<StripeAddressDetails> {
  if (!isBillingSameAsShipping) {
    const billingAddressElement = elements.getElement("address", {
      mode: "billing",
    });
    const { value } = await billingAddressElement!.getValue();
    return { ...value, email: shippingAddress.email };
  } else {
    const address: StripeAddress = {
      line1: shippingAddress.addressLine1,
      line2: shippingAddress.addressLine2,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postal_code: shippingAddress.postalCode,
      country: shippingAddress.country,
    };
    return {
      name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      firstName: shippingAddress.firstName,
      lastName: shippingAddress.lastName,
      address: address,
      phone: shippingAddress.phone,
      email: shippingAddress.email,
    };
  }
}

const paymentElementOptions: StripePaymentElementOptions = {
  layout: "tabs",
  fields: {
    billingDetails: {
      // We never want the PaymentElement to try to render these fields as we're relying on our AddressElements for this.
      address: { country: "never", postalCode: "never" },
    },
  },
};

export function PaymentDetails({
  step,
  t,
  handleIsPaymentDisabled,
  setPaymentError,
  errorMessage,
  urlBase,
}: Readonly<Props>) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, setCart } = useCartContext();
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isBillingComplete, setIsBillingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Disable payment button based on form state
  useEffect(() => {
    const isDisabled =
      isLoading ||
      !isPaymentComplete ||
      (!sameAsShipping && !isBillingComplete) ||
      step === CheckoutStep.ShippingAddress;
    handleIsPaymentDisabled(isDisabled);
  }, [
    isPaymentComplete,
    isBillingComplete,
    sameAsShipping,
    isLoading,
    handleIsPaymentDisabled,
    step,
  ]);

  if (step === CheckoutStep.ShippingMethodPaymentAndBilling && errorMessage) {
    return (
      <div className="font-roboto-condensed flex text-sm font-normal text-red-700">
        <strong>Payment Error:</strong> {errorMessage}
      </div>
    );
  }

  const isNameValid = (name: string) => {
    const allowedRegex = /^[a-zA-Z-' ]+$/; // Only letters, hyphens, apostrophes, and spaces
    return name.length <= 150 && allowedRegex.test(name);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setPaymentError("");
    placeOrderClickEvent(cart);
    if (!stripe || !elements) {
      setPaymentError("Issues on checkout page");
      setIsLoading(false);
      return;
    }

    const shippingAddress = cart.shippingAddress!;
    const billingAddressDetails = await mapStripeBillingAddressDetails(
      elements,
      sameAsShipping,
      shippingAddress,
    );

    const billingDetails: PaymentMethodCreateParams.BillingDetails = {
      address: billingAddressDetails.address,
      name: billingAddressDetails.name,
      email: shippingAddress.email,
    };

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setPaymentError(submitError.message || "Payment failed");
      setIsLoading(false);
      return;
    }
    if (
      billingAddressDetails?.firstName &&
      billingAddressDetails?.lastName &&
      (!isNameValid(billingAddressDetails.firstName) ||
        !isNameValid(billingAddressDetails.lastName))
    ) {
      setPaymentError(
        "Use up to 150 characters. Letters, hyphens (-), and apostrophes (') only.",
      );
      setIsLoading(false);
      return;
    }

    const orderNumber = await getNextOrderNumber();
    if (!orderNumber) {
      setPaymentError("Could not generate order number");
      setIsLoading(false);
      return;
    }

    const updatePaymentIntentSuccess = await updatePaymentIntent(
      cart.id,
      orderNumber,
    );
    if (!updatePaymentIntentSuccess) {
      setPaymentError("Unable to update Payment Intent");
      setIsLoading(false);
      return;
    }

    const props: SetOrderNumberBillingAddressAndFreezeCartProps = {
      addressDetails: billingAddressDetails,
      email: shippingAddress.email,
      orderNumber,
    };
    setCart(await setOrderNumberBillingAddressAndFreezeCart(props));

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: billingDetails,
        },
        return_url: `${origin}${urlBase}/payment-redirect?cartId=${cart?.id}`,
      },
    });
    if (error) {
      console.info(`stripe responded with an error object: ${error}`);
      // UNFREEZE ACTION
      setCart(await unfreezeCart());
      setPaymentError(error.message || "Payment Processing failed");
    }

    setIsLoading(false);
  }

  return (
    <div className="border-neutral-black-10 flex flex-col gap-4 rounded-sm border-1 p-6">
      <h2
        className={cn(
          "font-roboto-condensed text-2xl font-bold uppercase",
          step === CheckoutStep.ShippingAddress
            ? "text-neutral-black-60"
            : "text-neutral-black",
        )}
      >
        {t("paymentMethod")}
      </h2>
      {/* We want to hide this form but load it so that shipping address autocomplete works */}
      <form
        id="paymentDetails"
        className={`flex flex-col space-y-2 ${
          step === CheckoutStep.ShippingMethodPaymentAndBilling ? "" : "hidden"
        }`}
        onSubmit={handleSubmit}
      >
        <PaymentElement
          id="stripePaymentElement"
          onChange={(event) => {
            setIsPaymentComplete(event.complete);
          }}
          options={paymentElementOptions}
        />
        {step === CheckoutStep.ShippingMethodPaymentAndBilling && (
          <BillingAddress
            t={t}
            setIsBillingComplete={setIsBillingComplete}
            sameAsShipping={sameAsShipping}
            setSameAsShipping={setSameAsShipping}
          />
        )}
      </form>
    </div>
  );
}
