import { MoodIcon } from "./icons";
import type { JournalEntry } from "../services/journal";

const MOOD_META: Record<number, { label: string }> = {
  1: { label: "Rough" },
  2: { label: "Low" },
  3: { label: "Okay" },
  4: { label: "Good" },
  5: { label: "Great" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function readingTime(text: string) {
  return Math.max(
    1,
    Math.round((text.trim() ? text.trim().split(/\s+/).length : 0) / 200),
  );
}

interface JournalViewerProps {
  entry: JournalEntry;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function JournalViewer({
  entry,
  onBack,
  onEdit,
  onDelete,
}: JournalViewerProps) {
  const mood = entry.mood ? MOOD_META[entry.mood] : null;
  const rt = readingTime(entry.content);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-border shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-fg-muted hover:text-fg-strong transition-colors"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Journal
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="h-9 px-4 rounded-full text-sm font-semibold text-fg-muted hover:text-fg-strong hover:bg-surface-2 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="h-9 px-4 rounded-full text-sm font-semibold text-error hover:bg-error/10 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 md:px-8 py-7 md:py-9">
        <div className="max-w-prose mx-auto">
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-fg-muted">
            <span>{formatDate(entry.createdAt)}</span>
            <span>·</span>
            <span>{formatTime(entry.createdAt)}</span>
            {mood && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MoodIcon level={entry.mood!} className="w-3.5 h-3.5" />
                  {mood.label}
                </span>
              </>
            )}
            <span>·</span>
            <span>{rt} min read</span>
          </div>
          <h1 className="mt-6 font-display text-[1.9rem] sm:text-[2.1rem] font-medium tracking-[-0.02em] text-fg-strong leading-tight">
            {entry.title}
          </h1>
          <div className="mt-8 text-[1.05rem] leading-[1.8] text-fg whitespace-pre-wrap">
            {entry.content}
          </div>
        </div>
      </div>
    </div>
  );
}
