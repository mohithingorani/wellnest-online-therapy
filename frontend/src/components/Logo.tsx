/* WellNest brand mark — a minimal monoline "nest": a single cupping arc
   cradling a seed, for safety and quiet growth. One solid accent color, no
   container, no gradient. Paired with a clean Inter wordmark.
   Used by the navbar, footer, dashboard shell, auth pages. */
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
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        className="w-[24px] h-[24px] text-accent"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        aria-hidden="true"
      >
        {/* nest — a single cupping arc */}
        <path d="M4 11.5a8 8 0 0 0 16 0" />
        {/* seed nestled at the rim */}
        <circle cx="12" cy="9.2" r="1.9" fill="currentColor" stroke="none" />
      </svg>
      {withWordmark && (
        <span
          className={`font-body text-[1.28rem] leading-none font-semibold tracking-[-0.02em] ${
            onDark ? "text-night-fg" : "text-fg-strong"
          }`}
        >
          WellNest
        </span>
      )}
    </span>
  );
}
