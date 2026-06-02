import { useCallback, useEffect, useMemo, useState } from "react";
import { journalService, type JournalEntry } from "../services/journal";
import { getDailyPrompt } from "../data/journalPrompts";
import JournalHeader from "../components/JournalHeader";
import JournalFeed from "../components/JournalFeed";
import JournalViewer from "../components/JournalViewer";
import JournalEditor from "../components/JournalEditor";
import JournalEmptyState from "../components/JournalEmptyState";

type ViewMode = "list" | "view" | "edit" | "create";

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const dailyPrompt = useMemo(() => getDailyPrompt(), []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, streakRes] = await Promise.all([
        journalService.list(),
        journalService.getStreak(),
      ]);
      if (listRes.success && listRes.data) {
        setEntries(listRes.data.entries);
      }
      if (streakRes.success && streakRes.data) {
        setStreak(streakRes.data.streak);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredEntries = useMemo(
    () =>
      search.trim()
        ? entries.filter(
            (e) =>
              e.title.toLowerCase().includes(search.toLowerCase()) ||
              e.content.toLowerCase().includes(search.toLowerCase()),
          )
        : entries,
    [entries, search],
  );

  const stats = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diffToMon = day === 0 ? 6 : day - 1;
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() - diffToMon);
    thisMonday.setHours(0, 0, 0, 0);

    const weekly = entries.filter(
      (e) => new Date(e.createdAt) >= thisMonday,
    ).length;
    const moods = entries
      .filter((e) => e.mood !== null)
      .map((e) => e.mood!);
    const avg =
      moods.length > 0
        ? moods.reduce((a, b) => a + b, 0) / moods.length
        : null;

    return { weeklyEntries: weekly, averageMood: avg };
  }, [entries]);

  const selectEntry = useCallback((entry: JournalEntry) => {
    setActiveEntry(entry);
    setViewMode("view");
  }, []);

  const startCreate = useCallback(() => {
    setActiveEntry(null);
    setViewMode("create");
  }, []);

  const startEdit = useCallback(() => {
    setViewMode("edit");
  }, []);

  const handleSave = useCallback(
    async (data: { title: string; content: string; mood?: number }) => {
      setSaving(true);
      try {
        if (viewMode === "create") {
          const res = await journalService.create(data);
          if (res.success && res.data) {
            setEntries((prev) => [res.data!, ...prev]);
            setActiveEntry(res.data);
            setViewMode("view");
          }
        } else if (viewMode === "edit" && activeEntry) {
          const res = await journalService.update(activeEntry.id, data);
          if (res.success && res.data) {
            setEntries((prev) =>
              prev.map((e) => (e.id === res.data!.id ? res.data! : e)),
            );
            setActiveEntry(res.data);
            setViewMode("view");
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setSaving(false);
      }
    },
    [viewMode, activeEntry],
  );

  const handleDelete = useCallback(async () => {
    if (!activeEntry) return;
    try {
      await journalService.delete(activeEntry.id);
      setEntries((prev) => prev.filter((e) => e.id !== activeEntry.id));
      setActiveEntry(null);
      setViewMode("list");
      setDeleteConfirm(false);
    } catch (err: any) {
      setError(err.message);
    }
  }, [activeEntry]);

  const goBack = useCallback(() => {
    if (viewMode === "edit" && activeEntry) {
      setViewMode("view");
    } else {
      setViewMode("list");
      setActiveEntry(null);
    }
  }, [viewMode, activeEntry]);

  if (loading) {
    return (
      <div className="h-full p-6">
        <div className="animate-pulse space-y-6 max-w-4xl">
          <div className="h-8 w-32 rounded bg-surface-2" />
          <div className="h-20 rounded-2xl bg-surface-2" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-surface-2" />
            ))}
          </div>
          <div className="space-y-4 mt-8">
            <div className="h-4 w-24 rounded bg-surface-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-surface-2" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-error/10 text-error grid place-items-center mx-auto mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="font-display text-lg font-medium text-fg-strong mb-1">
            Couldn't load your journal
          </h3>
          <p className="text-sm text-fg-muted mb-4">{error}</p>
          <button
            onClick={load}
            className="h-10 px-5 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (viewMode === "view" && activeEntry) {
    return (
      <div className="h-full flex flex-col">
        <JournalViewer
          entry={activeEntry}
          onBack={goBack}
          onEdit={startEdit}
          onDelete={() => setDeleteConfirm(true)}
        />
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/20 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface rounded-2xl shadow-lift p-6 max-w-sm w-full mx-4 animate-scale-in">
              <div className="w-12 h-12 rounded-full bg-error/10 text-error grid place-items-center mx-auto mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="font-display text-lg font-medium text-fg-strong text-center mb-1">
                Delete entry?
              </h3>
              <p className="text-sm text-fg-muted text-center mb-6">
                This can't be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="h-10 px-5 rounded-full ring-1 ring-border text-fg-strong text-sm font-semibold hover:bg-surface-2 transition-colors"
                >
                  Keep it
                </button>
                <button
                  onClick={handleDelete}
                  className="h-10 px-5 rounded-full bg-error text-white text-sm font-semibold hover:bg-error/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (viewMode === "create" || viewMode === "edit") {
    return (
      <div className="h-full">
        <JournalEditor
          initialTitle={viewMode === "edit" ? activeEntry?.title : ""}
          initialContent={viewMode === "edit" ? activeEntry?.content : ""}
          initialMood={
            viewMode === "edit" ? activeEntry?.mood ?? null : undefined
          }
          onSave={handleSave}
          onCancel={goBack}
          saving={saving}
        />
      </div>
    );
  }

  if (entries.length === 0 && !search) {
    return (
      <JournalEmptyState dailyPrompt={dailyPrompt} onCreate={startCreate} />
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 sm:px-6 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <JournalHeader
          totalEntries={entries.length}
          streak={streak}
          weeklyEntries={stats.weeklyEntries}
          averageMood={stats.averageMood}
          dailyPrompt={dailyPrompt}
        />

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entries..."
              className="w-full h-10 pl-10 pr-4 rounded-full surface-inset text-sm text-fg-strong placeholder-fg-muted outline-none focus:ring-2 focus:ring-accent/30 transition-all"
            />
          </div>
          <button
            onClick={startCreate}
            className="h-10 px-5 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-colors shadow-soft shrink-0 flex items-center gap-1.5"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Entry
          </button>
        </div>

        {search && filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-2 text-fg-muted grid place-items-center mb-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-fg-strong">
              No results found
            </p>
            <p className="text-xs text-fg-muted mt-1">
              Try a different search term
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-xs font-semibold text-accent hover:text-accent-hover"
            >
              Clear search
            </button>
          </div>
        ) : (
          <JournalFeed entries={filteredEntries} onSelect={selectEntry} />
        )}

        {error && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-error text-white text-sm font-medium shadow-lift animate-fade-in-up">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 p-1 hover:bg-white/20 rounded-full"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
