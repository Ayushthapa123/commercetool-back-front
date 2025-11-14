import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addDiscountCode, removeDiscountCode } from "@/lib/bff/cart";
import { useCartContext } from "@/lib/context/cartContext";
import { DiscountCodeForm, DiscountCodeSchema } from "@/lib/models/cartModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useForm } from "react-hook-form";

export function DiscountCodeAccordion() {
  const t = useTranslations("Discounts");
  const { cart, setCart } = useCartContext();
  const discountCodeForm = useForm<DiscountCodeForm>({
    resolver: zodResolver(DiscountCodeSchema),
    defaultValues: {
      discountCode: "",
    },
  });

  const setDiscountError = (message: string) =>
    discountCodeForm.setError("discountCode", {
      type: "manual",
      message: message,
    });

  function removeDiscount() {
    if (cart.discountCode && cart.discountId) {
      removeDiscountCode(cart.discountId).then((response) => {
        if (response.id !== "") {
          setCart(response);
          discountCodeForm.reset({
            discountCode: "",
          });
        } else {
          setDiscountError(t("removeDiscountCodeError"));
        }
      });
    }
  }

  function onSubmit(values: DiscountCodeForm) {
    const discountCode = values.discountCode.toUpperCase();
    if (cart.discountCode?.toUpperCase() === discountCode) {
      setDiscountError(t("duplicateDiscountCode"));
    } else {
      addDiscountCode(discountCode).then((response) => {
        if (response.id !== "") {
          setCart(response);
        } else {
          setDiscountError(t("invalidDiscountCode"));
        }
      });
    }
  }

  return (
    <Accordion type="multiple">
      <AccordionItem id="discount" value="discount">
        <AccordionTrigger className="font-roboto text-sm font-normal hover:no-underline">
          {t("applyDiscountCode")}
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          <Form {...discountCodeForm}>
            <form
              onSubmit={discountCodeForm.handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <div className="flex h-12 gap-2">
                <FormField
                  control={discountCodeForm.control}
                  name="discountCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={t("enterCode")}
                          className="h-full bg-white px-3"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <button
                  className="border-neutral-black-30 hover:bg-neutral-black hover:border-neutral-black text-neutral-black rounded-xs border-[1.5px] bg-transparent px-6 py-3 font-bold hover:text-white"
                  type="submit"
                  id="applyDiscountCodeButton"
                >
                  {t("apply")}
                </button>
              </div>
              {discountCodeForm.formState.errors.discountCode && (
                <div className="text-tertiary-danger-red text-sm">
                  {discountCodeForm.formState.errors.discountCode.message}
                </div>
              )}
            </form>
          </Form>
          {cart.discountCode && cart.discountCode != "" && (
            <>
              <div
                className="bg-tertiary-dark-cyan font-roboto-condensed flex w-fit gap-2 rounded-xs px-2 py-1 text-sm font-bold text-white"
                data-testid="discount-badge"
              >
                {cart.discountCode}
                <button onClick={removeDiscount}>
                  {" "}
                  <Image
                    src="/close.svg"
                    alt={t("removeDiscountCode")}
                    width={16}
                    height={16}
                  />
                </button>
              </div>
              <div
                className="font-roboto text-neutral-black-70 text-xs"
                data-testid="applied-discount-code"
              >
                {t("appliedDiscountCode")}
              </div>
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
