const MOOD_DOT = ["bg-clay-400", "bg-ochre-400", "bg-sage-400", "bg-clay-500", "bg-accent"];

const ICON_PATHS = {
  entries:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  fire: "M12 2s4 4 4 8a4 4 0 01-8 0c0-1 .5-2 .5-2S6 10 6 13a6 6 0 0012 0c0-5-6-11-6-11z",
  calendar:
    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  mood: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
} as const;

const TINTS: Record<string, string> = {
  clay: "bg-clay-100 text-clay-700",
  ochre: "bg-ochre-100 text-ochre-600",
  sage: "bg-sage-100 text-sage-600",
  accent: "bg-clay-100 text-accent",
};

interface JournalStatsBarProps {
  totalEntries: number;
  streak: number;
  weeklyEntries: number;
  averageMood: number | null;
}

export default function JournalStatsBar({
  totalEntries,
  streak,
  weeklyEntries,
  averageMood,
}: JournalStatsBarProps) {
  const roundedMood = averageMood !== null ? Math.round(averageMood) : 0;

  const stats: {
    icon: keyof typeof ICON_PATHS;
    tint: string;
    value: string;
    label: string;
    hint: React.ReactNode;
  }[] = [
    {
      icon: "entries",
      tint: "clay",
      value: `${totalEntries}`,
      label: "Total entries",
      hint: "All time",
    },
    {
      icon: "fire",
      tint: "ochre",
      value: `${streak}`,
      label: "Day streak",
      hint: streak > 0 ? "In a row" : "Start today",
    },
    {
      icon: "calendar",
      tint: "sage",
      value: `${weeklyEntries}`,
      label: "This week",
      hint: "Last 7 days",
    },
    {
      icon: "mood",
      tint: "accent",
      value: averageMood !== null ? averageMood.toFixed(1) : "—",
      label: "Average mood",
      hint: (
        <span className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                n <= roundedMood ? MOOD_DOT[n - 1] : "bg-border"
              }`}
            />
          ))}
        </span>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
      {stats.map((s) => (
        <div key={s.label} className="card-elevated card-lift p-5">
          <span
            className={`w-10 h-10 rounded-xl grid place-items-center ${TINTS[s.tint]}`}
          >
            <svg
              className="w-[18px] h-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.9}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={ICON_PATHS[s.icon]}
              />
            </svg>
          </span>
          <div className="mt-4 font-display text-[1.9rem] font-semibold text-fg-strong leading-none tracking-[-0.02em]">
            {s.value}
          </div>
          <div className="mt-1.5 text-[13px] font-medium text-fg-strong">
            {s.label}
          </div>
          <div className="mt-2 text-[11px] text-fg-muted">{s.hint}</div>
        </div>
      ))}
    </div>
  );
}
