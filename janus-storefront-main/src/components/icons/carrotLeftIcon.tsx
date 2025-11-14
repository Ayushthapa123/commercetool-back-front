"use client";

import Image from "next/image";

export function CarrotLeftIcon({ className }: React.SVGProps<SVGSVGElement>) {
  return (
    <Image
      src="/chevron-left.svg"
      alt="Close Button"
      width={16}
      height={16}
      className={className}
    />
  );
}
