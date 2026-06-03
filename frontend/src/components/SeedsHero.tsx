import { useNavigate } from "react-router-dom";
import { useSeeds } from "../hooks/useSeeds";
import CountUp from "./CountUp";

/* SVG progress ring — 96px, animated on mount */
function ProgressRing({ pct, color, level }: { pct: number; color: string; level: number }) {
  const r = 40, cx = 48, cy = 48;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={96} height={96} viewBox="0 0 96 96" className="shrink-0">
      {/* track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={7} />
      {/* fill */}
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 48 48)"
        className="animate-ring-fill transition-all duration-700"
        style={{ strokeDashoffset: offset }}
      />
      {/* level number */}
      <text x={cx} y={cy + 5} textAnchor="middle" fill="white" fontSize={18} fontWeight="700" fontFamily="inherit">{level}</text>
    </svg>
  );
}

const EARN_OPS: { reason: string; label: string; seeds: number; route: string }[] = [
  { reason: "daily_checkin",     label: "Daily check-in",    seeds: 5,  route: "/dashboard" },
  { reason: "journal_entry",     label: "Journal entry",     seeds: 10, route: "/journal" },
  { reason: "breathing_session", label: "Breathing session", seeds: 8,  route: "/breathe" },
  { reason: "assessment",        label: "Self-assessment",   seeds: 15, route: "/assess" },
  { reason: "resource_read",     label: "Read an article",   seeds: 3,  route: "/resources" },
];

export default function SeedsHero() {
  const navigate = useNavigate();
  const { total, todayEarned, weekEarned, currentLevel, progressPct, seedsToNext, nextLevel, transactions, loading } = useSeeds();

  /* Which earn-ops are already done today */
  const today = new Date().toISOString().slice(0, 10);
  const doneToday = new Set(transactions.filter((t) => t.createdAt.slice(0, 10) === today).map((t) => t.reason));

  /* Last 7 days streak dots */
  const days7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const activeDays = new Set(transactions.filter((t) => t.amount > 0).map((t) => t.createdAt.slice(0, 10)));

  if (loading) {
    return (
      <div className="lg:col-span-3 card-feature rounded-[1.4rem] p-6 md:p-8 animate-pulse h-44" />
    );
  }

  return (
    <div className="lg:col-span-3 card-feature rounded-[1.4rem] overflow-hidden relative">
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-ochre-400/15 blur-[80px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-sage-500/10 blur-[60px]" />

      <div className="relative grid lg:grid-cols-[auto_1fr_auto] gap-6 p-6 md:p-7 items-center">

        {/* ── LEFT: ring + balance ── */}
        <div className="flex items-center gap-5">
          <ProgressRing pct={progressPct} color={currentLevel.ring} level={currentLevel.n} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-night-muted">{currentLevel.name}</p>
            <div className="font-display font-semibold leading-none text-ochre-300 text-[2.6rem] mt-1">
              <CountUp to={total} />
            </div>
            <p className="text-[11px] text-night-muted mt-1.5">Seeds</p>
            {nextLevel && seedsToNext > 0 && (
              <p className="text-[11px] text-night-muted/70 mt-1">
                <span className={`font-semibold ${currentLevel.accent}`}>{seedsToNext}</span> to {nextLevel.name}
              </p>
            )}
          </div>
        </div>

        {/* ── CENTER: stats + streak ── */}
        <div className="grid grid-cols-3 gap-4 lg:gap-6">
          <div className="text-center">
            <div className="font-display text-[1.8rem] font-semibold text-night-fg leading-none">+{todayEarned}</div>
            <div className="text-[11px] text-night-muted mt-1.5">Today</div>
          </div>
          <div className="text-center">
            <div className="font-display text-[1.8rem] font-semibold text-night-fg leading-none">+{weekEarned}</div>
            <div className="text-[11px] text-night-muted mt-1.5">This week</div>
          </div>
          <div className="text-center">
            <div className="font-display text-[1.8rem] font-semibold text-night-fg leading-none">{activeDays.has(today) ? "🔥" : "—"}</div>
            <div className="text-[11px] text-night-muted mt-1.5">Today active</div>
          </div>

          {/* 7-day streak dots */}
          <div className="col-span-3 flex items-center gap-1.5 justify-center pt-1">
            {days7.map((d, i) => {
              const active = activeDays.has(d);
              const isToday = i === 6;
              return (
                <div key={d} className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-full transition-all duration-300 ${
                    active
                      ? isToday
                        ? "bg-ochre-300 shadow-[0_0_0_3px_rgba(219,172,82,0.3)]"
                        : "bg-sage-400"
                      : "bg-white/10"
                  }`} />
                  <span className="text-[9px] text-night-muted/50">
                    {["M","T","W","T","F","S","S"][(new Date(d).getDay() + 6) % 7]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: earn today ── */}
        <div className="min-w-[200px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-night-muted mb-3">Earn today</p>
          <div className="space-y-2">
            {EARN_OPS.map((op) => {
              const done = doneToday.has(op.reason);
              return (
                <button
                  key={op.reason}
                  onClick={() => !done && navigate(op.route)}
                  className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all duration-200 ${
                    done
                      ? "bg-white/5 cursor-default"
                      : "bg-white/8 hover:bg-white/15 cursor-pointer"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full shrink-0 grid place-items-center transition-all ${
                    done ? "bg-sage-500" : "bg-white/10"
                  }`}>
                    {done
                      ? <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      : <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                    }
                  </span>
                  <span className={`flex-1 text-[12px] font-medium ${done ? "text-night-muted/60 line-through" : "text-night-fg"}`}>
                    {op.label}
                  </span>
                  <span className={`text-[11px] font-bold shrink-0 ${done ? "text-night-muted/40" : "text-ochre-300"}`}>
                    +{op.seeds}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* bottom bar — view full rewards */}
      <button
        onClick={() => navigate("/rewards")}
        className="relative w-full border-t border-night-border/40 flex items-center justify-center gap-2 py-3 text-[12px] font-semibold text-night-muted hover:text-night-fg hover:bg-white/[0.03] transition-all duration-200"
      >
        <span>View rewards &amp; history</span>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}
