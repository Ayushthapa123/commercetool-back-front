"use client";

import { useCartContext } from "@/lib/context/cartContext";

export default function CartCountIcon() {
  const { cart } = useCartContext();
  const cartCount = cart.totalItems;

  return (
    <>
      {cartCount > 0 && (
        <span
          id="cartCountIconLabel"
          className="bg-tertiary-dark-cyan group-hover:bg-secondary-cyan absolute -top-2 left-4 flex h-4 w-4 items-center justify-center rounded-full pr-1 pl-1 text-[10px] font-normal text-white opacity-100 sm:-top-1.5 sm:left-3"
        >
          {cartCount}
        </span>
      )}
    </>
  );
}
