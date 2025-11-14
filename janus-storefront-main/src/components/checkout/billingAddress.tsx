import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCartContext } from "@/lib/context/cartContext";
import { AddressElement } from "@stripe/react-stripe-js";
import { StripeAddressElementOptions } from "@stripe/stripe-js";

type Props = {
  t: (key: string) => string;
  setIsBillingComplete: (value: boolean) => void;
  sameAsShipping: boolean;
  setSameAsShipping: (value: boolean) => void;
};

/**
 * Creates the Stripe billing address element options to render the billing fields
 *
 * @param country
 * @returns Stripe options
 */
function getBillingAddressOptions(
  country?: string,
): StripeAddressElementOptions {
  const billingAddressElementOptions: StripeAddressElementOptions = {
    mode: "billing",
    display: { name: "split" },
  };

  if (country) {
    billingAddressElementOptions.defaultValues = {
      address: {
        country,
      },
    };
  }

  return billingAddressElementOptions;
}

export function BillingAddress({
  t,
  setIsBillingComplete,
  sameAsShipping,
  setSameAsShipping,
}: Readonly<Props>) {
  const { cart } = useCartContext();

  return (
    <>
      <div className="flex items-center gap-2">
        <Checkbox
          id="sameAsShippingAddress"
          name="sameAsShippingAddress"
          checked={sameAsShipping}
          onCheckedChange={() => setSameAsShipping(!sameAsShipping)}
        />
        <Label htmlFor="sameAsShippingAddress">
          {t("sameAsShippingAddress")}
        </Label>
      </div>
      {!sameAsShipping && cart?.shippingAddress?.country && (
        <div>
          <h2 className="font-roboto-condensed grow text-2xl font-bold uppercase">
            {t("billingAddress")}
          </h2>
          <AddressElement
            id="stripeBillingAddressElement"
            onChange={(event) => {
              setIsBillingComplete(event.complete);
            }}
            options={getBillingAddressOptions(cart?.shippingAddress?.country)}
          />
        </div>
      )}
    </>
  );
}
