"use client";

import addToCartAction from "@/actions/addToCartAction";
import { CartIcon } from "@/components/icons/cartIcon";
import { CheckIcon } from "@/components/icons/checkIcon";
import { WarningIcon } from "@/components/icons/warningIcon";
import { Quantity } from "@/components/quantity";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cartEntryModificationEvent } from "@/lib/analytics";
import { useCartContext } from "@/lib/context/cartContext";
import { ProductModel } from "@/lib/models/productModel";
import { useTranslations } from "next-intl";
import Form from "next/form";
import { useActionState, useEffect, useRef, useState } from "react";

type Props = {
  product: ProductModel;
};

export function MultiAddToCartButton({ product }: Readonly<Props>) {
  const { cart, setCart, broadcastCartUpdate } = useCartContext();
  const t = useTranslations("ProductPage");
  const [state, formAction, pending] = useActionState(addToCartAction, {
    cart: cart,
    message: "",
  });
  const [quantity, setQuantity] = useState(product.inStock ? 1 : 0);
  const [showToast, setShowToast] = useState(false);
  const [entry, setEntryModel] = useState(
    state.cart.entries.find((entry) => entry.product.id === product.id),
  );
  // TODO Migrate to useEffectEvent when next-auth peer dependency is upgraded for next 16
  const quantityRef = useRef(quantity);
  quantityRef.current = quantity;

  useEffect(() => {
    if (state.message === "success") {
      setCart(state.cart);
      broadcastCartUpdate();
      setShowToast(true);

      const newEntry = state.cart.entries.find(
        (item) => item.product.id === product.id,
      );

      setEntryModel(newEntry);
      setTimeout(() => setShowToast(false), 3000);

      if (entry) {
        cartEntryModificationEvent(
          state.cart,
          "addToCart",
          [entry],
          quantityRef.current,
        );
      }
    }
  }, [product.id, setCart, state.cart, state.message]);

  useEffect(() => {
    const newEntry = cart.entries.find(
      (item) => item.product.id === product.id,
    );
    setEntryModel(newEntry);
  }, [cart]);

  const entryQty = entry ? entry.quantity : 0;
  const qtyExceedProductLimit =
    quantity > 0 && quantity + entryQty > product.limit;

  return (
    <Form action={formAction} className="flex w-full flex-col gap-2">
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="cartId" value={cart.id} />
      {/* <input type="hidden" name="csrf" value={csrf} /> */}
      <div>
        {product.limit && product.limit > 0 && !qtyExceedProductLimit && (
          <Alert className="bg-tertiary-warning text-neutral-black w-fit rounded-xs border-0">
            <WarningIcon />
            <AlertDescription className="text-neutral-black text-xs">
              {t("productLimitNote", { productLimit: product.limit })}
            </AlertDescription>
          </Alert>
        )}
        {qtyExceedProductLimit && (
          <Alert className="bg-tertiary-warning text-neutral-black w-fit rounded-xs border-0">
            <WarningIcon />
            <AlertDescription className="text-neutral-black text-xs">
              {t("productLimitAlert", { productLimit: product.limit })}
            </AlertDescription>
          </Alert>
        )}
      </div>
      <div className="flex h-10.5 flex-row gap-2">
        <Quantity
          inStock={product.inStock}
          quantity={quantity}
          setQuantity={setQuantity}
          quantityLimit={product.limit}
        />
        <div className="relative w-50 md:w-75">
          <div className="pointer-events-none absolute bottom-1/2 left-1/2 w-50 -translate-x-1/2">
            <div
              id="borderAddedToCart"
              className={`border-neutral-black-30 font-roboto bg-neutral-black-3 z-50 flex w-full items-center gap-1 rounded border px-3 py-2 text-sm shadow-[0px_2px_12px_0px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out ${showToast ? "-translate-y-8 opacity-100" : "pointer-events-none translate-y-0 opacity-0"} `}
            >
              <CheckIcon role="presentation" className="fill-current" />
              <div
                id="labelAddedToCart"
                className="font-roboto space-y-2 text-xs font-bold tracking-normal"
              >
                {t("addedToCart")}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="font-roboto-condensed hover:bg-secondary-cyan bg-tertiary-dark-cyan flex h-10.5 w-full grow items-center justify-center gap-2 rounded-xs px-6 py-3 text-base font-bold text-white disabled:bg-gray-300 disabled:text-black disabled:hover:text-black md:w-75 md:grow-0"
            data-status={state?.message}
            disabled={pending || !product.inStock || qtyExceedProductLimit}
          >
            <CartIcon className="fill-current" role="presentation" />
            {t("addToCart")}
          </button>
        </div>
      </div>
    </Form>
  );
}
