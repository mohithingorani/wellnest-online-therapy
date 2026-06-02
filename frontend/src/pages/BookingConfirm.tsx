import { useParams, useNavigate, Link } from "react-router-dom";
import { bookings } from "../services/bookings";

function fmtUTC(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}
function prettyDate(d: string) {
  return new Date(`${d}T00:00`).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}
function prettyTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default function BookingConfirm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const booking = id ? bookings.get(id) : undefined;

  if (!booking) {
    return (
      <div className="bg-bg min-h-[70vh] grid place-items-center text-center px-4">
        <div>
          <h1 className="font-display text-2xl text-fg-strong">Booking not found</h1>
          <button onClick={() => navigate("/bookings")} className="mt-4 h-11 px-6 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-colors">My bookings</button>
        </div>
      </div>
    );
  }

  const start = new Date(`${booking.date}T${booking.time}`);
  const end = new Date(start.getTime() + booking.durationMin * 60000);
  const title = `WellNest session with ${booking.therapistName}`;
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmtUTC(start)}/${fmtUTC(end)}`;
  const ics = "data:text/calendar;charset=utf-8," + encodeURIComponent(
    ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", `DTSTART:${fmtUTC(start)}`, `DTEND:${fmtUTC(end)}`, `SUMMARY:${title}`, "END:VEVENT", "END:VCALENDAR"].join("\n")
  );

  return (
    <div className="bg-bg min-h-[80vh]">
      <div className="mx-auto max-w-[620px] px-5 md:px-8 py-16 md:py-20 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-success/15 text-success grid place-items-center animate-scale-in">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="mt-6 font-display text-3xl md:text-4xl font-medium text-fg-strong tracking-[-0.02em]">You're booked in.</h1>
        <p className="mt-2 text-fg-muted">A confirmation has been sent to your email. We'll remind you before it starts.</p>

        <div className="mt-8 surface-raised rounded-2xl p-6 text-left">
          <dl className="space-y-3">
            {[["Therapist", booking.therapistName], ["Session", booking.sessionType], ["Date", prettyDate(booking.date)], ["Time", `${prettyTime(booking.time)} · ${booking.durationMin} min`]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <dt className="text-sm text-fg-muted">{k}</dt>
                <dd className="text-sm font-semibold text-fg-strong text-right">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            <a href={gcal} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full ring-1 ring-border text-sm font-medium text-fg-strong hover:bg-surface-2 transition-colors">Google Calendar</a>
            <a href={ics} download="wellnest-session.ics" className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full ring-1 ring-border text-sm font-medium text-fg-strong hover:bg-surface-2 transition-colors">Apple / .ics</a>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          {booking.sessionType === "Video" && (
            <button onClick={() => navigate(`/session/${booking.id}`)} className="h-12 px-7 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-colors shadow-soft">Join session</button>
          )}
          <Link to="/bookings" className="inline-flex items-center justify-center h-12 px-7 rounded-full ring-1 ring-border text-fg-strong font-semibold text-sm hover:bg-surface transition-colors">View my bookings</Link>
        </div>
      </div>
    </div>
  );
}
