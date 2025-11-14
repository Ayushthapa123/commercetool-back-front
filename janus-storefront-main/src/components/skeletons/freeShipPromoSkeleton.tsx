import { Skeleton } from "@/components/ui/skeleton";

export function FreeShipPromoSkeleton() {
  return (
    <div className="rounded-sm bg-white p-2 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.15)]">
      <div className="py-1">
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>
      <Skeleton className="h-4 w-full rounded-md" />
    </div>
  );
}
