import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getAssessment } from "../data/assessments";

const BAND_STYLES: Record<string, { bg: string; text: string; bar: string }> = {
  minimal: { bg: "bg-sage-100",  text: "text-sage-700",  bar: "bg-sage-500" },
  mild:    { bg: "bg-ochre-100", text: "text-ochre-700", bar: "bg-ochre-400" },
  moderate:{ bg: "bg-clay-50",   text: "text-clay-700",  bar: "bg-clay-500" },
  high:    { bg: "bg-error/10",  text: "text-error",     bar: "bg-error" },
};

export default function AssessmentResult() {
  const { type } = useParams<{ type: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const def = getAssessment(type ?? "");
  const state = location.state as { score: number; band: string; answers: Record<string, number>; seedsAwarded?: boolean } | null;

  if (!def || !state) {
    navigate("/assess", { replace: true });
    return null;
  }

  const result = def.result(state.band);
  const style = BAND_STYLES[state.band] ?? BAND_STYLES.mild;
  const maxScore = def.questions.length * 3;
  const pct = Math.round((state.score / maxScore) * 100);

  return (
    <div className="journal-canvas min-h-[calc(100vh-68px)]">
      <div className="mx-auto max-w-[680px] px-5 md:px-8 py-10 md:py-16 space-y-6">

        {/* result card */}
        <div className="surface-raised rounded-[1.6rem] p-7 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fg-muted mb-3">{def.title} · Your result</p>

          <div className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ${style.bg} ${style.text} mb-5`}>
            {result.headline}
          </div>

          {/* score bar */}
          <div className="mt-2">
            <div className="h-2 rounded-full bg-border/40 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${style.bar}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between mt-1.5 text-[11px] text-fg-muted">
              <span>Minimal</span><span>High</span>
            </div>
          </div>

          <p className="mt-5 text-fg leading-relaxed">{result.body}</p>
        </div>

        {/* steps */}
        <div className="surface-raised rounded-[1.6rem] p-7 md:p-8">
          <h3 className="font-display text-lg text-fg-strong mb-4">What you can do</h3>
          <ul className="space-y-3.5">
            {result.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-fg leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-accent/15 text-accent grid place-items-center shrink-0 mt-0.5 text-[10px] font-bold">{i + 1}</span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* seeds earned */}
        {state.seedsAwarded && (
          <div className="flex items-center gap-3 rounded-2xl bg-sage-100/70 ring-1 ring-sage-200/60 px-5 py-3.5">
            <span className="text-xl">🌱</span>
            <p className="text-sm text-fg-strong"><span className="font-semibold">+15 Seeds earned</span> for completing this assessment.</p>
          </div>
        )}

        {!state.seedsAwarded && (
          <div className="flex items-center gap-3 rounded-2xl bg-surface ring-1 ring-border px-5 py-3.5">
            <span className="text-xl">🌱</span>
            <p className="text-sm text-fg-muted">
              <button onClick={() => navigate("/join")} className="font-semibold text-accent hover:text-accent-hover transition-colors">Create a free account</button>
              {" "}to save your results and earn Seeds.
            </p>
          </div>
        )}

        {/* actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button onClick={() => navigate("/assess")} className="flex-1 h-11 rounded-full ring-1 ring-border text-sm font-semibold text-fg-strong hover:bg-surface-2 transition-colors">
            Take another assessment
          </button>
          <button onClick={() => navigate(state.seedsAwarded ? "/dashboard" : "/therapists")} className="flex-1 h-11 rounded-full bg-accent text-primary-fg text-sm font-semibold hover:bg-accent-hover transition-all shadow-lift">
            {state.seedsAwarded ? "Go to dashboard" : "Talk to a therapist →"}
          </button>
        </div>
      </div>
    </div>
  );
}
