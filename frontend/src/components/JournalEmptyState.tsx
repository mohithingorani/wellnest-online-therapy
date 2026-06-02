import { getAllPrompts } from "../data/journalPrompts";

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getFeaturedPrompts(): string[] {
  const all = getAllPrompts();
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const indices = new Set<number>();
  let i = 1;
  while (indices.size < 3 && i < 100) {
    indices.add(Math.floor(seededRandom(seed + i) * all.length));
    i++;
  }
  return [...indices].map((idx) => all[idx]);
}

interface JournalEmptyStateProps {
  dailyPrompt: string;
  onCreate: () => void;
}

export default function JournalEmptyState({
  dailyPrompt,
  onCreate,
}: JournalEmptyStateProps) {
  const featured = getFeaturedPrompts();

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 animate-fade-in">
      <div className="max-w-lg w-full text-center">
        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-clay-200 to-ochre-200 text-clay-600 grid place-items-center mx-auto mb-6 shadow-soft">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>

        <h2 className="font-display text-2xl font-medium text-fg-strong mb-2">
          Start journaling
        </h2>
        <p className="text-sm text-fg-muted leading-relaxed max-w-sm mx-auto">
          Writing helps you process your thoughts, track your growth, and notice
          patterns over time.
        </p>

        <div className="mt-8 surface-raised rounded-2xl px-5 py-4 text-left">
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-1">
            Today's prompt
          </p>
          <p className="text-sm text-fg-strong font-display italic leading-relaxed">
            &ldquo;{dailyPrompt}&rdquo;
          </p>
        </div>

        <div className="mt-6 text-left">
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-3">
            More prompts to try
          </p>
          <div className="space-y-2">
            {featured.map((prompt, i) => (
              <button
                key={i}
                onClick={onCreate}
                className="w-full text-left p-3 rounded-xl bg-surface-2/50 ring-1 ring-border text-sm text-fg-strong hover:bg-surface-2 transition-colors font-display italic"
              >
                &ldquo;{prompt}&rdquo;
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onCreate}
          className="mt-8 h-12 px-8 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-colors shadow-soft"
        >
          Write your first entry
        </button>
      </div>
    </div>
  );
}
