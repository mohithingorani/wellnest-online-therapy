import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { awardClientSeeds } from "../services/seeds";

type Technique = "478" | "box" | "simple";
type AppPhase = "idle" | "inhale" | "hold" | "exhale";

interface PhaseStep {
  phase: AppPhase;
  duration: number;
}

interface TechniqueConfig {
  phases: PhaseStep[];
  label: string;
  description: string;
}

const TECHNIQUES: Record<Technique, TechniqueConfig> = {
  "478": {
    label: "4-7-8",
    description: "Calms anxiety fast",
    phases: [
      { phase: "inhale", duration: 4 },
      { phase: "hold",   duration: 7 },
      { phase: "exhale", duration: 8 },
    ],
  },
  box: {
    label: "Box",
    description: "Builds focus",
    phases: [
      { phase: "inhale", duration: 4 },
      { phase: "hold",   duration: 4 },
      { phase: "exhale", duration: 4 },
      { phase: "hold",   duration: 4 },
    ],
  },
  simple: {
    label: "Simple",
    description: "Gentle reset",
    phases: [
      { phase: "inhale", duration: 4 },
      { phase: "exhale", duration: 6 },
    ],
  },
};

const DURATIONS = [1, 3, 5] as const;

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

const PHASE_META: Record<AppPhase, { label: string; short: string; color: string; ringColor: string; glowColor: string }> = {
  idle:   { label: "Ready",   short: "Ready",  color: "text-night-muted",  ringColor: "#587a4f",        glowColor: "rgba(88,122,79,0.15)" },
  inhale: { label: "Inhale",  short: "In",     color: "text-sage-300",     ringColor: "#9cb791",        glowColor: "rgba(156,183,145,0.25)" },
  hold:   { label: "Hold",    short: "Hold",   color: "text-ochre-300",    ringColor: "#dbac52",        glowColor: "rgba(219,172,82,0.22)" },
  exhale: { label: "Exhale",  short: "Out",    color: "text-night-muted",  ringColor: "#4a6b52",        glowColor: "rgba(74,107,82,0.18)" },
};

/* ── Gentle chime using Web Audio API ── */
let audioCtx: AudioContext | null = null;

function playChime(freq: number) {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
  } catch {}
}

/* ── Breathing ring ── */
function BreathingRing({
  phase, progress, size = 320,
}: { phase: AppPhase; progress: number; size?: number }) {
  const meta = PHASE_META[phase];
  const r = size / 2 - 12;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const scale = phase === "inhale" ? 1 + 0.14 * progress
               : phase === "exhale" ? 1.14 - 0.14 * progress
               : phase === "hold"   ? 1.14
               : 1;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* glow */}
      <div className="absolute inset-0 rounded-full transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${meta.glowColor} 0%, transparent 70%)`, transform: `scale(${scale * 1.2})` }} />

      {/* progress arc */}
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={meta.ringColor} strokeWidth="2" strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress)}
          className="transition-all duration-300" />
      </svg>

      {/* main circle */}
      <div
        className="absolute inset-4 rounded-full transition-all duration-700 ease-in-out grid place-items-center"
        style={{
          background: `radial-gradient(circle at 38% 35%, ${meta.ringColor}30 0%, ${meta.ringColor}12 60%, transparent 100%)`,
          border: `1.5px solid ${meta.ringColor}30`,
          transform: `scale(${scale})`,
          boxShadow: `0 0 50px -16px ${meta.glowColor}`,
        }}
      >
        <div className="rounded-full border border-white/[0.05]"
          style={{ width: size * 0.45, height: size * 0.45 }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function Breathe() {
  const navigate = useNavigate();
  const [technique, setTechnique] = useState<Technique>("478");
  const [duration, setDuration] = useState<number>(3);
  const [status, setStatus] = useState<"idle" | "running" | "paused" | "complete">("idle");
  const [currentPhase, setCurrentPhase] = useState<AppPhase>("idle");
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const seedAwarded = useRef(false);
  const prevPhaseRef = useRef<AppPhase>("idle");

  const startTimeRef = useRef(0);
  const rafRef = useRef(0);

  const config = TECHNIQUES[technique];
  const cycleDuration = config.phases.reduce((s, p) => s + p.duration, 0);
  const totalDuration = duration * 60;
  const remaining = Math.max(0, totalDuration - elapsed);

  /* ── Phase-change feedback (haptic + chime) ── */
  useEffect(() => {
    if (currentPhase === prevPhaseRef.current) return;
    prevPhaseRef.current = currentPhase;

    if (status !== "running" || currentPhase === "idle") return;

    if (navigator.vibrate) navigator.vibrate(15);

    if (soundOn) {
      const freq = currentPhase === "inhale" ? 440
                 : currentPhase === "hold"   ? 520
                 : 330;
      playChime(freq);
    }
  }, [currentPhase, status, soundOn]);

  const animate = useCallback(() => {
    const now = performance.now();
    const raw = (now - startTimeRef.current) / 1000;

    if (raw >= totalDuration) {
      setStatus("complete");
      setElapsed(totalDuration);
      setCurrentPhase("idle");
      return;
    }

    setElapsed(Math.min(raw, totalDuration));
    const cycleTime = raw % cycleDuration;
    let accum = 0;

    for (const p of config.phases) {
      const next = accum + p.duration;
      if (cycleTime < next) {
        setCurrentPhase(p.phase);
        const prog = (cycleTime - accum) / p.duration;
        setPhaseProgress(prog);
        setPhaseSecondsLeft(Math.ceil(p.duration - (cycleTime - accum)));
        break;
      }
      accum = next;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [config.phases, cycleDuration, totalDuration]);

  useEffect(() => {
    if (status === "running") {
      startTimeRef.current = performance.now() - elapsed * 1000;
      rafRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [status, animate, elapsed]);

  useEffect(() => {
    if (status === "running" || status === "paused") return;
    setCurrentPhase("idle"); setPhaseProgress(0); setElapsed(0);
  }, [technique, duration]);

  useEffect(() => {
    if (status === "complete" && !seedAwarded.current) {
      seedAwarded.current = true;
      awardClientSeeds("breathing_session").catch(() => {});
    }
  }, [status]);

  const start  = () => { seedAwarded.current = false; setElapsed(0); setStatus("running"); setCurrentPhase(config.phases[0].phase); };
  const pause  = () => setStatus("paused");
  const resume = () => setStatus("running");
  const reset  = () => { setStatus("idle"); setElapsed(0); setCurrentPhase("idle"); setPhaseProgress(0); };

  const meta = PHASE_META[currentPhase];

  return (
    <div className="bg-night min-h-[calc(100vh-68px)] flex flex-col overflow-hidden relative">
      {/* ambient atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[10%] left-[20%] h-80 w-80 rounded-full blur-[120px] transition-all duration-1000"
          style={{ background: meta.glowColor, opacity: status === "running" ? 0.8 : 0.3 }} />
        <div className="absolute bottom-[15%] right-[15%] h-64 w-64 rounded-full bg-sage-500/8 blur-[100px]" />
      </div>

      {/* complete state */}
      {status === "complete" ? (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-6">
          <div className="w-20 h-20 rounded-full bg-sage-500/20 border border-sage-400/30 grid place-items-center">
            <svg className="w-9 h-9 text-sage-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="font-display text-3xl font-medium text-night-fg">Well done.</h2>
            <p className="mt-2 text-night-muted">{duration} minute{duration > 1 ? "s" : ""} of intentional breathing. +8 Seeds earned.</p>
          </div>
          <div className="flex gap-3 mt-2">
            <button onClick={start} className="h-12 px-7 rounded-full bg-sage-500 text-white font-semibold text-sm hover:bg-sage-400 transition-all">
              Go again
            </button>
            <button onClick={() => navigate("/dashboard")} className="h-12 px-7 rounded-full ring-1 ring-night-border text-night-fg font-semibold text-sm hover:bg-night-2 transition-colors">
              Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-between py-6 px-4">

          {/* ── TOP: technique selector + sound toggle ── */}
          <div className="flex items-center gap-2">
            {(Object.entries(TECHNIQUES) as [Technique, TechniqueConfig][]).map(([key, t]) => (
              <button
                key={key}
                onClick={() => { if (status === "idle") setTechnique(key); }}
                disabled={status !== "idle"}
                className={`h-9 px-4 rounded-full text-sm font-semibold transition-all duration-200 ${
                  technique === key
                    ? "bg-sage-500 text-white shadow-[0_4px_12px_-4px_rgba(88,122,79,0.6)]"
                    : status !== "idle"
                      ? "text-night-muted/30 cursor-not-allowed"
                      : "text-night-muted hover:text-night-fg hover:bg-night-2"
                }`}
              >
                {t.label}
                {technique === key && status === "idle" && (
                  <span className="ml-1.5 text-[10px] text-white/60">{t.description}</span>
                )}
              </button>
            ))}
            <button
              onClick={() => setSoundOn(v => !v)}
              className={`h-9 w-9 rounded-full grid place-items-center text-sm transition-all ${
                soundOn
                  ? "bg-night-fg/15 text-night-fg ring-1 ring-night-border"
                  : "text-night-muted/40 hover:text-night-muted"
              }`}
              aria-label={soundOn ? "Mute sounds" : "Enable sounds"}
            >
              {soundOn
                ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.8l4.5-3.2v12.8l-4.5-3.2H4a1 1 0 01-1-1V9.8a1 1 0 011-1h2.5z" /></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
              }
            </button>
          </div>

          {/* ── CENTER: breathing visualization ── */}
          <div className="flex flex-col items-center gap-6 flex-1 justify-center">
            <div className="flex flex-col items-center">
              <BreathingRing
                phase={status === "idle" ? "idle" : status === "paused" ? "hold" : currentPhase}
                progress={phaseProgress}
                size={280}
              />

              <div className="text-center -mt-2">
                  <div className={`font-display text-[1.8rem] font-medium tracking-[0.08em] uppercase transition-all duration-500 ${meta.color}`}>
                    {status === "idle" ? "Ready" : status === "paused" ? "Paused" : PHASE_META[currentPhase].label}
                  </div>
                  {status === "running" && currentPhase !== "idle" && (
                    <div className="font-display text-[3rem] font-light text-night-fg leading-none tabular-nums mt-1">
                      {phaseSecondsLeft}
                    </div>
                  )}
                  {status === "idle" && (
                    <p className="text-night-muted text-sm mt-1">{config.phases.map(p => `${p.duration}s`).join(" · ")}</p>
                  )}
                  {status === "paused" && (
                    <p className="text-night-muted text-sm mt-1">Tap to resume</p>
                  )}
                </div>
              </div>
            </div>

          {/* ── BOTTOM: controls ── */}
          <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            {/* session timer */}
            {(status === "running" || status === "paused") && (
              <div className="flex items-center gap-2 text-night-muted text-sm">
                <div className="h-px flex-1 bg-night-border/40" />
                <span className="font-display text-2xl font-light text-night-fg tabular-nums">{formatTime(remaining)}</span>
                <span className="text-[11px] uppercase tracking-wider">remaining</span>
                <div className="h-px flex-1 bg-night-border/40" />
              </div>
            )}

            {/* action buttons */}
            <div className="flex items-center gap-3">
              {status === "idle" && (
                <button onClick={start}
                  className="h-16 w-16 rounded-full bg-sage-500 text-white grid place-items-center hover:bg-sage-400 transition-all duration-300 shadow-[0_8px_28px_-8px_rgba(88,122,79,0.8)] hover:scale-105 active:scale-95">
                  <svg className="w-7 h-7 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
              )}
              {status === "running" && (
                <>
                  <button onClick={pause}
                    className="h-16 w-16 rounded-full bg-night-2 ring-1 ring-night-border text-night-fg grid place-items-center hover:bg-night-border transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
                    </svg>
                  </button>
                  <button onClick={reset}
                    className="h-11 w-11 rounded-full ring-1 ring-night-border/60 text-night-muted grid place-items-center hover:text-night-fg hover:bg-night-2 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </>
              )}
              {status === "paused" && (
                <>
                  <button onClick={resume}
                    className="h-16 w-16 rounded-full bg-sage-500 text-white grid place-items-center hover:bg-sage-400 transition-all duration-300 shadow-[0_8px_28px_-8px_rgba(88,122,79,0.6)] hover:scale-105">
                    <svg className="w-7 h-7 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </button>
                  <button onClick={reset}
                    className="h-11 w-11 rounded-full ring-1 ring-night-border/60 text-night-muted grid place-items-center hover:text-night-fg hover:bg-night-2 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* duration pills — idle only */}
            {status === "idle" && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-night-muted/60 uppercase tracking-wider font-medium mr-1">Duration</span>
                {DURATIONS.map((d) => (
                  <button key={d} onClick={() => setDuration(d)}
                    className={`h-9 px-4 rounded-full text-sm font-semibold transition-all ${
                      duration === d
                        ? "bg-night-fg text-night ring-0"
                        : "ring-1 ring-night-border text-night-muted hover:text-night-fg hover:bg-night-2"
                    }`}
                  >{d}m</button>
                ))}
              </div>
            )}

            {/* phase rhythm indicator */}
            {status === "idle" && (
              <div className="flex items-center gap-1.5">
                {config.phases.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className={`rounded-full transition-all ${
                      p.phase === "inhale" ? "bg-sage-400 w-8 h-1.5"
                      : p.phase === "hold"   ? "bg-ochre-400 w-5 h-1.5"
                      : "bg-night-border w-6 h-1.5"
                    }`} />
                    <span className="text-[10px] text-night-muted/50 font-medium uppercase">{PHASE_META[p.phase].short}{p.duration}</span>
                    {i < config.phases.length - 1 && <span className="text-night-muted/30 text-[9px] ml-0.5">→</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
