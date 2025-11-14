import { WarningIcon } from "@/components/icons/warningIcon";
import { Quantity } from "@/components/quantity";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  cartEntryModificationEvent,
  EntryModificationType,
} from "@/lib/analytics";
import { removeLineItem, updateLineItemQuantity } from "@/lib/bff/cart";
import { useCartContext } from "@/lib/context/cartContext";
import { useCurrencyContext } from "@/lib/context/currencyContext";
import { EntryModel } from "@/lib/models/cartModel";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  entry: EntryModel;
  urlBase: string;
};

export function CartEntry({ entry, urlBase }: Readonly<Props>) {
  const { cart, setCart, broadcastCartUpdate } = useCartContext();
  const { currency } = useCurrencyContext();
  const product = entry.product;
  const [quantity, setQuantity] = useState(
    product.inStock ? entry.quantity : 0,
  );
  const [currentCartId, setCurrentCartId] = useState(cart.id);
  const [currentCartVeresion, setCurrentCartVersion] = useState(cart.version);
  const t = useTranslations("Cart");

  function removeEntry() {
    removeLineItem(entry.id, cart).then((cart) => {
      setCart(cart);
      broadcastCartUpdate();
    });
    cartEntryModificationEvent(cart, "removeFromCart", [entry]);
  }

  useEffect(() => {
    const qtyAllowedToPurchase =
      quantity <= product.limit ? quantity : product.limit;
    if (
      qtyAllowedToPurchase !== entry.quantity &&
      currentCartId === cart.id &&
      currentCartVeresion === cart.version
    ) {
      updateLineItemQuantity(entry.id, qtyAllowedToPurchase).then((cart) => {
        setCart(cart);
        broadcastCartUpdate();
      });

      const diffQty = Math.abs(quantity - entry.quantity);
      const modificationType: EntryModificationType =
        quantity > entry.quantity ? "addToCart" : "removeFromCart";

      cartEntryModificationEvent(cart, modificationType, [entry], diffQty);
    } else {
      setQuantity(entry.quantity);
      setCurrentCartId(cart.id);
      setCurrentCartVersion(cart.version);
    }
  }, [
    entry.quantity,
    entry.id,
    quantity,
    setCart,
    currentCartId,
    cart.id,
    entry,
    cart.netPrice.currencyIso,
    cart,
  ]);

  return (
    <div
      className={cn(
        "border-neutral-black-10 flex flex-row gap-10 border-b-1 py-4",
        product.inStock
          ? "border-neutral-black-10 border-b-1"
          : "border-tertiary-danger-red border-b-2",
      )}
    >
      <div className="relative h-19 w-19 shrink-0 items-center justify-center md:h-30 md:w-30">
        <Link href={`${urlBase}${product.linkAddress}.html`}>
          <Image
            src={
              product.images.length > 0
                ? product.images[0].url
                : "/graco-logo-image.png"
            }
            alt={product.images[0].altText || product.name}
            className="h-auto w-full"
            fill
          />
        </Link>
      </div>
      <div className="flex w-full flex-row gap-10">
        <div className="flex grow flex-col gap-2">
          <div className="font-roboto">
            <Link
              href={`${urlBase}${product.linkAddress}.html`}
              className="hover:underline"
            >
              <h3
                id={product.id}
                className="text-neutral-black text-base md:text-lg"
              >
                {product.name}
              </h3>
            </Link>
            <div className="text-neutral-black-60 text-sm">
              {t("partNumber", { partNumber: product.sku ?? "" })}
            </div>
          </div>
          <div className="flex flex-col md:hidden">
            <div
              id={entry.id}
              className="font-roboto-condensed text-2xl font-bold"
            >
              {product.discount?.amount.formattedValue ||
                product.price.formattedValue}
            </div>
            {product.discount && (
              <>
                <div className="font-roboto text-neutral-black-60 text-sm">
                  {t.rich("saved", {
                    savings: () => (
                      <span className="line-through">
                        {product.price.formattedValue}
                      </span>
                    ),
                  })}
                </div>
                <div className="font-roboto text-tertiary-dark-cyan text-sm">
                  {t("discount", { discount: product.discount.percentage })}
                </div>
              </>
            )}
          </div>
          {product.limit > 0 && entry.quantity >= product.limit && (
            <Alert className="bg-tertiary-warning text-neutral-black w-fit rounded-xs border-0">
              <WarningIcon />
              <AlertDescription className="text-neutral-black text-xs">
                {t("quantityLimitAlert", { quantityLimit: product.limit })}
              </AlertDescription>
            </Alert>
          )}
          <Quantity
            inStock={product.inStock}
            quantity={quantity}
            setQuantity={setQuantity}
            quantityLimit={product.limit}
          />

          <div className="inline-flex items-center justify-start gap-1 text-xs">
            {product.inStock ? (
              <>
                <div className="flex h-5 w-fit shrink-0 items-center justify-center">
                  <Image
                    src="/circle-check.svg"
                    alt="In Stock Icon"
                    width={16}
                    height={16}
                  />
                </div>
                <div>{t("inStock", { currencySymbol: currency.symbol })}</div>
              </>
            ) : (
              <>
                <div className="flex h-5 w-fit shrink-0 items-center justify-center">
                  <Image
                    src="/out-stock.svg"
                    alt="Out of Stock Icon"
                    width={16}
                    height={16}
                  />
                </div>
                <div className="text-red-600">{t("outOfStock")}</div>
              </>
            )}
          </div>
          <button
            id={"removeBtn"}
            onClick={removeEntry}
            className="hover:text-primary-blue text-primary-blue md:text-neutral-black w-fit hover:cursor-pointer hover:underline md:hidden"
          >
            {t("remove")}
          </button>
        </div>
        <div className="hidden flex-col items-end gap-2 pr-10 md:flex">
          <div className="flex flex-col items-end">
            <div
              id={"productPrice-" + product.sku}
              className="font-roboto-condensed text-2xl font-bold"
            >
              {product.discount?.amount.formattedValue ||
                product.price.formattedValue}
            </div>
            {product.discount && (
              <>
                <div className="font-roboto text-neutral-black-60 text-sm">
                  {t.rich("saved", {
                    savings: () => (
                      <span className="line-through">
                        {product.price.formattedValue}
                      </span>
                    ),
                  })}
                </div>
                <div className="font-roboto text-tertiary-dark-cyan text-sm">
                  {t("discount", { discount: product.discount.percentage })}
                </div>
              </>
            )}
          </div>
          <button
            onClick={removeEntry}
            className="hover:text-primary-blue hover:cursor-pointer hover:underline"
          >
            {t("remove")}
          </button>
        </div>
      </div>
    </div>
  );
}
