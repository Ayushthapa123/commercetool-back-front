"use client";

import { LinkCard } from "@/components/linkCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselProgress,
} from "@/components/ui/carousel";
import {
  ProductClickType,
  SectionType,
  viewRecommendedEvent,
} from "@/lib/analytics";
import { getRelatedProducts } from "@/lib/bff/cart";
import { useCartContext } from "@/lib/context/cartContext";
import { ProductModel } from "@/lib/models/productModel";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Props = {
  cartId: string;
  urlBase: string;
};

export function RecommendedProducts({ cartId, urlBase }: Readonly<Props>) {
  const { cart } = useCartContext();
  const t = useTranslations("Cart");
  const [products, setProducts] = useState<ProductModel[]>([]);
  const showRecommended = cart.entries.length > 0;
  const title = showRecommended ? "recommendedProducts" : "mostViewedProducts";
  const clickType: ProductClickType = showRecommended
    ? "recommended products"
    : "most viewed products";
  const sectionType: SectionType = showRecommended
    ? "Recommended Products"
    : "Most Viewed Products";

  useEffect(() => {
    async function fetchProducts() {
      const data = await getRelatedProducts(cartId);
      setProducts(data);
    }
    fetchProducts();
  }, [cartId]);

  useEffect(() => {
    if (products.length > 0) {
      const section: SectionType =
        cart.entries.length > 0
          ? "Recommended Products"
          : "Most Viewed Products";

      viewRecommendedEvent(section, cartId, products);
    }
  }, [products]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="flex w-full flex-col gap-10">
      <p className="font-roboto-condensed text-3xl">{t(title)}</p>
      <div
        id={
          cart?.entries?.length > 0
            ? "recommendedProductsBlock"
            : "mostViewedProductsBlock"
        }
        className="flex w-full flex-col items-center justify-center md:flex-row md:justify-start"
      >
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {products.map((product, index) => (
              <CarouselItem
                key={index}
                className="2xs:basis-1/2 max-w-45 basis-auto lg:basis-1/3 xl:basis-1/4 2xl:basis-1/4"
              >
                <LinkCard
                  product={product}
                  allowAddCart={true}
                  rank={(index + 1).toString()}
                  clickType={clickType}
                  urlBase={urlBase}
                  sectionType={sectionType}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute left-1/2 mx-auto mt-6 flex w-68 -translate-x-1/2 gap-4 xl:hidden">
            <CarouselPrevious />
            <CarouselProgress className="h-0.5" />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
