import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { useToast } from "../../components/admin/Toast";

export default function AdminLogin() {
  const { admin, login, loading } = useAdminAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF8] dark:bg-bg">
        <div className="w-12 h-12 border-4 border-[#4a6b52] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (admin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast("Please fill in all fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      addToast("Welcome back!", "success");
      navigate("/admin");
    } catch (err) {
      addToast("Invalid credentials", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF8] dark:bg-bg px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#4a6b52] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl font-nunito">W</span>
          </div>
          <h1 className="text-2xl font-bold text-fg-strong dark:text-white font-playfair">WellNest Admin</h1>
          <p className="text-fg-muted dark:text-fg-muted font-nunito mt-2">Sign in to your admin account</p>
        </div>

        <div className="bg-white dark:bg-surface rounded-2xl p-8 border border-border dark:border-border shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-fg dark:text-fg-muted mb-1.5 font-nunito">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@wellnest.com"
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-border bg-white dark:bg-surface-2 text-fg-strong dark:text-white font-nunito text-sm focus:border-[#4a6b52] focus:ring-2 focus:ring-[#4a6b52]/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg dark:text-fg-muted mb-1.5 font-nunito">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-border bg-white dark:bg-surface-2 text-fg-strong dark:text-white font-nunito text-sm focus:border-[#4a6b52] focus:ring-2 focus:ring-[#4a6b52]/20 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-[#4a6b52] text-white font-nunito font-semibold rounded-xl hover:bg-[#3b5642] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-fg-muted hover:text-[#4a6b52] font-nunito">
            ← Back to WellNest
          </a>
        </div>
      </div>
    </div>
  );
}