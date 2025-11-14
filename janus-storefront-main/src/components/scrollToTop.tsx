"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function ScrollToTop() {
  const t = useTranslations("Navigation");
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      variant={"link"}
      className="cursor-pointer border-0 p-0 hover:no-underline"
    >
      <Image
        src="/arrow-up.svg"
        alt="Back to Top Arrow"
        width={24}
        height={24}
        className="inline-block"
      />
      <span className="hidden font-bold md:inline">{t("backToTop")}</span>
      <span className="inline font-bold md:hidden">{t("top")}</span>
    </Button>
  );
}
