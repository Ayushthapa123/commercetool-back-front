"use client";

import { EntryModel } from "@/lib/models/cartModel";
import { useTranslations } from "next-intl";
import Image from "next/image";

type Props = {
  entry: EntryModel;
};

export function CartEntry({ entry }: Readonly<Props>) {
  const t = useTranslations("Checkout");
  const product = entry.product;
  return (
    <div className="flex gap-2">
      <div className="relative h-12 w-12 shrink-0">
        <Image
          src={product.images[0].url}
          alt={product.images[0].altText || product.id}
          className="h-auto w-full"
          fill
        />
      </div>
      <div className="font-roboto flex flex-col text-xs">
        <div>{product.name}</div>
        <div className="text-neutral-black-60">
          {t("qty", { amount: entry.quantity })}
        </div>
        <div className="flex gap-2">
          <div className="font-bold">
            {product.discount?.amount.formattedValue ||
              product.price.formattedValue}
          </div>
          {product.discount && (
            <>
              <div className="text-neutral-black-60 line-through">
                {product.price.formattedValue}
              </div>
              <div className="text-tertiary-dark-cyan">
                {t("save", { percent: product.discount.percentage })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
