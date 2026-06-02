import { FlameIcon } from "./icons";
import JournalStatsBar from "./JournalStatsBar";

interface JournalHeaderProps {
  totalEntries: number;
  streak: number;
  weeklyEntries: number;
  averageMood: number | null;
  dailyPrompt: string;
  onCreate: () => void;
}

export default function JournalHeader({
  totalEntries,
  streak,
  weeklyEntries,
  averageMood,
  dailyPrompt,
  onCreate,
}: JournalHeaderProps) {
  return (
    <div className="space-y-6">
      {/* title row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-[1.9rem] md:text-[2.1rem] font-medium text-fg-strong tracking-[-0.02em] leading-tight">
            Journal
          </h1>
          <p className="text-sm text-fg-muted mt-0.5">
            {totalEntries > 0
              ? `${totalEntries} ${totalEntries === 1 ? "entry" : "entries"} and counting.`
              : "Your private space to reflect."}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          {streak > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-clay-50 border border-clay-100 rounded-full px-3 py-1.5">
              <FlameIcon className="w-3.5 h-3.5" />
              {streak}-day streak
            </span>
          )}
          <button
            onClick={onCreate}
            className="h-10 px-5 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-colors shadow-soft inline-flex items-center gap-1.5"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New entry
          </button>
        </div>
      </div>

      {/* daily prompt — matches dashboard affirmation card */}
      <div className="rounded-[1.4rem] bg-clay-50/60 border border-clay-100 p-4 md:p-5">
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-full bg-clay-200/60 text-clay-600 grid place-items-center shrink-0 mt-0.5">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </span>
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-clay-600 uppercase tracking-wider">
              Today's prompt
            </p>
            <p className="mt-0.5 text-sm md:text-base text-fg italic leading-relaxed font-medium">
              &ldquo;{dailyPrompt}&rdquo;
            </p>
          </div>
        </div>
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
