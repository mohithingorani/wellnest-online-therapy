import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { bookings as bStore, isUpcoming, type Booking } from "../services/bookings";
import { moods as mStore, MOODS, type MoodEntry } from "../services/moods";
import MoodChart from "../components/MoodChart";
import { getDailyAffirmation } from "../data/affirmations";

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

/* ---- consistent button language ---- */
const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-1.5 font-semibold rounded-full bg-accent text-primary-fg transition-all duration-300 shadow-[0_4px_14px_-6px_rgba(192,97,63,0.5)] hover:bg-accent-hover hover:shadow-[0_10px_24px_-8px_rgba(192,97,63,0.55)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_8px_-4px_rgba(192,97,63,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface";
const BTN_GHOST =
  "inline-flex items-center justify-center gap-1.5 font-medium rounded-full ring-1 ring-border bg-surface/60 text-fg-strong transition-all duration-300 hover:bg-surface-2 hover:ring-clay-300 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40";

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
    setLoading(false);
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
    <div className="journal-canvas min-h-[calc(100vh-68px)]">
    <div className="mx-auto max-w-[1180px] px-5 md:px-8 py-8 md:py-12 animate-page">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-clay-600">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
          <h1 className="mt-2 font-display text-[2rem] md:text-[2.6rem] font-medium text-fg-strong tracking-[-0.035em] leading-[1.02]">{greeting()}, {firstName(user?.name)}.</h1>
        </div>
        <button onClick={() => navigate("/therapists")} className={`${BTN_PRIMARY} self-start h-11 px-6 text-sm`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
          Find a therapist
        </button>
      </div>

      {showVerify && (
        <div className="mt-5 flex items-start gap-3 rounded-[1.4rem] bg-ochre-100 border border-ochre-300/60 p-4 shadow-soft">
          <svg className="w-5 h-5 text-ochre-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <p className="flex-1 text-sm text-fg"><b className="text-fg-strong">Verify your email.</b> We sent a link to {user?.email || "your inbox"}.</p>
          <button onClick={dismissVerify} aria-label="Dismiss" className="text-fg-muted hover:text-fg-strong transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
      )}

      {/* AFFIRMATION */}
      <div className="mt-6 relative overflow-hidden rounded-[1.6rem] bg-surface border border-border p-5 md:p-6 shadow-soft">
        <span aria-hidden className="pointer-events-none absolute -top-2 right-5 font-display text-[5.5rem] leading-none text-border/70 select-none">&rdquo;</span>
        <div className="relative flex items-start gap-4">
          <span className="w-10 h-10 rounded-2xl bg-sage-100 text-sage-600 grid place-items-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" /></svg>
          </span>
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-muted">A thought for today</p>
            <p className="mt-1.5 font-display text-base md:text-lg text-fg-strong italic leading-relaxed">&ldquo;{getDailyAffirmation()}&rdquo;</p>
          </div>
        </div>
      </div>

      {/* BENTO */}
      <div className="mt-6 grid lg:grid-cols-3 gap-4 md:gap-5">
        {/* CHECK-IN (hero) */}
        <Tile className="lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-[1.35rem] text-fg-strong tracking-[-0.01em]">How are you feeling today?</h2>
              <p className="text-sm text-fg-muted mt-1">{todayMood ? `You checked in as “${MOODS.find((m) => m.v === todayMood)?.label}” — update anytime.` : "A quick check-in helps you notice patterns over time."}</p>
            </div>
            {streak > 0 && <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-clay-50 border border-clay-100 rounded-full px-3 py-1.5 shadow-soft">🔥 {streak}-day streak</span>}
          </div>
          <div className="mt-7 grid grid-cols-5 gap-2 sm:gap-3 max-w-md">
            {MOODS.map((m) => {
              const sel = todayMood === m.v;
              return (
                <button key={m.v} onClick={() => logMood(m.v)} aria-pressed={sel} title={m.label} className="group flex flex-col items-center gap-2.5 focus-visible:outline-none">
                  <span className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full grid place-items-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    sel
                      ? `bg-gradient-to-br ${m.tone} text-white scale-110 shadow-[0_10px_20px_-8px_rgba(47,58,50,0.45)] ring-2 ring-accent/40 ring-offset-2 ring-offset-surface`
                      : "surface-inset text-fg-muted group-hover:text-fg-strong group-hover:-translate-y-0.5 group-hover:shadow-soft group-active:translate-y-0 group-active:scale-95"
                  }`}>
                    <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" />
                      <circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none" />
                      <path strokeLinecap="round" d={mouth(m.v)} />
                    </svg>
                  </span>
                  <span className={`text-[11px] md:text-xs transition-colors duration-200 ${sel ? "text-fg-strong font-semibold" : "text-fg-muted font-medium group-hover:text-fg"}`}>{m.label}</span>
                </button>
              );
            })}
          </div>
        </Tile>

        {/* NEXT SESSION */}
        {next ? (
          <Tile dark className="lg:col-span-1 relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute -top-12 -right-8 h-40 w-40 rounded-full bg-clay-500/30 blur-3xl" />
            <div className="relative flex flex-col h-full">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ochre-300">
                <span className="w-1.5 h-1.5 rounded-full bg-ochre-300 animate-pulse-soft" />
                Next session · {countdown(next)}
              </span>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-ochre-300 to-clay-400 text-night grid place-items-center font-display font-semibold shadow-[0_6px_14px_-6px_rgba(0,0,0,0.4)]">{initials(next.therapistName)}</div>
                <div className="min-w-0"><div className="font-semibold truncate">{next.therapistName}</div><div className="text-xs text-night-muted">{next.sessionType} · {prettyTime(next.time)}</div></div>
              </div>
              <div className="mt-3 text-xs text-night-muted flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {prettyDate(next.date)}
              </div>
              <div className="mt-5 flex gap-2">
                {next.sessionType === "Video" && <button onClick={() => navigate(`/session/${next.id}`)} className="h-9 px-4 rounded-full bg-ochre-300 text-night text-sm font-semibold hover:bg-ochre-200 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_6px_14px_-6px_rgba(0,0,0,0.5)]">Join</button>}
                <button onClick={() => navigate("/bookings")} className="h-9 px-4 rounded-full ring-1 ring-night-border text-night-fg text-sm font-medium hover:bg-night-2 transition-colors">Details</button>
              </div>
            </div>
          </Tile>
        ) : (
          <Tile className="lg:col-span-1 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl surface-inset grid place-items-center text-accent"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
            <p className="mt-3 font-semibold text-fg-strong text-sm">No sessions yet</p>
            <p className="mt-1 text-xs text-fg-muted">Book your first when you're ready.</p>
            <button onClick={() => navigate("/therapists")} className={`${BTN_PRIMARY} mt-4 h-9 px-4 text-sm`}>Find a therapist</button>
          </Tile>
        )}

        {/* MOOD TREND */}
        <Tile className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-[1.35rem] text-fg-strong tracking-[-0.01em]">Your wellbeing</h2>
              {delta !== 0 && (
                <span className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5 ${delta > 0 ? "text-success bg-success/10" : "text-clay-600 bg-clay-50"}`}>
                  {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}%
                </span>
              )}
            </div>
            <span className="text-xs text-fg-muted font-medium">Last 14 days</span>
          </div>
          <div className="mt-5"><MoodChart data={series} /></div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-fg-muted/80">
            <span>2 weeks ago</span><span>Today</span>
          </div>
        </Tile>

        {/* STATS STACK */}
        <div className="lg:col-span-1 grid gap-4 md:gap-5">
          <MiniStat icon="fire" tint="clay" value={`${streak}`} label="Day check-in streak" />
          <MiniStat icon="check" tint="sage" value={`${past.length}`} label="Sessions completed" />
          <MiniStat icon="heart" tint="accent" value={avgMood} label="Average mood" trend={delta !== 0 ? { up: delta > 0, val: Math.abs(delta) } : undefined} />
        </div>

        {/* FOR YOU */}
        <Tile className="lg:col-span-2">
          <h2 className="font-display text-[1.35rem] text-fg-strong tracking-[-0.01em] mb-4">For you</h2>
          <div className="space-y-2.5">
            <Action onClick={() => navigate("/therapists")} icon="search" title={next ? "Book your next session" : "Find your therapist"} body="Keep your momentum going." />
            <Action onClick={() => navigate("/bookings")} icon="calendar" title="Review your sessions" body="See upcoming and past appointments." />
            <Action onClick={() => navigate("/journal")} icon="journal" title="Write in your journal" body="Reflect, track, and grow with daily entries." />
            <Action onClick={() => navigate("/breathe")} icon="lotus" title="2-minute breathing reset" body="Calm your mind with a guided breathing exercise." />
          </div>
        </Tile>

        {/* CARE TEAM */}
        <Tile className="lg:col-span-1">
          <h2 className="font-display text-[1.35rem] text-fg-strong tracking-[-0.01em] mb-4">Your care team</h2>
          {therapist ? (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-clay-300 to-clay-500 text-white grid place-items-center font-display text-xl font-semibold shadow-[0_10px_22px_-10px_rgba(184,88,56,0.55)] ring-1 ring-white/30">{initials(therapist)}</div>
              <div className="mt-3 font-semibold text-fg-strong">{therapist}</div>
              <div className="text-xs text-fg-muted">Clinical Psychologist</div>
              <div className="mt-4 flex gap-2 justify-center">
                <button className={`${BTN_PRIMARY} h-9 px-4 text-sm`}>Message</button>
                <button onClick={() => navigate("/bookings")} className={`${BTN_GHOST} h-9 px-4 text-sm`}>Sessions</button>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-fg-muted">You haven't been matched yet.</p>
              <button onClick={() => navigate("/therapists")} className={`${BTN_PRIMARY} mt-4 h-9 px-4 text-sm`}>Get matched</button>
            </div>
          )}
        </Tile>
      </div>
    </div>
    </div>
  );
}

/* ---- pieces ---- */

function Tile({ children, className = "", dark = false }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <section className={`${dark ? "bg-night text-night-fg ring-1 ring-night-border shadow-[0_18px_40px_-24px_rgba(47,58,50,0.5)]" : "surface-raised"} rounded-[1.4rem] p-5 md:p-6 ${className}`}>
      {children}
    </section>
  );
}

function MiniStat({ icon, value, label, tint, trend }: { icon: "fire" | "check" | "heart"; value: string; label: string; tint: "clay" | "sage" | "accent"; trend?: { up: boolean; val: number } }) {
  const paths = {
    fire: "M12 2s4 4 4 8a4 4 0 01-8 0c0-1 .5-2 .5-2S6 10 6 13a6 6 0 0012 0c0-5-6-11-6-11z",
    check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    heart: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  };
  const tints = {
    clay: "bg-clay-100 text-clay-600",
    sage: "bg-sage-100 text-sage-600",
    accent: "bg-accent/10 text-accent",
  };
  return (
    <div className="group surface-raised hover-lift rounded-[1.4rem] p-5 flex items-center gap-4">
      <span className={`w-12 h-12 rounded-2xl ${tints[tint]} grid place-items-center shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={paths[icon]} /></svg>
      </span>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <div className="font-display text-[1.7rem] font-semibold text-fg-strong leading-none">{value}</div>
          {trend && (
            <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${trend.up ? "text-success" : "text-clay-600"}`}>
              {trend.up ? "↑" : "↓"} {trend.val}%
            </span>
          )}
        </div>
        <div className="mt-1.5 text-xs text-fg-muted">{label}</div>
      </div>
    </div>
  );
}

function Action({ icon, title, body, onClick, soon }: { icon: "search" | "calendar" | "lotus" | "journal"; title: string; body: string; onClick: () => void; soon?: boolean }) {
  const paths = {
    search: "M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z",
    calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    lotus: "M12 21c-5 0-8-3-8-3s2-5 8-5 8 5 8 5-3 3-8 3zM12 13c0-4 2-7 2-7s-2-1-2-3c0 2-2 3-2 3s2 3 2 7z",
    journal: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  };
  return (
    <button
      onClick={soon ? undefined : onClick}
      className={`group w-full flex items-center gap-4 rounded-2xl border border-border bg-surface/40 p-3.5 text-left transition-all duration-300 ${soon ? "opacity-60 cursor-default" : "hover:border-accent/40 hover:bg-surface-2/50 hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"}`}
    >
      <span className="w-11 h-11 rounded-xl bg-clay-100 text-clay-700 grid place-items-center shrink-0 transition-all duration-300 group-hover:bg-clay-200 group-hover:scale-105">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={paths[icon]} /></svg>
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-fg-strong">{title}{soon && <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-fg-muted bg-surface-2 rounded-full px-2 py-0.5">Soon</span>}</span>
        <span className="block text-xs text-fg-muted mt-0.5">{body}</span>
      </span>
      {!soon && <svg className="w-4 h-4 text-fg-muted shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>}
    </button>
  );
}

function DashSkeleton() {
  return (
    <div className="journal-canvas min-h-[calc(100vh-68px)]">
    <div className="mx-auto max-w-[1180px] px-5 md:px-8 py-8 md:py-12 animate-pulse">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-2">
          <div className="h-9 w-64 bg-surface-2 rounded-lg" />
          <div className="h-4 w-44 bg-surface-2 rounded" />
        </div>
        <div className="h-10 w-36 bg-surface-2 rounded-full" />
      </div>

      {/* affirmation */}
      <div className="mt-5 h-[72px] bg-surface-2 rounded-[1.4rem]" />

      {/* bento */}
      <div className="mt-6 grid lg:grid-cols-3 gap-4 md:gap-5">
        <div className="lg:col-span-2 surface-raised rounded-[1.4rem] h-52" />
        <div className="lg:col-span-1 surface-raised rounded-[1.4rem] h-52" />
        <div className="lg:col-span-2 surface-raised rounded-[1.4rem] h-72" />
        <div className="lg:col-span-1 grid gap-4 md:gap-5">
          {[0, 1, 2].map((i) => <div key={i} className="surface-raised rounded-[1.4rem] h-[88px]" />)}
        </div>
        <div className="lg:col-span-2 surface-raised rounded-[1.4rem] h-80" />
        <div className="lg:col-span-1 surface-raised rounded-[1.4rem] h-72" />
      </div>
    </div>
    </div>
  );
}
