import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { subscribeToNewsletter } from "../services/newsletter";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Find a therapist", to: "/therapists" },
      { label: "How it works", to: "/#journey" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", to: "/join" },
      { label: "Create account", to: "/join" },
    ],
  },
];

// TODO: Add real social profile URLs before launch
const socials: { label: string; href: string; icon: ReactNode }[] = [];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    const res = await subscribeToNewsletter(email);
    setLoading(false);
    if (res.success) {
      setSubscribed(true);
      setEmail("");
    } else {
      setError(res.message ?? "Something went wrong. Try again.");
    }
  };

  return (
    <footer className="relative isolate overflow-hidden bg-night text-night-fg">
      {/* one subtle ambient glow for quiet depth */}
      <div aria-hidden className="pointer-events-none absolute bottom-[-8rem] left-1/2 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-sage-500/8 blur-[150px]" />
      {/* top hairline */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-night-border to-transparent" />

      <div className="relative mx-auto flex min-h-[60vh] max-w-[1280px] flex-col px-5 md:px-8 lg:px-12">
        {/* ── top: brand + minimal nav ── */}
        <div className="grid gap-12 pt-16 md:pt-24 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          {/* brand + newsletter + socials */}
          <div className="max-w-sm">
            <Logo onDark />
            <p className="mt-5 text-[0.95rem] leading-relaxed text-night-muted">
              Therapy that meets you where you are. Get matched with a licensed
              therapist who truly fits.
            </p>

            <div className="mt-8">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-night-muted">Stay in the loop</div>
              {subscribed ? (
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-sage-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Thanks — we'll be in touch.
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-3 flex h-12 max-w-xs items-center rounded-full border border-night-border bg-night-2/60 pl-5 pr-1.5 backdrop-blur transition-colors focus-within:border-night-fg/30">
                  <label htmlFor="footer-email" className="sr-only">Email address</label>
                  <input
                    id="footer-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="Your email"
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-night-fg placeholder-night-muted outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    aria-label="Subscribe"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-primary-fg transition-all duration-300 hover:bg-accent-hover hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" /></svg>
                    )}
                  </button>
                </form>
              )}
              {error && (
                <p className="mt-2 text-xs text-ochre-400">{error}</p>
              )}
            </div>

            {socials.length > 0 && (
              <div className="mt-8 flex items-center gap-2.5">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-night-border text-night-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-night-fg/40 hover:text-night-fg"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* link columns */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h4 className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-night-fg/45">{col.title}</h4>
              <ul className="mt-5 space-y-3.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="group inline-flex items-center gap-1.5 text-[0.95rem] text-night-muted transition-colors duration-200 hover:text-night-fg">
                      {l.label}
                      <svg className="w-3.5 h-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ── legal row ── */}
        <div className="mt-16 flex flex-col gap-3 border-t border-night-border/60 pt-6 text-sm text-night-muted md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} WellNest</span>
            <Link to="/privacy" className="hover:text-night-fg transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-night-fg transition-colors">Terms of Service</Link>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-night-fg/60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Encrypted &amp; confidential. We never sell your data.</span>
          </div>
        </div>

        {/* ── oversized statement wordmark, anchored at the bottom ── */}
        <div className="mt-12 flex flex-1 items-end md:mt-16">
          <h2 aria-hidden className="w-full select-none whitespace-nowrap font-display font-semibold leading-[0.78] tracking-[-0.045em] text-[clamp(3.5rem,19vw,18.75rem)] text-night-fg/[0.14]">
            WellNest
          </h2>
        </div>
      </div>
    </footer>
  );
}
