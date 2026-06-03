import { useNavigate, NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Logo from "./Logo";

const paths = [
  { name: "Therapists", path: "/therapists" },
  { name: "About", path: "/about" },
];

function initial(name?: string) {
  return name?.trim().charAt(0).toUpperCase() || "U";
}
function firstName(name?: string) {
  const first = name?.trim().split(" ")[0] || "";
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : "there";
}

const btnMaterial =
  "inline-flex items-center justify-center h-10 px-5 rounded-full font-semibold text-sm bg-accent text-primary-fg hover:bg-accent-hover transition shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
const btnGhost =
  "inline-flex items-center justify-center h-10 px-4 rounded-full font-semibold text-sm text-fg-strong hover:bg-surface transition-colors";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Transparent over the hero, frosted cream bar once you scroll.
  const transparent = location.pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const linkBase =
    "relative py-1 text-[0.95rem] font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:bg-accent after:transition-all after:duration-300";

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        transparent ? "bg-transparent" : "bg-bg md:bg-bg/80 md:backdrop-blur-xl border-b border-border"
      }`}
    >
      <nav className="grid grid-cols-[1fr_auto_1fr] md:flex md:justify-between items-center min-h-[68px] px-4 py-3 md:px-8 lg:px-12 mx-auto max-w-[1180px]">
        <button className="md:hidden p-2 -ml-2 justify-self-start text-fg-strong" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>

        <button onClick={() => navigate("/")} className="justify-self-center" aria-label="WellNest home">
          <Logo />
        </button>

        <div className="hidden md:flex justify-center gap-8 lg:gap-10">
          {location.pathname !== "/" && paths.map((p) => (
            <NavLink
              key={p.path}
              to={p.path}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "text-fg-strong after:w-full" : "text-fg-muted hover:text-fg-strong after:w-0 hover:after:w-full"}`
              }
            >
              {p.name}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "text-fg-strong after:w-full" : "text-fg-muted hover:text-fg-strong after:w-0 hover:after:w-full"}`
              }
            >
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="hidden md:flex justify-end gap-2 items-center">
          {user ? (
            <div className="relative group flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-b from-clay-400 to-clay-600 text-white flex items-center justify-center text-sm font-semibold shadow-soft">{initial(user.name)}</div>
              <span className="font-medium text-sm cursor-pointer text-fg-strong">{firstName(user.name)}</span>
              <div className="absolute right-0 top-full mt-2 w-44 surface-raised rounded-xl p-1 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-sm text-fg hover:bg-surface-2 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-fg-muted" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" /></svg>
                  Dashboard
                </Link>
                <Link to="/bookings" className="flex items-center gap-2.5 px-3 py-2 text-sm text-fg hover:bg-surface-2 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-fg-muted" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  My sessions
                </Link>
                <div className="my-1 h-px bg-border" />
                <button onClick={handleLogout} className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/join" className={btnGhost}>Log in</Link>
              <Link to="/join" className={btnMaterial}>Get started</Link>
            </>
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-bg flex flex-col">
          <div className="flex justify-between items-center px-4 py-3 border-b border-border">
            <button onClick={() => navigate("/")} aria-label="WellNest home"><Logo /></button>
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="p-2 text-fg-strong">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex flex-col items-center gap-7 pt-16 flex-1">
            {location.pathname !== "/" && paths.map((p) => (
              <NavLink key={p.path} to={p.path} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `font-display text-2xl ${isActive ? "text-accent" : "text-fg-strong"}`}>
                {p.name}
              </NavLink>
            ))}
            {user && (
              <>
                <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `font-display text-2xl ${isActive ? "text-accent" : "text-fg-strong"}`}>Dashboard</NavLink>
                <NavLink to="/bookings" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `font-display text-2xl ${isActive ? "text-accent" : "text-fg-strong"}`}>My sessions</NavLink>
                <NavLink to="/breathe" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `font-display text-2xl ${isActive ? "text-accent" : "text-fg-strong"}`}>Breathing</NavLink>
              </>
            )}
            <div className="flex flex-col gap-3 mt-6 w-64">
              {user ? (
                <>
                  <span className="text-center text-fg-muted">Signed in as <span className="font-semibold text-fg-strong">{firstName(user.name)}</span></span>
                  <button onClick={handleLogout} className="h-12 rounded-full font-semibold text-sm ring-1 ring-border text-fg-strong hover:bg-surface transition-colors">Log out</button>
                </>
              ) : (
                <>
                  <Link to="/join" onClick={() => setMobileMenuOpen(false)} className="h-12 flex items-center justify-center rounded-full font-semibold text-sm ring-1 ring-border text-fg-strong hover:bg-surface transition-colors">Log in</Link>
                  <Link to="/join" onClick={() => setMobileMenuOpen(false)} className="h-12 flex items-center justify-center rounded-full font-semibold text-sm bg-accent text-primary-fg">Get started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function LoginButton({ onClick }: { onClick?: () => void }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => { onClick?.(); navigate("/join"); }} className="inline-flex items-center justify-center h-10 px-4 rounded-full font-semibold text-sm text-fg-strong hover:bg-surface transition-colors">
      Log in
    </button>
  );
}
