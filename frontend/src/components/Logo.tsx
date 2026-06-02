/* WellNest brand mark — a "nest": two cupping arcs cradling a seed, for safety,
   holding, and quiet growth. Sits in a warm clay→ochre gradient squircle with a
   soft top highlight. Used by the navbar, footer, dashboard shell, auth pages. */
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
      <span className="relative grid place-items-center w-9 h-9 rounded-[0.72rem] bg-gradient-to-br from-clay-400 via-clay-500 to-ochre-500 shadow-soft ring-1 ring-black/5 overflow-hidden">
        {/* soft top-light highlight for a tactile, premium feel */}
        <span aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
        <svg
          viewBox="0 0 24 24"
          className="relative w-[22px] h-[22px] text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
        >
          {/* nest — two concentric cupping arcs */}
          <path d="M4.5 11a7.5 7.5 0 0 0 15 0" />
          <path d="M8 11a4 4 0 0 0 8 0" stroke="currentColor" strokeOpacity="0.85" />
          {/* seed nestled at the rim */}
          <circle cx="12" cy="8.9" r="2.05" fill="currentColor" stroke="none" />
        </svg>
      </span>
      {withWordmark && (
        <span
          className={`font-display text-[1.35rem] leading-none font-semibold tracking-[-0.01em] ${
            onDark ? "text-night-fg" : "text-fg-strong"
          }`}
        >
          Well<span className={onDark ? "text-ochre-300" : "text-accent"}>Nest</span>
        </span>
      )}
    </span>
  );
}
