"use client";

import { BazaarVoiceWidgetType } from "@/lib/pdp/pdpTypes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RatingProps {
  widget_type: BazaarVoiceWidgetType;
  productId: string;
}

export default function BazaarVoiceWidgets({
  widget_type,
  productId,
}: RatingProps) {
  // In order to prevent React Hydration errors, we are using a useEffect to run on the client only (as recommended in https://nextjs.org/docs/messages/react-hydration-error)
  // The Hydration errors are occuring because the BazaarVoice script is modifying this DOM.
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {isClient && (
        <>
          {widget_type === BazaarVoiceWidgetType.Summary && (
            <div
              id="productRatingBlock"
              data-bv-show="rating_summary"
              data-bv-product-id={productId}
            ></div>
          )}
          {widget_type === BazaarVoiceWidgetType.Inline && (
            <div
              id="productInlineRatingBlock"
              data-bv-show="inline_rating"
              data-bv-product-id={productId}
            ></div>
          )}
          {widget_type === BazaarVoiceWidgetType.Reviews && (
            <div
              id="productReviewsBlock"
              data-bv-show="reviews"
              data-bv-product-id={productId}
            ></div>
          )}
          {widget_type === BazaarVoiceWidgetType.Questions && (
            <div
              id="productQuestionsBlock"
              data-bv-show="questions"
              data-bv-product-id={productId}
            ></div>
          )}
        </>
      )}
    </>
  );
}

type ScrollProps = {
  targetClasses: string[];
  scrollId: string;
  buttonToClickID?: string;
};

export function BazaarVoiceScrollButtonHandler({
  targetClasses,
  scrollId,
  buttonToClickID,
}: ScrollProps) {
  const router = useRouter();

  useEffect(() => {
    let hasClicked = false; // External flag to prevent re-clicking

    const simulateFullClick = (element: HTMLElement) => {
      const down = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      const up = new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      const click = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      element.dispatchEvent(down);
      element.dispatchEvent(up);
      element.dispatchEvent(click);
    };

    const querySelectorDeep = (
      selector: string,
      root: Document | ShadowRoot = document,
    ): HTMLElement | null => {
      const match = root.querySelector(selector) as HTMLElement | null;
      if (match) return match;

      const elements = root.querySelectorAll("*");
      for (const el of elements) {
        const shadow = (el as HTMLElement).shadowRoot;
        if (shadow) {
          const deepMatch = querySelectorDeep(selector, shadow);
          if (deepMatch) return deepMatch;
        }
      }

      return null;
    };

    const waitForButtonAndClick = () => {
      const maxAttempts = 50;
      let attempts = 0;

      const interval = setInterval(() => {
        if (hasClicked) {
          clearInterval(interval);
          return;
        }

        const button = querySelectorDeep(`#${buttonToClickID}`) as HTMLElement;

        if (button) {
          simulateFullClick(button);
          hasClicked = true;
          clearInterval(interval);
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(interval);
          }
        }
      }, 100);
    };

    const handleClick = (e: Event) => {
      e.preventDefault();

      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );

      requestAnimationFrame(() => {
        window.location.hash = `#${scrollId}`;
        if (buttonToClickID) {
          setTimeout(() => {
            waitForButtonAndClick();
          }, 500); // Give time for accordion + BV to render
        }
      });
    };

    // Attach listener to initial trigger buttons
    const observer = new MutationObserver(() => {
      targetClasses.forEach((className) => {
        const button = document.querySelector(`.${className}`);
        if (button && !button.hasAttribute("data-listener-attached")) {
          button.addEventListener("click", handleClick);
          button.setAttribute("data-listener-attached", "true");
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [buttonToClickID, router, scrollId, targetClasses]);

  return null;
}
