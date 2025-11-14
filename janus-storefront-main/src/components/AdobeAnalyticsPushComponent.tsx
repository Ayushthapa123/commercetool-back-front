"use client";

import { AnalyticsEvent, pushToAdobeDataLayer } from "@/lib/analytics";
import { useEffect } from "react";

type Props = {
  event: AnalyticsEvent;
};

export default function AdobeAnalyticsPushComponent({ event }: Props) {
  useEffect(() => {
    pushToAdobeDataLayer(event);
  }, [event]);

  return null;
}
