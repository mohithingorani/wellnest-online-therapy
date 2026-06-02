import type { MoodEntry } from "../services/moods";

/* Lightweight SVG area chart for the mood trend. No chart library — a single
   gradient-filled area + line + points, with the latest point emphasized. */
export default function MoodChart({ data }: { data: MoodEntry[] }) {
  const W = 640, H = 200, padX = 14, padTop = 16, padBottom = 28;
  const n = data.length;
  if (n < 2) return <div className="h-[200px] grid place-items-center text-sm text-fg-muted">Log a few days to see your trend.</div>;

  const x = (i: number) => padX + (i * (W - padX * 2)) / (n - 1);
  const y = (v: number) => padTop + (1 - (v - 1) / 4) * (H - padTop - padBottom);
  const pts = data.map((d, i) => ({ x: x(i), y: y(d.value), d }));

  const line = pts.map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L ${pts[n - 1].x.toFixed(1)} ${H - padBottom} L ${pts[0].x.toFixed(1)} ${H - padBottom} Z`;
  const last = pts[n - 1];

  // gridlines at Okay(3) and Good(4)
  const grids = [3, 4].map((v) => y(v));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none" role="img" aria-label="Mood trend over the last two weeks">
      <defs>
        <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {grids.map((gy, i) => (
        <line key={i} x1={padX} x2={W - padX} y1={gy} y2={gy} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 5" />
      ))}

      <path d={area} fill="url(#moodFill)" />
      <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === n - 1 ? 0 : 2.5} fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="1.5" />
      ))}

      {/* latest point emphasized */}
      <circle cx={last.x} cy={last.y} r="7" fill="var(--color-accent)" opacity="0.18" />
      <circle cx={last.x} cy={last.y} r="4" fill="var(--color-accent)" stroke="var(--color-surface)" strokeWidth="2" />
    </svg>
  );
}
