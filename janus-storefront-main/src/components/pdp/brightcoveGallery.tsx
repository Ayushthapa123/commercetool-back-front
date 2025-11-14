"use client";

import { useEffect, useRef } from "react";

type Props = {
  brightcoveID: string;
  brightcoveGalleryID: string;
  className?: string;
  onContentCheck?: (hasContent: boolean) => void;
};

export function BrightcoveGallery({
  brightcoveID,
  brightcoveGalleryID,
  className,
  onContentCheck,
}: Readonly<Props>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = "brightcove-script";
    const existingScript = document.getElementById(scriptId);

    if (existingScript && existingScript instanceof HTMLScriptElement) {
      existingScript.remove();
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://players.brightcove.net/${brightcoveID}/experience_${brightcoveGalleryID}/live.js`;
    script.async = true;
    document.body.appendChild(script);

    const observer = new MutationObserver(() => {
      const container = containerRef.current;
      const hasContent =
        container &&
        (container.children.length > 0 ||
          container.innerHTML.trim().length > 0);

      if (hasContent) {
        onContentCheck?.(true);
        clearTimeout(fallbackTimeout);
        observer.disconnect();
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    const fallbackTimeout = setTimeout(() => {
      onContentCheck?.(false);
      observer.disconnect();
    }, 5000);

    return () => {
      script.remove();
      observer.disconnect();
      clearTimeout(fallbackTimeout);
    };
  }, [brightcoveID, brightcoveGalleryID, onContentCheck]);
  return (
    <div
      ref={containerRef}
      className={className}
      data-experience={brightcoveGalleryID}
    />
  );
}
