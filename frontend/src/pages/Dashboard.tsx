import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { bookings as bStore, isUpcoming, type Booking } from "../services/bookings";
import { moods as mStore, MOODS, type MoodEntry } from "../services/moods";
import MoodChart from "../components/MoodChart";

function firstName(name?: string) {
  const f = name?.trim().split(" ")[0] || "";
  return f ? f[0].toUpperCase() + f.slice(1) : "there";
}
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}
function initials(name = "") {
  const p = name.replace(/^Dr\.?\s+/i, "").trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}
function prettyDate(d: string) { return new Date(`${d}T00:00`).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }); }
function prettyTime(t: string) { const [h, m] = t.split(":").map(Number); return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`; }
function countdown(b: Booking) {
  const ms = new Date(`${b.date}T${b.time}`).getTime() - Date.now();
  const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000);
  return d >= 1 ? `in ${d} day${d > 1 ? "s" : ""}` : h >= 1 ? `in ${h}h` : "soon";
}
function mouth(v: number) { return `M8.5 14 Q 12 ${14 + (v - 3) * 2} 15.5 14`; }

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showVerify, setShowVerify] = useState(params.get("welcome") === "1");
  const [series, setSeries] = useState<MoodEntry[]>([]);
  const [todayMood, setTodayMood] = useState<number | null>(null);

  useEffect(() => {
    setSeries(mStore.series());
    setTodayMood(mStore.today()?.value ?? null);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const all = useMemo(() => bStore.list(), []);
  const upcoming = useMemo(() => all.filter(isUpcoming), [all]);
  const past = useMemo(() => all.filter((b) => !b.cancelled && !isUpcoming(b)), [all]);
  const next = upcoming[0];
  const therapist = (next || upcoming[0] || past[0])?.therapistName;

  const streak = mStore.streak();
  const recent = series.slice(-7);
  const prev = series.slice(-14, -7);
  const avg = (a: MoodEntry[]) => (a.length ? a.reduce((s, e) => s + e.value, 0) / a.length : 0);
  const delta = recent.length && prev.length ? Math.round(((avg(recent) - avg(prev)) / avg(prev)) * 100) : 0;
  const avgMood = MOODS.find((m) => m.v === Math.round(avg(series)))?.label ?? "—";

  const logMood = (v: number) => { setSeries(mStore.log(v)); setTodayMood(v); };
  const dismissVerify = () => { setShowVerify(false); params.delete("welcome"); setParams(params, { replace: true }); };

  if (loading) return <DashSkeleton />;

  return (
    <div className="mx-auto max-w-[1180px] px-5 md:px-8 py-7 md:py-9">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-[1.9rem] md:text-[2.1rem] font-medium text-fg-strong tracking-[-0.02em] leading-tight">{greeting()}, {firstName(user?.name)}.</h1>
          <p className="text-sm text-fg-muted mt-0.5">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <button onClick={() => navigate("/therapists")} className="self-start h-10 px-5 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-colors shadow-soft">Find a therapist</button>
      </div>

      {showVerify && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-ochre-100 border border-ochre-300/60 p-3.5 animate-fade-in-up">
          <svg className="w-5 h-5 text-ochre-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <p className="flex-1 text-sm text-fg"><b className="text-fg-strong">Verify your email.</b> We sent a link to {user?.email || "your inbox"}.</p>
          <button onClick={dismissVerify} aria-label="Dismiss" className="text-fg-muted hover:text-fg-strong"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
      )}

      {/* BENTO */}
      <div className="mt-6 grid lg:grid-cols-3 gap-4 md:gap-5">
        {/* CHECK-IN (hero) */}
        <Tile className="lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-xl text-fg-strong">How are you feeling today?</h2>
              <p className="text-sm text-fg-muted mt-0.5">{todayMood ? `You checked in as "${MOODS.find((m) => m.v === todayMood)?.label}" — update anytime.` : "A quick check-in helps you notice patterns over time."}</p>
            </div>
            {streak > 0 && <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-clay-50 border border-clay-100 rounded-full px-3 py-1.5">🔥 {streak}-day streak</span>}
          </div>
          <div className="mt-6 flex justify-between gap-2 max-w-md">
            {MOODS.map((m) => {
              const sel = todayMood === m.v;
              return (
                <button key={m.v} onClick={() => logMood(m.v)} className="flex flex-col items-center gap-2 group focus-visible:outline-none">
                  <span className={`w-12 h-12 md:w-14 md:h-14 rounded-full grid place-items-center transition-all duration-200 group-hover:scale-110 ${sel ? `bg-gradient-to-br ${m.tone} text-white shadow-soft scale-110 ring-2 ring-accent/30` : "surface-inset text-fg-muted group-hover:text-fg"}`}>
                    <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" />
                      <circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none" />
                      <path strokeLinecap="round" d={mouth(m.v)} />
                    </svg>
                  </span>
                  <span className={`text-[11px] md:text-xs font-medium ${sel ? "text-fg-strong" : "text-fg-muted"}`}>{m.label}</span>
                </button>
              );
            })}
          </div>
        </Tile>

        {/* NEXT SESSION */}
        {next ? (
          <Tile dark className="lg:col-span-1 relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute -top-12 -right-8 h-40 w-40 rounded-full bg-clay-500/30 blur-3xl" />
            <div className="relative">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ochre-300">Next session · {countdown(next)}</span>
              <div className="mt-3 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-ochre-300 to-clay-400 text-night grid place-items-center font-display font-semibold">{initials(next.therapistName)}</div>
                <div className="min-w-0"><div className="font-semibold truncate">{next.therapistName}</div><div className="text-xs text-night-muted">{next.sessionType} · {prettyTime(next.time)}</div></div>
              </div>
              <div className="text-xs text-night-muted mt-2">{prettyDate(next.date)}</div>
              <div className="mt-4 flex gap-2">
                {next.sessionType === "Video" && <button onClick={() => navigate(`/session/${next.id}`)} className="h-9 px-4 rounded-full bg-ochre-300 text-night text-sm font-semibold hover:bg-ochre-200 transition-colors">Join</button>}
                <button onClick={() => navigate("/bookings")} className="h-9 px-4 rounded-full ring-1 ring-night-border text-night-fg text-sm font-medium hover:bg-night-2 transition-colors">Details</button>
              </div>
            </div>
          </Tile>
        ) : (
          <Tile className="lg:col-span-1 flex flex-col items-center justify-center text-center">
            <div className="w-11 h-11 rounded-2xl surface-inset grid place-items-center text-accent"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
            <p className="mt-3 font-semibold text-fg-strong text-sm">No sessions yet</p>
            <p className="mt-1 text-xs text-fg-muted">Book your first when you're ready.</p>
            <button onClick={() => navigate("/therapists")} className="mt-3 h-9 px-4 rounded-full bg-accent text-primary-fg text-sm font-semibold hover:bg-accent-hover transition-colors">Find a therapist</button>
          </Tile>
        )}

        {/* MOOD TREND */}
        <Tile className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-xl text-fg-strong">Your wellbeing</h2>
              {delta !== 0 && (
                <span className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5 ${delta > 0 ? "text-success bg-success/10" : "text-clay-600 bg-clay-50"}`}>
                  {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}%
                </span>
              )}
            </div>
            <span className="text-xs text-fg-muted">Last 14 days</span>
          </div>
          <div className="mt-4"><MoodChart data={series} /></div>
          <div className="mt-2 flex items-center justify-between text-xs text-fg-muted">
            <span>2 weeks ago</span><span>Today</span>
          </div>
        </Tile>

        {/* STATS STACK */}
        <div className="lg:col-span-1 grid gap-4 md:gap-5">
          <MiniStat icon="fire" value={`${streak}`} label="Day check-in streak" />
          <MiniStat icon="check" value={`${past.length}`} label="Sessions completed" />
          <MiniStat icon="heart" value={avgMood} label="Average mood" />
        </div>

        {/* FOR YOU */}
        <Tile className="lg:col-span-2">
          <h2 className="font-display text-xl text-fg-strong mb-4">For you</h2>
          <div className="space-y-2.5">
            <Action onClick={() => navigate("/therapists")} icon="search" title={next ? "Book your next session" : "Find your therapist"} body="Keep your momentum going." />
            <Action onClick={() => navigate("/bookings")} icon="calendar" title="Review your sessions" body="See upcoming and past appointments." />
            <Action onClick={() => {}} soon icon="lotus" title="2-minute breathing reset" body="A quick exercise to settle your mind." />
          </div>
        </Tile>

        {/* CARE TEAM */}
        <Tile className="lg:col-span-1">
          <h2 className="font-display text-xl text-fg-strong mb-4">Your care team</h2>
          {therapist ? (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-clay-300 to-clay-500 text-white grid place-items-center font-display text-xl font-semibold shadow-soft">{initials(therapist)}</div>
              <div className="mt-3 font-semibold text-fg-strong">{therapist}</div>
              <div className="text-xs text-fg-muted">Clinical Psychologist</div>
              <div className="mt-4 flex gap-2 justify-center">
                <button className="h-9 px-4 rounded-full bg-accent text-primary-fg text-sm font-semibold hover:bg-accent-hover transition-colors">Message</button>
                <button onClick={() => navigate("/bookings")} className="h-9 px-4 rounded-full ring-1 ring-border text-fg-strong text-sm font-medium hover:bg-surface-2 transition-colors">Sessions</button>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-fg-muted">You haven't been matched yet.</p>
              <button onClick={() => navigate("/therapists")} className="mt-3 h-9 px-4 rounded-full bg-accent text-primary-fg text-sm font-semibold hover:bg-accent-hover transition-colors">Get matched</button>
            </div>
          )}
        </Tile>
      </div>
    </div>
  );
}

/* ---- pieces ---- */

function Tile({ children, className = "", dark = false }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <section className={`${dark ? "bg-night text-night-fg ring-1 ring-night-border" : "surface-raised"} rounded-[1.4rem] p-5 md:p-6 transition-transform duration-300 hover:-translate-y-0.5 ${className}`}>
      {children}
    </section>
  );
}

function MiniStat({ icon, value, label }: { icon: "fire" | "check" | "heart"; value: string; label: string }) {
  const paths = {
    fire: "M12 2s4 4 4 8a4 4 0 01-8 0c0-1 .5-2 .5-2S6 10 6 13a6 6 0 0012 0c0-5-6-11-6-11z",
    check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    heart: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  };
  return (
    <div className="surface-raised rounded-[1.4rem] p-5 flex items-center gap-4 transition-transform duration-300 hover:-translate-y-0.5">
      <span className="w-11 h-11 rounded-xl surface-inset grid place-items-center text-accent shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={paths[icon]} /></svg></span>
      <div><div className="font-display text-2xl font-semibold text-fg-strong leading-none">{value}</div><div className="mt-1 text-xs text-fg-muted">{label}</div></div>
    </div>
  );
}

function Action({ icon, title, body, onClick, soon }: { icon: "search" | "calendar" | "lotus"; title: string; body: string; onClick: () => void; soon?: boolean }) {
  const paths = {
    search: "M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z",
    calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    lotus: "M12 21c-5 0-8-3-8-3s2-5 8-5 8 5 8 5-3 3-8 3zM12 13c0-4 2-7 2-7s-2-1-2-3c0 2-2 3-2 3s2 3 2 7z",
  };
  return (
    <button onClick={soon ? undefined : onClick} className={`w-full flex items-center gap-3.5 rounded-2xl border border-border p-3.5 text-left transition-colors ${soon ? "opacity-60 cursor-default" : "hover:border-accent/50 hover:bg-surface-2/60"}`}>
      <span className="w-10 h-10 rounded-xl bg-clay-100 text-clay-700 grid place-items-center shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={paths[icon]} /></svg></span>
      <span className="flex-1 min-w-0"><span className="block text-sm font-semibold text-fg-strong">{title}{soon && <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-fg-muted bg-surface-2 rounded-full px-2 py-0.5">Soon</span>}</span><span className="block text-xs text-fg-muted">{body}</span></span>
      {!soon && <svg className="w-4 h-4 text-fg-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>}
    </button>
  );
}

function DashSkeleton() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 md:px-8 py-7 md:py-9 animate-pulse">
      <div className="h-8 w-64 bg-surface-2 rounded mb-2" />
      <div className="h-4 w-40 bg-surface-2 rounded" />
      <div className="mt-6 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 surface-raised rounded-[1.4rem] h-44" />
        <div className="surface-raised rounded-[1.4rem] h-44" />
        <div className="lg:col-span-2 surface-raised rounded-[1.4rem] h-64" />
        <div className="grid gap-5">{[0, 1, 2].map((i) => <div key={i} className="surface-raised rounded-[1.4rem] h-[88px]" />)}</div>
        <div className="lg:col-span-2 surface-raised rounded-[1.4rem] h-52" />
        <div className="surface-raised rounded-[1.4rem] h-52" />
      </div>
    </div>
  );
}
