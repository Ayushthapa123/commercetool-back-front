import { cn } from "@/lib/utils";

export function CarrotRightIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-current", className)}
      {...props}
    >
      <g id="UI Icons">
        <path
          id="Vector (Stroke)"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.3333 8.50008L6.73018 3.83341L5.99992 4.57377L9.87273 8.50008L5.99992 12.4264L6.73018 13.1667L11.3333 8.50008Z"
        />
      </g>
    </svg>
  );
}
