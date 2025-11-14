"use client";

import Script from "next/script";

interface ScriptProps {
  scriptUrl: string;
}

export default function BazaarVoiceScript(scriptProps: ScriptProps) {
  const { scriptUrl } = scriptProps;
  return <Script async src={scriptUrl} strategy="afterInteractive" />;
}
