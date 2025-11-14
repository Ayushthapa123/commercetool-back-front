"use client";

import { useEffect } from "react";

interface ScriptInjectorProps {
  scriptHtml: string; // This should be a full <script> tag, possibly HTML-escaped
}

export default function BrightEdgeScript({ scriptHtml }: ScriptInjectorProps) {
  useEffect(() => {
    // Unescape HTML entities
    const unescaped = scriptHtml
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");

    // Parse the string into a DOM element
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = unescaped;

    // Extract the <script> tag
    const scriptTag = tempDiv.querySelector("script");
    if (scriptTag) {
      document.head.appendChild(scriptTag);
    }
  }, [scriptHtml]);

  return null; // No visible output
}
