"use client";

import { useCartContext } from "@/lib/context/cartContext";

type Props = {
  fallback: React.JSX.Element;
  children: React.ReactNode;
};

/**
 * Suspense config for when the cart object has not finished loading - i.e. the
 * commercetools request has not completed to populate the cart.
 * @param param0 component props
 * @returns JSX
 */
export function CartSuspense({ fallback, children }: Props) {
  const { loading } = useCartContext();
  return <>{loading ? fallback : children}</>;
}
