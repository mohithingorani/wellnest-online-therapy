/* WellNest brand mark — uses /wellnest-logo.svg from public folder.
   Paired with the "WellNest" wordmark in font-body semibold. */
export default function Logo({
  withWordmark = true,
  onDark = false,
  className = "",
}: {
  withWordmark?: boolean;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/wellnest-logo.svg"
        alt={withWordmark ? "" : "WellNest"}
        aria-hidden={withWordmark ? "true" : undefined}
        className="h-7 w-auto"
      />
      {withWordmark && (
        <span
          className={`font-body text-[1.2rem] leading-none font-semibold tracking-[-0.02em] ${
            onDark ? "text-night-fg" : "text-fg-strong"
          }`}
        >
          WellNest
        </span>
      )}
    </span>
  );
}
