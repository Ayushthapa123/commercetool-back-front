export function ArrowRight({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.66669 2.05725L14.6095 8.00006L8.66669 13.9429L7.72388 13.0001L12.7239 8.00006L7.72388 3.00006L8.66669 2.05725Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.66669 7.33337H13.6667V8.66671H1.66669V7.33337Z"
      />
    </svg>
  );
}
