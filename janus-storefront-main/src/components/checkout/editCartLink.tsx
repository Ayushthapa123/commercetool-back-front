"use client";

import { CartIcon } from "@/components/icons/cartIcon";
import { cartWorkflowEvent } from "@/lib/analytics";
import { useCartContext } from "@/lib/context/cartContext";
import Link from "next/link";

type Props = {
  urlBase: string;
  label: string;
};

export function EditCartLink({ urlBase, label }: Props) {
  const { cart } = useCartContext();
  const cartCount = cart.totalItems;
  const handleClick = () => cartWorkflowEvent("editCart", cart.id);

  return (
    <Link
      href={`${urlBase}/cart.html`}
      className="text-primary-blue flex gap-2 text-sm"
      onClick={handleClick}
    >
      <CartIcon className="fill-current" aria-label="Cart Icon" role="img" />
      {label}
      {cartCount > 0 && ` (${cartCount})`}
    </Link>
  );
}
