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
  const grouped = groupEntries(entries);

  return (
    <div className="space-y-8">
      {grouped.map(([label, groupEntries]) => (
        <div key={label}>
          <h2 className="font-display text-sm font-semibold text-fg-muted uppercase tracking-wider mb-3">
            {label}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {groupEntries.map((entry) => (
              <JournalCard
                key={entry.id}
                entry={entry}
                onClick={() => onSelect(entry)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
