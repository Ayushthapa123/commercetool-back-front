"use client";

import { cn } from "@/lib/utils";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
}

function Progress({
  className,
  indicatorClassName,
  value,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      id="freeShipProgressBar"
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-neutral-200",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "bg-primary-blue h-full w-full flex-1 transition-all",
          indicatorClassName,
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
