"use client";

import { useEffect } from "react";

type OnetrustButtonProps = {
  privacyPreferencesText: string;
};

export function OnetrustButton({
  privacyPreferencesText,
}: Readonly<OnetrustButtonProps>) {
  useEffect(() => {
    const otButton = document.getElementById("ot-sdk-btn");
    if (otButton) {
      const observer = new MutationObserver(() => {
        if (otButton.textContent !== privacyPreferencesText) {
          otButton.textContent = privacyPreferencesText;
        }
      });

      observer.observe(otButton, { childList: true, subtree: true });

      return () => observer.disconnect();
    }
  }, [privacyPreferencesText]);

  return (
    <button id="ot-sdk-btn" className="ot-sdk-show-settings hover:underline">
      {privacyPreferencesText}
    </button>
  );
}
