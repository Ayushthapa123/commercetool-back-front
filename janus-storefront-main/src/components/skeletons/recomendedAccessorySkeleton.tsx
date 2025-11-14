import { Skeleton } from "@/components/ui/skeleton";

export function RecommendedAccessorySkeleton() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex gap-4">
        <Skeleton className="h-18 w-18 rounded-md" />
        <div className="flex grow flex-col gap-2 md:flex-row md:gap-6">
          <div className="flex grow flex-col gap-2 text-sm">
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-4 w-1/4 rounded-md" />
            <Skeleton className="h-4 w-1/6 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
