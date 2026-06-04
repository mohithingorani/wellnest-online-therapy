import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getAssessment } from "../data/assessments";
import { useAuth } from "../contexts/AuthContext";
import { joinWaitlist } from "../services/seeds";
import { saveAssessment } from "../services/assessments";

/* ── atmospheric tones ──────────────────────────────────────────── */
const TONE: Record<string, { glow: string; hex: string; heroGlow: string }> = {
  burnout: { hex: "#c9795a", glow: "radial-gradient(55% 65% at 70% 20%, rgba(201,121,90,0.28) 0%, transparent 70%)",  heroGlow: "rgba(201,121,90,0.14)" },
  gad7:    { hex: "#4a6b52", glow: "radial-gradient(55% 65% at 70% 20%, rgba(74,107,82,0.26)   0%, transparent 70%)",  heroGlow: "rgba(74,107,82,0.12)"  },
  stress:  { hex: "#b8850a", glow: "radial-gradient(55% 65% at 70% 20%, rgba(184,133,10,0.24)  0%, transparent 70%)",  heroGlow: "rgba(184,133,10,0.11)" },
  mood:    { hex: "#4a6b52", glow: "radial-gradient(55% 65% at 70% 20%, rgba(74,107,82,0.24)   0%, transparent 70%)",  heroGlow: "rgba(74,107,82,0.11)"  },
};

const BANDS = ["minimal", "mild", "moderate", "high"] as const;
type Band = typeof BANDS[number];

/* ── per-type report content ────────────────────────────────────── */
const REPORT: Record<string, {
  label: string;
  reportName: string;
  cta: string;
  scoreContext: (band: Band, pct: number) => string;
  urgencyLine: (band: Band) => string;
  visibleStep: string;
  triggerLabels: string[];                // shown as redacted rows
  triggerSeverities: string[];
  timelineRange: (band: Band) => string;  // e.g. "4–8 weeks" — LOCKED, shown redacted
  riskLine: (band: Band) => string;       // shown redacted
  therapistSpec: string;
  milestones: string[];                   // 4 milestone labels on journey
  shareText: (pct: number, headline: string) => string;
}> = {
  gad7: {
    label: "Anxiety",
    reportName: "Anxiety Recovery Report",
    cta: "Unlock your full anxiety recovery report",
    scoreContext: (band, pct) =>
      band === "minimal" ? `Your GAD-7 score of ${pct}% indicates minimal anxiety. Your nervous system is well-regulated.`
      : band === "mild"  ? `Your GAD-7 score of ${pct}% indicates mild anxiety — present, manageable, and the clearest stage to address.`
      : band === "moderate" ? `Your GAD-7 score of ${pct}% places you in the moderate range. This level consistently interferes with sleep, focus, and daily decisions.`
      : `Your GAD-7 score of ${pct}% indicates high anxiety. At this level, the anxiety response has become self-reinforcing and rarely resolves without structured support.`,
    urgencyLine: (band) =>
      band === "minimal" || band === "mild"
        ? "This is the easiest stage to address. Most people who act now avoid escalation entirely."
        : "Anxiety deepens over time without intervention. Early support leads to significantly faster recovery.",
    visibleStep: "Start with one 5-minute breathing exercise on waking — this is the single highest-ROI intervention at your score level.",
    triggerLabels: ["Situational worry patterns", "Sleep disruption cycle", "Avoidance behaviours"],
    triggerSeverities: ["High impact", "Moderate impact", "Contributing factor"],
    timelineRange: (band) => band === "minimal" ? "2–3 weeks" : band === "mild" ? "3–6 weeks" : band === "moderate" ? "6–10 weeks" : "10–16 weeks",
    riskLine: (band) => band === "high" ? "Without intervention, scores at this level typically increase by 15–25% within 90 days." : "Early action at this stage reduces escalation risk by approximately 70%.",
    therapistSpec: "anxiety and generalised worry",
    milestones: ["Triggers identified", "Patterns interrupt", "Score drops 30%", "Sustainable baseline"],
    shareText: (_p, headline) => `Took a free anxiety assessment. My result: ${headline}. 2 minutes — worth knowing:`,
  },
  burnout: {
    label: "Burnout",
    reportName: "Burnout Recovery Report",
    cta: "Unlock your full burnout recovery report",
    scoreContext: (band, pct) =>
      band === "minimal" ? `Your score of ${pct}% indicates low burnout risk. Burnout typically begins invisibly — checking in now is the right habit.`
      : band === "mild"  ? `Your score of ${pct}% shows early burnout signs. This is the most reversible stage — the window to act without months of recovery is now.`
      : band === "moderate" ? `Your score of ${pct}% indicates established burnout. Your energy systems are under sustained strain. A weekend off won't fix this — it needs deliberate intervention.`
      : `Your score of ${pct}% indicates severe burnout. The WHO classifies this as a clinical syndrome. Recovery is possible, but requires professional support and real structural change.`,
    urgencyLine: (band) =>
      band === "minimal" || band === "mild"
        ? "Early-stage burnout is the fastest to reverse. Most people who intervene now recover in weeks, not months."
        : "Burnout that goes unaddressed for 3+ months typically doubles recovery time. The earlier you act, the better the outcome.",
    visibleStep: "Identify one commitment you can reduce or delegate this week — not next month. Overload is the primary engine of burnout.",
    triggerLabels: ["Primary workload driver", "Boundary erosion pattern", "Recovery deficit factor"],
    triggerSeverities: ["High impact", "High impact", "Moderate impact"],
    timelineRange: (band) => band === "minimal" ? "2–4 weeks" : band === "mild" ? "4–8 weeks" : band === "moderate" ? "8–14 weeks" : "14–24 weeks",
    riskLine: (band) => band === "high" ? "At this level, without intervention, physical health symptoms typically emerge within 60 days." : "Acting at this stage reduces total recovery time by an estimated 60–70%.",
    therapistSpec: "burnout and occupational stress",
    milestones: ["Root causes mapped", "Energy stabilises", "Score drops 40%", "Sustainable capacity"],
    shareText: (pct, headline) => `Scored ${pct}% on a free burnout assessment — result: ${headline}. Take yours (2 min, no signup):`,
  },
  stress: {
    label: "Stress",
    reportName: "Stress Recovery Report",
    cta: "Unlock your full stress recovery report",
    scoreContext: (band, pct) =>
      band === "minimal" ? `Your PSS score of ${pct}% indicates well-managed stress. Your nervous system has strong recovery capacity right now.`
      : band === "mild"  ? `Your PSS score of ${pct}% is mildly elevated — very common, and almost always a pattern problem rather than a capacity problem.`
      : band === "moderate" ? `Your PSS score of ${pct}% means your cortisol is staying elevated between stressors. Sleep quality, immune function, and focus are all affected at this level.`
      : `Your PSS score of ${pct}% is high. Your nervous system is in near-constant alert mode — this has real consequences for health, cognition, and relationships.`,
    urgencyLine: (band) =>
      band === "minimal" || band === "mild"
        ? "Mild stress is the easiest to address — usually a pattern issue with a clear solution."
        : "Chronic high stress compounds over time. Acting now prevents the physiological consequences that make recovery harder.",
    visibleStep: "Do one thing today that removes or shrinks a stressor — not manages it, removes it. This single act signals to your nervous system that change is possible.",
    triggerLabels: ["Primary stress source", "Nervous system dysregulation pattern", "Recovery gap factor"],
    triggerSeverities: ["High impact", "Moderate impact", "Contributing factor"],
    timelineRange: (band) => band === "minimal" ? "1–3 weeks" : band === "mild" ? "3–5 weeks" : band === "moderate" ? "5–9 weeks" : "9–14 weeks",
    riskLine: (band) => band === "high" ? "High PSS scores are strongly correlated with burnout onset within 60–90 days without intervention." : "Early stress management reduces escalation risk significantly.",
    therapistSpec: "stress and nervous system regulation",
    milestones: ["Sources identified", "Cortisol resets", "Score drops 35%", "New equilibrium"],
    shareText: (pct) => `My PSS stress score: ${pct}% — free 1-min test. Where do you land?`,
  },
  mood: {
    label: "Mood",
    reportName: "Wellbeing Recovery Report",
    cta: "Unlock your full wellbeing recovery report",
    scoreContext: (band, pct) =>
      band === "minimal" ? `Your score of ${pct}% reflects genuine wellbeing across energy, connection, sleep, and hope. Understanding what's creating this helps you protect it.`
      : band === "mild"  ? `Your score of ${pct}% shows some areas under strain. Small consistent actions matter more than big one-time fixes at this level.`
      : band === "moderate" ? `Your score of ${pct}% indicates you're not at your best across multiple dimensions — energy, connection, and hope are all below baseline.`
      : `Your score of ${pct}% reflects significant difficulty. Prolonged low mood changes how your brain processes positive events — support now leads to meaningfully better outcomes.`,
    urgencyLine: (band) =>
      band === "minimal" || band === "mild"
        ? "Small actions at this stage have outsized positive effects — momentum compounds quickly."
        : "Low mood tends to self-reinforce over time. Early support significantly shortens the recovery path.",
    visibleStep: "Reach out to one person today. Isolation is the single most effective accelerant of low mood — connection is its antidote.",
    triggerLabels: ["Primary mood driver", "Energy depletion source", "Connection gap factor"],
    triggerSeverities: ["High impact", "Moderate impact", "Contributing factor"],
    timelineRange: (band) => band === "minimal" ? "1–2 weeks" : band === "mild" ? "2–5 weeks" : band === "moderate" ? "4–8 weeks" : "8–14 weeks",
    riskLine: (band) => band === "high" ? "Without intervention, low mood at this level typically deepens within 30–45 days." : "Acting at this stage typically produces visible improvement within 2–3 weeks.",
    therapistSpec: "mood, emotional wellbeing, and life transitions",
    milestones: ["Patterns understood", "Energy returns", "Score improves 30%", "Stable baseline"],
    shareText: (_p, headline) => `Quick mood check: ${headline}. Free WellNest tools, no account needed:`,
  },
};

/* ── small components ──────────────────────────────────────────── */
function Bar({ width = "w-20" }: { width?: string }) {
  return <span className={`inline-block ${width} h-[0.85em] rounded bg-fg-muted/15 align-middle mx-0.5`} />;
}

function LockIcon({ size = "w-4 h-4", className = "" }: { size?: string; className?: string }) {
  return (
    <svg className={`${size} ${className}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

/* ── main component ─────────────────────────────────────────────── */
export default function AssessmentResult() {
  const { type }   = useParams<{ type: string }>();
  const location   = useLocation();
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const def        = getAssessment(type ?? "");
  const state      = location.state as {
    score: number; band: string; answers: Record<string, number>;
    seedsAwarded?: boolean; justSignedUp?: boolean;
  } | null;

  const [email, setEmail]               = useState("");
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [copied, setCopied]             = useState(false);
  const [seedsEarned, setSeedsEarned]   = useState(state?.seedsAwarded ?? false);
  const [saving, setSaving]             = useState(false);
  const savedRef = useRef(false);

  /* When the user lands here after signing up from this page, save their
     assessment and award seeds — they were a guest when they took the test. */
  useEffect(() => {
    if (!user || !state || !def || savedRef.current) return;
    if (!state.justSignedUp) return;
    savedRef.current = true;
    setSaving(true);
    saveAssessment(def.id, state.score, state.band, state.answers)
      .then((res) => { if (res?.seedsAwarded) setSeedsEarned(true); })
      .catch(() => {})
      .finally(() => setSaving(false));
  }, [user, state, def]);

  if (!def || !state) { navigate("/assess", { replace: true }); return null; }

  const typeKey  = type ?? "gad7";
  const band     = state.band as Band;
  const tone     = TONE[typeKey] ?? TONE.gad7;
  const rep      = REPORT[typeKey] ?? REPORT.gad7;
  const result   = def.result(band);
  const maxScore = def.questions.length * 3;
  const pct      = Math.round((state.score / maxScore) * 100);
  const isGuest  = !user;
  const shareUrl = `${window.location.origin}/${typeKey === "gad7" ? "anxiety-test" : typeKey === "burnout" ? "burnout-test" : typeKey === "stress" ? "stress-test" : "mood-check"}`;
  const shareMsg = rep.shareText(pct, result.headline);

  const goSignup   = () => navigate("/join", { state: { from: location.pathname, resultState: state } });
  const copyLink   = async () => { const t = `${shareMsg} ${shareUrl}`; try { await navigator.clipboard.writeText(t); } catch { const el = document.createElement("textarea"); el.value = t; el.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(el); el.select(); try { document.execCommand("copy"); } catch { /**/ } document.body.removeChild(el); } setCopied(true); setTimeout(() => setCopied(false), 2200); };
  const whatsApp   = () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareMsg} ${shareUrl}`)}`, "_blank", "noopener,noreferrer");
  const linkedin   = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
  const onWaitlist = async () => { if (!email) return; await joinWaitlist(email, undefined, typeKey).catch(() => {}); setWaitlistDone(true); };

  /* locked report percentage — always 78% for guests */
  const unlockedPct = isGuest ? 22 : 100;

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="bg-bg">

      {/* ══════════════════════════════════════════════════════════
          HERO — score + CTA above the fold
      ══════════════════════════════════════════════════════════ */}
      <div className="relative bg-night overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: tone.glow }} />
        {/* large decorative pct */}
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 font-display font-black leading-none select-none"
          style={{ fontSize: "clamp(9rem, 25vw, 18rem)", color: "rgba(255,255,255,0.025)", right: "-2%" }}>
          {pct}
        </div>

        <div className="relative mx-auto max-w-[640px] px-5 md:px-8 pt-10 pb-10 md:pt-14 md:pb-12">

          {/* eyebrow nav */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate("/assess")} className="flex items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors text-xs font-semibold">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              Assessments
            </button>
            {/* label: shortened on mobile, full on md+ */}
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
              <span className="hidden sm:inline">{rep.reportName}</span>
              <span className="sm:hidden">{rep.label} Report</span>
            </span>
          </div>

          {/* band pills */}
          <div className="flex items-center gap-2 mb-6">
            {BANDS.map((b, i) => {
              const active = b === band;
              const past   = BANDS.indexOf(b) < BANDS.indexOf(band);
              return (
                <div key={b} className="flex items-center gap-2">
                  <div className="rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ width: active ? undefined : 22, height: 22, padding: active ? "0 12px" : 0, background: active ? tone.hex : past ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)" }}>
                    <span className="text-[10px] font-bold text-white leading-none" style={{ display: active ? undefined : "none" }}>{b.charAt(0).toUpperCase() + b.slice(1)}</span>
                  </div>
                  {i < BANDS.length - 1 && <div className="h-px w-3.5 flex-none" style={{ background: past || active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.06)" }} />}
                </div>
              );
            })}
          </div>

          {/* score headline */}
          <h1 className="font-display font-semibold text-white leading-[0.92] tracking-[-0.035em]"
            style={{ fontSize: "clamp(3.4rem, 11vw, 6.4rem)" }}>
            {result.headline}.
          </h1>

          <p className="mt-6 leading-relaxed text-white/70 font-medium" style={{ fontSize: "clamp(1.05rem, 2.5vw, 1.2rem)" }}>
            {rep.scoreContext(band, pct)}
          </p>

          {/* report unlock bar — the key above-fold hook */}
          {isGuest && (
            <div className="mt-8 rounded-2xl bg-white/[0.07] border border-white/[0.1] p-5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Your report</span>
                <span className="text-[11px] font-bold text-white/40">{unlockedPct}% unlocked</span>
              </div>
              {/* progress bar */}
              <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-4">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${unlockedPct}%`, background: tone.hex }} />
              </div>
              <p className="text-sm text-white/55 mb-4 leading-relaxed">
                Your personalised recovery report has been generated. <strong className="text-white/75">{100 - unlockedPct}% is locked</strong> — including your trigger analysis, recovery timeline, and personalized action plan.
              </p>
              <button onClick={goSignup}
                className="w-full h-12 flex items-center justify-center rounded-full font-semibold text-[0.9rem] text-white transition-all hover:opacity-90 active:scale-[0.99]"
                style={{ background: tone.hex }}>
                {rep.cta} →
              </button>
              <p className="text-center text-[10px] text-white/25 mt-2.5">Free · No credit card · 30 seconds</p>
            </div>
          )}

          {/* logged-in: seeds + post-signup welcome */}
          {!isGuest && (
            <div className="mt-6 space-y-3">
              {state.justSignedUp && (
                <div className="flex items-start gap-3 rounded-2xl bg-white/[0.09] border border-white/[0.14] px-4 py-4">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: tone.hex }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {saving ? "Saving your results…" : "Your full report is now unlocked."}
                    </p>
                    <p className="text-xs text-white/50 mt-0.5">All sections below are now visible. Your progress is saved to your account.</p>
                  </div>
                </div>
              )}
              {seedsEarned && (
                <div className="flex items-center gap-3 rounded-2xl bg-white/[0.07] border border-white/[0.1] px-4 py-3.5">
                  <svg className="w-4 h-4 shrink-0" style={{ color: tone.hex }} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 4 15 4 9a8 8 0 0116 0c0 6-8 12-8 12z"/></svg>
                  <p className="text-sm text-white/70"><span className="font-semibold text-white">+15 Seeds earned.</span> Retake in 2 weeks to track your progress.</p>
                </div>
              )}
            </div>
          )}

          {/* share row */}
          <div className="mt-7 flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 mr-1">Share</span>
            {[
              { label: "WhatsApp", action: whatsApp,  icon: <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current flex-none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
              { label: "LinkedIn",  action: linkedin,  icon: <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current flex-none"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
              { label: copied ? "Copied" : "Copy link", action: copyLink, icon: copied ? <svg className="w-3 h-3 flex-none" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> : <svg className="w-3 h-3 flex-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.1-1.1m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg> },
            ].map(({ label, action, icon }) => (
              <button key={label} onClick={action}
                className="flex items-center gap-1.5 h-7 px-3 rounded-full border border-white/10 bg-white/[0.06] text-white/55 hover:text-white text-[11px] font-semibold transition-all">
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          REPORT BODY
      ══════════════════════════════════════════════════════════ */}
      <div className="bg-bg">
        <div className="mx-auto max-w-[800px] px-5 md:px-8 py-10 md:py-14 space-y-3">

          {/* ── SECTION 1: What this score means (visible) ── */}
          <div className="rounded-[1.5rem] border border-border/60 bg-surface overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border/40 flex items-center justify-between bg-surface-2/40">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full grid place-items-center" style={{ background: `${tone.hex}20` }}>
                  <svg className="w-3 h-3" style={{ color: tone.hex }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span className="text-[13px] font-bold text-fg-strong/80">
                  <span className="hidden xs:inline text-fg-muted/70">§1 · </span>Score Summary
                </span>
              </div>
              <span className="text-[10px] font-bold text-success bg-success/12 px-2 py-0.5 rounded-full shrink-0">Unlocked</span>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-xl grid place-items-center font-display font-bold text-base text-white" style={{ background: tone.hex }}>
                  {pct}
                </div>
                <div>
                  <p className="font-semibold text-fg-strong text-base">{result.headline}</p>
                  <p className="text-[0.95rem] text-fg-muted mt-1.5 leading-relaxed">{result.body}</p>
                </div>
              </div>
              <div className="rounded-xl bg-[#f5f2ec] px-4 py-3">
                <p className="text-sm text-fg-strong leading-relaxed">
                  <span className="font-semibold" style={{ color: tone.hex }}>Next step: </span>
                  {rep.visibleStep}
                </p>
              </div>
            </div>
          </div>

          {/* ── SECTION 2: Your Triggers (locked) ── */}
          {isGuest ? (
            <LockedSection
              number={2} label="Your Top Triggers" hex={tone.hex}
              preview="We identified 3 primary drivers in your responses:"
              onUnlock={goSignup} ctaLabel={rep.cta}>
              <div className="space-y-2.5 mt-1">
                {rep.triggerLabels.map((label, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-[#f5f2ec] px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full text-[10px] font-bold grid place-items-center text-fg-muted/40 bg-fg-muted/10">{i + 1}</span>
                      <span className="text-sm text-fg-muted/40 select-none">{label.split("").map(() => "█").join("")}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-fg-muted/35 shrink-0">{rep.triggerSeverities[i]}</span>
                  </div>
                ))}
              </div>
            </LockedSection>
          ) : (
            <div className="rounded-[1.5rem] border border-border/60 bg-surface overflow-hidden">
              <SectionHeader number={2} label="Your Top Triggers" hex={tone.hex} locked={false} />
              <div className="p-5 space-y-2.5">
                {rep.triggerLabels.map((label, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-[#f5f2ec] px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full text-[10px] font-bold grid place-items-center text-white" style={{ background: tone.hex }}>{i + 1}</span>
                      <span className="text-sm text-fg-strong">{label}</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${tone.hex}15`, color: tone.hex }}>{rep.triggerSeverities[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECTION 3: Recovery timeline (locked) ── */}
          {isGuest ? (
            <LockedSection
              number={3} label="Recovery Timeline" hex={tone.hex}
              preview="Your estimated time to baseline wellbeing:"
              onUnlock={goSignup} ctaLabel={rep.cta}>
              <div className="mt-3 rounded-xl bg-[#f5f2ec] px-4 py-4 flex items-center gap-3">
                <LockIcon size="w-4 h-4" className="text-fg-muted/30 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-fg-muted/40 mb-1">Estimated recovery window</p>
                  <p className="text-sm text-fg-muted/35 leading-relaxed">
                    With consistent support, people at your score level typically recover in <Bar width="w-14" /> to <Bar width="w-12" /> weeks.
                  </p>
                </div>
              </div>
              <div className="mt-2 rounded-xl bg-[#f5f2ec] px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-fg-muted/40 mb-1">Risk if unaddressed</p>
                <p className="text-sm text-fg-muted/35 select-none">{rep.riskLine(band).split("").map(() => "█").join("").slice(0, 55)}...</p>
              </div>
            </LockedSection>
          ) : (
            <div className="rounded-[1.5rem] border border-border/60 bg-surface overflow-hidden">
              <SectionHeader number={3} label="Recovery Timeline" hex={tone.hex} locked={false} />
              <div className="p-5 space-y-2.5">
                <div className="rounded-xl bg-[#f5f2ec] px-4 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-fg-muted mb-1">Estimated recovery window</p>
                  <p className="text-lg font-display font-semibold text-fg-strong">{rep.timelineRange(band)}</p>
                  <p className="text-xs text-fg-muted mt-0.5">with consistent structured support</p>
                </div>
                <div className="rounded-xl bg-[#f5f2ec] px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-fg-muted mb-1">Risk if unaddressed</p>
                  <p className="text-sm text-fg-strong leading-relaxed">{rep.riskLine(band)}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── SECTION 4: Personalized action plan (locked) ── */}
          {isGuest ? (
            <LockedSection
              number={4} label="Your 7-Day Action Plan" hex={tone.hex}
              preview="7 targeted actions ranked by impact for your score level:"
              onUnlock={goSignup} ctaLabel={rep.cta}>
              <div className="space-y-1.5 mt-2">
                {[1,2,3,4,5,6,7].map((d) => (
                  <div key={d} className="flex items-center gap-3 rounded-lg bg-[#f5f2ec] px-3.5 py-2.5">
                    <span className="w-6 h-6 rounded-lg text-[10px] font-bold grid place-items-center shrink-0 text-fg-muted/30 bg-fg-muted/8">{d}</span>
                    <div className="h-2.5 rounded-full bg-fg-muted/10 flex-1" style={{ maxWidth: `${55 + Math.sin(d) * 30}%` }} />
                  </div>
                ))}
              </div>
            </LockedSection>
          ) : (
            <div className="rounded-[1.5rem] border border-border/60 bg-surface overflow-hidden">
              <SectionHeader number={4} label="Your 7-Day Action Plan" hex={tone.hex} locked={false} />
              <div className="p-5 space-y-2">
                {result.steps.concat([
                  `Retake this assessment on day 7 to measure your starting baseline`,
                  `Schedule 10 minutes of unstructured rest — no screens, no tasks`,
                  `Write down what you want to feel differently in 30 days`,
                  `Review and adjust: which of this week's actions had the most impact?`,
                ]).slice(0, 7).map((step, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-[#f5f2ec] px-4 py-3.5">
                    <span className="w-6 h-6 rounded-lg text-[10px] font-bold grid place-items-center shrink-0 text-white mt-0.5" style={{ background: tone.hex }}>{i + 1}</span>
                    <p className="text-sm text-fg-strong leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECTION 5: Progress forecast (locked) ── */}
          {isGuest ? (
            <LockedSection
              number={5} label="Your Progress Forecast" hex={tone.hex}
              preview="Predicted score trajectory over 8 weeks with structured support:"
              onUnlock={goSignup} ctaLabel={rep.cta}>
              <div className="mt-3 h-24 rounded-xl bg-[#f5f2ec] flex items-end gap-1.5 px-4 pb-3 pt-4">
                {[pct, Math.max(pct - 8, 5), Math.max(pct - 18, 5), Math.max(pct - 28, 5), Math.max(pct - 36, 5), Math.max(pct - 42, 5), Math.max(pct - 47, 5), Math.max(pct - 50, 5)].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md" style={{
                    height: `${h}%`,
                    background: i === 0 ? `${tone.hex}40` : "rgba(0,0,0,0.06)",
                    opacity: i === 0 ? 1 : 0.5,
                  }} />
                ))}
              </div>
            </LockedSection>
          ) : (
            <div className="rounded-[1.5rem] border border-border/60 bg-surface overflow-hidden">
              <SectionHeader number={5} label="Your Progress Forecast" hex={tone.hex} locked={false} />
              <div className="p-5">
                <div className="h-28 rounded-xl bg-[#f5f2ec] flex items-end gap-1.5 px-4 pb-3 pt-4">
                  {[pct, Math.max(pct - 8, 5), Math.max(pct - 18, 5), Math.max(pct - 28, 5), Math.max(pct - 36, 5), Math.max(pct - 42, 5), Math.max(pct - 47, 5), Math.max(pct - 50, 5)].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-md transition-all" style={{ height: `${h}%`, background: i === 0 ? tone.hex : `${tone.hex}30` }} />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-fg-muted">
                  <span>Today ({pct}%)</span>
                  <span>Week 8 (~{Math.max(pct - 50, 5)}%)</span>
                </div>
                <p className="mt-3 text-sm text-fg-muted leading-relaxed">{rep.timelineRange(band)} to baseline with consistent support and structured action.</p>
              </div>
            </div>
          )}

          {/* ── Mid-page CTA (guests only) ── */}
          {isGuest && (
            <div className="rounded-[1.5rem] bg-night border border-night-border p-5 md:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl grid place-items-center shrink-0 mt-0.5" style={{ background: `${tone.hex}25` }}>
                  <LockIcon size="w-4 h-4" className="text-white/60" />
                </div>
                <div>
                  <p className="font-semibold text-night-fg text-sm">Your report is 78% locked</p>
                  <p className="text-night-muted text-xs mt-0.5 leading-relaxed">Sections 2–5 contain your triggers, recovery timeline, personalised 7-day plan, and score trajectory. Free to unlock.</p>
                </div>
              </div>
              <button onClick={goSignup}
                className="w-full h-12 flex items-center justify-center rounded-full font-semibold text-[0.9rem] text-white transition-all hover:opacity-90"
                style={{ background: tone.hex }}>
                {rep.cta} →
              </button>
              <p className="text-center text-[10px] text-white/20 mt-2">Free · No credit card · 30 seconds</p>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          RECOVERY JOURNEY
      ══════════════════════════════════════════════════════════ */}
      <div className="relative bg-night overflow-hidden border-t border-night-border">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50" style={{ background: tone.glow }} />
        <div className="relative mx-auto max-w-[640px] px-5 md:px-8 py-12 md:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Recovery journey</p>
          <h2 className="font-display font-semibold text-white leading-tight tracking-[-0.02em] mb-10"
            style={{ fontSize: "clamp(1.5rem, 4.5vw, 1.9rem)" }}>
            Where this goes with support
          </h2>

          {/* milestone track */}
          <div className="relative">
            <div className="absolute top-5 left-5 right-5 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <div className="absolute top-5 left-5 h-px" style={{ width: "12%", background: tone.hex }} />
            <div className="relative flex justify-between">
              {["Today", ...rep.milestones].map((label, i) => {
                const locked = isGuest && i > 0;
                return (
                  <div key={i} className="flex flex-col items-center gap-2" style={{ width: "19%" }}>
                    <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: i === 0 ? tone.hex : locked ? "rgba(255,255,255,0.08)" : `${tone.hex}60`,
                        background: i === 0 ? tone.hex : locked ? "rgba(255,255,255,0.04)" : `${tone.hex}20`,
                      }}>
                      {i === 0
                        ? <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/></svg>
                        : locked
                        ? <LockIcon size="w-3 h-3" className="text-white/20" />
                        : <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      }
                    </div>
                    <p className="text-[11px] font-semibold text-center leading-tight" style={{ color: i === 0 ? "rgba(255,255,255,0.85)" : locked ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)" }}>
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-10 rounded-2xl bg-white/[0.05] border border-white/[0.08] px-5 py-4">
            <p className="text-sm text-white/60 leading-relaxed">
              <span className="font-semibold text-white/80">{rep.urgencyLine(band)}</span>{" "}
              {isGuest && "Your full recovery plan is waiting."}
            </p>
          </div>

          {isGuest && (
            <button onClick={goSignup}
              className="mt-5 w-full h-12 flex items-center justify-center rounded-full font-semibold text-sm text-white transition-all hover:opacity-90 border border-white/12"
              style={{ background: tone.hex }}>
              {rep.cta} →
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      {isGuest ? (
        <div className="relative bg-night overflow-hidden border-t border-night-border/60">
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(55% 70% at 50% 105%, ${tone.heroGlow.replace("rgba", "rgba").replace(/[\d.]+\)$/, "0.2)")} 0%, transparent 60%)` }} />
          <div className="relative mx-auto max-w-[640px] px-5 md:px-8 py-14 md:py-20">

            <h2 className="font-display font-semibold text-white leading-[1.06] tracking-[-0.025em] mb-4"
              style={{ fontSize: "clamp(1.85rem, 5.5vw, 2.5rem)" }}>
              Your recovery report is ready.<br />
              <span className="text-white/45 font-medium">78% is waiting for you.</span>
            </h2>

            <p className="text-white/62 text-[1rem] leading-relaxed mb-8 max-w-lg font-medium">
              Create a free account to unlock your complete report — including what's driving your {rep.label.toLowerCase()}, how long recovery will take, and the exact actions that will help most.
            </p>

            {/* unlock grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-8">
              {[
                "Your top 3 triggers identified",
                `Recovery timeline: ${rep.timelineRange(band)}`,
                "Complete 7-day action plan",
                "8-week score forecast",
                "Progress tracking over time",
                "Retake every 2 weeks to measure change",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 rounded-xl bg-white/[0.05] border border-white/[0.07] px-3.5 py-3">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: tone.hex }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  <p className="text-[13px] text-white/70 font-medium leading-snug">{item}</p>
                </div>
              ))}
            </div>

            <button onClick={goSignup}
              className="w-full h-12 flex items-center justify-center rounded-full font-semibold text-base text-white transition-all hover:opacity-90 active:scale-[0.99] shadow-lift"
              style={{ background: tone.hex }}>
              {rep.cta} →
            </button>
            <p className="text-center text-[10px] text-white/25 mt-3">Free forever · No credit card · 30 seconds to unlock</p>

            {/* waitlist */}
            <div className="mt-12 pt-8 border-t border-night-border/40">
              <p className="text-sm font-semibold text-white/75 mb-1">Want to speak to a therapist who specialises in {rep.therapistSpec}?</p>
              <p className="text-[12.5px] text-white/40 mb-4">Join the waitlist — we'll match you when therapists go live. No commitment.</p>
              {waitlistDone ? (
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: tone.hex }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  You're on the list — we'll be in touch.
                </div>
              ) : (
                <div className="flex gap-2 max-w-md">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                    onKeyDown={(e) => e.key === "Enter" && onWaitlist()}
                    className="flex-1 h-10 rounded-full border border-night-border bg-white/[0.05] px-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/20 transition-all" />
                  <button onClick={onWaitlist} disabled={!email}
                    className="h-10 px-5 rounded-full text-sm font-semibold text-white disabled:opacity-30 transition-all"
                    style={{ background: tone.hex }}>
                    Join
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* logged-in bottom nav */
        <div className="bg-bg border-t border-border/40">
          <div className="mx-auto max-w-[640px] px-5 md:px-8 py-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate("/assess")} className="flex-1 h-12 flex items-center justify-center rounded-full ring-1 ring-border text-sm font-semibold text-fg hover:bg-surface-2 transition-colors">Take another assessment</button>
              <button onClick={() => navigate("/dashboard")} className="flex-1 h-12 flex items-center justify-center rounded-full font-semibold text-sm text-white transition-all hover:opacity-90 shadow-lift" style={{ background: tone.hex }}>Go to dashboard →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── sub-components ─────────────────────────────────────────────── */
function SectionHeader({ number, label, hex, locked }: { number: number; label: string; hex: string; locked: boolean }) {
  return (
    <div className="px-5 py-3.5 border-b border-border/40 flex items-center justify-between gap-3 bg-surface-2/40">
      <div className="flex items-center gap-2 min-w-0">
        {locked
          ? <div className="w-5 h-5 rounded-full bg-fg-muted/8 grid place-items-center shrink-0"><LockIcon size="w-3 h-3" className="text-fg-muted/50" /></div>
          : <div className="w-5 h-5 rounded-full grid place-items-center shrink-0" style={{ background: `${hex}20` }}><svg className="w-3 h-3" style={{ color: hex }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></div>
        }
        <span className="text-[13px] font-bold text-fg-strong/80 truncate">
          <span className="hidden xs:inline text-fg-muted/70">§{number} · </span>
          {label}
        </span>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${locked ? "text-fg-muted bg-fg-muted/10" : "text-success bg-success/12"}`}>
        {locked ? "Locked" : "Unlocked"}
      </span>
    </div>
  );
}

function LockedSection({ number, label, hex, preview, children, onUnlock, ctaLabel }: {
  number: number; label: string; hex: string; preview: string;
  children: React.ReactNode; onUnlock: () => void; ctaLabel: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-border/60 bg-surface overflow-hidden">
      <SectionHeader number={number} label={label} hex={hex} locked />
      <div className="p-5">
        <p className="text-sm text-fg-muted mb-3 leading-relaxed">{preview}</p>
        {children}
        <button onClick={onUnlock}
          className="mt-4 w-full h-10 flex items-center justify-center rounded-full font-semibold text-[0.85rem] text-white transition-all hover:opacity-90"
          style={{ background: hex }}>
          {ctaLabel} →
        </button>
      </div>
    </div>
  );
}

