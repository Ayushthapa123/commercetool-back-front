"use client";

import AdobeAnalyticsWrapper from "@/components/AdobeAnalyticsLink";
import BazaarVoiceWidgets from "@/components/bazaarVoiceWidgets";
import { CartSuspense } from "@/components/cartSuspense";
import { SingleAddButton } from "@/components/singleAddButton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ProductClickEvent,
  ProductClickType,
  viewRecommendedEvent,
} from "@/lib/analytics";
import { useCartContext } from "@/lib/context/cartContext";
import { ProductModel } from "@/lib/models/productModel";
import { BazaarVoiceWidgetType } from "@/lib/pdp/pdpTypes";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { use, useEffect } from "react";

type Props = {
  urlBase: string;
  promise: Promise<ProductModel[]>;
};

export function RecommendedAccessories({ urlBase, promise }: Readonly<Props>) {
  const { cart } = useCartContext();
  const accessories = use(promise);

  useEffect(() => {
    viewRecommendedEvent("Recommended Accessories", cart.id, accessories);
  }, []);

  return (
    <div className="flex w-full flex-col gap-3">
      {accessories.map((accessory, index) => (
        <AccessoryCard
          key={index}
          rank={index + 1}
          urlBase={urlBase}
          product={accessory}
        />
      ))}
    </div>
  );
}

type CardProps = {
  rank: number;
  urlBase: string;
  product: ProductModel;
};

function AccessoryCard({ rank, urlBase, product }: CardProps) {
  const t = useTranslations("ProductPage");

  const clickType: ProductClickType = "recommended accessories";
  const analyticsData: ProductClickEvent = {
    event: "productClick",
    event_name: "productClick",
    products: [
      {
        SKU: product.sku,
        name: product.name,
      },
    ],
    productClickFiltersApplied: "",
    productClickRankNumber: rank.toString(),
    productClickType: clickType,
  };

  const addToCartFallback = <Skeleton className="h-10 w-1/6 rounded-md" />;

  return (
    <div id="accessory-card" className="flex gap-4">
      <div className="relative h-18 w-18 items-center justify-center text-sm">
        <AdobeAnalyticsWrapper
          href={`${urlBase}${product.linkAddress}`}
          analyticsData={analyticsData}
        >
          <Image
            src={product.images[0].url || "/placeholder.png"}
            alt={product.name || "Image Title"}
            className="productImage h-auto w-full"
            fill
          />
        </AdobeAnalyticsWrapper>
      </div>
      <div className="flex grow flex-col gap-2 md:flex-row md:gap-6">
        <div className="flex grow flex-col text-sm">
          <AdobeAnalyticsWrapper
            href={`${urlBase}${product.linkAddress}`}
            analyticsData={analyticsData}
          >
            <div className="productTitle">{product.name}</div>
          </AdobeAnalyticsWrapper>
          {product.sku && (
            <div>
              <BazaarVoiceWidgets
                widget_type={BazaarVoiceWidgetType.Inline}
                productId={product?.sku}
              />
            </div>
          )}
          {product.commerceEnabled === true && (
            <div className="flex gap-2">
              <div className="productPrice font-roboto-condensed text-sm font-bold">
                {product.discount && product.discount.amount.value > 0
                  ? product.discount.amount.formattedValue
                  : product.price.formattedValue}
              </div>
              {product.discount && product.discount.amount.value > 0 ? (
                <>
                  <div className="font-roboto text-neutral-black-60 flex flex-row gap-1">
                    {t.rich("saved", {
                      savings: () => (
                        <span className="line-through">
                          {product.price.formattedValue}
                        </span>
                      ),
                    })}
                  </div>
                  <div className="font-roboto text-tertiary-dark-cyan">
                    {t("save", { percent: product.discount.percentage })}
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
        {product.commerceEnabled === true && (
          <CartSuspense fallback={addToCartFallback}>
            <SingleAddButton
              product={product}
              positionInList={rank.toString()}
              sectionType={clickType}
            />
          </CartSuspense>
        )}
      </div>
    </div>
  );
}
