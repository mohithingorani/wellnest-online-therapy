import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAssessment } from "../data/assessments";
import { saveAssessment } from "../services/assessments";
import { useAuth } from "../contexts/AuthContext";

/* ── per-type atmosphere (matches result page) ─────────────────── */
const TYPE_GLOW: Record<string, string> = {
  burnout: "radial-gradient(60% 70% at 20% 80%, rgba(201,121,90,0.18) 0%, transparent 65%)",
  gad7:    "radial-gradient(60% 70% at 20% 80%, rgba(74,107,82,0.16) 0%, transparent 65%)",
  stress:  "radial-gradient(60% 70% at 20% 80%, rgba(201,150,10,0.14) 0%, transparent 65%)",
  mood:    "radial-gradient(60% 70% at 20% 80%, rgba(74,107,82,0.14) 0%, transparent 65%)",
};

/* ── intensity pips — shows relative weight of each option ─────── */
function Pips({ count, filled, color }: { count: number; filled: boolean; color: string }) {
  return (
    <div className="flex gap-[3px] items-center">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-200"
          style={{
            width: 6,
            height: 6,
            background: i < count
              ? filled ? color : "rgba(0,0,0,0.18)"
              : "rgba(0,0,0,0.08)",
          }}
        />
      ))}
    </div>
  );
}

export default function AssessmentFlow() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const def = getAssessment(type ?? "");

  const [phase, setPhase] = useState<"intro" | "questions" | "saving">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const slide = (fn: () => void) => {
    setVisible(false);
    timerRef.current = setTimeout(() => { fn(); setVisible(true); }, 200);
  };

  const commit = useCallback(async (value: number) => {
    if (!def) return;
    const q = def.questions[current];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);
    setSelected(null);

    if (current < def.questions.length - 1) {
      setDirection("forward");
      slide(() => setCurrent((c) => c + 1));
      return;
    }

    setPhase("saving");
    const { score, band } = def.score(newAnswers);
    let seedsAwarded = false;
    try {
      if (user) {
        const saved = await saveAssessment(def.id, score, band, newAnswers);
        seedsAwarded = saved?.seedsAwarded ?? false;
      }
    } catch { /* non-fatal */ }
    navigate(`/assess/${def.id}/result`, { state: { score, band, answers: newAnswers, seedsAwarded } });
  }, [def, current, answers, user, navigate]);

  const handleAnswer = (value: number) => {
    if (selected !== null) return;
    setSelected(value);
    timerRef.current = setTimeout(() => commit(value), 320);
  };

  const goBack = () => {
    if (phase === "intro") { navigate("/assess"); return; }
    if (current === 0) { setPhase("intro"); return; }
    setDirection("back");
    slide(() => setCurrent((c) => c - 1));
  };

  /* keyboard: 1-4 selects the nth option */
  useEffect(() => {
    if (phase !== "questions" || !def) return;
    const q = def.questions[current];
    const handler = (e: KeyboardEvent) => {
      const n = parseInt(e.key);
      if (n >= 1 && n <= q.options.length && selected === null) {
        handleAnswer(q.options[n - 1].value);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, current, selected, def]);

  if (!def) {
    return (
      <div className="min-h-[calc(100vh-68px)] grid place-items-center bg-bg">
        <p className="text-fg-muted">Assessment not found.</p>
      </div>
    );
  }

  const total = def.questions.length;
  const glow = TYPE_GLOW[type ?? "burnout"] ?? TYPE_GLOW.burnout;

  /* ── INTRO ─────────────────────────────────────────────────────── */
  if (phase === "intro") {
    return (
      <div className="relative min-h-[calc(100vh-68px)] bg-night overflow-hidden flex flex-col">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />

        <div className="relative mx-auto w-full max-w-[560px] px-5 md:px-8 flex flex-col flex-1 py-8 md:py-12">
          {/* back */}
          <button
            onClick={() => navigate("/assess")}
            className="self-start flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-12"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            <span className="text-sm font-medium">All assessments</span>
          </button>

          <div className="flex-1 flex flex-col justify-center">
            {/* type chip */}
            <span
              className="self-start text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-7 border"
              style={{ color: def.accentFill, borderColor: `${def.accentFill}40`, background: `${def.accentFill}12` }}
            >
              {def.title}
            </span>

            {/* headline */}
            <h1 className="font-display font-semibold text-white leading-[1.0] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.6rem, 8vw, 4.2rem)" }}>
              {def.id === "gad7"    && <>Anxiety<br />Check</>}
              {def.id === "burnout" && <>Burnout<br />Screen</>}
              {def.id === "stress"  && <>Stress<br />Level</>}
              {def.id === "mood"    && <>Mood<br />Check</>}
            </h1>

            <p className="mt-5 text-white/55 text-[1.05rem] leading-relaxed max-w-xs font-medium">
              {def.description}
            </p>

            {/* meta row */}
            <div className="mt-10 flex flex-wrap gap-3">
              {[
                { label: def.duration,                           sub: "to complete" },
                { label: `${total} question${total > 1 ? "s" : ""}`, sub: "tap to answer" },
                { label: "Private",                              sub: "answers are yours" },
              ].map((m) => (
                <div key={m.label} className="rounded-2xl bg-white/[0.05] border border-white/[0.08] px-4 py-3">
                  <p className="text-[0.9rem] font-semibold text-white">{m.label}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setPhase("questions")}
            className="mt-10 w-full h-14 rounded-full font-semibold text-base text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-lift"
            style={{ background: def.accentFill }}
          >
            Start →
          </button>

          <p className="mt-4 text-center text-[11px] text-white/25">
            Press 1 – 4 on keyboard to answer
          </p>
        </div>
      </div>
    );
  }

  /* ── SAVING ─────────────────────────────────────────────────────── */
  if (phase === "saving") {
    return (
      <div className="min-h-[calc(100vh-68px)] bg-bg grid place-items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-border border-t-accent animate-spin" />
          <p className="text-sm text-fg-muted">Calculating your result…</p>
        </div>
      </div>
    );
  }

  /* ── QUESTIONS ──────────────────────────────────────────────────── */
  const q = def.questions[current];
  const pct = ((current + 1) / total) * 100;

  const slideStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : `translateX(${direction === "forward" ? "24px" : "-24px"})`,
    transition: visible
      ? "opacity 0.2s cubic-bezier(0.22,1,0.36,1), transform 0.2s cubic-bezier(0.22,1,0.36,1)"
      : "none",
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-bg flex flex-col">
      <div className="mx-auto w-full max-w-[560px] px-5 md:px-8 flex flex-col flex-1 pt-6 pb-8 md:pt-8 md:pb-10">

        {/* ── top chrome ── */}
        <div className="flex items-center gap-4 mb-10 md:mb-14">
          <button onClick={goBack} className="-ml-1 p-1.5 rounded-full text-fg-muted hover:text-fg-strong hover:bg-surface-2 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>

          {/* segmented progress */}
          <div className="flex-1 relative h-1 rounded-full bg-border/40 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: `${pct}%`, background: def.accentFill }}
            />
          </div>

          <span className="text-[12px] font-semibold tabular-nums text-fg-muted shrink-0">
            {current + 1}<span className="text-fg-muted/40"> / {total}</span>
          </span>
        </div>

        {/* ── question ── */}
        <div className="flex-1 flex flex-col justify-center" style={slideStyle}>

          {/* frame */}
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] mb-4"
            style={{ color: def.accentFill, opacity: 0.8 }}>
            {def.frame}
          </p>

          {/* question text */}
          <h2 className="font-display font-semibold text-fg-strong leading-[1.1] tracking-[-0.025em]"
            style={{ fontSize: "clamp(1.65rem, 5vw, 2.1rem)" }}>
            {q.text}
          </h2>

          {/* options */}
          <div className="mt-8 space-y-2">
            {q.options.map((opt, idx) => {
              const isSelected = selected === opt.value;
              const isAnswered = answers[q.id] === opt.value;
              const active = isSelected || isAnswered;
              /* pip count: spread evenly across 4 regardless of option count */
              const pipCount = Math.round(((idx + 1) / q.options.length) * 4);

              return (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  disabled={selected !== null}
                  className={`group relative w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-200 border outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-${def.accentFill.replace(/[^a-zA-Z]+/g, "")} ${active ? "border-transparent" : "border-border hover:border-border/80"} ${active ? `${def.accentFill}10` : "bg-surface"}`}
                  style={{
                    borderColor: active ? def.accentFill : "var(--color-border)",
                    background: active ? `${def.accentFill}12` : "var(--color-surface)",
                    boxShadow: active ? `0 0 0 1px ${def.accentFill}40` : undefined,
                    transform: isSelected ? "scale(0.99)" : undefined,
                  }}
                >
                  {/* keyboard hint — fades on mobile */}
                  <span className={`hidden sm:flex shrink-0 w-6 h-6 rounded-lg items-center justify-center text-[11px] font-bold tabular-nums transition-all border ${
                    active
                      ? "text-white border-transparent"
                      : "text-fg-muted/40 border-border/50"
                  }`}
                    style={{ background: active ? def.accentFill : undefined }}>
                    {idx + 1}
                  </span>

                  {/* label */}
                  <span className={`flex-1 text-[1rem] md:text-[1.05rem] font-medium transition-colors ${
                    active ? "text-fg-strong" : "text-fg group-hover:text-fg-strong"
                  }`}>
                    {opt.label}
                  </span>

                  {/* pip intensity indicator */}
                  <Pips count={pipCount} filled={active} color={def.accentFill} />

                  {/* check */}
                  <div
                    className={`shrink-0 w-5 h-5 rounded-full grid place-items-center transition-all duration-200 ${
                      active ? "opacity-100 scale-100" : "opacity-0 scale-75"
                    }`}
                    style={{ background: def.accentFill }}
                  >
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── footer nudge ── */}
        <p className="mt-6 text-center text-[11px] text-fg-muted/35">
          {selected !== null ? "Moving to next…" : "Select an answer to continue"}
        </p>
      </div>
    </div>
  );
}
