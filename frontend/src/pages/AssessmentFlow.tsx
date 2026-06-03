import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAssessment } from "../data/assessments";
import { saveAssessment } from "../services/assessments";
import { useAuth } from "../contexts/AuthContext";

export default function AssessmentFlow() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const def = getAssessment(type ?? "");

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  if (!def) {
    return (
      <div className="journal-canvas min-h-[calc(100vh-68px)] grid place-items-center">
        <div className="text-center">
          <p className="text-fg-muted">Assessment not found.</p>
          <button onClick={() => navigate("/assess")} className="mt-4 h-10 px-5 rounded-full bg-accent text-primary-fg text-sm font-semibold">Back</button>
        </div>
      </div>
    );
  }

  const q = def.questions[current];
  const total = def.questions.length;
  const progress = ((current) / total) * 100;

  const handleAnswer = async (value: number) => {
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (current < total - 1) {
      setCurrent((c) => c + 1);
      return;
    }

    // last question — compute and save
    setSaving(true);
    const { score, band } = def.score(newAnswers);
    try {
      if (user) {
        await saveAssessment(def.id, score, band, newAnswers);
      }
    } catch {
      // non-fatal — still show result
    } finally {
      setSaving(false);
      navigate(`/assess/${def.id}/result`, { state: { score, band, answers: newAnswers, seedsAwarded: !!user } });
    }
  };

  const goBack = () => {
    if (current > 0) setCurrent((c) => c - 1);
    else navigate("/assess");
  };

  return (
    <div className="journal-canvas min-h-[calc(100vh-68px)] flex flex-col">
      <div className="mx-auto w-full max-w-[680px] px-5 md:px-8 py-8 flex flex-col flex-1">

        {/* progress */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={goBack} className="text-fg-muted hover:text-fg-strong transition-colors p-1 -ml-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex-1 h-1.5 rounded-full bg-border/50 overflow-hidden">
            <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-medium text-fg-muted tabular-nums w-12 text-right">{current + 1} of {total}</span>
        </div>

        {/* assessment title */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-clay-600 mb-1">{def.title}</p>

        {/* question */}
        <div className="flex-1 flex flex-col justify-center">
          <div key={current} className="animate-fade-in-up">
            <h2 className="font-display text-[1.6rem] md:text-[1.9rem] font-medium text-fg-strong leading-[1.1] tracking-[-0.02em]">
              {q.text}
            </h2>
            <p className="mt-2 text-sm text-fg-muted">Over the last 2 weeks...</p>

            <div className="mt-8 space-y-3">
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    disabled={saving}
                    className={`group w-full flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 ${
                      selected
                        ? "border-accent bg-accent/8 text-fg-strong"
                        : "border-border bg-surface hover:border-accent/50 hover:bg-surface-2/60"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full border-2 shrink-0 grid place-items-center transition-all ${selected ? "border-accent bg-accent" : "border-border group-hover:border-accent/60"}`}>
                      {selected && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </span>
                    <span className={`text-sm font-medium ${selected ? "text-accent" : "text-fg"}`}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {saving && (
          <div className="flex items-center gap-2 justify-center py-4 text-sm text-fg-muted">
            <span className="w-4 h-4 rounded-full border-2 border-border border-t-accent animate-spin" />
            Saving your results…
          </div>
        )}
      </div>
    </div>
  );
}
