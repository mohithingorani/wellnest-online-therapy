import { FlameIcon } from "./icons";

function avgMoodDisplay(avg: number | null): string {
  if (avg === null) return "—";
  return avg.toFixed(1);
}

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
  const stats = [
    { label: "Total entries", value: totalEntries },
    { label: "Day streak", value: streak, icon: streak > 0 ? <FlameIcon className="w-4 h-4" /> : null },
    { label: "This week", value: weeklyEntries },
    { label: "Avg mood", value: avgMoodDisplay(averageMood) },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="surface-raised rounded-xl px-4 py-3">
          <p className="text-xs text-fg-muted">{s.label}</p>
          <p className="mt-0.5 font-display text-xl font-medium text-fg-strong">
            {s.icon && <span className="mr-1">{s.icon}</span>}
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
