import { cn } from "@/lib/utils";

export function Mail({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-current", className)}
      {...props}
    >
      <path d="M15.333 13.667H0.666992V2.33301H15.333V13.667ZM8 10.208L2 5.1084V12.333H14V5.1084L8 10.208ZM8 8.45801L13.6377 3.66699H2.3623L8 8.45801Z" />
    </svg>
  );
}
