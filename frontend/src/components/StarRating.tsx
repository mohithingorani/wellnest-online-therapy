interface StarRatingProps {
  value: number;
  /** Number of reviews to show alongside, optional. */
  count?: number;
  size?: "sm" | "md" | "lg";
  /** When set, stars become interactive. */
  onChange?: (v: number) => void;
}

const SIZES = { sm: "w-3.5 h-3.5 text-xs", md: "w-4 h-4 text-sm", lg: "w-6 h-6 text-base" };

export default function StarRating({ value, count, size = "md", onChange }: StarRatingProps) {
  const interactive = !!onChange;
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= Math.round(value);
          const star = (
            <svg className={`${SIZES[size].split(" ").slice(0, 2).join(" ")} ${filled ? "text-ochre-400" : "text-border"}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.36 4.18a1 1 0 00.95.69h4.4c.97 0 1.37 1.24.59 1.81l-3.56 2.59a1 1 0 00-.36 1.12l1.36 4.18c.3.92-.75 1.69-1.54 1.12l-3.56-2.59a1 1 0 00-1.18 0l-3.56 2.59c-.79.57-1.84-.2-1.54-1.12l1.36-4.18a1 1 0 00-.36-1.12L1.4 9.61c-.78-.57-.38-1.81.59-1.81h4.4a1 1 0 00.95-.69l1.36-4.18z" />
            </svg>
          );
          return interactive ? (
            <button key={i} type="button" onClick={() => onChange!(i)} aria-label={`${i} star${i > 1 ? "s" : ""}`} className="p-0.5 transition-transform">{star}</button>
          ) : (
            <span key={i}>{star}</span>
          );
        })}
      </div>
      {value > 0 && <span className="font-semibold text-fg-strong text-sm">{value.toFixed(1)}</span>}
      {count != null && <span className="text-sm text-fg-muted">({count.toLocaleString()})</span>}
    </div>
  );
}
