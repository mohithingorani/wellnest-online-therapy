/* WellNest brand mark — a warm "bloom": five soft petals opening from a center,
   symbolizing growth, care, and calm. Sits in a clay→ochre gradient squircle.
   Used by the navbar, footer, dashboard shell, and auth pages. */
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
      <span className="relative grid place-items-center w-9 h-9 rounded-[0.7rem] bg-gradient-to-br from-clay-400 via-clay-500 to-ochre-500 shadow-soft ring-1 ring-black/5">
        <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] text-white" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse key={i} cx="12" cy="7.6" rx="2.15" ry="4.3" fill="currentColor" fillOpacity="0.92" transform={`rotate(${i * 72} 12 12)`} />
          ))}
          <circle cx="12" cy="12" r="2.05" fill="currentColor" />
          <circle cx="12" cy="12" r="2.05" fill="#000" fillOpacity="0.08" />
        </svg>
      </span>
      {withWordmark && (
        <span className={`font-display text-[1.35rem] leading-none font-semibold tracking-[-0.01em] ${onDark ? "text-night-fg" : "text-fg-strong"}`}>
          WellNest
        </span>
      )}
    </span>
  );
}
