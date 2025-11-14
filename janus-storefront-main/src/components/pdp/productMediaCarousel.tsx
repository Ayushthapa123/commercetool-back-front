"use client";

import { VideoInfo } from "@/app/[country]/[language]/[segment]/product/[slug]/page";
import BrightcovePlayer from "@/components/pdp/brightcovePlayer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { emptyImageData, ImageData } from "@/lib/models/productModel";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { SetStateAction, useState } from "react";

type ProductMediaCarouselProperties = {
  brightcoveID: string | undefined;
  images: ImageData[];
  videos: VideoInfo[];
};

type CarouselImage = ImageData & {
  thumbnail: boolean;
  videoId: string;
};

type IndexActionType = "increment" | "decrement";

export function ProductMediaCarousel({
  brightcoveID,
  images,
  videos,
}: Readonly<ProductMediaCarouselProperties>) {
  const t = useTranslations("ProductPage");
  const [showPlayer, setShowPlayer] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const thumbnails: CarouselImage[] = videos.map((info) => ({
    url: info.thumbnail,
    caption: "",
    altText: "Product Video Thumbnail",
    representative: false,
    thumbnail: true,
    videoId: info.video.videoId,
  }));
  const imageData: CarouselImage[] = images.map((image) => ({
    ...image,
    thumbnail: false,
    videoId: "",
  }));

  const carouselImages = [...imageData, ...thumbnails];
  const firstImageUrl =
    carouselImages.length > 0 ? carouselImages[0] : emptyImageData();
  const currentImage = carouselImages[currentIndex] || firstImageUrl;

  const indexAction = (action: IndexActionType): SetStateAction<number> => {
    return function (prevState: number) {
      let index = 0;
      switch (action) {
        case "increment":
          index = (prevState + 1) % carouselImages.length;
          break;
        case "decrement":
          index =
            (prevState - 1 + carouselImages.length) % carouselImages.length;
          break;
      }

      const image = carouselImages[index];
      if (image.thumbnail) {
        setShowPlayer(true);
        setVideoId(image.videoId);
      } else {
        setShowPlayer(false);
      }

      return index;
    };
  };

  const nextImage = () => {
    setCurrentIndex(indexAction("increment"));
  };

  const previousImage = () => {
    setCurrentIndex(indexAction("decrement"));
  };

  const clickHandler = (image: CarouselImage, index: number) => {
    setCurrentIndex(index);

    if (image.thumbnail) {
      setShowPlayer(true);
      setVideoId(image.videoId);
    } else {
      setShowPlayer(false);
    }
  };

  return (
    <>
      <div className={showPlayer ? "hidden" : ""}>
        <div className="relative aspect-square w-full">
          <Image
            src={currentImage.url}
            alt={currentImage.altText || "Product Image"}
            fill
            style={{
              objectFit: "contain",
              objectPosition: "center",
            }}
            priority={true}
            className="rounded-xs"
          />
        </div>
        <div className="text-neutral-black-50 text-center text-sm">
          {currentImage.representative === true ? (
            <>{t("isRepresentative")}</>
          ) : (
            <>{currentImage.caption}</>
          )}
        </div>
      </div>
      <div className={`relative w-full ${!showPlayer ? "hidden" : ""}`}>
        {brightcoveID && (
          <BrightcovePlayer videoId={videoId} brightcoveID={brightcoveID} />
        )}
      </div>
      {carouselImages.length > 1 && (
        <div className="pt-2">
          <Carousel
            opts={{
              align: "start",
              watchDrag: carouselImages.length > 6,
            }}
          >
            <CarouselContent>
              {carouselImages.map((image, index) => (
                <CarouselItem key={`image-${index}`} className="basis-auto">
                  <div className="relative h-20 w-20 overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.altText || "Product Image"}
                      fill
                      className={`border object-cover object-center ${
                        image.url === currentImage.url
                          ? "border-secondary-cyan"
                          : "border-neutral-200 opacity-50"
                      }`}
                      onClick={() => clickHandler(image, index)}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className="absolute top-1/2 -left-2.5"
              onClick={previousImage}
              disabled={currentIndex === 0}
            />
            <CarouselNext
              className="absolute top-1/2 -right-2.5"
              onClick={nextImage}
              disabled={currentIndex === carouselImages.length - 1}
            />
          </Carousel>
        </div>
      )}
    </>
  );
}
