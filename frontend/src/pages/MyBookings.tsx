import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookings as store, isUpcoming, type Booking } from "../services/bookings";
import BookingCard from "../components/BookingCard";
import PageShell from "../components/PageShell";

type Tab = "upcoming" | "past" | "cancelled";

export default function MyBookings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [version, setVersion] = useState(0);

  const all = useMemo(() => store.list(), [version]);
  const grouped = useMemo(() => ({
    upcoming: all.filter(isUpcoming),
    past:     all.filter((b) => !b.cancelled && !isUpcoming(b)),
    cancelled:all.filter((b) => b.cancelled),
  }), [all]);

  const cancel = (id: string) => { store.cancel(id); setVersion((v) => v + 1); };
  const list: Booking[] = grouped[tab];
  const total = all.filter((b) => !b.cancelled).length;

  const empties: Record<Tab, { title: string; body: string }> = {
    upcoming:  { title: "No upcoming sessions",  body: "Book a session and it'll show up here."       },
    past:      { title: "No past sessions yet",  body: "Your completed sessions will appear here."    },
    cancelled: { title: "Nothing cancelled",     body: "Cancelled sessions live here."                },
  };

  const tabBar = (
    <div className="inline-flex rounded-xl bg-surface-2 p-1">
      {(["upcoming", "past", "cancelled"] as Tab[]).map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`h-9 px-5 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${tab === t ? "bg-surface text-fg-strong shadow-soft" : "text-fg-muted hover:text-fg"}`}
        >
          {t}
          {grouped[t].length > 0 && (
            <span className="ml-1.5 text-[11px] text-fg-muted">({grouped[t].length})</span>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <PageShell
      eyebrow="Your care"
      title="Sessions"
      subtitle={total > 0 ? `${total} session${total > 1 ? "s" : ""} booked` : "Book a session to get started."}
      action={
        <button
          onClick={() => navigate("/therapists")}
          className="h-10 px-5 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-all"
        >
          Book a session
        </button>
      }
      header={tabBar}
    >
      {list.length === 0 ? (
        <div className="rounded-[1.4rem] bg-surface border border-border/60 text-center py-20 px-6">
          <div className="mx-auto w-12 h-12 rounded-2xl surface-inset grid place-items-center text-accent">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <p className="mt-4 font-semibold text-fg-strong">{empties[tab].title}</p>
          <p className="mt-1 text-sm text-fg-muted">{empties[tab].body}</p>
          <button onClick={() => navigate("/therapists")} className="mt-5 h-10 px-5 rounded-full bg-accent text-primary-fg text-sm font-semibold hover:bg-accent-hover transition-colors">
            Browse therapists
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((b) => <BookingCard key={b.id} booking={b} kind={tab} onCancel={cancel} />)}
        </div>
      )}
    </PageShell>
  );
}
