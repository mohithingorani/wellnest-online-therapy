import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "./Logo";

function firstName(name?: string) {
  const f = name?.trim().split(" ")[0] || "";
  return f ? f[0].toUpperCase() + f.slice(1) : "there";
}

const NAV = [
  { to: "/dashboard", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { to: "/bookings", label: "Sessions", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
];
const SOON = [
  { label: "Messages", icon: "M8 12h8m-8-4h8m-6 8H7l-4 3V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-7z" },
  { label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function DashboardShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleLogout = async () => { await logout(); navigate("/"); };

  const Sidebar = (
    <div className="flex flex-col h-full bg-surface">
      <div className="px-5 h-16 flex items-center border-b border-border">
        <Link to="/" aria-label="WellNest home"><Logo /></Link>
      </div>
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Menu</p>
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? "bg-accent/12 text-accent" : "text-fg hover:bg-surface-2"}`
            }
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={n.icon} /></svg>
            {n.label}
          </NavLink>
        ))}
        {SOON.map((n) => (
          <span key={n.label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-fg-muted/60 cursor-not-allowed">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={n.icon} /></svg>
            {n.label}
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide rounded-full bg-surface-2 px-2 py-0.5">Soon</span>
          </span>
        ))}

        <div className="pt-4 mt-4 border-t border-border">
          <Link to="/therapists" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-fg hover:bg-surface-2 transition-colors">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
            Find a therapist
          </Link>
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-fg-muted hover:bg-surface-2 transition-colors">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to site
          </Link>
        </div>
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-clay-400 to-clay-600 text-white grid place-items-center font-display text-sm font-semibold shrink-0">{firstName(user?.name)[0]}</div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-fg-strong truncate">{firstName(user?.name)}</div>
            <div className="text-xs text-fg-muted truncate">{user?.email}</div>
          </div>
          <button onClick={handleLogout} aria-label="Log out" className="text-fg-muted hover:text-error transition-colors p-1.5 rounded-lg hover:bg-surface-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg grain flex">
      {/* desktop sidebar */}
      <aside className="hidden lg:block w-[248px] shrink-0 border-r border-border sticky top-0 h-screen">{Sidebar}</aside>

      {/* mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-night/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[260px] border-r border-border shadow-lift animate-slide-in-left">{Sidebar}</div>
        </div>
      )}

      {/* content */}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-30 h-16 px-4 flex items-center justify-between bg-bg/80 backdrop-blur-xl border-b border-border">
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-2 -ml-2 text-fg-strong">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <Logo />
          <span className="w-6" />
        </header>
        <Outlet />
      </div>
    </div>
  );
}
