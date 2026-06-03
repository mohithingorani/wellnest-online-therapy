import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // TODO(backend): call authService.requestPasswordReset(email)
      await new Promise((r) => setTimeout(r, 600));
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-border/70 bg-[#f5f2ec] px-4 py-3.5 text-[0.95rem] text-fg-strong placeholder:text-fg-muted/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 focus:bg-surface transition-all duration-200";

  return (
    <div className="min-h-screen bg-[#efece4] grain flex items-stretch justify-center lg:items-center lg:p-5">
      <div className="relative w-full overflow-hidden lg:max-w-[1360px] lg:h-[min(900px,92vh)] lg:flex lg:rounded-[2.4rem]">

        {/* ── LEFT: image panel ── */}
        <div className="relative hidden lg:block lg:flex-1">
          <img src="/join-sofa.png" alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-[#efe9df]/55 via-[#efe9df]/10 to-transparent" />
          <div className="relative z-10 flex h-full flex-col p-10 xl:p-14">
            <Logo className="[&_span]:text-[1.5rem]" />
            <div className="mt-16 max-w-md xl:mt-24">
              <h2 className="font-display font-medium leading-[1.04] tracking-[-0.025em] text-fg-strong text-[2.8rem] xl:text-[3.5rem]">
                We all forget<br />sometimes.
              </h2>
              <p className="mt-6 max-w-sm text-lg leading-relaxed text-fg-strong/75">
                Enter your email and we'll send you a link to reset your password.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: form panel ── */}
        <div className="relative flex min-h-screen w-full flex-col justify-center bg-surface px-6 py-10 sm:px-10 lg:min-h-0 lg:w-[46%] lg:rounded-[2.4rem] lg:shadow-[0_30px_80px_-40px_rgba(47,58,50,0.4)] xl:px-16">
          <div className="mx-auto w-full max-w-[400px]">

            <div className="mb-8 flex justify-center lg:hidden"><Logo /></div>

            {sent ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-success/15 text-success grid place-items-center mx-auto mb-5">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h1 className="font-display text-[2rem] font-medium tracking-[-0.02em] text-fg-strong">Check your inbox</h1>
                <p className="mt-3 text-fg-muted">
                  We sent a password reset link to <span className="font-semibold text-fg-strong">{email}</span>. It expires in 30 minutes.
                </p>
                <p className="mt-6 text-sm text-fg-muted">
                  Didn't receive it?{" "}
                  <button onClick={() => setSent(false)} className="font-semibold text-accent hover:text-accent-hover transition-colors">
                    Try again
                  </button>
                </p>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <h1 className="font-display text-[2rem] font-medium tracking-[-0.02em] text-fg-strong">Reset your password</h1>
                  <p className="mt-2 text-fg-muted">Enter your email and we'll send you a reset link.</p>
                </div>

                {error && (
                  <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-error/20 bg-error/10 px-4 py-3">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-error" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-sm leading-relaxed text-error">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="rp-email" className="mb-2 block text-sm font-semibold text-fg-strong">Email address</label>
                    <div className="relative">
                      <input
                        id="rp-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={`${inputCls} pr-11`}
                      />
                      <span aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-muted">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-accent text-base font-semibold text-primary-fg shadow-lift transition-all duration-300 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
                    {loading ? "Sending…" : "Send reset link"}
                  </button>
                </form>
              </>
            )}

            <p className="mt-8 text-center text-sm text-fg-muted">
              Remember your password?{" "}
              <Link to="/join" className="font-semibold text-accent transition-colors hover:text-accent-hover">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
