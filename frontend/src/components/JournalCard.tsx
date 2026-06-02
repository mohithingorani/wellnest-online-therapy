import { MoodIcon } from "./icons";
import type { JournalEntry } from "../services/journal";

const MOOD_META: Record<number, { color: string; label: string }> = {
  1: { color: "bg-clay-400", label: "Rough" },
  2: { color: "bg-ochre-400", label: "Low" },
  3: { color: "bg-sage-400", label: "Okay" },
  4: { color: "bg-clay-500", label: "Good" },
  5: { color: "bg-accent", label: "Great" },
};

function smartDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
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
  onClick: () => void;
}

export default function JournalCard({ entry, onClick }: JournalCardProps) {
  const mood = entry.mood ? MOOD_META[entry.mood] : null;
  const wc = wordCount(entry.content);
  const rt = readingTime(entry.content);

  return (
    <button
      onClick={onClick}
      className="group relative surface-raised rounded-[1.4rem] p-5 transition-transform duration-300 hover:-translate-y-0.5 text-left w-full cursor-pointer"
    >
      {mood && <div className={`h-1 rounded-full w-12 mb-3 ${mood.color}`} />}
      <div className="flex items-center justify-between text-xs text-fg-muted">
        <span>{smartDate(entry.createdAt)}</span>
        <span className="flex items-center gap-1">
          {mood && <MoodIcon level={entry.mood!} className="w-3.5 h-3.5" />}
          {wc} words
        </span>
      </div>
      <h3 className="mt-2 font-display text-lg font-medium text-fg-strong leading-snug line-clamp-1">
        {entry.title}
      </h3>
      <p className="mt-1.5 text-sm text-fg-muted line-clamp-2 leading-relaxed">
        {entry.content}
      </p>
      <span className="mt-3 inline-block text-[10px] font-medium text-fg-muted bg-surface-2 rounded-full px-2 py-0.5">
        {rt} min read
      </span>
    </button>
  );
}
