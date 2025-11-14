"use client";

import { scrollDepthEvent } from "@/lib/analytics";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ScrollDepthTracker(): React.JSX.Element | null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const maxScrollDepth = useRef(25);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = Math.round(
        (scrollTop / (docHeight - winHeight)) * 100,
      );
      const scrollDepthPercentage = Math.round(scrollPercent / 25) * 25;
      maxScrollDepth.current = scrollDepthPercentage;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    scrollDepthEvent(maxScrollDepth.current.toString());
  }, [pathname, searchParams]);

  return null;
}
