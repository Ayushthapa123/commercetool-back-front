import { Skeleton } from "@/components/ui/skeleton";

export function ProductVideoSkeleton() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 md:flex-row">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-100 w-90 rounded-md" />
      ))}
    </div>
  );
}
