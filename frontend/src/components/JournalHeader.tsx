import { FlameIcon } from "./icons";
import JournalStatsBar from "./JournalStatsBar";

interface JournalHeaderProps {
  totalEntries: number;
  streak: number;
  weeklyEntries: number;
  averageMood: number | null;
  dailyPrompt: string;
}

export default function JournalHeader({
  totalEntries,
  streak,
  weeklyEntries,
  averageMood,
  dailyPrompt,
}: JournalHeaderProps) {
  return (
    <div className="space-y-4 animate-fade-in-down">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl sm:text-3xl font-medium text-fg-strong">
          Journal
        </h1>
        {streak > 0 && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ochre-600 bg-ochre-100/60 rounded-full px-3 py-1">
            <FlameIcon className="w-4 h-4" />
            {streak}-day streak
          </span>
        )}
      </div>

      <div className="surface-raised rounded-2xl px-5 py-4">
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-1">
          Today's prompt
        </p>
        <p className="text-sm sm:text-base text-fg-strong font-display italic leading-relaxed">
          &ldquo;{dailyPrompt}&rdquo;
        </p>
      </div>

      <JournalStatsBar
        totalEntries={totalEntries}
        streak={streak}
        weeklyEntries={weeklyEntries}
        averageMood={averageMood}
      />
    </div>
  );
}
