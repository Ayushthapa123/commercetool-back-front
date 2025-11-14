"use client";

import addToCartAction from "@/actions/addToCartAction";
import { CartIcon } from "@/components/icons/cartIcon";
import { CheckIcon } from "@/components/icons/checkIcon";
import {
  cartEntryModificationEvent,
  clickRecommendedEvent,
} from "@/lib/analytics";
import { useCartContext } from "@/lib/context/cartContext";
import { ProductModel } from "@/lib/models/productModel";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Form from "next/form";
import { useActionState, useEffect } from "react";

type Props = {
  product: ProductModel;
  className?: string;
  positionInList?: string;
  sectionType?: string;
};

export function SingleAddButton({
  product,
  className,
  positionInList,
  sectionType,
}: Props) {
  const { cart, setCart, broadcastCartUpdate } = useCartContext();
  const t = useTranslations("ProductPage");
  const [state, formAction, pending] = useActionState(addToCartAction, {
    cart: cart,
    message: "",
  });

  useEffect(() => {
    if (state.message === "success") {
      setCart(state.cart);
      broadcastCartUpdate();
      const entry = state.cart.entries.find(
        (entry) => entry.product.id === product.id,
      );
      if (entry) {
        clickRecommendedEvent(
          product,
          positionInList!,
          sectionType!,
          state.cart.id,
        );
        cartEntryModificationEvent(state.cart, "addToCart", [entry]);
      }
    }
  }, [product.id, setCart, state.cart, state.message]);

  return (
    <Form action={formAction} className={cn("w-full md:w-fit", className)}>
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="cartId" value={cart.id} />
      {/* <input type="hidden" name="csrf" value={csrf} /> */}
      <input type="hidden" name="quantity" value="1" />
      <button
        type="submit"
        className={cn(
          "font-roboto-condensed disabled:data-[status=success]:bg-tertiary-dark-cyan flex h-10.5 w-full items-center justify-center gap-2 rounded-xs border-[1.5px] bg-transparent fill-current p-3 text-base font-bold text-black hover:bg-black hover:text-white disabled:bg-gray-300 disabled:hover:text-black disabled:data-[status=success]:text-white",
          sectionType === "recommended accessories" && "lg:w-[90px]",
        )}
        data-status={state?.message}
        disabled={pending || state?.message == "success"}
      >
        {state?.message != "success" ? (
          <CartIcon role="presentation" />
        ) : (
          <CheckIcon role="presentation" className="fill-current" />
        )}
        {pending
          ? t("pending")
          : state?.message == "success"
            ? t("added")
            : t("add")}
      </button>
    </Form>
  );
}
