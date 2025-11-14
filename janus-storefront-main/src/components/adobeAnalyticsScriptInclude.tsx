"use client";

import {
  configureClickLocationListeners,
  exitLinkEvent,
  pageViewEvent,
} from "@/lib/analytics";
import { useCartContext } from "@/lib/context/cartContext";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

export function AdobeAnalyticsScriptInclude() {
  const { cart } = useCartContext();
  const pathname = usePathname();
  const isPdp = pathname?.includes("/product/") ?? false;
  const adobeAnalyticsID = process.env.ADOBE_ANALYTICS_ID ?? "580d190e19a0";

  useEffect(() => {
    // Initialize adobe data layer
    if (typeof window !== "undefined") {
      window.adobeDataLayer = window.adobeDataLayer || [];
    }

    // Defer to pdp for product specific analytics (i do not like this)
    if (!isPdp) {
      pageViewEvent(cart.id, pathname);
    }

    /**
     * Handle adding event listeners to anchor elements that will load the url in
     * a new window/tab, as these links will not trigger the `beforeunload` event.
     */
    const selector = 'a[target="_blank"]';
    const anchors = document.querySelectorAll<HTMLAnchorElement>(selector);
    anchors.forEach((link) =>
      link.addEventListener("click", () => exitLinkEvent(link)),
    );

    configureClickLocationListeners();

    const handleUnload = (event: BeforeUnloadEvent) => {
      const element = (event.target as ShadowRoot).activeElement;
      const isAnchor = element?.tagName === "A";

      if (isAnchor) {
        const anchor = element as HTMLAnchorElement;
        const hostname = anchor.hostname;
        const exit = hostname !== window.location.hostname;
        if (exit) exitLinkEvent(anchor);
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      anchors.forEach((link) =>
        link.removeEventListener("click", () => exitLinkEvent(link)),
      );
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [pathname]);

  return (
    <>
      <Script
        src={`https://assets.adobedtm.com/602a97228093/9f3ccd4704cb/launch-${adobeAnalyticsID}.min.js`}
      />
    </>
  );
}
