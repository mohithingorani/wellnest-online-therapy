import { useMemo } from "react";
import JournalCard from "./JournalCard";
import type { JournalEntry } from "../services/journal";

function getWeekRanges() {
  const now = new Date();
  const day = now.getDay();
  const diffToMon = day === 0 ? 6 : day - 1;
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - diffToMon);
  thisMonday.setHours(0, 0, 0, 0);
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);
  return { thisMonday, lastMonday };
}

type GroupKey = "This Week" | "Last Week" | "Earlier";

function groupEntries(entries: JournalEntry[]): [GroupKey, JournalEntry[]][] {
  const { thisMonday, lastMonday } = getWeekRanges();
  const groups: Record<GroupKey, JournalEntry[]> = {
    "This Week": [],
    "Last Week": [],
    "Earlier": [],
  };
  for (const entry of entries) {
    const date = new Date(entry.createdAt);
    if (date >= thisMonday) {
      groups["This Week"].push(entry);
    } else if (date >= lastMonday) {
      groups["Last Week"].push(entry);
    } else {
      groups["Earlier"].push(entry);
    }
  }
  return (Object.entries(groups) as [GroupKey, JournalEntry[]][]).filter(
    ([, es]) => es.length > 0,
  );
}

interface JournalFeedProps {
  entries: JournalEntry[];
  onSelect: (entry: JournalEntry) => void;
}

export default function JournalFeed({ entries, onSelect }: JournalFeedProps) {
  const grouped = useMemo(() => groupEntries(entries), [entries]);

  return (
    <div className="space-y-9">
      {grouped.map(([label, groupEntries]) => (
        <div key={label}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-[11px] font-semibold text-fg-strong uppercase tracking-[0.18em]">
              {label}
            </h2>
            <span className="text-[11px] font-semibold text-fg-muted bg-surface-2 rounded-full px-2 py-0.5">
              {groupEntries.length}
            </span>
            <span className="flex-1 h-px bg-border/70" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-4">
            {groupEntries.map((entry) => (
              <JournalCard
                key={entry.id}
                entry={entry}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
