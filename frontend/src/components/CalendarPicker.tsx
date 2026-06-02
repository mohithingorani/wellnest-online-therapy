import { useState } from "react";

interface CalendarPickerProps {
  value: string | null; // YYYY-MM-DD
  onChange: (date: string) => void;
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CalendarPicker({ value, onChange }: CalendarPickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const canGoBack = view > new Date(today.getFullYear(), today.getMonth(), 1);

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div className="surface-inset rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          disabled={!canGoBack}
          onClick={() => setView(new Date(year, month - 1, 1))}
          className="w-8 h-8 grid place-items-center rounded-full hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-4 h-4 text-fg" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="font-display font-medium text-fg-strong">{MONTHS[month]} {year}</span>
        <button
          type="button"
          onClick={() => setView(new Date(year, month + 1, 1))}
          className="w-8 h-8 grid place-items-center rounded-full hover:bg-surface transition-colors"
          aria-label="Next month"
        >
          <svg className="w-4 h-4 text-fg" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-fg-muted mb-1">
        {DAYS.map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const di = iso(d);
          const past = d < today;
          const weekend = d.getDay() === 0;
          const disabled = past || weekend;
          const selected = value === di;
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onChange(di)}
              className={`aspect-square rounded-xl text-sm font-medium transition-colors ${
                selected
                  ? "bg-accent text-primary-fg"
                  : disabled
                  ? "text-fg-muted/30 cursor-not-allowed"
                  : "text-fg-strong hover:bg-surface"
              }`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
