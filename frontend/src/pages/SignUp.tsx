import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService, setAuthUser } from "../services/auth";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.signup({ name, email, password });
      if (response.success && response.data) {
        setAuthUser(response.data);
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
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
              <h1 className="font-playfair text-2xl text-[#0D393E] mb-1">Create your account</h1>
              <p className="font-nunito text-sm text-[#3E464E]">Start your wellness journey with us</p>
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
                <label htmlFor="name" className="block text-sm font-medium text-[#0D393E] mb-1.5 font-nunito">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E8E2DD] font-nunito text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/10 transition-all duration-200 bg-white/80"
                  placeholder="John Doe"
                  required
                />
              </div>

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
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E8E2DD] font-nunito text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/10 transition-all duration-200 bg-white/80"
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                />
                <p className="mt-1.5 text-xs text-[#9CA3AF] font-nunito">Must be at least 8 characters</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#0D393E] text-white font-nunito font-medium text-sm rounded-lg hover:bg-[#2a5459] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8E2DD]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#F5F1ED] px-3 text-[#9CA3AF] font-nunito">or</span>
              </div>
            </div>

            {/* Google button */}
            <button
              type="button"
              className="w-full py-2.5 px-4 bg-white border border-[#E8E2DD] text-[#0D393E] font-nunito text-sm font-medium rounded-lg hover:bg-[#F9F7F5] hover:border-[#D9D5CF] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Sign in link */}
            <p className="text-center mt-6 text-sm text-[#3E464E] font-nunito">
              Already have an account?{" "}
              <Link to="/signin" className="text-[#0D393E] font-medium hover:text-[#47898E] transition-colors">
                Sign in
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