"use client";

import { ClearCartButton } from "@/components/cart/clearCartButton";
import { useCartContext } from "@/lib/context/cartContext";
import { useTranslations } from "next-intl";

export function CartHeader() {
  const t = useTranslations("Cart");
  const { cart } = useCartContext();
  const cartCount = cart.totalItems;

  return (
    <div className="flex flex-col items-baseline gap-2">
      <div className="flex items-center gap-2 pt-4">
        <h1
          id="cartHeader"
          className="font-roboto-condensed flex grow items-center gap-2 text-2xl leading-14 font-bold md:gap-4 md:text-3xl"
        >
          <span className="text-3xl md:text-5xl">{t("cart")}</span>
          <span>{t("cartItems", { cartCount: cartCount })}</span>
        </h1>
      </div>
      {cartCount > 0 && <ClearCartButton />}
    </div>
  );
}
