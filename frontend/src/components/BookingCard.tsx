import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Booking } from "../services/bookings";

function initials(name = "") {
  const p = name.replace(/^Dr\.?\s+/i, "").trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
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
    weekday: date.toLocaleDateString(undefined, { weekday: "long" }),
  };
}
function getUrgency(date: string, time: string): "imminent" | "today" | "tomorrow" | "soon" | "normal" {
  const session = new Date(`${date}T${time}`);
  const now = new Date();
  const msUntil = session.getTime() - now.getTime();
  const hrsUntil = msUntil / 3_600_000;
  if (msUntil < 0) return "normal";
  if (hrsUntil <= 4) return "imminent";
  if (hrsUntil <= 24) return "today";
  if (hrsUntil <= 48) return "tomorrow";
  if (hrsUntil <= 168) return "soon";
  return "normal";
}

const SESSION_TYPE_META: Record<string, { icon: string; label: string; color: string }> = {
  Video:     { icon: "video", label: "Video",     color: "text-sage-600 bg-sage-50 border-sage-200" },
  Phone:     { icon: "phone", label: "Phone",     color: "text-ochre-700 bg-ochre-50 border-ochre-200" },
  "In-person": { icon: "location", label: "In-person", color: "text-fg-muted bg-surface-2 border-border" },
};

function BookingCard({ booking, kind, onCancel }: {
  booking: Booking; kind: "upcoming" | "past" | "cancelled"; onCancel?: (id: string) => void;
}) {
  const navigate = useNavigate();
  const { month, day, weekday } = dayParts(booking.date);
  const urgency = kind === "upcoming" ? getUrgency(booking.date, booking.time) : "normal";
  const sessionMeta = SESSION_TYPE_META[booking.sessionType] ?? SESSION_TYPE_META.Video;
  const isImminent = urgency === "imminent" || urgency === "today";

  /* Card wrapper — state drives the whole visual */
  const cardCls = [
    "rounded-[1.5rem] overflow-hidden flex transition-all duration-300",
    kind === "cancelled"
      ? "opacity-55 ring-1 ring-error/20 bg-surface"
      : isImminent
        ? "ring-1 ring-accent/35 bg-accent/[0.04] hover:shadow-[0_8px_28px_-12px_rgba(192,97,63,0.35)]"
        : "surface-raised hover:shadow-[0_8px_28px_-16px_rgba(47,58,50,0.22)] hover:-translate-y-0.5",
  ].join(" ");

  /* Date column — state drives its fill */
  const dateCls = [
    "shrink-0 w-[72px] flex flex-col items-center justify-center gap-0.5 py-5 border-r",
    kind === "cancelled"
      ? "bg-surface-2 border-border text-fg-muted"
      : isImminent
        ? "bg-accent border-accent/30 text-primary-fg"
        : "bg-surface-2 border-border text-fg-muted",
  ].join(" ");

  return (
    <div className={cardCls}>
      {/* left — date hero */}
      <div className={dateCls}>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] leading-none opacity-80">{month}</span>
        <span className="font-display text-[2rem] font-semibold leading-none mt-1">{day}</span>
        {isImminent && urgency === "imminent" && (
          <span className="mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-soft" />
            <span className="text-[9px] font-bold uppercase tracking-wide text-white/80">Live</span>
          </span>
        )}
      </div>

      {/* right — session detail */}
      <div className="flex-1 min-w-0 px-4 py-4 flex flex-col justify-between">
        <div>
          {/* urgency badge */}
          {kind === "upcoming" && urgency !== "normal" && urgency !== "soon" && (
            <span className={`inline-block text-[11px] font-semibold mb-2 ${isImminent ? "text-accent" : "text-ochre-600"}`}>
              {urgency === "imminent" ? "● Starting soon" : urgency === "today" ? "● Today" : "● Tomorrow"}
            </span>
          )}

          {/* therapist */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 text-white grid place-items-center font-display text-[11px] font-semibold shrink-0">
              {initials(booking.therapistName)}
            </div>
            <span className="font-semibold text-fg-strong text-sm truncate">{booking.therapistName}</span>
          </div>

          {/* meta row */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${sessionMeta.color}`}>
               {sessionMeta.label}
            </span>
            <span className="text-xs text-fg-muted">{prettyTime(booking.time)}</span>
            {kind === "upcoming" && (
              <span className="text-[11px] text-fg-muted/60">{weekday}</span>
            )}
          </div>
        </div>

        {/* actions */}
        <div className="mt-3 flex items-center gap-2">
          {kind === "upcoming" && (
            <>
              {booking.sessionType === "Video" && (
                <button
                  onClick={() => navigate(`/session/${booking.id}`)}
                  className="h-8 px-3.5 rounded-full bg-accent text-primary-fg text-xs font-semibold hover:bg-accent-hover transition-colors"
                >
                  Join
                </button>
              )}
              <button
                onClick={() => navigate(`/therapists/${booking.therapistId}/book`)}
                className="h-8 px-3.5 rounded-full ring-1 ring-border text-fg-strong text-xs font-medium hover:bg-surface-2 transition-colors"
              >
                Reschedule
              </button>
              <button
                onClick={() => onCancel?.(booking.id)}
                className="h-8 px-3 rounded-full text-xs font-medium text-error hover:bg-error/10 transition-colors ml-auto"
              >
                Cancel
              </button>
            </>
          )}
          {kind === "past" && (
            <button
              onClick={() => navigate(`/therapists/${booking.therapistId}/book`)}
              className="h-8 px-3.5 rounded-full ring-1 ring-border text-fg-strong text-xs font-medium hover:bg-surface-2 transition-colors"
            >
              Book again
            </button>
          )}
          {kind === "cancelled" && (
            <>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-fg-muted rounded-full bg-surface-2 px-3 py-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                Cancelled
              </span>
              <button
                onClick={() => navigate(`/therapists/${booking.therapistId}/book`)}
                className="h-8 px-3.5 rounded-full ring-1 ring-border text-fg-strong text-xs font-medium hover:bg-surface-2 transition-colors ml-auto"
              >
                Rebook
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(BookingCard);
