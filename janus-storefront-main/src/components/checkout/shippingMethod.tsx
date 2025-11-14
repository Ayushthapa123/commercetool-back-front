import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { setShippingMethod } from "@/lib/bff/cart";
import { getShippingMethods } from "@/lib/bff/shippingMethods";
import { CheckoutStep } from "@/lib/checkout/checkoutStep";
import { useCartContext } from "@/lib/context/cartContext";
import {
  emptyShippingMethod,
  ShippingMethodModel,
} from "@/lib/models/shippingMethodModel";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Props = {
  step: CheckoutStep;
  t: (key: string) => string;
};

export function ShippingMethod({ step, t }: Readonly<Props>) {
  const { cart, setCart } = useCartContext();
  const [method, setMethod] = useState<ShippingMethodModel>(
    emptyShippingMethod(),
  );
  const [shippingMethods, setShippingMethods] = useState<ShippingMethodModel[]>(
    [],
  );

  useEffect(() => {
    if (cart.shippingAddress && shippingMethods.length === 0) {
      getShippingMethods().then(setShippingMethods);
    }

    if (
      shippingMethods.length > 0 &&
      method.id === "" &&
      step === CheckoutStep.ShippingMethodPaymentAndBilling
    ) {
      setMethod(shippingMethods[0]); // set to default
      setShippingMethod(shippingMethods[0].id).then(setCart);
    }
  }, [cart.shippingAddress, method, setCart, shippingMethods, step]);

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
        {t("shippingMethods")}
      </h2>
      {step === CheckoutStep.ShippingMethodPaymentAndBilling && (
        <RadioGroup id="shippingMethodRadioGroup" defaultValue="option-0">
          {shippingMethods.map((m, index) => (
            <div
              key={m.name}
              className="data-[state=checked]:bg-neutral-black-3 border-neutral-black-30 data-[state=checked]:border-secondary-cyan flex items-center rounded-xs border-2 p-4"
              onClick={() => setMethod(m)}
              tabIndex={index}
              data-state={m.id === method.id ? "checked" : "unchecked"}
            >
              <RadioGroupItem
                value={`option-${index}`}
                id={`option-${index}`}
                checked={m.id === method.id}
                className="data-[state=checked]:text-secondary-cyan data-[state=checked]:border-secondary-cyan"
              />
              <Label
                htmlFor={`option-${index}`}
                className="font-roboto ml-2 w-full justify-between"
              >
                {m.description}
                {cart.subTotal.value >= m.freeShipLevel.value ? (
                  <div className="flex items-center gap-4">
                    <div className="font-bold">{t("free")}</div>
                    <div className="line-through">
                      {m.deliveryCost.formattedValue}
                    </div>
                  </div>
                ) : (
                  <div className="font-bold">
                    {m.deliveryCost.formattedValue}
                  </div>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
}
