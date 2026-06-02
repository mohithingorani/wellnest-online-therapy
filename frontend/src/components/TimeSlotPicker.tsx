interface TimeSlotPickerProps {
  date: string; // YYYY-MM-DD — used to derive deterministic availability
  value: string | null;
  onChange: (time: string) => void;
}

const SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

/* Deterministic "availability" from the date string so it's stable per day
   (real availability comes from the backend later). */
function unavailable(date: string, time: string) {
  let h = 0;
  for (const ch of date + time) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % 3 === 0;
}

function label(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function TimeSlotPicker({ date, value, onChange }: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
      {SLOTS.map((t) => {
        const off = unavailable(date, t);
        const selected = value === t;
        return (
          <button
            key={t}
            type="button"
            disabled={off}
            onClick={() => onChange(t)}
            className={`h-11 rounded-xl text-sm font-medium border transition-colors ${
              selected
                ? "bg-accent text-primary-fg border-accent"
                : off
                ? "border-border text-fg-muted/30 line-through cursor-not-allowed"
                : "border-border text-fg-strong bg-surface hover:border-accent"
            }`}
          >
            {label(t)}
          </button>
        );
      })}
    </div>
  );
}
