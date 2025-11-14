"use client";

import { BrightcoveGallery } from "@/components/pdp/brightcoveGallery";
import { Button } from "@/components/ui/button";
import { useVideoRefresh } from "@/lib/context/quickOperationalVideosContext";
import { useState } from "react";

type Props = {
  brightcoveID: string;
  videoGalleryID: string;
  educationLink?: string;
  educationCenterLabel: string;
  quickOperationalVideosLabel: string;
  checkOutAllVideosLabel: string;
};

export function BrightcoveSection({
  educationCenterLabel,
  quickOperationalVideosLabel,
  checkOutAllVideosLabel,
  brightcoveID,
  videoGalleryID,
  educationLink,
}: Props) {
  const [hasContent, setHasContent] = useState<boolean | null>(null);

  const { refreshKey } = useVideoRefresh();
  if (hasContent === false) return null;

  return (
    <section
      key={refreshKey}
      className={`bg-neutral-black-3 mx-0 ml-[calc(-50vw+50%)] flex w-screen max-w-screen flex-col items-center-safe gap-10 py-16 transition-opacity duration-500 md:py-24 ${
        hasContent ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="container flex w-full flex-col items-center-safe gap-10 px-2 md:px-0">
        <div className="flex w-full flex-col items-start gap-2">
          <p className="font-roboto-condensed text-neutral-black-70 text-base font-bold">
            {educationCenterLabel}
          </p>
          <p className="font-roboto-condensed text-5xl font-bold">
            {quickOperationalVideosLabel}
          </p>
        </div>

        <div className="w-full">
          <BrightcoveGallery
            brightcoveID={brightcoveID}
            brightcoveGalleryID={videoGalleryID}
            className="w-full"
            onContentCheck={setHasContent}
          />
        </div>

        {educationLink && hasContent && (
          <a href={educationLink}>
            <Button className="text-neutral-black border-neutral-black-30 hover:bg-neutral-black rounded-xs bg-transparent px-6 py-3 hover:text-white">
              {checkOutAllVideosLabel}
            </Button>
          </a>
        )}
      </div>
    </section>
  );
}
