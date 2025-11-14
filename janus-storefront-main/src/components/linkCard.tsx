"use client";

import AdobeAnalyticsLink from "@/components/AdobeAnalyticsLink";
import BazaarVoiceWidgets from "@/components/bazaarVoiceWidgets";
import { CartSuspense } from "@/components/cartSuspense";
import { SingleAddButton } from "@/components/singleAddButton";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductClickEvent, ProductClickType } from "@/lib/analytics";
import { ProductModel } from "@/lib/models/productModel";
import { BazaarVoiceWidgetType } from "@/lib/pdp/pdpTypes";
import { useTranslations } from "next-intl";
import Image from "next/image";

type Props = {
  product: ProductModel;
  allowAddCart?: boolean;
  rank: string;
  clickType: ProductClickType;
  urlBase: string;
  sectionType?: string;
};

export function LinkCard({
  product,
  allowAddCart,
  rank,
  clickType,
  urlBase,
  sectionType,
}: Readonly<Props>) {
  const t = useTranslations("ProductPage");

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
    productClickRankNumber: rank,
    productClickType: clickType,
  };

  const addToCartFallback = <Skeleton className="h-10 w-full rounded-md" />;

  return (
    <Card className="flex h-full w-auto flex-col items-center justify-center border-0 bg-white shadow-none">
      <CardContent className="flex h-full w-full flex-col items-center justify-center gap-4 px-0 md:ml-0">
        <div className="relative h-41 w-full items-center justify-center md:h-57">
          <AdobeAnalyticsLink
            href={`${urlBase}${product.linkAddress}`}
            analyticsData={analyticsData}
          >
            <Image
              src={product.images[0].url ?? "/graco-logo-image.png"}
              alt={product.images[0].altText || product.name}
              id="productImage"
              className="h-auto w-full object-contain"
              fill
            />
          </AdobeAnalyticsLink>
        </div>
        <div className="flex w-full grow flex-col justify-between gap-1">
          <div className="flex w-full flex-col gap-1">
            <AdobeAnalyticsLink
              href={`${urlBase}${product.linkAddress}.html`}
              analyticsData={analyticsData}
            >
              <div
                id="productTitle"
                className="text-jg font-roboto hover:underline"
              >
                {product.name}
              </div>
            </AdobeAnalyticsLink>
            {product?.sku && (
              <div>
                <BazaarVoiceWidgets
                  widget_type={BazaarVoiceWidgetType.Inline}
                  productId={product?.sku}
                />
              </div>
            )}
          </div>
          <div className="flex w-full">
            {product.commerceEnabled === true && (
              <>
                <div
                  id="productPrice"
                  className="font-roboto-condensed text-2xl font-bold"
                >
                  {product.discount?.amount.formattedValue ||
                    product.price.formattedValue}
                </div>
                {product.discount && product.discount.amount.value > 0 && (
                  <>
                    <div className="font-roboto text-neutral-black-60 flex flex-row gap-1 text-sm">
                      {t.rich("saved", {
                        savings: () => (
                          <span className="line-through">
                            {product.price.formattedValue}
                          </span>
                        ),
                      })}
                    </div>
                    <div className="font-roboto text-tertiary-dark-cyan text-sm">
                      {t("save", { percent: product.discount.percentage })}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        {allowAddCart && product.commerceEnabled && (
          <CartSuspense fallback={addToCartFallback}>
            <SingleAddButton
              product={product}
              positionInList={rank}
              sectionType={sectionType}
              className="w-full!"
            />
          </CartSuspense>
        )}
      </CardContent>
    </Card>
  );
}
