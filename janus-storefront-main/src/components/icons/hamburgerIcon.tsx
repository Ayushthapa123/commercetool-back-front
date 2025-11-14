"use client";

import Image from "next/image";

export function HamburgerIcon({ className }: React.SVGProps<SVGSVGElement>) {
  return (
    <Image
      src="/burger-menu.svg"
      alt="Hamburger menu"
      width={16}
      height={16}
      className={className}
    />
  );
}
