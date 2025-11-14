"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type BreadcrumbProps = {
  segment: string;
  page: string;
  baseURL: string;
};

export function Breadcrumb({
  segment,
  page,
  baseURL,
}: Readonly<BreadcrumbProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWrapped, setIsWrapped] = useState(false);
  const t = useTranslations("Navigation");

  useEffect(() => {
    const checkWrap = () => {
      const container = containerRef.current;
      if (!container) return;

      const spans = container.querySelectorAll("span");
      if (spans.length < 2) return;

      const linkEl = spans[0];
      const pageEl = spans[1];

      const linkTop = linkEl.offsetTop;
      const pageTop = pageEl.offsetTop;

      setIsWrapped(pageTop > linkTop);
    };

    const timeout = setTimeout(checkWrap, 100);
    window.addEventListener("resize", checkWrap);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", checkWrap);
    };
  }, [segment, page]);

  return (
    <div
      id="breadcrumb"
      ref={containerRef}
      className="font-roboto py-4 text-xs"
      style={{
        maxWidth: "100%", // constrain width to allow wrapping
        wordBreak: "break-word",
        whiteSpace: "normal",
      }}
    >
      <span style={{ display: "inline-block", maxWidth: "100%" }}>
        <Link
          href={`${baseURL}/${segment}`}
          className="hover:text-secondary-cyan hover:underline"
        >
          {isWrapped ? "..." : t(segment.toLowerCase())}
        </Link>
      </span>
      <span style={{ display: "inline-block", maxWidth: "100%" }}>
        &nbsp;/&nbsp;{page}
      </span>
    </div>
  );
}
