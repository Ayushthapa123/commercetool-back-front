"use client";

import Image from "next/image";

export function CloseIcon({ className }: React.SVGProps<SVGSVGElement>) {
  return (
    <Image
      src="/nav-close.svg"
      alt="Close Button"
      width={16}
      height={16}
      className={className}
    />
  );
}
