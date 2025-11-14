"use client";

import { CartEntry } from "@/components/cart/cartEntry";
import { EmptyCart } from "@/components/cart/emptyCart";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartContext } from "@/lib/context/cartContext";

type Props = {
  urlBase: string;
};

export function Cart({ urlBase }: Readonly<Props>) {
  const { cart, loading } = useCartContext();

  if (cart.entries.length <= 0 && !loading) {
    return <EmptyCart urlBase={urlBase} />;
  }

  return (
    <>
      {loading ? (
        <Skeleton className="h-36 w-full rounded-md" />
      ) : (
        <ul id="cartEntries" className="border-neutral-black-10 border-t-1">
          {cart.entries.map((entry) => (
            <li key={entry.product.id}>
              <CartEntry entry={entry} urlBase={urlBase} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
