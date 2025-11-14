export function CheckIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      id={"svgVectorStroke"}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g id="UI Icons">
        <path
          id="Vector (Stroke)"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.6684 4.16665L6 12.8351L1.3316 8.16665L2.33334 7.16492L6 10.8316L13.6667 3.16492L14.6684 4.16665Z"
        />
      </g>
    </svg>
  );
}
