"use client";

import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

export function PaginationButton({
  offset,
  limit,
  url,
}: {
  offset: number;
  limit: number;
  url: string;
}) {
  const { push } = useRouter();

  const handleNextPage = () => {
    push(`${url}?offset=${offset + limit}`);
  };

  const handlePreviousPage = () => {
    push(`${url}?offset=${offset - limit}`);
  };

  return (
    <div className="mt-4 flex items-center justify-between">
      <button
        className="bg-tertiary-dark-cyan hover:bg-secondary-cyan disabled:bg-neutral-black-30 rounded px-4 py-2 text-white disabled:cursor-not-allowed"
        onClick={handlePreviousPage}
        disabled={offset < limit}
      >
        Previous Page
      </button>
      <Progress value={offset} className="hidden w-[50%] md:block" />
      <button
        className="bg-tertiary-dark-cyan hover:bg-secondary-cyan disabled:bg-neutral-black-30 rounded px-4 py-2 text-white disabled:cursor-not-allowed"
        onClick={handleNextPage}
        disabled={offset >= 100}
      >
        Next Page
      </button>
    </div>
  );
}
