"use client";

import { pageViewEvent } from "@/lib/analytics";
import { useCartContext } from "@/lib/context/cartContext";
import { ProductModel } from "@/lib/models/productModel";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type Props = {
  product: ProductModel;
};

// this is dumb
export function PdpPageView({ product }: Props) {
  const { cart } = useCartContext();
  const pathname = usePathname();

  useEffect(() => {
    pageViewEvent(cart.id, pathname, product);
  }, []);

  return null;
}
