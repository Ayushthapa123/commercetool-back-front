import { Skeleton } from "@/components/ui/skeleton";

export default function PDPKeySpecsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex w-full grow flex-col gap-1">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-1/2 rounded-md" />
        </div>
      ))}
    </div>
  );
}
