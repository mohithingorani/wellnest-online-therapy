import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

/* Password reset. Two modes:
   - request: enter email → we send a reset link (backend endpoint needed)
   - reset:   arrived with ?token=... → set a new password
   Backend endpoints don't exist yet, so submission simulates success. */
export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [sent, setSent] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // TODO(backend): POST /users/forgot-password { email }
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSent(true);
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    setError("");
    // TODO(backend): POST /users/reset-password { token, password }
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-bg grain relative overflow-hidden flex items-center justify-center px-4 py-12 isolate">
      <div aria-hidden className="absolute pointer-events-none animate-blob w-[600px] h-[600px] bg-gradient-to-br from-sage-300/25 to-clay-400/15 blur-3xl rounded-full -top-32 -left-32" />
      <div aria-hidden className="absolute pointer-events-none animate-blob w-[500px] h-[500px] bg-gradient-to-br from-ochre-300/20 to-sage-300/15 blur-3xl rounded-full -bottom-24 -right-24" style={{ animationDelay: "6s" }} />

      <div className="relative w-full max-w-sm animate-fade-in-up">
        <div className="flex justify-center mb-6"><Link to="/" aria-label="WellNest home"><Logo /></Link></div>

        <div className="surface-raised rounded-[1.9rem] p-8 md:p-9">
          {/* RESET MODE */}
          {token ? (
            done ? (
              <Success
                title="Password updated"
                body="You can now sign in with your new password."
                cta={<button onClick={() => navigate("/signin")} className="mt-6 w-full h-12 rounded-full bg-accent text-primary-fg font-semibold hover:bg-accent-hover transition-colors">Back to sign in</button>}
              />
            ) : (
              <>
                <Head title="Set a new password" sub="Choose a strong password you'll remember." />
                {error && <ErrorBox msg={error} />}
                <form onSubmit={submitReset} className="space-y-4">
                  <Field id="password" label="New password" type="password" value={password} onChange={setPassword} placeholder="Min. 8 characters" minLength={8} />
                  <Field id="confirm" label="Confirm password" type="password" value={confirm} onChange={setConfirm} placeholder="Re-enter password" minLength={8} />
                  <Submit loading={loading} label="Update password" />
                </form>
              </>
            )
          ) : sent ? (
            <Success
              title="Check your email"
              body={`If an account exists for ${email || "that address"}, we've sent a link to reset your password.`}
              cta={<Link to="/signin" className="mt-6 inline-flex items-center justify-center w-full h-12 rounded-full bg-accent text-primary-fg font-semibold hover:bg-accent-hover transition-colors">Back to sign in</Link>}
            />
          ) : (
            <>
              <Head title="Reset your password" sub="Enter your email and we'll send you a reset link." />
              {error && <ErrorBox msg={error} />}
              <form onSubmit={submitRequest} className="space-y-4">
                <Field id="email" label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
                <Submit loading={loading} label="Send reset link" />
              </form>
              <p className="text-center mt-6 text-sm text-fg-muted">
                Remembered it?{" "}
                <Link to="/signin" className="text-accent font-semibold hover:text-accent-hover transition-colors">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Head({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="text-center mb-7">
      <h1 className="font-display text-[1.7rem] font-medium text-fg-strong tracking-[-0.02em]">{title}</h1>
      <p className="text-sm text-fg-muted mt-1.5">{sub}</p>
    </div>
  );
}
function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="mb-5 px-4 py-3 rounded-xl bg-error/10 border border-error/20">
      <p className="text-sm text-error leading-relaxed">{msg}</p>
    </div>
  );
}
function Field({ id, label, type, value, onChange, placeholder, minLength }: { id: string; label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string; minLength?: number }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-fg-strong mb-1.5">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        minLength={minLength}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/60 text-fg-strong text-sm placeholder:text-fg-muted/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/12 focus:bg-surface transition-all duration-200"
      />
    </div>
  );
}
function Submit({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading} className="group relative w-full inline-flex items-center justify-center gap-2 h-12 rounded-full font-semibold text-sm bg-accent text-primary-fg shadow-lift hover:bg-accent-hover transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0">
      {loading && <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
      {loading ? "Please wait…" : label}
    </button>
  );
}
function Success({ title, body, cta }: { title: string; body: string; cta: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-success/15 text-success grid place-items-center">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      </div>
      <h1 className="mt-5 font-display text-[1.6rem] font-medium text-fg-strong tracking-[-0.02em]">{title}</h1>
      <p className="mt-2 text-sm text-fg-muted leading-relaxed">{body}</p>
      {cta}
    </div>
  );
}
