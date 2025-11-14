import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailsSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Product Details */}
      <div className="flex w-full flex-col gap-4">
        {/* New badge goes here */}
        <div className="flex w-full flex-col gap-4">
          {/* Title Area */}
          <Skeleton className="h-5 w-1/2 rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-5 w-1/2 rounded-md" />
          <Skeleton className="h-5 w-1/2 rounded-md" />
        </div>
      </div>
      <hr />
      <div className="flex w-full flex-col gap-2">
        {/* Price Area */}
        <Skeleton className="h-5 w-1/8 rounded-md" />
        <Skeleton className="h-8 w-1/2 rounded-md" />
        <Skeleton className="h-5 w-1/4 rounded-md" />
      </div>
      <div className="flex w-full flex-row gap-2">
        {/* CTA Area */}
        <Skeleton className="h-11 w-1/2 rounded-md" />
      </div>
      {/* In Stock Message */}
      <Skeleton className="h-5 w-3/4 rounded-md" />
    </div>
  );
}
