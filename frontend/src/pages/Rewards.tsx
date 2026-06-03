import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSeeds } from "../hooks/useSeeds";
import { getAchievements, type Achievement } from "../services/seeds";
import { LEVELS } from "../data/levels";
import CountUp from "../components/CountUp";

/* ─── helpers ──────────────────────────────────────────────── */
const PRETTY: Record<string, string> = {
  signup: "Joined WellNest", daily_checkin: "Daily check-in",
  journal_entry: "Journal entry", breathing_session: "Breathing session",
  assessment: "Self-assessment", resource_read: "Read an article",
  referral: "Referred a friend", weekly_challenge: "Weekly challenge",
  streak_3day: "3-day streak", streak_7day: "7-day streak", streak_30day: "30-day streak",
};
function prettyReason(r: string) { return PRETTY[r] ?? r.replace(/_/g, " "); }
function relTime(iso: string) {
  const ms = Date.now() - new Date(iso).getTime(), m = Math.floor(ms / 60000);
  if (m < 1) return "just now"; if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24); if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/* ─── SVG Icon system — no emojis ───────────────────────────── */
const ICONS = {
  leaf:      "M12 21C12 21 4 15 4 9a8 8 0 0116 0c0 6-8 12-8 12z",
  pen:       "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  flame:     "M12 2s4 4 4 8a4 4 0 01-8 0c0-1 .5-2 .5-2S6 10 6 13a6 6 0 0012 0c0-5-6-11-6-11z",
  wind:      "M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2",
  eye:       "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  users:     "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  mountain:  "M3 17l4-8 4 4 3-6 5 10H3z",
  star:      "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  lock:      "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  check:     "M5 13l4 4L19 7",
  ticket:    "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z",
  phone:     "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  gift:      "M20 12v10H4V12M22 7H2v5h20V7zM12 22V7m0 0H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z",
};

function Ic({ d, className = "w-5 h-5", style, strokeWidth = 1.7 }: { d: string; className?: string; style?: React.CSSProperties; strokeWidth?: number }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d={d} />
    </svg>
  );
}

/* ─── Achievement definitions with SVG icon + rarity ─────────── */
type Rarity = "common" | "uncommon" | "rare" | "epic";
interface AchDef { label: string; desc: string; icon: keyof typeof ICONS; rarity: Rarity; unlockHint: string; }
const ACH: Record<string, AchDef> = {
  first_seed:       { label: "First Seed",       desc: "Earned your first Seeds.",                icon: "leaf",     rarity: "common",   unlockHint: "Sign up and complete onboarding" },
  first_reflection: { label: "First Reflection",  desc: "Wrote your first journal entry.",         icon: "pen",      rarity: "common",   unlockHint: "Write in your journal once" },
  week_warrior:     { label: "Week Warrior",       desc: "Checked in 7 days in a row.",             icon: "flame",    rarity: "uncommon", unlockHint: "Maintain a 7-day streak" },
  calm_mind:        { label: "Calm Mind",          desc: "Completed 10 breathing sessions.",        icon: "wind",     rarity: "uncommon", unlockHint: "Complete 10 breathing exercises" },
  self_aware:       { label: "Self-Aware",         desc: "Completed all 4 assessments.",            icon: "eye",      rarity: "rare",     unlockHint: "Take all 4 self-assessments" },
  connector:        { label: "Connector",          desc: "Referred your first friend.",             icon: "users",    rarity: "rare",     unlockHint: "Invite a friend who signs up" },
  month_strong:     { label: "Month Strong",       desc: "Checked in 30 days in a row.",            icon: "mountain", rarity: "epic",     unlockHint: "Maintain a 30-day streak" },
};

const RARITY_STYLES: Record<Rarity, { border: string; bg: string; glow: string; badge: string; text: string }> = {
  common:   { border: "border-border",         bg: "bg-surface-2",           glow: "",                                               badge: "bg-surface-2 text-fg-muted",         text: "text-fg-muted" },
  uncommon: { border: "border-sage-300/60",    bg: "bg-sage-50",             glow: "shadow-[0_0_18px_-6px_rgba(74,107,82,0.35)]",    badge: "bg-sage-100 text-sage-700",          text: "text-sage-700" },
  rare:     { border: "border-ochre-300/60",   bg: "bg-ochre-50",            glow: "shadow-[0_0_18px_-6px_rgba(219,172,82,0.4)]",    badge: "bg-ochre-100 text-ochre-700",        text: "text-ochre-700" },
  epic:     { border: "border-accent/50",      bg: "bg-accent/[0.07]",       glow: "shadow-[0_0_24px_-6px_rgba(192,97,63,0.5)]",     badge: "bg-accent/15 text-accent",           text: "text-accent" },
};

/* ─── Progress ring ─────────────────────────────────────────── */
function Ring({ pct, color, size = 96 }: { pct: number; color: string; size?: number }) {
  const r = size / 2 - 7, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={7} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset} transform={`rotate(-90 ${cx} ${cy})`}
        className="animate-ring-fill" style={{ strokeDashoffset: offset }} />
    </svg>
  );
}

/* ─── REDEMPTIONS ───────────────────────────────────────────── */
const REDEMPTIONS = [
  { label: "10% off first session", seeds: 150, icon: "ticket" as const, tier: 1, color: "from-sage-500 to-sage-600" },
  { label: "Free 15-min intro call", seeds: 400, icon: "phone" as const, tier: 2, color: "from-ochre-500 to-ochre-600" },
  { label: "Free first session",     seeds: 1000, icon: "gift" as const,  tier: 3, color: "from-accent to-accent-hover" },
];

/* ═══════════════════════════════════════════════════════════════ */
export default function Rewards() {
  const navigate = useNavigate();
  const { total, lifetimeEarned, todayEarned, weekEarned, transactions, currentLevel, progressPct, seedsToNext, nextLevel, activeDays, loading } = useSeeds();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => { getAchievements().then(setAchievements).catch(() => {}); }, []);

  const earned = new Set(achievements.map((a) => a.slug));
  const today = new Date().toISOString().slice(0, 10);

  /* 28-day streak calendar */
  const days28 = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (27 - i)); return d.toISOString().slice(0, 10);
  });
  let streak = 0;
  const checkDay = new Date();
  while (activeDays.has(checkDay.toISOString().slice(0, 10))) { streak++; checkDay.setDate(checkDay.getDate() - 1); }

  /* transaction groups */
  type Group = { label: string; items: typeof transactions };
  const groups: Group[] = [];
  const seen = new Map<string, Group>();
  for (const tx of transactions.slice(0, 20)) {
    const d = tx.createdAt.slice(0, 10);
    const lbl = d === today ? "Today" : d === new Date(Date.now() - 86400000).toISOString().slice(0, 10) ? "Yesterday"
      : new Date(d).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    if (!seen.has(lbl)) { const g = { label: lbl, items: [] as typeof transactions }; groups.push(g); seen.set(lbl, g); }
    seen.get(lbl)!.items.push(tx);
  }

  if (loading) return (
    <div className="bg-bg min-h-[calc(100vh-68px)] grid place-items-center">
      <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
    </div>
  );

  return (
    <div className="bg-bg min-h-[calc(100vh-68px)]">
      <div className="mx-auto max-w-[1180px] px-5 md:px-8 animate-page">

        {/* ══════════════════ HERO ══════════════════════════════ */}
        <div className="relative overflow-hidden bg-night rounded-[1.4rem] px-6 md:px-8 pt-7 pb-8 mt-6">
          {/* ambient glows */}
          <div aria-hidden className="pointer-events-none absolute -top-16 right-[20%] h-56 w-56 rounded-full bg-ochre-400/12 blur-[70px]" />
          <div aria-hidden className="pointer-events-none absolute bottom-0 left-[5%] h-40 w-40 rounded-full bg-sage-500/10 blur-[60px]" />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* level ring + name */}
            <div className="flex items-center gap-5 shrink-0">
              <div className="relative">
                <Ring pct={progressPct} color={currentLevel.ring} size={88} />
                <span className="absolute inset-0 grid place-items-center font-display font-bold text-white text-[1.1rem]">
                  {currentLevel.n}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-night-muted">Level {currentLevel.n}</p>
                <h1 className="mt-0.5 font-display text-[2rem] font-medium leading-none" style={{ color: currentLevel.ring }}>
                  {currentLevel.name}
                </h1>
                <p className="mt-1 text-night-muted text-xs italic">{currentLevel.tagline}</p>
              </div>
            </div>

            {/* progress to next */}
            <div className="flex-1 min-w-0">
              {nextLevel && seedsToNext > 0 ? (
                <>
                  <div className="flex items-center justify-between text-[11px] text-night-muted mb-2">
                    <span className="font-semibold">{seedsToNext} seeds to <span style={{ color: nextLevel.ring }}>{nextLevel.name}</span></span>
                    <span>{progressPct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full animate-ring-fill transition-all duration-700"
                      style={{ width: `${progressPct}%`, background: currentLevel.ring }} />
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-[11px] text-night-muted/60">
                    <span>{currentLevel.name} {currentLevel.min}</span>
                    <span className="flex-1 h-px bg-night-border/40" />
                    <span>{nextLevel.name} {nextLevel.min}</span>
                  </div>
                </>
              ) : (
                <div className="text-sm font-semibold text-ochre-300">Max level reached. Ancient wisdom achieved.</div>
              )}
            </div>

            {/* stats row */}
            <div className="flex items-center gap-6 lg:gap-8 shrink-0">
              {[["Total", total, true], ["Today", todayEarned, false], ["This week", weekEarned, false]].map(([lbl, val, big]) => (
                <div key={lbl as string} className="text-center">
                  <div className={`font-display font-semibold leading-none text-night-fg ${big ? "text-[2.2rem]" : "text-[1.4rem]"}`}>
                    {big ? <CountUp to={val as number} /> : `+${val}`}
                  </div>
                  <div className="text-[10px] text-night-muted mt-1.5 uppercase tracking-[0.14em]">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pb-8 pt-5 space-y-4">

          {/* ══════════════════ LEVEL JOURNEY (horizontal) ════════════════ */}
          <div className="bg-surface border border-border/60 rounded-[1.4rem] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[0.95rem] font-semibold text-fg-strong">Level journey</h2>
              <span className="text-[11px] text-fg-muted">{lifetimeEarned} lifetime Seeds</span>
            </div>

            {/* horizontal milestone path — scrollable on small screens */}
            <div className="overflow-x-auto -mx-1 px-1 pb-1">
              <div className="flex items-start min-w-max gap-0">
                {LEVELS.map((lvl, i) => {
                  const past = total > (lvl.max ?? Infinity);
                  const active = lvl.n === currentLevel.n;
                  const future = !past && !active;
                  return (
                    <div key={lvl.n} className="flex items-center">
                      {/* connector */}
                      {i > 0 && (
                        <div className="h-[2px] w-8 shrink-0 transition-all duration-500"
                          style={{ background: past ? lvl.ring : active ? currentLevel.ring : "#e2ddd6", opacity: future ? 0.3 : 1 }} />
                      )}
                      {/* node + label */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`relative w-10 h-10 rounded-full grid place-items-center border-2 transition-all duration-300 ${
                          active ? "shadow-[0_0_0_4px_rgba(47,58,50,0.12)]" : past ? "" : "opacity-30"
                        }`} style={{
                          borderColor: active || past ? lvl.ring : "#d8d2c8",
                          background: active ? lvl.ring : past ? `${lvl.ring}28` : "transparent",
                        }}>
                          {past && !active && <Ic d={ICONS.check} className="w-3.5 h-3.5" style={{ color: lvl.ring } as React.CSSProperties} />}
                          {active && <span className="font-display font-bold text-white text-[0.8rem]">{lvl.n}</span>}
                          {future && <span className="font-display font-bold text-[10px] text-fg-muted/50">{lvl.n}</span>}
                          {active && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-ochre-400 border border-surface animate-pulse-soft" />
                          )}
                        </div>
                        <div className="text-center w-14">
                          <div className={`text-[10px] font-semibold leading-tight ${active ? "text-fg-strong" : past ? "text-fg-muted" : "text-fg-muted/35"}`}>{lvl.name}</div>
                          <div className={`text-[9px] mt-0.5 ${past || active ? "text-fg-muted/55" : "text-fg-muted/25"}`}>
                            {lvl.min >= 1000 ? `${(lvl.min/1000).toFixed(0)}k` : lvl.min}{lvl.max ? `–${lvl.max >= 1000 ? `${(lvl.max/1000).toFixed(0)}k` : lvl.max}` : "+"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ══════════════════ MID ROW: Streak + Rewards ════════════════ */}
          <div className="grid md:grid-cols-[1fr_1fr] gap-5">

            {/* STREAK HEATMAP */}
            <div className="bg-surface border border-border/60 rounded-[1.4rem] p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[0.95rem] font-semibold text-fg-strong">Activity streak</h2>
                  <p className="text-[11px] text-fg-muted mt-0.5">Last 28 days</p>
                </div>
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${streak > 0 ? "bg-ochre-50 border border-ochre-200" : "bg-surface-2 border border-border/60"}`}>
                  <Ic d={ICONS.flame} className={`w-3.5 h-3.5 ${streak > 0 ? "text-ochre-600" : "text-fg-muted/40"}`} />
                  <span className={`font-display text-base font-semibold leading-none ${streak > 0 ? "text-ochre-700" : "text-fg-muted/50"}`}>{streak}</span>
                  <span className={`text-[10px] font-medium ${streak > 0 ? "text-ochre-600" : "text-fg-muted/40"}`}>day{streak !== 1 ? "s" : ""}</span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {["M","T","W","T","F","S","S"].map((d, i) => (
                  <div key={`h-${i}`} className="text-center text-[9px] text-fg-muted/45 font-semibold pb-1">{d}</div>
                ))}
                {days28.map((d) => {
                  const future = d > today, active = activeDays.has(d), isToday = d === today;
                  return (
                    <div key={d} title={d} className={`aspect-square rounded transition-all duration-200 ${
                      future ? "bg-transparent"
                      : active && isToday ? "bg-ochre-400 shadow-[0_0_0_1.5px_rgba(219,172,82,0.4)]"
                      : active ? "bg-sage-400/75"
                      : "bg-border/25"
                    }`} />
                  );
                })}
              </div>
              {streak === 0 && (
                <p className="mt-3 text-[11px] text-fg-muted/60 text-center">Log a mood check-in today to start your streak</p>
              )}
              <div className="mt-2.5 flex items-center gap-2 text-[10px] text-fg-muted/50">
                <span className="w-2.5 h-2.5 rounded-sm bg-border/25 shrink-0" /><span>No activity</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-sage-400/75 ml-2 shrink-0" /><span>Active</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-ochre-400 ml-2 shrink-0" /><span>Today</span>
              </div>
            </div>

            {/* UNLOCK REWARDS */}
            <div className="bg-surface border border-border/60 rounded-[1.4rem] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[0.95rem] font-semibold text-fg-strong">Unlock rewards</h2>
                  <p className="text-[11px] text-fg-muted mt-0.5">Redeem with Seeds when you book</p>
                </div>
                <span className="text-[11px] font-bold text-fg-strong">{total} <span className="text-fg-muted font-medium">Seeds</span></span>
              </div>
              <div className="space-y-3">
                {REDEMPTIONS.map((r) => {
                  const pct = Math.min(100, Math.round((total / r.seeds) * 100));
                  const unlocked = total >= r.seeds;
                  return (
                    <div key={r.seeds} className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                      unlocked ? "border-sage-200 bg-sage-50" : "border-border/60 bg-surface-2/40"
                    }`}>
                      {/* tier color strip */}
                      <div className={`absolute left-0 inset-y-0 w-1 rounded-l-2xl bg-gradient-to-b ${r.color} opacity-80`} />
                      <div className="pl-4 pr-4 py-3.5 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 bg-gradient-to-br ${r.color}`}>
                          <Ic d={ICONS[r.icon]} className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-semibold leading-tight ${unlocked ? "text-sage-700" : "text-fg-strong"}`}>
                            {r.label}
                          </div>
                          {unlocked ? (
                            <div className="text-[11px] font-bold text-sage-600 mt-0.5 flex items-center gap-1">
                              <Ic d={ICONS.check} className="w-3 h-3" strokeWidth={2.5} /> Unlocked
                            </div>
                          ) : (
                            <div className="mt-1.5 h-1 rounded-full bg-border/40 overflow-hidden">
                              <div className={`h-full rounded-full bg-gradient-to-r ${r.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[11px] font-bold text-fg-strong">{r.seeds}</div>
                          <div className="text-[9px] text-fg-muted uppercase tracking-wide">Seeds</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ══════════════════ ACHIEVEMENTS ══════════════════════════════ */}
          <div className="bg-surface border border-border/60 rounded-[1.4rem] p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[0.95rem] font-semibold text-fg-strong">Achievements</h2>
                <p className="text-[11px] text-fg-muted mt-0.5">{earned.size} of {Object.keys(ACH).length} collected</p>
              </div>
              {/* rarity legend */}
              <div className="hidden sm:flex items-center gap-3 text-[10px] text-fg-muted">
                {(["common","uncommon","rare","epic"] as Rarity[]).map((r) => (
                  <span key={r} className={`rounded-full px-2 py-0.5 border ${RARITY_STYLES[r].badge} border-current/30`}>{r}</span>
                ))}
              </div>
            </div>

            {/* progress bar */}
            <div className="h-1 rounded-full bg-border/40 overflow-hidden mb-5">
              <div className="h-full rounded-full bg-gradient-to-r from-sage-400 to-ochre-400 transition-all duration-700"
                style={{ width: `${(earned.size / Object.keys(ACH).length) * 100}%` }} />
            </div>

            {/* 7 achievements: 4-col mobile → 7-col desktop so no orphan */}
            <div className="grid grid-cols-4 lg:grid-cols-7 gap-3">
              {Object.entries(ACH).map(([slug, def], idx) => {
                const got = earned.has(slug);
                const earnedAt = achievements.find((a) => a.slug === slug)?.earnedAt;
                const rs = RARITY_STYLES[def.rarity];
                return (
                  <div key={slug}
                    title={got ? `${def.label} — ${def.desc}` : `Locked: ${def.unlockHint}`}
                    className={`relative rounded-2xl border p-4 flex flex-col items-center text-center transition-all duration-300 ${
                      got
                        ? `${rs.bg} ${rs.border} ${rs.glow} animate-pop-in`
                        : "bg-surface-2/50 border-border/40"
                    }`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* rarity badge */}
                    {got && (
                      <span className={`absolute top-2 right-2 text-[8px] font-bold uppercase tracking-wide rounded-full px-1.5 py-0.5 border ${rs.badge} border-current/20`}>
                        {def.rarity}
                      </span>
                    )}

                    {/* icon container */}
                    <div className={`relative w-12 h-12 rounded-2xl grid place-items-center mb-3 transition-all duration-300 ${
                      got ? `bg-gradient-to-br ${def.rarity === "epic" ? "from-accent/20 to-accent/10" : def.rarity === "rare" ? "from-ochre-200/60 to-ochre-100/40" : def.rarity === "uncommon" ? "from-sage-200/60 to-sage-100/40" : "from-surface to-surface-2"} border ${rs.border}` : "bg-border/20 border border-border/30"
                    }`}>
                      {got ? (
                        <Ic d={ICONS[def.icon]} className="w-5 h-5" style={{ color: def.rarity === "epic" ? "var(--color-accent)" : def.rarity === "rare" ? "#c7943c" : def.rarity === "uncommon" ? "#587a4f" : "#7d8a7e" } as React.CSSProperties} />
                      ) : (
                        <Ic d={ICONS.lock} className="w-4 h-4 text-fg-muted/30" />
                      )}
                    </div>

                    <div className={`text-xs font-semibold leading-tight ${got ? rs.text : "text-fg-muted/40"}`}>{def.label}</div>
                    <div className={`text-[10px] mt-1 leading-snug ${got ? "text-fg-muted" : "text-fg-muted/30"}`}>
                      {got ? (earnedAt ? relTime(earnedAt) : "Earned") : def.unlockHint}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ══════════════════ EARN TODAY + HISTORY ══════════════════════ */}
          <div className="grid md:grid-cols-[1fr_1fr] gap-4 items-start">

            {/* EARN TODAY */}
            <div className="bg-surface border border-border/60 rounded-[1.4rem] p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[0.95rem] font-semibold text-fg-strong">Earn today</h2>
                <span className="text-[11px] text-fg-muted">
                  {transactions.filter(t => ["daily_checkin","journal_entry","breathing_session","assessment","resource_read"].includes(t.reason) && t.createdAt.slice(0,10) === today).length} / 5 done
                </span>
              </div>
              <div className="space-y-1">
                {([
                  { reason: "daily_checkin",     label: "Daily check-in",    seeds: 5,  route: "/dashboard", icon: "star" as const,  accent: "bg-surface-2 text-fg-muted" },
                  { reason: "journal_entry",     label: "Journal entry",     seeds: 10, route: "/journal",   icon: "pen" as const,   accent: "bg-sage-50 text-sage-600" },
                  { reason: "breathing_session", label: "Breathing session", seeds: 8,  route: "/breathe",   icon: "wind" as const,  accent: "bg-surface-2 text-fg-muted" },
                  { reason: "assessment",        label: "Self-assessment",   seeds: 15, route: "/assess",    icon: "eye" as const,   accent: "bg-ochre-50 text-ochre-600" },
                  { reason: "resource_read",     label: "Read an article",   seeds: 3,  route: "/resources", icon: "leaf" as const,  accent: "bg-sage-50 text-sage-500" },
                ] as const).map((op) => {
                  const done = transactions.some((t) => t.reason === op.reason && t.createdAt.slice(0, 10) === today);
                  return (
                    <button key={op.reason} onClick={() => !done && navigate(op.route)}
                      className={`w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-all duration-200 ${done ? "cursor-default" : "hover:bg-surface-2/60"}`}>
                      <span className={`w-7 h-7 rounded-lg grid place-items-center shrink-0 ${done ? "bg-sage-100 text-sage-500" : op.accent}`}>
                        {done ? <Ic d={ICONS.check} className="w-3.5 h-3.5" strokeWidth={2.5} /> : <Ic d={ICONS[op.icon]} className="w-3.5 h-3.5" />}
                      </span>
                      <span className={`flex-1 text-sm ${done ? "line-through text-fg-muted/60" : "text-fg-strong font-medium"}`}>{op.label}</span>
                      <span className={`text-[11px] font-bold shrink-0 ${done ? "text-sage-400" : "text-sage-600 bg-sage-50 border border-sage-200/80 rounded-full px-2 py-0.5"}`}>
                        {done ? "✓" : `+${op.seeds}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TRANSACTION HISTORY */}
            <div className="bg-surface border border-border/60 rounded-[1.4rem] p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[0.95rem] font-semibold text-fg-strong">Activity</h2>
                <span className="text-[11px] text-fg-muted">{lifetimeEarned} total Seeds</span>
              </div>
              {groups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sage-50 border border-sage-100 grid place-items-center">
                    <Ic d={ICONS.leaf} className="w-5 h-5 text-sage-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-fg-strong">No activity yet</p>
                    <p className="text-[11px] text-fg-muted mt-0.5">Complete daily actions to start earning Seeds</p>
                  </div>
                  <button onClick={() => navigate("/dashboard")} className="h-8 px-4 rounded-full bg-accent text-primary-fg text-xs font-semibold hover:bg-accent-hover transition-colors">
                    Go to Overview
                  </button>
                </div>
              ) : (
                <div className="max-h-[240px] overflow-y-auto space-y-0.5">
                  {groups.map((g) => (
                    <div key={g.label}>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-fg-muted/50 pt-2.5 pb-1 first:pt-0">{g.label}</p>
                      {g.items.map((tx) => (
                        <div key={tx.id} className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-surface-2/50 transition-colors">
                          <span className="w-5 h-5 rounded-md bg-sage-50 text-sage-500 grid place-items-center shrink-0">
                            <Ic d={ICONS.leaf} className="w-3 h-3" />
                          </span>
                          <span className="flex-1 text-xs text-fg truncate">{prettyReason(tx.reason)}</span>
                          <span className="text-[10px] text-fg-muted/55">{relTime(tx.createdAt)}</span>
                          <span className={`text-xs font-bold tabular-nums ${tx.amount > 0 ? "text-sage-600" : "text-error"}`}>
                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
