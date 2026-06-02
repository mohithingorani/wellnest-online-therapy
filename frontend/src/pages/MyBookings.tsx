import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookings as store, isUpcoming, type Booking } from "../services/bookings";
import BookingCard from "../components/BookingCard";

type Tab = "upcoming" | "past" | "cancelled";

export default function MyBookings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [version, setVersion] = useState(0); // re-read after cancel

  const all = useMemo(() => store.list(), [version]);
  const grouped = useMemo(() => ({
    upcoming: all.filter((b) => isUpcoming(b)),
    past: all.filter((b) => !b.cancelled && !isUpcoming(b)),
    cancelled: all.filter((b) => b.cancelled),
  }), [all]);

  const cancel = (id: string) => { store.cancel(id); setVersion((v) => v + 1); };
  const list: Booking[] = grouped[tab];

  const empties: Record<Tab, { title: string; body: string }> = {
    upcoming: { title: "No upcoming sessions", body: "Book a session and it'll show up here." },
    past: { title: "No past sessions yet", body: "Your completed sessions will appear here." },
    cancelled: { title: "Nothing cancelled", body: "Cancelled sessions live here." },
  };

  const total = all.filter((b) => !b.cancelled).length;

  return (
    <div className="flex-1 bg-bg">
      <div className="mx-auto max-w-[1180px] px-5 md:px-8 py-7 md:py-9">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-display text-[1.9rem] md:text-[2.1rem] font-medium text-fg-strong tracking-[-0.02em] leading-tight">Your sessions</h1>
            <p className="text-sm text-fg-muted mt-0.5">{total > 0 ? `${total} session${total > 1 ? "s" : ""} booked` : "Book a session to get started."}</p>
          </div>
          <button onClick={() => navigate("/therapists")} className="self-start h-10 px-5 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-colors shadow-soft">Book a session</button>
        </div>

        <div className="mt-6 inline-flex rounded-full bg-surface-2 p-1">
          {(["upcoming", "past", "cancelled"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`h-9 px-5 rounded-full text-sm font-semibold capitalize transition-colors ${tab === t ? "bg-surface text-fg-strong shadow-soft" : "text-fg-muted hover:text-fg-strong"}`}>
              {t} {grouped[t].length > 0 && <span className="text-fg-muted">({grouped[t].length})</span>}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {list.length === 0 ? (
            <div className="surface-raised rounded-[1.4rem] text-center py-16 px-6">
              <div className="mx-auto w-12 h-12 rounded-2xl surface-inset grid place-items-center text-accent">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="mt-4 font-semibold text-fg-strong">{empties[tab].title}</p>
              <p className="mt-1 text-sm text-fg-muted">{empties[tab].body}</p>
              <button onClick={() => navigate("/therapists")} className="mt-4 h-10 px-5 rounded-full bg-accent text-primary-fg text-sm font-semibold hover:bg-accent-hover transition-colors">Browse therapists</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {list.map((b) => <BookingCard key={b.id} booking={b} kind={tab} onCancel={cancel} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
