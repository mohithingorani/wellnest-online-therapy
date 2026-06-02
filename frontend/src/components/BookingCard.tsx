import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Booking } from "../services/bookings";

function initials(name = "") {
  const p = name.replace(/^Dr\.?\s+/i, "").trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}
function prettyDate(d: string) {
  return new Date(`${d}T00:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
function prettyTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function BookingCard({ booking, kind, onCancel }: { booking: Booking; kind: "upcoming" | "past" | "cancelled"; onCancel?: (id: string) => void }) {
  const navigate = useNavigate();
  return (
    <div className="surface-raised rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-clay-300 to-clay-500 text-white grid place-items-center font-display font-semibold shrink-0">{initials(booking.therapistName)}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-fg-strong">{booking.therapistName}</div>
        <div className="text-sm text-fg-muted">{booking.sessionType} · {prettyDate(booking.date)} · {prettyTime(booking.time)}</div>
      </div>
      <div className="flex items-center gap-2">
        {kind === "upcoming" && (
          <>
            {booking.sessionType === "Video" && (
              <button onClick={() => navigate(`/session/${booking.id}`)} className="h-9 px-4 rounded-full bg-accent text-primary-fg text-sm font-semibold hover:bg-accent-hover transition-colors">Join</button>
            )}
            <button onClick={() => navigate(`/therapists/${booking.therapistId}/book`)} className="h-9 px-4 rounded-full ring-1 ring-border text-fg-strong text-sm font-medium hover:bg-surface-2 transition-colors">Reschedule</button>
            <button onClick={() => onCancel?.(booking.id)} className="h-9 px-4 rounded-full text-sm font-medium text-error hover:bg-error/10 transition-colors">Cancel</button>
          </>
        )}
        {kind === "past" && (
          <button onClick={() => navigate(`/therapists/${booking.therapistId}/book`)} className="h-9 px-4 rounded-full ring-1 ring-border text-fg-strong text-sm font-medium hover:bg-surface-2 transition-colors">Book again</button>
        )}
        {kind === "cancelled" && <span className="text-xs font-medium text-fg-muted rounded-full bg-surface-2 px-3 py-1">Cancelled</span>}
      </div>
    </div>
  );
}

export default memo(BookingCard);
