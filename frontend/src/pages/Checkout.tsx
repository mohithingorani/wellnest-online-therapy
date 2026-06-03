import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { bookings } from "../services/bookings";

interface Draft {
  therapistId: number; therapistName: string; sessionType: string;
  date: string; time: string; durationMin: number; price: string;
}

const METHODS = [
  { id: "card", label: "Card", desc: "Visa, Mastercard, Amex" },
  { id: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm" },
  { id: "wallet", label: "Wallet", desc: "WellNest credits" },
];

function prettyDate(d: string) {
  return new Date(`${d}T00:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
function prettyTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const draft = location.state as Draft | null;
  const [method, setMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!draft?.therapistId) return <Navigate to="/therapists" replace />;

  const pay = async () => {
    setProcessing(true);
    setError("");
    // TODO(backend): create Razorpay/Stripe order, open checkout, verify signature.
    try {
      const b = bookings.create({
        therapistId: draft.therapistId, therapistName: draft.therapistName,
        sessionType: draft.sessionType, date: draft.date, time: draft.time,
        durationMin: draft.durationMin, price: draft.price,
      });
      navigate(`/booking/${b.id}/confirmed`, { replace: true });
    } catch {
      setProcessing(false);
      setError("Something went wrong completing your booking. Please try again.");
    }
  };

  return (
    <div className="bg-bg min-h-[80vh]">
      <div className="mx-auto max-w-[860px] px-5 md:px-8 py-10 md:py-14">
        <h1 className="font-display text-3xl md:text-4xl font-medium text-fg-strong tracking-[-0.02em]">Checkout</h1>
        <p className="text-sm text-fg-muted mt-1">You won't be charged until session pricing is finalized.</p>

        {error && <div className="mt-6 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-sm text-error">{error}</div>}

        <div className="mt-8 grid md:grid-cols-[1fr_300px] gap-6 items-start">
          {/* payment method */}
          <div className="surface-raised rounded-2xl p-6">
            <h2 className="font-display text-xl text-fg-strong mb-4">Payment method</h2>
            <div className="space-y-3">
              {METHODS.map((m) => (
                <button key={m.id} onClick={() => setMethod(m.id)} className={`w-full flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${method === m.id ? "border-accent bg-clay-50/60 ring-1 ring-accent" : "border-border bg-surface hover:border-accent/50"}`}>
                  <span className={`w-5 h-5 rounded-full border-2 grid place-items-center ${method === m.id ? "border-accent" : "border-border"}`}>
                    {method === m.id && <span className="w-2.5 h-2.5 rounded-full bg-accent" />}
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold text-fg-strong text-sm">{m.label}</span>
                    <span className="block text-xs text-fg-muted">{m.desc}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs text-fg-muted">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Payments are encrypted and processed securely.
            </div>
          </div>

          {/* order summary */}
          <aside className="surface-raised rounded-2xl p-6">
            <h2 className="font-display text-lg text-fg-strong mb-4">Order summary</h2>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-fg-muted">Therapist</dt><dd className="font-medium text-fg-strong text-right">{draft.therapistName}</dd></div>
              <div className="flex justify-between"><dt className="text-fg-muted">Session</dt><dd className="font-medium text-fg-strong">{draft.sessionType}</dd></div>
              <div className="flex justify-between"><dt className="text-fg-muted">When</dt><dd className="font-medium text-fg-strong text-right">{prettyDate(draft.date)} · {prettyTime(draft.time)}</dd></div>
            </dl>
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-baseline">
              <span className="text-fg-muted text-sm">Total</span>
              <span className="font-display text-2xl font-semibold text-fg-strong">{draft.price}</span>
            </div>
            <button onClick={pay} disabled={processing} className="mt-5 w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-all duration-300 shadow-lift disabled:opacity-50 disabled:hover:translate-y-0">
              {processing && <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
              {processing ? "Processing…" : "Confirm booking"}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
