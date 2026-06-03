import { useState, useRef, useEffect } from "react";
import { getDailyPrompt } from "../data/journalPrompts";
import { MoodIcon } from "./icons";

const MOOD_OPTIONS = [
  { v: 1, label: "Rough" },
  { v: 2, label: "Low" },
  { v: 3, label: "Okay" },
  { v: 4, label: "Good" },
  { v: 5, label: "Great" },
];

interface JournalEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialMood?: number | null;
  onSave: (data: { title: string; content: string; mood?: number }) => void;
  onCancel: () => void;
  saving?: boolean;
}

export default function JournalEditor({
  initialTitle = "",
  initialContent = "",
  initialMood,
  onSave,
  onCancel,
  saving,
}: JournalEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [mood, setMood] = useState<number | undefined>(
    initialMood ?? undefined,
  );
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const canSave = title.trim().length > 0 && content.trim().length > 0;
  const dailyPrompt = getDailyPrompt();

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-border shrink-0">
        <button
          onClick={onCancel}
          className="text-sm font-semibold text-fg-muted hover:text-fg-strong transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() =>
            onSave({
              title: title.trim(),
              content: content.trim(),
              mood,
            })
          }
          disabled={!canSave || saving}
          className="h-9 px-5 rounded-full bg-accent text-primary-fg text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 md:px-8 py-7 md:py-9">
        <div className="max-w-prose mx-auto space-y-6">
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title..."
            className="w-full bg-transparent font-display text-[1.9rem] sm:text-[2.1rem] font-medium tracking-[-0.02em] text-fg-strong placeholder-fg-muted/50 outline-none border-none"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent text-base sm:text-lg leading-relaxed text-fg placeholder-fg-muted/40 outline-none border-none resize-none min-h-[40vh]"
          />

          <div className="rounded-[1.4rem] bg-clay-50/60 border border-clay-100 px-4 py-3">
            <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-wider mb-1">
              Today's prompt
            </p>
            <p className="text-sm text-fg font-medium font-display italic">
              &ldquo;{dailyPrompt}&rdquo;
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-wider mb-2">
              How are you feeling?
            </p>
            <div className="flex items-center gap-2">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m.v}
                  onClick={() => setMood(mood === m.v ? undefined : m.v)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-sm transition-all ${
                    mood === m.v
                      ? "bg-accent/10 ring-2 ring-accent"
                      : "hover:bg-surface-2 text-fg-muted"
                  }`}
                >
                  <MoodIcon level={m.v} className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
