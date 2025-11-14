import { Skeleton } from "@/components/ui/skeleton";

export function RelatedProductsSkeleton() {
  return (
    <section className="flex w-full flex-col gap-10">
      <Skeleton className="h-12 w-1/3" />
      <div className="flex w-full flex-col items-center justify-center gap-6 md:flex-row md:justify-start">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-73 w-73 rounded-md" />
        ))}
      </div>
    </section>
  );
}
