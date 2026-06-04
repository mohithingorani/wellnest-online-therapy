import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/Logo";
import SEO from "../components/SEO";


function passwordStrength(pw: string) {
  if (!pw) return { label: "", level: 0, color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const steps = [
    { label: "Weak", color: "bg-error" },
    { label: "Fair", color: "bg-warning" },
    { label: "Good", color: "bg-ochre-400" },
    { label: "Strong", color: "bg-sage-500" },
    { label: "Very strong", color: "bg-success" },
  ];
  return { ...steps[Math.min(score, 4) - 1], level: Math.min(score, 5) };
}

const inp =
  "w-full rounded-lg border border-[#e2ddd6] bg-[#faf8f5] px-3.5 py-3 text-[0.9rem] text-fg-strong placeholder:text-fg-muted/45 outline-none focus:border-accent focus:ring-2 focus:ring-accent/12 transition-all duration-150";

export default function Join({ mode: initialMode = "login" }: { mode?: "login" | "signup" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const locState = location.state as { from?: string; resultState?: Record<string, unknown> } | null;
  const from = locState?.from || "/dashboard";
  const resultState = locState?.resultState;
  const { login, signup, googleAuth } = useAuth();

  /* If the user came from an assessment result page, return there after auth
     so the unlocked content is immediately visible and the assessment is saved. */
  const afterAuth = (isNewAccount: boolean) => {
    const isResultFrom = from.includes("/assess/") && from.includes("/result") && resultState;
    if (isNewAccount && isResultFrom) {
      navigate(from, { state: { ...resultState, justSignedUp: true }, replace: true });
    } else if (isNewAccount) {
      navigate("/dashboard?welcome=1", { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  };

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const isLogin = mode === "login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // toggle without remounting — just flip state, no key reset
  const toggle = useCallback((next: "login" | "signup") => {
    if (mode === next) return;
    setMode(next);
    setError("");
  }, [mode]);

  const strength = passwordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await login(email, password);
        afterAuth(false);
      } else {
        await signup(name, email, password);
        afterAuth(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : isLogin ? "Incorrect email or password." : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google sign-in — renderButton() is reliable for button-click flows.
  // prompt() is One Tap only and silently suppresses itself; renderButton()
  // renders a real iframe button that always works.
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const render = () => {
      if (!window.google || !googleBtnRef.current) {
        setTimeout(render, 200);
        return;
      }
      google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }: { credential: string }) => {
          setLoading(true);
          setError("");
          try {
            await googleAuth(credential);
            afterAuth(!isLogin);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Google sign-in failed.");
          } finally {
            setLoading(false);
          }
        },
      });
      // renderButton() embeds a real iframe button — works regardless of
      // One Tap suppression, dismissed state, or third-party cookie blocks.
      google.accounts.id.renderButton(googleBtnRef.current!, {
        type: "standard",
        theme: "filled_black",
        size: "large",
        shape: "rectangular",
        width: googleBtnRef.current!.getBoundingClientRect().width || 360,
        text: isLogin ? "signin_with" : "signup_with",
      });
    };
    render();
  // Re-render when mode changes so button text updates (sign in vs sign up)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  return (
    <div className="min-h-dvh bg-[#f5f1eb] flex items-stretch lg:items-center lg:justify-center lg:p-6">
      <SEO
        title={isLogin ? "Sign In" : "Create Account"}
        description={isLogin ? "Sign in to your WellNest account to access your therapy sessions, self-assessments, journal, and wellness tools." : "Create your free WellNest account to unlock your full recovery report, track your progress over time, and connect with licensed therapists."}
        canonical={isLogin ? "/join" : "/join"}
        noIndex
      />

      {/* back link — safe-area aware so it clears notch on iOS */}
      <Link
        to="/"
        className="fixed left-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/80 px-3 py-1.5 text-xs font-medium text-fg-muted backdrop-blur-sm transition-all hover:bg-white hover:text-fg-strong hover:shadow-soft"
        style={{ top: "max(16px, env(safe-area-inset-top, 16px))" }}
      >
        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back
      </Link>

      <div className="flex flex-col w-full max-w-[1180px] lg:flex-row lg:h-[min(740px,88vh)] lg:rounded-2xl lg:overflow-hidden lg:shadow-[0_20px_60px_-30px_rgba(47,58,50,0.35)]">

        {/* ── LEFT image panel ── */}
        <div className="relative hidden lg:block lg:w-[46%] shrink-0">
          <img src="/join-sofa.png" alt="" className="absolute inset-0 h-full w-full object-cover object-left" loading="lazy" decoding="async" />
          {/* gradient overlay for text legibility */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#1e1a14]/70 via-[#1e1a14]/10 to-transparent" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#1e1a14]/20 to-transparent" />

          {/* headline */}
          <div className="absolute bottom-12 left-8 right-8">
            <h2 className="font-display font-medium text-white leading-[1.05] tracking-[-0.025em] text-[2.4rem]">
              A calmer mind<br />starts <span className="italic text-clay-300">here.</span>
            </h2>
            <p className="mt-3 text-white/65 text-[0.95rem] leading-relaxed">
              Therapy that meets you where you are.<br />Compassionate. Personal. Effective.
            </p>
            {/* trust line */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-1.5 backdrop-blur-md ring-1 ring-white/20">
              <svg className="w-3.5 h-3.5 text-clay-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span className="text-xs text-white/80 font-medium">Secure, confidential, and private.</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT form panel ── */}
        {/* overflow-y-auto scrolls naturally from top — no justify-center (causes flex overflow
            to push content above the viewport where it can't be scrolled back to) */}
        <div className="flex flex-1 flex-col bg-white overflow-y-auto lg:min-h-0 px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-[380px] py-8 lg:py-10"
            style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 2rem))" }}>

            {/* logo — mobile top padding clears the fixed Back button */}
            <div className="pt-10 pb-6 sm:pt-12 lg:pt-0 lg:pb-6 flex items-center">
              <Logo />
            </div>

            {/* mode tabs */}
            <div className="flex rounded-xl bg-[#f5f1eb] p-1 mb-8">
              <button
                type="button"
                onClick={() => toggle("login")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-200 ${isLogin ? "bg-white text-fg-strong shadow-soft" : "text-fg-muted hover:text-fg"}`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => toggle("signup")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-200 ${!isLogin ? "bg-white text-fg-strong shadow-soft" : "text-fg-muted hover:text-fg"}`}
              >
                Sign up
              </button>
            </div>

            {/* heading — no key, no remount animation */}
            <div className="mb-7">
              <h1 className="font-display text-[1.75rem] font-medium tracking-[-0.02em] text-fg-strong leading-tight">
                {isLogin ? "Welcome back." : "Create your account."}
              </h1>
              <p className="mt-1.5 text-[0.9rem] text-fg-muted">
                {isLogin ? "Sign in to continue your wellbeing journey." : "Start your wellbeing journey with WellNest."}
              </p>
            </div>

            {/* error */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-error/20 bg-error/8 px-3.5 py-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-error" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-sm text-error leading-snug">{error}</p>
              </div>
            )}

            {/* form — fields animate via grid-rows trick to avoid height jumps */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* name — signup only, collapses smoothly */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ gridTemplateRows: isLogin ? "0fr" : "1fr", display: "grid" }}
              >
                <div className="min-h-0">
                  <div className={`transition-opacity duration-200 ${isLogin ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                    <label htmlFor="j-name" className="block text-[0.82rem] font-semibold text-fg-strong mb-1.5">Full name</label>
                    <input id="j-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required={!isLogin} placeholder="Your name" className={inp} />
                  </div>
                </div>
              </div>

              {/* email */}
              <div>
                <label htmlFor="j-email" className="block text-[0.82rem] font-semibold text-fg-strong mb-1.5">Email address</label>
                <input id="j-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" className={inp} />
              </div>

              {/* password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="j-pw" className="text-[0.82rem] font-semibold text-fg-strong">Password</label>
                  {isLogin && (
                    <Link to="/reset-password" className="text-[0.78rem] text-accent hover:text-accent-hover transition-colors">Forgot password?</Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="j-pw"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    placeholder={isLogin ? "Enter your password" : "Min. 8 characters"}
                    className={`${inp} pr-10`}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} aria-label={showPw ? "Hide" : "Show"} className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-accent transition-colors">
                    {showPw
                      ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
                {/* strength — signup */}
                {!isLogin && password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-0.5 flex-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : "bg-border/50"}`} />
                      ))}
                    </div>
                    <span className="text-[0.72rem] text-fg-muted font-medium w-16 text-right">{strength.label}</span>
                  </div>
                )}
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-semibold text-primary-fg transition-all duration-200 hover:bg-accent-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading && <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
                {loading ? (isLogin ? "Signing in…" : "Creating account…") : isLogin ? "Sign in" : "Create account"}
              </button>
            </form>

            {/* divider */}
            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-border/50" />
              <span className="text-[0.78rem] text-fg-muted">or</span>
              <span className="h-px flex-1 bg-border/50" />
            </div>

            {/* Google sign-in — rendered as a real iframe button by GSI.
                filled_black theme gives a solid dark bg that stands out from the white form.
                The wrapper clips the iframe to rounded-xl corners. */}
            <div className="overflow-hidden rounded-lg border border-[#e2ddd6]">
              <div
                ref={googleBtnRef}
                className="w-full [&>div]:!w-full [&_iframe]:!w-full [&_iframe]:!rounded-none"
              />
            </div>

            {/* bottom — already have account / create */}
            <p className="mt-7 text-center text-[0.82rem] text-fg-muted">
              {isLogin ? "New to WellNest? " : "Already have an account? "}
              <button type="button" onClick={() => toggle(isLogin ? "signup" : "login")} className="font-semibold text-fg-strong underline underline-offset-2 hover:text-accent transition-colors">
                {isLogin ? "Create an account" : "Log in"}
              </button>
            </p>

            {/* terms note */}
            <p className="mt-4 text-center text-[0.73rem] text-fg-muted/60 leading-relaxed">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="underline underline-offset-2 hover:text-fg-muted transition-colors">Terms</Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline underline-offset-2 hover:text-fg-muted transition-colors">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
