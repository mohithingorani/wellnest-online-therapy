import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { getSeeds } from "../services/seeds";
import { getLevel, getProgressPct } from "../data/levels";

function firstName(name?: string) {
  const f = name?.trim().split(" ")[0] || "";
  return f ? f[0].toUpperCase() + f.slice(1) : "there";
}

const NAV = [
  { to: "/dashboard",  label: "Overview",    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { to: "/bookings",   label: "Sessions",    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { to: "/journal",    label: "Journal",     icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { to: "/breathe",    label: "Breathing",   icon: "M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" },
  { to: "/assess",     label: "Assessments", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { to: "/resources",  label: "Resources",   icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { to: "/messages",   label: "Messages",    icon: "M8 12h8m-8-4h8m-6 8H7l-4 3V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-7z" },
  { to: "/rewards",    label: "Rewards",     icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
];

export default function DashboardShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [seeds, setSeeds] = useState<number | null>(null);
  const [seedsPct, setSeedsPct] = useState(0);

  useEffect(() => {
    getSeeds().then((d) => {
      setSeeds(d.total);
      setSeedsPct(getProgressPct(d.total));
    }).catch(() => {});
  }, []);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleLogout = async () => { await logout(); navigate("/"); };

  const Sidebar = (
    <div className="flex flex-col h-full bg-surface-2 border-r border-border">
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-muted">Menu</p>
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? "bg-surface text-accent font-semibold shadow-[0_1px_2px_rgba(42,36,32,0.04),0_4px_10px_-8px_rgba(42,36,32,0.14)] ring-1 ring-border/70" : "text-fg hover:bg-white/60 hover:text-fg-strong"}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-accent transition-all duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"}`} />
                <svg className={`w-[18px] h-[18px] transition-colors duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? "text-accent" : "text-fg-muted group-hover:text-fg-strong"}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={n.icon} /></svg>
                {n.label}
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-border">
          <Link to="/therapists" onClick={() => setOpen(false)} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-fg hover:bg-white/60 hover:text-fg-strong transition-colors duration-200">
            <svg className="w-[18px] h-[18px] text-fg-muted transition-colors duration-200 group-hover:text-accent" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
            Find a therapist
          </Link>
          <Link to="/" onClick={() => setOpen(false)} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-fg-muted hover:bg-white/60 hover:text-fg-strong transition-colors duration-200">
            <svg className="w-[18px] h-[18px] transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to site
          </Link>
        </div>
      </nav>

      <div className="p-3 border-t border-border space-y-2">
        {/* Seeds mini-card */}
        <Link to="/rewards" className="group block rounded-xl bg-night/90 hover:bg-night transition-colors duration-200 px-3 py-2.5 ring-1 ring-night-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-night-muted">
              {seeds !== null ? getLevel(seeds).name : "Seeds"}
            </span>
            <span className="text-sm font-bold text-ochre-300">{seeds ?? "—"} 🌱</span>
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-ochre-300 transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: `${seedsPct}%` }}
            />
          </div>
        </Link>

        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/50 ring-1 ring-border/50 shadow-soft transition-colors duration-200 hover:bg-white/70">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-clay-400 to-clay-600 text-white grid place-items-center font-display text-sm font-semibold shrink-0 shadow-[0_4px_10px_-5px_rgba(184,88,56,0.55)] ring-1 ring-white/25">{firstName(user?.name)[0]}</div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-fg-strong truncate">{firstName(user?.name)}</div>
            <div className="text-xs text-fg-muted truncate">{user?.email}</div>
          </div>
          <button onClick={handleLogout} aria-label="Log out" className="text-fg-muted hover:text-error transition-colors p-1.5 rounded-lg hover:bg-white/60">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex min-h-[calc(100vh-68px)]">
      {/* desktop sidebar */}
      <aside className="hidden lg:block w-[248px] shrink-0 sticky top-[68px] h-[calc(100vh-68px)]">{Sidebar}</aside>

      {/* mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-night/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[260px] shadow-lift animate-slide-in-left">{Sidebar}</div>
        </div>
      )}

      {/* content with framer-motion page transitions */}
      {/* overflow visible — overflow-hidden clips drop shadows on cards */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
