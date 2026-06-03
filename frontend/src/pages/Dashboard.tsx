import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { bookings as bStore, isUpcoming, type Booking } from "../services/bookings";
import { moods as mStore, MOODS, type MoodEntry } from "../services/moods";
import MoodChart from "../components/MoodChart";
import { getDailyAffirmation } from "../data/affirmations";
import WeeklyChallenge from "../components/WeeklyChallenge";
import { useSeeds } from "../hooks/useSeeds";
import { ACHIEVEMENT_META } from "../services/seeds";
import { getAchievements } from "../services/seeds";
import CountUp from "../components/CountUp";
import { IcFlame, IcPen, IcWind, IcTarget, IcBook, IcCalendar, IcLeaf, IcSearch, IcStar, IcCheck } from "../components/Icon";

/* ── helpers ─────────────────────────────────────────────────── */
const fn = (name?: string) => { const f = name?.trim().split(" ")[0] ?? ""; return f ? f[0].toUpperCase() + f.slice(1) : "there"; };
const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };
const initials = (name = "") => { const p = name.replace(/^Dr\.?\s+/i, "").trim().split(/\s+/); return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?"; };
const prettyTime = (t: string) => { const [h, m] = t.split(":").map(Number); return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`; };
const countdown = (b: Booking) => { const ms = new Date(`${b.date}T${b.time}`).getTime() - Date.now(); const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000); return d >= 1 ? `in ${d}d` : h >= 1 ? `in ${h}h` : "soon"; };
const mouth = (v: number) => `M8.5 14 Q 12 ${14 + (v - 3) * 2} 15.5 14`;

/* ── SVG ring for Seeds progress ─────────────────────────────── */
function SeedRing({ pct, color, size = 64 }: { pct: number; color: string; size?: number }) {
  const r = size / 2 - 5, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={4.5} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`} className="animate-ring-fill" style={{ strokeDashoffset: offset }} />
    </svg>
  );
}

/* ── Dashboard ────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showVerify, setShowVerify] = useState(params.get("welcome") === "1");
  const [series, setSeries] = useState<MoodEntry[]>([]);
  const [todayMood, setTodayMood] = useState<number | null>(null);
  const [earnedSlugs, setEarnedSlugs] = useState<Set<string>>(new Set());
  const seeds = useSeeds();

  useEffect(() => {
    setSeries(mStore.series());
    setTodayMood(mStore.today()?.value ?? null);
    setLoading(false);
    getAchievements().then((a) => setEarnedSlugs(new Set(a.map((x) => x.slug)))).catch(() => {});
  }, []);

  const all = useMemo(() => bStore.list(), []);
  const upcoming = useMemo(() => all.filter(isUpcoming), [all]);
  const past = useMemo(() => all.filter((b) => !b.cancelled && !isUpcoming(b)), [all]);
  const next = upcoming[0];
  const therapist = (next || past[0])?.therapistName;
  const streak = mStore.streak();
  const recent = series.slice(-7), prev = series.slice(-14, -7);
  const avg = (a: MoodEntry[]) => a.length ? a.reduce((s, e) => s + e.value, 0) / a.length : 0;
  const delta = recent.length && prev.length ? Math.round(((avg(recent) - avg(prev)) / avg(prev)) * 100) : 0;
  const avgMood = MOODS.find((m) => m.v === Math.round(avg(series)))?.label ?? "—";
  const logMood = (v: number) => { setSeries(mStore.log(v)); setTodayMood(v); };
  const dismissVerify = () => { setShowVerify(false); params.delete("welcome"); setParams(params, { replace: true }); };

  if (loading) return <Skeleton />;

  const affirmation = getDailyAffirmation();
  const todayLabel = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="bg-bg min-h-[calc(100vh-68px)]">

      {/* ══════════════════════════ HERO BAND ══════════════════════════ */}
      <div className="relative overflow-hidden bg-night">
        {/* ambient glows */}
        <div aria-hidden className="pointer-events-none absolute -top-24 right-[15%] h-72 w-72 rounded-full bg-sage-500/20 blur-[90px]" />
        <div aria-hidden className="pointer-events-none absolute top-0 left-0 h-56 w-56 rounded-full bg-accent/10 blur-[80px]" />

        <div className="mx-auto max-w-[1180px] px-5 md:px-8 pt-8 md:pt-10 pb-10 md:pb-12">

          {/* top row: date + CTA */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-night-muted">{todayLabel}</p>
            <button
              onClick={() => navigate("/therapists")}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-white text-xs font-semibold  transition-colors border border-white hover:bg-white/10"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
              Find a therapist
            </button>
          </div>

          {/* main hero content */}
          <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            {/* left: greeting + affirmation */}
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-medium text-[1.9rem] sm:text-[2.4rem] md:text-[2.8rem] text-night-fg tracking-[-0.03em] leading-[1.05]">
                {greeting()}, {fn(user?.name)}.
              </h1>

              {/* affirmation */}
              <p className="mt-3 text-night-muted text-[0.9rem] leading-relaxed max-w-xl italic line-clamp-2">
                <span className="text-ochre-300 font-display text-lg not-italic mr-1">"</span>
                {affirmation}
                <span className="text-ochre-300 font-display text-lg not-italic ml-0.5">"</span>
              </p>

              {/* status pills — wrap naturally */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {streak > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-night-fg">
                    <IcFlame className="w-3 h-3 text-ochre-300" /> {streak}d streak
                  </span>
                )}
                {todayMood && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sage-500/20 border border-sage-400/20 px-2.5 py-1 text-[11px] font-semibold text-sage-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage-400" />
                    {MOODS.find((m) => m.v === todayMood)?.label}
                  </span>
                )}
                {next && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-ochre-300/15 border border-ochre-300/20 px-2.5 py-1 text-[11px] font-semibold text-ochre-300">
                    <IcCalendar className="w-3 h-3" /> Session {countdown(next)}
                  </span>
                )}
              </div>
            </div>

            {/* Seeds level pill — shrinks on mobile */}
            {!seeds.loading && (
              <button
                onClick={() => navigate("/rewards")}
                className="group flex items-center gap-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 px-3.5 py-3 transition-all duration-300 self-start shrink-0"
              >
                <div className="relative shrink-0">
                  <SeedRing pct={seeds.progressPct} color={seeds.currentLevel.ring} size={48} />
                  <span className="absolute inset-0 grid place-items-center font-display font-bold text-white text-[12px]">{seeds.currentLevel.n}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-[1.6rem] font-semibold text-ochre-300 leading-none">
                      <CountUp to={seeds.total} />
                    </span>
                    <IcLeaf className="w-2.5 h-2.5 text-sage-400" />
                  </div>
                  <div className="text-[10px] text-night-muted mt-0.5 whitespace-nowrap">{seeds.currentLevel.name}</div>
                </div>
                <svg className="w-3.5 h-3.5 text-night-muted/40 group-hover:text-night-muted transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════ CONTENT ════════════════════════════ */}
      <div className="mx-auto max-w-[1180px] px-5 md:px-8 py-7 md:py-9 space-y-6 animate-page">

        {/* verify banner */}
        {showVerify && (
          <div className="flex items-start gap-3 rounded-2xl bg-ochre-50 border border-ochre-200/60 p-4">
            <svg className="w-4 h-4 text-ochre-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <p className="flex-1 text-sm text-fg"><b className="text-fg-strong">Verify your email.</b> We sent a link to {user?.email || "your inbox"}.</p>
            <button onClick={dismissVerify} className="text-fg-muted hover:text-fg-strong transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        )}

        {/* ── ROW 1: Mood check-in + Next session ── */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">

          {/* MOOD CHECK-IN */}
          <div className="rounded-[1.6rem] bg-surface border border-border/60 p-6 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-[1.3rem] font-medium text-fg-strong tracking-[-0.01em]">How are you feeling?</h2>
                <p className="text-sm text-fg-muted mt-1">
                  {todayMood
                    ? `You checked in as "${MOODS.find((m) => m.v === todayMood)?.label}" today.`
                    : "A daily check-in builds self-awareness over time."}
                </p>
              </div>
              {streak > 0 && (
                <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-accent bg-accent/8 border border-accent/15 rounded-full px-2.5 py-1">
                  <IcFlame className="w-3 h-3" />{streak}
                </span>
              )}
            </div>

            {/* mood selector — full-width, more space */}
            <div className="mt-6 flex justify-between gap-2">
              {MOODS.map((m) => {
                const sel = todayMood === m.v;
                return (
                  <button
                    key={m.v}
                    onClick={() => logMood(m.v)}
                    aria-pressed={sel}
                    title={m.label}
                    className="group flex-1 flex flex-col items-center gap-2 focus-visible:outline-none"
                  >
                    <span className={`w-full max-w-[60px] aspect-square rounded-2xl grid place-items-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      sel
                        ? `bg-gradient-to-br ${m.tone} text-white scale-105 shadow-[0_8px_20px_-8px_rgba(47,58,50,0.4)] ring-2 ring-accent/30 ring-offset-2 ring-offset-surface`
                        : "bg-surface-2 text-fg-muted hover:bg-sage-50 hover:text-sage-700 hover:-translate-y-0.5 group-active:scale-95"
                    }`}>
                      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8}>
                        <circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" />
                        <circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none" />
                        <path strokeLinecap="round" d={mouth(m.v)} />
                      </svg>
                    </span>
                    <span className={`text-[11px] font-medium leading-tight text-center transition-colors ${sel ? "text-fg-strong font-semibold" : "text-fg-muted group-hover:text-fg"}`}>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* post-check-in insight */}
            {todayMood && (
              <div className="mt-5 flex items-start gap-3 rounded-xl bg-sage-50 border border-sage-100 px-4 py-3">
                <IcStar className="w-4 h-4 text-sage-500 shrink-0 mt-0.5" />
                <p className="text-xs text-sage-700 leading-relaxed">
                  {todayMood >= 4 ? "Great to hear — your wellbeing trend is heading in the right direction." : todayMood === 3 ? "Days like this build resilience. Journaling can help clarify what's on your mind." : "Thank you for checking in. On hard days, the breathing exercise can help ground you."}
                </p>
              </div>
            )}
          </div>

          {/* NEXT SESSION */}
          {next ? (
            <div className="rounded-[1.6rem] bg-night border border-night-border overflow-hidden relative p-6 md:p-7 flex flex-col justify-between">
              <div aria-hidden className="pointer-events-none absolute -top-10 -right-8 h-36 w-36 rounded-full bg-sage-500/15 blur-[50px]" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sage-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-400 animate-pulse-soft" />
                  Next session · {countdown(next)}
                </span>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 text-white grid place-items-center font-display font-bold text-base shadow-soft shrink-0">
                    {initials(next.therapistName)}
                  </div>
                  <div>
                    <div className="font-semibold text-night-fg">{next.therapistName}</div>
                    <div className="text-xs text-night-muted mt-0.5">{next.sessionType} · {prettyTime(next.time)}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-night-muted">
                  {new Date(`${next.date}T00:00`).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                </div>
              </div>
              <div className="relative mt-6 flex gap-2">
                {next.sessionType === "Video" && (
                  <button onClick={() => navigate(`/session/${next.id}`)} className="h-9 px-4 rounded-full bg-sage-500 text-white text-sm font-semibold hover:bg-sage-400 transition-colors">Join</button>
                )}
                <button onClick={() => navigate("/bookings")} className="h-9 px-4 rounded-full ring-1 ring-night-border text-night-fg text-sm font-medium hover:bg-night-2 transition-colors">Details</button>
              </div>
            </div>
          ) : (
            <div className="rounded-[1.6rem] bg-sage-50 border border-sage-100 p-6 md:p-7 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sage-100 text-sage-500 grid place-items-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <p className="font-semibold text-fg-strong">Find your therapist</p>
                <p className="text-sm text-fg-muted mt-1">Match with a verified clinician who fits your needs.</p>
              </div>
              <button onClick={() => navigate("/therapists")} className="h-9 px-5 rounded-full bg-accent text-primary-fg text-sm font-semibold hover:bg-accent-hover transition-all shadow-[0_4px_12px_-4px_rgba(192,97,63,0.45)]">
                Browse therapists
              </button>
            </div>
          )}
        </div>

        {/* ── ROW 2: Wellbeing analytics — full width, no card border ── */}
        <div className="rounded-[1.6rem] bg-surface border border-border/60 overflow-hidden">
          {/* header */}
          <div className="px-6 md:px-7 pt-6 pb-0 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-[1.3rem] font-medium text-fg-strong tracking-[-0.01em]">Wellbeing trend</h2>
              {delta !== 0 && (
                <span className={`inline-flex items-center gap-0.5 text-xs font-bold rounded-full px-2.5 py-1 ${delta > 0 ? "text-success bg-success/10" : "text-accent bg-accent/10"}`}>
                  {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}%
                </span>
              )}
            </div>
            <span className="text-xs text-fg-muted">Last 14 days</span>
          </div>

          {/* inline stats — no separate cards */}
          <div className="px-6 md:px-7 mt-4 grid grid-cols-3 gap-4 border-b border-border/40 pb-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-ochre-50 grid place-items-center shrink-0"><IcFlame className="w-4 h-4 text-ochre-600" /></span>
              <div><div className="font-display text-[1.6rem] font-semibold text-fg-strong leading-none">{streak || "0"}</div><div className="text-[11px] text-fg-muted mt-1">Day streak</div></div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-sage-50 grid place-items-center shrink-0"><IcCalendar className="w-4 h-4 text-sage-600" /></span>
              <div><div className="font-display text-[1.6rem] font-semibold text-fg-strong leading-none">{past.length}</div><div className="text-[11px] text-fg-muted mt-1">Sessions done</div></div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-accent/8 grid place-items-center shrink-0"><IcStar className="w-4 h-4 text-accent" /></span>
              <div><div className="font-display text-[1.6rem] font-semibold text-fg-strong leading-none">{avgMood || "—"}</div><div className="text-[11px] text-fg-muted mt-1">Avg mood</div></div>
            </div>
          </div>

          {/* chart — no padding boxing it in */}
          <div className="px-4 md:px-6 pt-4 pb-5">
            <MoodChart data={series} />
            <div className="mt-2 flex items-center justify-between text-[11px] text-fg-muted/70 px-1">
              <span>2 weeks ago</span><span>Today</span>
            </div>
          </div>
        </div>

        {/* ── ROW 3: Actions + Challenge/Achievements unified panel ── */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-4">

          {/* TODAY'S ACTIONS — compact grouped rows */}
          <div className="rounded-[1.4rem] bg-surface border border-border/60 overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <h2 className="font-display text-[1.05rem] font-medium text-fg-strong tracking-[-0.01em]">Today's actions</h2>
              {seeds.todayEarned > 0 && (
                <span className="text-[11px] font-semibold text-sage-600 bg-sage-50 border border-sage-200 rounded-full px-2.5 py-1 flex items-center gap-1">
                  +{seeds.todayEarned} <IcLeaf className="w-3 h-3" /> earned
                </span>
              )}
            </div>

            {/* EARN SEEDS group */}
            <div className="px-3 pb-2">
              <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-fg-muted/60">Earn Seeds</p>
              {([
                { Icon: IcPen,    label: "Journal",    body: "Write a reflection",    route: "/journal",   seeds: 10, accent: "bg-sage-500",   light: "bg-sage-50 text-sage-600",   done: seeds.transactions.some(t => t.reason === "journal_entry"    && t.createdAt.slice(0,10) === new Date().toISOString().slice(0,10)) },
                { Icon: IcWind,   label: "Breathe",    body: "2-minute reset",        route: "/breathe",   seeds: 8,  accent: "bg-accent",      light: "bg-accent/8 text-accent",    done: seeds.transactions.some(t => t.reason === "breathing_session" && t.createdAt.slice(0,10) === new Date().toISOString().slice(0,10)) },
                { Icon: IcTarget, label: "Assess",     body: "Know yourself better",  route: "/assess",    seeds: 15, accent: "bg-ochre-500",   light: "bg-ochre-50 text-ochre-600", done: seeds.transactions.some(t => t.reason === "assessment"         && t.createdAt.slice(0,10) === new Date().toISOString().slice(0,10)) },
                { Icon: IcBook,   label: "Read",       body: "Learn something new",   route: "/resources", seeds: 3,  accent: "bg-sage-400",    light: "bg-sage-50 text-sage-500",   done: seeds.transactions.some(t => t.reason === "resource_read"      && t.createdAt.slice(0,10) === new Date().toISOString().slice(0,10)) },
              ] as const).map((a) => (
                <button key={a.label} onClick={() => navigate(a.route)}
                  className="group w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-surface-2/70 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
                >
                  <span className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 transition-all duration-200 ${a.done ? "bg-sage-100 text-sage-600" : a.light}`}>
                    {a.done
                      ? <IcCheck className="w-4 h-4" strokeWidth={2.5} />
                      : <a.Icon className="w-4 h-4" />
                    }
                  </span>
                  <div className="flex-1 min-w-0 text-left">
                    <div className={`text-sm font-semibold leading-tight ${a.done ? "line-through text-fg-muted" : "text-fg-strong"}`}>{a.label}</div>
                    <div className="text-[11px] text-fg-muted mt-0.5">{a.body}</div>
                  </div>
                  {!a.done && (
                    <span className="shrink-0 flex items-center gap-0.5 text-[10px] font-bold text-sage-600 bg-sage-100 rounded-full px-2 py-0.5">
                      +{a.seeds}<IcLeaf className="w-2.5 h-2.5" />
                    </span>
                  )}
                  {a.done && <span className="shrink-0 text-[10px] font-semibold text-sage-500">Done</span>}
                </button>
              ))}
            </div>

            {/* divider */}
            <div className="mx-5 h-px bg-border/50 my-1" />

            {/* NAVIGATE group */}
            <div className="px-3 pb-4">
              <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-fg-muted/60">Navigate</p>
              {([
                { Icon: IcSearch,   label: "Find a therapist", body: "Browse verified clinicians", route: "/therapists" },
                { Icon: IcCalendar, label: "My sessions",       body: "View upcoming & past",       route: "/bookings"   },
              ] as const).map((a) => (
                <button key={a.label} onClick={() => navigate(a.route)}
                  className="group w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-surface-2/70 transition-all duration-200 focus-visible:outline-none"
                >
                  <span className="w-8 h-8 rounded-lg bg-surface-2 text-fg-muted grid place-items-center shrink-0">
                    <a.Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-fg-strong">{a.label}</div>
                    <div className="text-[11px] text-fg-muted mt-0.5">{a.body}</div>
                  </div>
                  <svg className="w-4 h-4 text-fg-muted/40 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Challenge + Achievements unified — no double borders */}
          <div className="flex flex-col gap-3">

            {/* WEEKLY CHALLENGE — compact, integrated */}
            <WeeklyChallenge />

            {/* ACHIEVEMENTS — prominent, rewarding */}
            <div className="rounded-[1.4rem] bg-surface border border-border/60 p-4 flex-1">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-[0.95rem] font-semibold text-fg-strong">Achievements</h3>
                  <p className="text-[11px] text-fg-muted mt-0.5">{earnedSlugs.size} of {Object.keys(ACHIEVEMENT_META).length} earned</p>
                </div>
                <button onClick={() => navigate("/rewards")} className="text-[11px] text-accent font-semibold hover:text-accent-hover transition-colors flex items-center gap-0.5">
                  All
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              {/* progress bar */}
              <div className="h-1 rounded-full bg-border/50 overflow-hidden mb-4">
                <div className="h-full rounded-full bg-sage-500 transition-all duration-700"
                  style={{ width: `${(earnedSlugs.size / Object.keys(ACHIEVEMENT_META).length) * 100}%` }} />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {Object.entries(ACHIEVEMENT_META).map(([slug, meta], i) => {
                  const got = earnedSlugs.has(slug);
                  return (
                    <div key={slug} title={got ? `${meta.label} — ${meta.desc}` : `Locked: ${meta.desc}`}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <span className={`rounded-xl grid place-items-center text-base transition-all duration-300 ${
                        got
                          ? "w-12 h-12 bg-sage-100 shadow-[0_0_0_2px_rgba(74,107,82,0.25),0_2px_8px_-4px_rgba(74,107,82,0.3)] scale-100 animate-pop-in"
                          : "w-9 h-9 bg-surface-2 opacity-30 grayscale"
                      }`}
                        style={{ animationDelay: got ? `${i * 40}ms` : undefined }}
                      >
                        {meta.emoji}
                      </span>
                      <span className={`text-[9px] font-medium text-center leading-tight ${got ? "text-fg-strong" : "text-fg-muted/30"}`}>
                        {meta.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CARE TEAM — minimal strip */}
            {therapist && (
              <div className="rounded-[1.4rem] bg-night border border-night-border px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 text-white grid place-items-center font-display font-bold text-xs shrink-0">
                  {initials(therapist)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-night-fg truncate">{therapist}</div>
                  <div className="text-[11px] text-night-muted">Your therapist</div>
                </div>
                <button onClick={() => navigate("/bookings")} className="shrink-0 h-7 px-3 rounded-full ring-1 ring-night-border text-night-fg text-[11px] font-medium hover:bg-night-2 transition-colors">
                  Sessions
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── skeleton ─────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="bg-bg min-h-[calc(100vh-68px)]">
      <div className="bg-night h-48 animate-pulse" />
      <div className="mx-auto max-w-[1180px] px-5 md:px-8 py-7 space-y-5 animate-pulse">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
          <div className="h-56 rounded-[1.6rem] bg-surface-2" />
          <div className="h-56 rounded-[1.6rem] bg-surface-2" />
        </div>
        <div className="h-72 rounded-[1.6rem] bg-surface-2" />
        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-5">
          <div className="h-64 rounded-[1.6rem] bg-surface-2" />
          <div className="h-64 rounded-[1.6rem] bg-surface-2" />
        </div>
      </div>
    </div>
  );
}
