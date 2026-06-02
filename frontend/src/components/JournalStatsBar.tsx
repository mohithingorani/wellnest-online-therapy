function avgMoodDisplay(avg: number | null): string {
  if (avg === null) return "—";
  return avg.toFixed(1);
}

const ICON_PATHS = {
  journal:
    "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  fire: "M12 2s4 4 4 8a4 4 0 01-8 0c0-1 .5-2 .5-2S6 10 6 13a6 6 0 0012 0c0-5-6-11-6-11z",
  calendar:
    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  heart:
    "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
} as const;

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
  const stats: { icon: keyof typeof ICON_PATHS; value: string; label: string }[] = [
    { icon: "journal", value: `${totalEntries}`, label: "Total entries" },
    { icon: "fire", value: `${streak}`, label: "Day streak" },
    { icon: "calendar", value: `${weeklyEntries}`, label: "This week" },
    { icon: "heart", value: avgMoodDisplay(averageMood), label: "Average mood" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="surface-raised rounded-[1.4rem] p-5 flex items-center gap-4 transition-transform duration-300 hover:-translate-y-0.5"
        >
          <span className="w-11 h-11 rounded-xl surface-inset grid place-items-center text-accent shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={ICON_PATHS[s.icon]}
              />
            </svg>
          </span>
          <div>
            <div className="font-display text-2xl font-semibold text-fg-strong leading-none">
              {s.value}
            </div>
            <div className="mt-1 text-xs text-fg-muted">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
