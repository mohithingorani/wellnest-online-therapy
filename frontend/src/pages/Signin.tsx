import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Signin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/dashboard";
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg grain relative overflow-hidden flex items-center justify-center px-4 py-12 isolate">
      {/* Decorative background blobs — same language as landing page hero */}
      <div aria-hidden className="absolute pointer-events-none animate-blob w-[600px] h-[600px] bg-gradient-to-br from-sage-300/25 to-clay-400/15 blur-3xl rounded-full -top-32 -left-32" />
      <div aria-hidden className="absolute pointer-events-none animate-blob w-[500px] h-[500px] bg-gradient-to-br from-ochre-300/20 to-sage-300/15 blur-3xl rounded-full -bottom-24 -right-24" style={{ animationDelay: "6s" }} />
      <div aria-hidden className="absolute pointer-events-none animate-blob w-[320px] h-[320px] bg-gradient-to-br from-clay-200/20 to-ochre-200/10 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60" style={{ animationDelay: "12s" }} />

      {/* Main card */}
      <div className="relative w-full max-w-sm animate-fade-in-up">

        {/* Card */}
        <div className="surface-raised rounded-[1.9rem] p-8 md:p-9">
          <div className="text-center mb-7">
            <h1 className="font-display text-[1.7rem] font-medium text-fg-strong tracking-[-0.02em]">Welcome back</h1>
            <p className="text-sm text-fg-muted mt-1.5">Sign in to continue your journey</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-error/10 border border-error/20 flex items-start gap-2.5">
              <svg className="w-4 h-4 text-error mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm text-error leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-fg-strong mb-1.5">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface/60 text-fg-strong text-sm placeholder:text-fg-muted/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/12 focus:bg-surface transition-all duration-200"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-fg-strong">
                  Password
                </label>
                <Link to="/reset-password" className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-border bg-surface/60 text-fg-strong text-sm placeholder:text-fg-muted/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/12 focus:bg-surface transition-all duration-200"
                  placeholder="Enter your password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-muted hover:text-accent transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full inline-flex items-center justify-center gap-2 h-12 rounded-full font-semibold text-sm bg-accent text-primary-fg shadow-lift hover:bg-accent-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading && <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <span className="transition-transform duration-300">→</span>}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-fg-muted">
            Don't have an account?{" "}
            <Link to="/signup" className="text-accent font-semibold hover:text-accent-hover transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center mt-6 text-xs text-fg-muted/50">
          © 2026 WellNest. All rights reserved.
        </p>
      </div>
    </div>
  );
}
