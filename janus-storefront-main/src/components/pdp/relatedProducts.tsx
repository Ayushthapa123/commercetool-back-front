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
import { viewRecommendedEvent } from "@/lib/analytics";
import { useCartContext } from "@/lib/context/cartContext";
import { ProductModel } from "@/lib/models/productModel";
import { use, useEffect } from "react";

type Props = {
  urlBase: string;
  promise: Promise<ProductModel[]>;
};

export function RelatedProducts({ urlBase, promise }: Readonly<Props>) {
  const { cart } = useCartContext();
  const products = use(promise);

  useEffect(() => {
    viewRecommendedEvent("Recommended Products", cart.id, products);
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 md:flex-row md:justify-start">
      <Carousel
        opts={{
          align: "start",
        }}
        className="2xs:max-w-83 w-full max-w-42 md:max-w-full"
      >
        <CarouselContent>
          {products.map((product, index) => (
            <CarouselItem
              key={index}
              className="2xs:basis-1/2 max-w-41 basis-auto md:basis-1/3 md:pl-1 lg:pl-2"
            >
              <LinkCard
                product={product}
                rank={(index + 1).toString()}
                clickType="related products"
                urlBase={urlBase}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute left-1/2 mx-auto mt-6 flex w-68 -translate-x-1/2 gap-4 md:hidden">
          <CarouselPrevious />
          <CarouselProgress className="h-0.5" />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
}
