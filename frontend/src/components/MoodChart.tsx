import type { MoodEntry } from "../services/moods";

/* Lightweight SVG area chart for the mood trend. No chart library — soft
   gridlines across all five mood levels, a gradient-filled area, a line that
   draws itself in, and a gently pulsing latest point. The displayed aspect
   ratio matches the viewBox (w-full + h-auto), so nothing is distorted. */
export default function MoodChart({ data }: { data: MoodEntry[] }) {
  const W = 640, H = 210, padX = 18, padTop = 18, padBottom = 24;
  const n = data.length;

  if (n < 2)
    return (
      <div className="h-[210px] grid place-items-center text-center">
        <div className="flex flex-col items-center gap-3 px-6">
          <span className="w-12 h-12 rounded-2xl surface-inset grid place-items-center text-clay-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 14l3-3 3 3 4-5" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-fg-strong">Your trend is taking shape</p>
            <p className="mt-0.5 text-xs text-fg-muted">Check in for a couple of days to see it here.</p>
          </div>
        </div>
      </div>
    );

  const x = (i: number) => padX + (i * (W - padX * 2)) / (n - 1);
  const y = (v: number) => padTop + (1 - (v - 1) / 4) * (H - padTop - padBottom);
  const pts = data.map((d, i) => ({ x: x(i), y: y(d.value), d }));

  const line = pts.map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L ${pts[n - 1].x.toFixed(1)} ${H - padBottom} L ${pts[0].x.toFixed(1)} ${H - padBottom} Z`;
  const last = pts[n - 1];
  const levels = [1, 2, 3, 4, 5];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible" role="img" aria-label="Mood trend over the last two weeks">
      <defs>
        <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.24" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* soft gridlines across every mood level; the "Okay" midline reads a touch stronger */}
      {levels.map((v) => {
        const gy = y(v);
        const mid = v === 3;
        return (
          <line
            key={v}
            x1={padX}
            x2={W - padX}
            y1={gy}
            y2={gy}
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray={mid ? undefined : "2 7"}
            opacity={mid ? 0.6 : 0.4}
          />
        );
      })}

      <path d={area} fill="url(#moodFill)" className="animate-fade-in" />
      <path
        d={line}
        pathLength={1}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
        className="animate-draw"
      />

      {pts.slice(0, -1).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.6" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="1.5" />
      ))}

      {/* latest point — pulsing halo + solid dot */}
      <circle cx={last.x} cy={last.y} r="8" fill="var(--color-accent)" opacity="0.16" className="animate-pulse-soft" />
      <circle cx={last.x} cy={last.y} r="4.5" fill="var(--color-accent)" stroke="var(--color-surface)" strokeWidth="2" />
    </svg>
  );
}
