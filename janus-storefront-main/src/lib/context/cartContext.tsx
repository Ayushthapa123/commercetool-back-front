"use client";

import { getCart } from "@/lib/bff/cart";
import { CartModel, emptyCart } from "@/lib/models/cartModel";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type CartContextType = {
  cart: CartModel;
  setCart: (cart: CartModel) => void;
  loading: boolean;
  broadcastCartUpdate: () => void;
};

const CartContext = createContext<CartContextType>({
  cart: emptyCart(),
  setCart: () => {},
  loading: true,
  broadcastCartUpdate: () => {},
});

type Props = {
  children: React.ReactNode;
  cartId: string | undefined;
  locale: string;
};

export function CartProvider({ children, cartId, locale }: Readonly<Props>) {
  const [cart, setCart] = useState<CartModel>(emptyCart());
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const senderId = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    channelRef.current = new BroadcastChannel(`cart-sync`);
    channelRef.current.onmessage = async (event) => {
      const {
        sender,
        type,
        cartId: eventCartId,
        locale: eventLocale,
      } = event.data;

      if (sender === senderId.current) return; // Ignore own messages
      if (eventLocale != locale) return; //Ignore ecents from other locales
      const updateCartId = cartId ?? eventCartId;

      if (type === "cartUpdate") {
        const updatedCart = await getCart(updateCartId);
        setCart(updatedCart);
      }
    };

    return () => channelRef.current?.close();
  }, [cartId]);

  const updateCart = (updatedCart: CartModel) => {
    setCart(updatedCart);
    broadcastCartUpdate();
  };

  useEffect(() => {
    if (!cartId) {
      setCart(emptyCart());
      setLoading(false);
      return;
    }

    getCart(cartId)
      .then((updatedCart) => {
        updateCart(updatedCart);
      })
      .finally(() => setLoading(false));
  }, [cartId]);

  const broadcastCartUpdate = () => {
    if (cartId && locale) {
      channelRef.current?.postMessage({
        sender: senderId.current,
        type: "cartUpdate",
        cartId,
        locale,
      });
    }
  };

  const contextValue = useMemo(
    () => ({ cart, setCart, loading, broadcastCartUpdate }),
    [cart, loading],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCartContext() {
  return useContext(CartContext);
}
