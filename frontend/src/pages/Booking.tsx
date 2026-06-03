import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTherapist } from "../services/api";
import type { Therapist } from "../services/api";
import CalendarPicker from "../components/CalendarPicker";
import TimeSlotPicker from "../components/TimeSlotPicker";

const SESSION_TYPES = [
  { id: "video", label: "Video", desc: "Meet face-to-face online", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  { id: "chat", label: "Chat", desc: "Text-based session", icon: "M8 12h8m-8-4h8m-6 8H7l-4 3V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-7z" },
  { id: "voice", label: "Voice", desc: "Audio-only call", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.2l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.2-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" },
];

function initials(name = "") {
  const p = name.replace(/^Dr\.?\s+/i, "").trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}
function prettyDate(d: string) {
  return new Date(`${d}T00:00`).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}
function prettyTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function Booking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState("video");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchTherapist(parseInt(id)).then(setTherapist).catch(() => setTherapist(null));
  }, [id]);

  const canNext = (step === 1 && sessionType) || (step === 2 && date) || (step === 3 && time);
  const steps = ["Session type", "Date", "Time", "Review"];

  const proceed = () => {
    if (step < 4) { setStep(step + 1); return; }
    navigate("/checkout", {
      state: {
        therapistId: therapist?.id, therapistName: therapist?.name,
        sessionType: SESSION_TYPES.find((s) => s.id === sessionType)?.label,
        date, time, durationMin: 50, price: "₹—",
      },
    });
  };

  return (
    <div className="bg-bg min-h-[80vh]">
      <div className="mx-auto max-w-[1080px] px-5 md:px-8 py-10 md:py-14">
        <button onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))} className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg-strong transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>

        {/* stepper */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => {
            const n = i + 1;
            const active = n === step, done = n < step;
            return (
              <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className={`flex items-center gap-2 ${active || done ? "" : "opacity-50"}`}>
                  <span className={`w-7 h-7 rounded-full grid place-items-center text-xs font-semibold ${done ? "bg-accent text-primary-fg" : active ? "bg-accent/15 text-accent ring-1 ring-accent" : "bg-surface-2 text-fg-muted"}`}>
                    {done ? "✓" : n}
                  </span>
                  <span className="hidden sm:block text-sm font-medium text-fg-strong">{s}</span>
                </div>
                {n < steps.length && <span className="flex-1 h-px bg-border min-w-4" />}
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-6 items-start">
          {/* step content */}
          <div className="surface-raised rounded-2xl p-6 md:p-8 min-h-[340px]">
            {step === 1 && (
              <>
                <h2 className="font-display text-2xl text-fg-strong mb-1">How would you like to meet?</h2>
                <p className="text-sm text-fg-muted mb-6">Choose the format you're most comfortable with.</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {SESSION_TYPES.map((s) => (
                    <button key={s.id} onClick={() => setSessionType(s.id)} className={`text-left rounded-2xl border p-4 transition-colors ${sessionType === s.id ? "border-accent bg-clay-50/60 ring-1 ring-accent" : "border-border bg-surface hover:border-accent/50"}`}>
                      <span className="w-10 h-10 rounded-xl bg-clay-100 text-clay-700 grid place-items-center mb-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={s.icon} /></svg>
                      </span>
                      <div className="font-semibold text-fg-strong">{s.label}</div>
                      <div className="text-xs text-fg-muted mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="font-display text-2xl text-fg-strong mb-1">Pick a date</h2>
                <p className="text-sm text-fg-muted mb-6">Weekends shown as unavailable for this demo.</p>
                <div className="max-w-sm"><CalendarPicker value={date} onChange={(d) => { setDate(d); setTime(null); }} /></div>
              </>
            )}

            {step === 3 && date && (
              <>
                <h2 className="font-display text-2xl text-fg-strong mb-1">Choose a time</h2>
                <p className="text-sm text-fg-muted mb-6">{prettyDate(date)}</p>
                <TimeSlotPicker date={date} value={time} onChange={setTime} />
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="font-display text-2xl text-fg-strong mb-6">Review your session</h2>
                <dl className="space-y-3">
                  {[["Therapist", therapist?.name || "—"], ["Format", SESSION_TYPES.find((s) => s.id === sessionType)?.label], ["Date", date ? prettyDate(date) : "—"], ["Time", time ? `${prettyTime(time)} · 50 min` : "—"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-border pb-3 last:border-0">
                      <dt className="text-sm text-fg-muted">{k}</dt>
                      <dd className="text-sm font-semibold text-fg-strong">{v}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </div>

          {/* summary */}
          <aside className="md:sticky md:top-24 surface-raised rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-clay-300 to-clay-500 text-white grid place-items-center font-display font-semibold">{initials(therapist?.name)}</div>
              <div className="min-w-0">
                <div className="font-semibold text-fg-strong truncate">{therapist?.name || "Loading…"}</div>
                <div className="text-xs text-fg-muted truncate">{therapist?.title || ""}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
              <Row label="Format" value={SESSION_TYPES.find((s) => s.id === sessionType)?.label || "—"} />
              <Row label="Date" value={date ? prettyDate(date) : "—"} />
              <Row label="Time" value={time ? prettyTime(time) : "—"} />
              <Row label="Session fee" value="₹—" />
            </div>
            <button
              onClick={proceed}
              disabled={!canNext}
              className="mt-5 w-full h-12 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-all duration-300 shadow-lift disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {step < 4 ? "Continue" : "Confirm & pay"}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-fg-muted">{label}</span><span className="font-medium text-fg-strong">{value}</span></div>;
}
