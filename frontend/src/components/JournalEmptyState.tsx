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
    <div className="journal-canvas min-h-[calc(100vh-68px)]">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-68px)] px-6 py-14 animate-page">
        <div className="max-w-xl w-full text-center">
          <div className="w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-clay-300 to-ochre-300 text-white grid place-items-center mx-auto mb-6 shadow-[0_8px_20px_-10px_rgba(120,58,40,0.4)]">
            <svg
              className="w-9 h-9"
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

          <h2 className="font-display text-[2rem] md:text-[2.4rem] font-medium text-fg-strong tracking-[-0.03em] leading-[1.05]">
            Begin your journal
          </h2>
          <p className="mt-3 text-sm md:text-base text-fg-muted leading-relaxed max-w-md mx-auto">
            A few honest lines a day. Writing helps you process what you feel,
            track your growth, and notice the patterns over time.
          </p>

          {/* Today's prompt — espresso focal card */}
          <section className="relative overflow-hidden rounded-[1.6rem] card-feature p-6 md:p-7 mt-9 text-left">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-10 h-52 w-52 rounded-full bg-clay-500/25 blur-3xl"
            />
            <div className="relative">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ochre-300">
                Today&rsquo;s prompt
              </span>
              <p className="mt-3 font-display text-xl md:text-2xl leading-snug text-night-fg">
                &ldquo;{dailyPrompt}&rdquo;
              </p>
              <button
                onClick={onCreate}
                className="mt-5 h-11 px-5 rounded-full bg-ochre-300 text-night font-semibold text-sm hover:bg-ochre-200 transition-colors shadow-soft inline-flex items-center gap-1.5"
              >
                Write your first entry
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </section>

          <div className="mt-7 text-left">
            <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-[0.18em] mb-3">
              Or start from one of these
            </p>
            <div className="grid gap-3">
              {featured.map((prompt, i) => (
                <button
                  key={i}
                  onClick={onCreate}
                  className="group card-elevated card-lift w-full text-left p-4 flex items-center gap-3"
                >
                  <span className="w-8 h-8 rounded-full bg-clay-100 text-clay-600 grid place-items-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                  <span className="flex-1 text-sm text-fg font-display italic leading-snug">
                    &ldquo;{prompt}&rdquo;
                  </span>
                  <svg className="w-4 h-4 text-fg-muted/60 transition-all duration-300 group-hover:text-accent shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
