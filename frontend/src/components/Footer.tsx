import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Find a therapist", to: "/therapists" },
      { label: "How it works", to: "/#how" },
      { label: "Pricing", to: "/#pricing" },
      { label: "About", to: "/about" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", to: "/signin" },
      { label: "Create account", to: "/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Privacy", to: "/about" },
      { label: "Contact", to: "/about" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-night text-night-fg">
      <div className="mx-auto max-w-[1180px] px-5 md:px-8 lg:px-12 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + newsletter */}
          <div>
            <Logo onDark />
            <p className="mt-4 text-sm text-night-muted max-w-xs leading-relaxed">
              Therapy that meets you where you are. Get matched with a licensed
              therapist who truly fits.
            </p>

            <div className="mt-6">
              <div className="text-sm font-semibold">Stay in the loop</div>
              {subscribed ? (
                <p className="mt-3 text-sm text-apricot-400">Thanks — we'll be in touch.</p>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-3 flex max-w-xs">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="h-11 flex-1 min-w-0 px-4 rounded-l-xl bg-night-2 border border-night-border border-r-0 text-sm text-night-fg placeholder-night-muted outline-none focus:border-indigo-400 transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="h-11 px-4 rounded-r-xl bg-gradient-to-b from-indigo-500 to-indigo-700 text-white flex items-center justify-center hover:brightness-110 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-night-fg">{col.title}</h4>
              <div className="mt-4 flex flex-col gap-2.5 text-sm text-night-muted">
                {col.links.map((l) => (
                  <Link key={l.label} to={l.to} className="w-fit hover:text-night-fg transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-night-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-night-muted">
          <div>© {new Date().getFullYear()} WellNest. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Encrypted &amp; confidential. We never sell your data.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
