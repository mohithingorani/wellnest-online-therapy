import { memo } from "react";
import type { JournalEntry } from "../services/journal";

const MOOD_META: Record<
  number,
  { dot: string; pill: string; label: string }
> = {
  1: { dot: "bg-clay-400", pill: "bg-clay-50 text-clay-700", label: "Rough" },
  2: { dot: "bg-ochre-400", pill: "bg-ochre-100 text-ochre-600", label: "Low" },
  3: { dot: "bg-sage-400", pill: "bg-sage-100 text-sage-600", label: "Okay" },
  4: { dot: "bg-clay-500", pill: "bg-clay-100 text-clay-700", label: "Good" },
  5: { dot: "bg-accent", pill: "bg-clay-100 text-accent", label: "Great" },
};

function smartDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const days = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function readingTime(text: string) {
  return Math.max(1, Math.round(wordCount(text) / 200));
}

interface JournalCardProps {
  entry: JournalEntry;
  onSelect: (entry: JournalEntry) => void;
}

const JournalCard = memo(function JournalCard({ entry, onSelect }: JournalCardProps) {
  const mood = entry.mood ? MOOD_META[entry.mood] : null;
  const wc = wordCount(entry.content);
  const rt = readingTime(entry.content);

  return (
    <button
      onClick={() => onSelect(entry)}
      className="group card-elevated card-lift text-left w-full p-5 md:p-6 flex flex-col cursor-pointer"
    >
      <div className="flex items-center justify-between gap-3">
        {mood ? (
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full pl-1.5 pr-2.5 py-1 ${mood.pill}`}
          >
            <span className={`h-2 w-2 rounded-full ${mood.dot}`} />
            {mood.label}
          </span>
        ) : (
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-fg-muted">
            Note
          </span>
        )}
        <span className="text-xs font-medium text-fg-muted">
          {smartDate(entry.createdAt)}
        </span>
      </div>

      <h3 className="mt-3.5 font-display text-lg md:text-[1.2rem] font-medium text-fg-strong leading-snug line-clamp-1 transition-colors group-hover:text-accent">
        {entry.title}
      </h3>
      <p className="mt-2 text-sm text-fg-muted leading-relaxed line-clamp-2 flex-1">
        {entry.content}
      </p>

      <div className="mt-4 pt-3.5 border-t border-border/70 flex items-center gap-2.5 text-[11px] font-medium text-fg-muted">
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h10M4 17h7" />
          </svg>
          {wc} words
        </span>
        <span className="h-1 w-1 rounded-full bg-border" />
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {rt} min read
        </span>
        <svg
          className="w-4 h-4 ml-auto text-fg-muted/60 transition-all duration-300 group-hover:text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
});

export default JournalCard;
