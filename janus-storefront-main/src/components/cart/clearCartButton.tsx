import { cartEntryModificationEvent } from "@/lib/analytics";
import { clearCart } from "@/lib/bff/cart";
import { useCartContext } from "@/lib/context/cartContext";
import { useTranslations } from "next-intl";

export function ClearCartButton() {
  const { cart, setCart, broadcastCartUpdate } = useCartContext();
  const t = useTranslations("Cart");
  const clearCartFunction = () => {
    clearCart(cart).then((cart) => {
      setCart(cart);
      broadcastCartUpdate();
    });
    cartEntryModificationEvent(cart, "removeFromCart", cart.entries);
  };

  return (
    <button
      id={"removeAllBtn"}
      className="font-roboto text-primary-blue hover:text-neutral-black text-sm hover:cursor-pointer hover:underline"
      onClick={clearCartFunction}
    >
      {t("removeAll")}
    </button>
  );
}
