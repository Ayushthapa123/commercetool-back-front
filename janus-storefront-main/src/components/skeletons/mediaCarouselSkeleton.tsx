import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

export function MediaCarouselSkeleton() {
  return (
    <div>
      <Skeleton className="h-130 w-full rounded-md md:w-130" />
      <div className="flex w-[90vw] gap-2 pt-2 sm:w-full">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full md:w-130"
        >
          <CarouselContent>
            {Array.from({ length: 6 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-auto md:basis-1/2 lg:basis-1/6"
              >
                <Skeleton key={index} className="h-20 w-20 rounded-md" />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
