import { useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/Logo";

/* ── Social icon marks ── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-5 h-5">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.3 0-9.7-2.6-11.3-7l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C41.1 35.7 44 30.4 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}
/* ── Password strength logic ── */
function passwordStrength(pw: string) {
  if (!pw) return { label: "", level: 0, color: "", bars: 0 };
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
  return { ...steps[Math.min(score, 4) - 1], level: Math.min(score, 5), bars: Math.min(score, 5) };
}

/* ── Shared input classes ── */
const inputBase =
  "w-full rounded-xl border border-border/70 bg-[#f5f2ec] px-4 py-3 text-[0.95rem] text-fg-strong placeholder:text-fg-muted/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 focus:bg-surface transition-all duration-200";
const inputWithIcon = "pl-11";

/* ── Small helpers ── */
function EnvIcon({ path }: { path: string }) {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function Join({ mode: initialMode = "login" }: { mode?: "login" | "signup" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/dashboard";
  const { login, signup, googleAuth } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const isLogin = mode === "login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggle = useCallback(() => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError("");
    setConfirmEmail("");
  }, []);

  const strength = passwordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && email !== confirmEmail) {
      setError("Email addresses don't match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await login(email, password);
        navigate(from, { replace: true });
      } else {
        await signup(name, email, password);
        navigate("/dashboard?welcome=1", { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : isLogin ? "Invalid email or password" : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = useCallback(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === "your_google_client_id_here") {
      setError("Google sign-in is not configured yet. Add your Google Client ID to the .env file.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: google.accounts.id.CredentialResponse) => {
          try {
            await googleAuth(response.credential);
            navigate(isLogin ? from : "/dashboard?welcome=1", { replace: true });
          } catch (err) {
            setError(err instanceof Error ? err.message : "Google sign-in failed");
          } finally {
            setLoading(false);
          }
        },
      });
      google.accounts.id.prompt();
    } catch {
      setLoading(false);
      setError("Failed to initialize Google sign-in. Check your Google Client ID.");
    }
  }, [googleAuth, navigate, from, isLogin]);

  return (
    <div className="relative min-h-dvh bg-[#efece4] grain flex items-stretch justify-center overflow-hidden isolate lg:p-4">
      {/* background blobs — mobile ambience */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-sage-300/30 to-sage-400/10 blur-3xl lg:hidden animate-[fadeIn_0.8s_ease-out_forwards]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-br from-clay-300/25 to-ochre-300/10 blur-3xl lg:hidden animate-[fadeIn_0.8s_ease-out_forwards]" style={{ animationDelay: "0.2s" }} />

      {/* ── Back to home link ── */}
      <Link
        to="/"
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-2 text-xs font-medium text-fg-strong/70 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] backdrop-blur-md ring-1 ring-white/70 transition-all duration-300  hover:bg-white hover:text-fg-strong hover:shadow-soft lg:left-6 lg:top-6 animate-[fadeIn_0.4s_ease-out_forwards]"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to home
      </Link>

      <div className="relative w-full max-w-full lg:max-w-[1280px] lg:h-[min(860px,94vh)] lg:flex lg:shadow-[0_30px_80px_-40px_rgba(47,58,50,0.4)] lg:rounded-2xl animate-[fadeInUp_0.6s_ease-out_forwards]">

        {/* ── LEFT: image panel ── */}
        <div className="relative hidden lg:flex lg:w-[52%] lg:rounded-l-2xl lg:overflow-hidden animate-[fadeIn_0.6s_ease-out_forwards]">
          <img src="/join-sofa.png" alt="" className="absolute inset-0 h-full w-full object-cover object-left" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-[#efe9df]/55 via-[#efe9df]/10 to-transparent" />

          <div className="relative z-10 flex h-full flex-col p-10 xl:p-12">
            <Logo className="[&_span]:text-[1.5rem]" />

            <div className="mt-auto">
              <div className="inline-flex items-center gap-3 rounded-xl bg-white/30 px-4 py-3 ring-1 ring-white/45 backdrop-blur-md">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/45 text-sage-700">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </span>
                <div className="text-sm leading-snug text-fg-strong">
                  <div className="font-semibold">Your privacy is our priority.</div>
                  <div className="text-fg-strong/70">Secure, confidential, and HIPAA-compliant.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: form panel ── */}
        <div className="relative flex w-full flex-col bg-surface px-6 pb-10 pt-16 sm:px-10 lg:min-h-0 lg:w-[48%] lg:justify-center lg:rounded-r-2xl lg:px-12 lg:py-10 xl:px-14">
          <div className="mx-auto w-full max-w-[400px]">
            <div className="mb-6 flex justify-center lg:hidden animate-[fadeInUp_0.4s_ease-out_forwards]"><Logo /></div>

            <div key={mode} className="text-center animate-[fadeInUp_0.4s_ease-out_forwards]">
              <h1 className="font-display text-[1.8rem] font-medium tracking-[-0.02em] text-fg-strong">
                {isLogin ? "Welcome back" : "Create your account"}
              </h1>
              <p className="mt-1.5 text-[0.95rem] text-fg-muted">
                {isLogin ? "Sign in to continue your wellbeing journey." : "Start your wellbeing journey with us."}
              </p>
            </div>

            {/* ── Error banner ── */}
            {error && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-error/20 bg-error/10 px-4 py-3 animate-[fadeInUp_0.3s_ease-out_forwards]">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-error" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-sm leading-relaxed text-error">{error}</p>
              </div>
            )}

            {/* ── Form ── */}
            <form key={mode} onSubmit={handleSubmit} className="mt-6 space-y-4 animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: "0.1s" }}>
              {/* Name field — signup only */}
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-fg-strong">Full name</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted"><EnvIcon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></span>
                    <input
                      id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
                      placeholder="Your full name" className={`${inputBase} ${inputWithIcon}`}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-fg-strong">Email address</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted"><EnvIcon path="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></span>
                  <input
                    id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder="you@example.com" className={`${inputBase} ${inputWithIcon}`}
                  />
                </div>
              </div>

              {/* Confirm email — signup only */}
              {!isLogin && (
                <div>
                  <label htmlFor="confirmEmail" className="mb-1.5 block text-sm font-semibold text-fg-strong">Confirm email</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted"><EnvIcon path="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></span>
                    <input
                      id="confirmEmail" type="email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} required
                      placeholder="Re-enter your email" className={`${inputBase} ${inputWithIcon}`}
                    />
                  </div>
                  {confirmEmail && confirmEmail !== email && (
                    <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Emails don't match.
                    </p>
                  )}
                </div>
              )}

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-fg-strong">Password</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted"><EnvIcon path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder={isLogin ? "Enter your password" : "Min. 8 characters"}
                    className={`${inputBase} ${inputWithIcon}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-muted transition-colors hover:text-accent"
                  >
                    {showPassword ? (
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    ) : (
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>

                {/* Password strength — signup only */}
                {!isLogin && password && (
                  <div className="mt-2.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : "bg-border/60"}`}
                        />
                      ))}
                    </div>
                    <p className={`text-[0.7rem] mt-1.5 font-medium tracking-wide uppercase ${strength.level <= 2 ? "text-error" : "text-fg-muted"}`}>
                      {strength.label}
                    </p>
                  </div>
                )}
                {!isLogin && !password && (
                  <p className="mt-1.5 text-xs text-fg-muted/50">Must be at least 8 characters</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-semibold text-primary-fg shadow-lift transition-all duration-300 hover:bg-accent-hover  active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
                {loading
                  ? (isLogin ? "Signing in\u2026" : "Creating account\u2026")
                  : (isLogin ? "Sign in" : "Create account")}
                {!loading && <span className="transition-transform duration-300 group-hover:translate-x-0.5">&rarr;</span>}
              </button>
            </form>

            {/* ── Divider ── */}
            <div className="my-6 flex items-center gap-4 animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: "0.2s" }}>
              <span className="h-px flex-1 bg-border/60" />
              <span className="text-sm text-fg-muted">Or continue with</span>
              <span className="h-px flex-1 bg-border/60" />
            </div>

            {/* ── Social buttons ── */}
            <div className="animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: "0.25s" }}>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                aria-label="Continue with Google"
                className="flex w-full items-center justify-center gap-3 h-12 rounded-full border border-border bg-surface text-sm font-medium text-fg-strong transition-all duration-300 hover:bg-surface-2 hover:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </div>

            {/* ── Toggle mode ── */}
            <p className="mt-6 text-center text-sm text-fg-muted animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: "0.3s" }}>
              {isLogin ? "New here? " : "Already have an account? "}
              <button type="button" onClick={toggle} className="font-semibold text-accent transition-colors hover:text-accent-hover">
                {isLogin ? "Create an account" : "Log in"}
              </button>
            </p>

            {/* ── Privacy badge — mobile only ── */}
            <div className="pt-10 lg:hidden animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: "0.35s" }}>
              <div className="flex items-center gap-2.5 rounded-xl bg-sage-100/60 px-3.5 py-2.5 ring-1 ring-sage-200/50">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/70 text-sage-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </span>
                <div className="text-xs leading-snug text-fg-strong/80">
                  <span className="font-semibold">Your privacy is our priority.</span> Secure, confidential, and HIPAA-compliant.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
