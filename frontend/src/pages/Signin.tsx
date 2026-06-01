import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Signin() {
  const navigate = useNavigate();
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
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* Header */}
      <header className="relative z-10 flex justify-center py-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img className="w-8 h-8" src="/logos/wellnest.svg" alt="WellNest" />
          <span className="font-nunito font-bold text-xl text-[#47898E]">WellNest</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="bg-[#F5F1ED] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="font-playfair text-2xl text-[#0D393E] mb-1">Welcome back</h1>
              <p className="font-nunito text-sm text-[#3E464E]">Sign in to continue your journey</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm text-red-600 font-nunito">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#0D393E] mb-1.5 font-nunito">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E8E2DD] font-nunito text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/10 transition-all duration-200 bg-white/80"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#0D393E] mb-1.5 font-nunito">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-11 rounded-lg border border-[#E8E2DD] font-nunito text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/10 transition-all duration-200 bg-white/80"
                    placeholder="Enter your password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#47898E] transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#0D393E] text-white font-nunito font-medium text-sm rounded-lg hover:bg-[#2a5459] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Sign up link */}
            <p className="text-center mt-6 text-sm text-[#3E464E] font-nunito">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#0D393E] font-medium hover:text-[#47898E] transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center mt-6 text-xs text-[#9CA3AF] font-nunito">
            © 2026 WellNest. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}