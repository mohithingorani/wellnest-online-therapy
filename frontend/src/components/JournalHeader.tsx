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
    <div className="space-y-7 md:space-y-8">
      {/* title row */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-clay-600">
            Your private space
          </p>
          <h1 className="mt-2 font-display text-[2rem] md:text-[2.5rem] font-medium text-fg-strong tracking-[-0.03em] leading-[1.02]">
            Journal
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            {totalEntries > 0
              ? `${totalEntries} ${totalEntries === 1 ? "reflection" : "reflections"} written so far.`
              : "Write freely. No one else can see this."}
          </p>
        </div>
        <button
          onClick={onCreate}
          className="group self-start h-11 pl-5 pr-5 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-all duration-300 shadow-[0_4px_12px_-6px_rgba(120,58,40,0.35)] inline-flex items-center gap-2"
        >
          <svg
            className="w-4 h-4 transition-transform duration-300"
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

      {/* Today's prompt — espresso editorial feature card */}
      <section className="relative overflow-hidden rounded-[1.6rem] card-feature p-6 md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-12 h-64 w-64 rounded-full bg-clay-500/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-ochre-500/15 blur-3xl"
        />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-ochre-300">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10l1.4 1.4M3 12h2m14 0h2M5.6 18.4l1.4-1.4m10-10l1.4-1.4"
                />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                Today&rsquo;s prompt
              </span>
            </div>
            <p className="mt-4 font-display text-[1.4rem] md:text-[1.7rem] leading-snug text-night-fg tracking-[-0.01em]">
              &ldquo;{dailyPrompt}&rdquo;
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {streak > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ochre-200 bg-white/8 border border-white/10 rounded-full px-3 py-2">
                <FlameIcon className="w-3.5 h-3.5" />
                {streak}-day streak
              </span>
            )}
            <button
              onClick={onCreate}
              className="h-11 px-5 rounded-full bg-ochre-300 text-night font-semibold text-sm hover:bg-ochre-200 transition-colors shadow-soft inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              Write about this
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <JournalStatsBar
        totalEntries={totalEntries}
        streak={streak}
        weeklyEntries={weeklyEntries}
        averageMood={averageMood}
      />
    </div>
  );
}
