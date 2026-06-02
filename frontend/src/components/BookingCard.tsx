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
function dayParts(d: string) {
  const date = new Date(`${d}T00:00`);
  return {
    month: date.toLocaleDateString(undefined, { month: "short" }).toUpperCase(),
    day: date.getDate(),
  };
}

function BookingCard({ booking, kind, onCancel }: { booking: Booking; kind: "upcoming" | "past" | "cancelled"; onCancel?: (id: string) => void }) {
  const navigate = useNavigate();
  const { month, day } = dayParts(booking.date);
  const isVideo = booking.sessionType === "Video";

  return (
    <div className="surface-raised rounded-[1.4rem] p-5 md:p-6 flex flex-col transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        {/* date block */}
        <div className={`shrink-0 w-14 rounded-2xl grid place-items-center py-2 text-center ${kind === "cancelled" ? "surface-inset text-fg-muted" : "bg-clay-50 border border-clay-100 text-clay-700"}`}>
          <div className="text-[10px] font-semibold uppercase tracking-wider leading-none">{month}</div>
          <div className="font-display text-xl font-semibold leading-tight mt-0.5">{day}</div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-clay-300 to-clay-500 text-white grid place-items-center font-display text-xs font-semibold shrink-0">{initials(booking.therapistName)}</div>
            <div className="font-semibold text-fg-strong truncate">{booking.therapistName}</div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-sm text-fg-muted">
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-fg">
              {isVideo ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              )}
              {booking.sessionType}
            </span>
            <span>{prettyTime(booking.time)}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border flex items-center gap-2">
        {kind === "upcoming" && (
          <>
            {isVideo && (
              <button onClick={() => navigate(`/session/${booking.id}`)} className="h-9 px-4 rounded-full bg-accent text-primary-fg text-sm font-semibold hover:bg-accent-hover transition-colors">Join</button>
            )}
            <button onClick={() => navigate(`/therapists/${booking.therapistId}/book`)} className="h-9 px-4 rounded-full ring-1 ring-border text-fg-strong text-sm font-medium hover:bg-surface-2 transition-colors">Reschedule</button>
            <button onClick={() => onCancel?.(booking.id)} className="h-9 px-4 rounded-full text-sm font-medium text-error hover:bg-error/10 transition-colors ml-auto">Cancel</button>
          </>
        )}
        {kind === "past" && (
          <>
            <span className="text-xs font-medium text-fg-muted">{prettyDate(booking.date)}</span>
            <button onClick={() => navigate(`/therapists/${booking.therapistId}/book`)} className="h-9 px-4 rounded-full ring-1 ring-border text-fg-strong text-sm font-medium hover:bg-surface-2 transition-colors ml-auto">Book again</button>
          </>
        )}
        {kind === "cancelled" && (
          <>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted rounded-full bg-surface-2 px-3 py-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              Cancelled
            </span>
            <button onClick={() => navigate(`/therapists/${booking.therapistId}/book`)} className="h-9 px-4 rounded-full ring-1 ring-border text-fg-strong text-sm font-medium hover:bg-surface-2 transition-colors ml-auto">Rebook</button>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(BookingCard);
