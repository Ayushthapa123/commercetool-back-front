"use client";

import { AnalyticsEvent, pushToAdobeDataLayer } from "@/lib/analytics";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  href: string;
  analyticsData: AnalyticsEvent;
  children: ReactNode;
}

export default function AdobeAnalyticsLink({
  href,
  analyticsData,
  children,
}: Props) {
  const handleClick = () => {
    pushToAdobeDataLayer(analyticsData);
  };

  return (
    <Link href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}
