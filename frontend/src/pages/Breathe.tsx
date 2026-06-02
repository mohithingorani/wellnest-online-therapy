import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BreathingCircle from "../components/BreathingCircle";

type Technique = "478" | "box" | "simple";
type AppPhase = "idle" | "inhale" | "hold" | "exhale";

interface TechniqueConfig {
  phases: { phase: AppPhase; duration: number }[];
  label: string;
}

const TECHNIQUES: Record<Technique, TechniqueConfig> = {
  "478": {
    label: "4-7-8",
    phases: [
      { phase: "inhale", duration: 4 },
      { phase: "hold", duration: 7 },
      { phase: "exhale", duration: 8 },
    ],
  },
  box: {
    label: "Box",
    phases: [
      { phase: "inhale", duration: 4 },
      { phase: "hold", duration: 4 },
      { phase: "exhale", duration: 4 },
      { phase: "hold", duration: 4 },
    ],
  },
  simple: {
    label: "Simple",
    phases: [
      { phase: "inhale", duration: 4 },
      { phase: "exhale", duration: 6 },
    ],
  },
};

const DURATIONS = [1, 3, 5] as const;
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Breathe() {
  const navigate = useNavigate();

  const [technique, setTechnique] = useState<Technique>("478");
  const [duration, setDuration] = useState<number>(3);
  const [status, setStatus] = useState<"idle" | "running" | "paused" | "complete">("idle");
  const [currentPhase, setCurrentPhase] = useState<AppPhase>("idle");
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const startTimeRef = useRef(0);
  const rafRef = useRef(0);

  const config = TECHNIQUES[technique];
  const cycleDuration = config.phases.reduce((s, p) => s + p.duration, 0);
  const totalDuration = duration * 60;

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
    let found = false;

    for (const p of config.phases) {
      const next = accum + p.duration;
      if (cycleTime < next) {
        setCurrentPhase(p.phase);
        setPhaseProgress((cycleTime - accum) / p.duration);
        found = true;
        break;
      }
      accum = next;
    }

    if (!found) {
      setCurrentPhase(config.phases[0].phase);
      setPhaseProgress(0);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [config.phases, cycleDuration, totalDuration]);

  useEffect(() => {
    if (status === "running") {
      startTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [status, animate]);

  useEffect(() => {
    if (status === "running" || status === "paused") return;
    setCurrentPhase("idle");
    setPhaseProgress(0);
    setElapsed(0);
  }, [technique, duration]);

  const start = () => {
    setElapsed(0);
    setStatus("running");
  };

  const pause = () => setStatus("paused");

  const resume = () => {
    startTimeRef.current = performance.now() - elapsed * 1000;
    setStatus("running");
  };

  const reset = () => {
    setStatus("idle");
    setElapsed(0);
    setCurrentPhase("idle");
    setPhaseProgress(0);
  };

  const remaining = Math.max(0, totalDuration - elapsed);

  return (
    <div className="relative min-h-[calc(100vh-68px)] overflow-x-hidden journal-canvas flex flex-col animate-page">
      {/* Atmospheric blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-16 h-[500px] w-[500px] rounded-full bg-clay-200/50 blur-[130px] animate-blob" />
        <div className="absolute -bottom-40 left-1/4 h-[420px] w-[420px] rounded-full bg-ochre-200/40 blur-[120px] animate-blob" style={{ animationDelay: "6s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_-10%,rgba(220,166,75,0.06),transparent_55%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-5 md:px-8 py-7 md:py-9">
        {status === "complete" ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-success/15 text-success grid place-items-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div className="text-center">
              <h2 className="font-display text-3xl font-medium text-fg-strong">Session complete</h2>
              <p className="mt-2 text-fg-muted">Well done. You took {duration}-minute{duration > 1 ? "s" : ""} for yourself.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={start} className="h-12 px-7 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-all duration-300 shadow-lift">
                Start again
              </button>
              <button onClick={() => navigate("/dashboard")} className="h-12 px-7 rounded-full ring-1 ring-border text-fg-strong font-semibold text-sm hover:bg-surface-2 transition-colors">
                Back to dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 xl:gap-24">
            {/* Left: Breathing circle */}
            <div className="flex flex-col items-center gap-6">
              <BreathingCircle
                phase={status === "idle" ? "idle" : status === "paused" ? "hold" : currentPhase}
                progress={phaseProgress}
                technique={technique}
              />
            </div>

            {/* Right: Controls panel */}
            <div className="flex flex-col items-center gap-6 w-full max-w-sm bg-surface ring-1 ring-border rounded-3xl px-8 py-10 shadow-soft">
              <div className="text-center">
                <h2 className="font-display text-lg font-medium text-fg-strong">Breathing exercise</h2>
                <p className="text-sm text-fg-muted mt-0.5">Choose your technique and start</p>
              </div>

              {/* Technique selector */}
              <div className="flex rounded-full bg-surface-2 ring-1 ring-border p-1 max-w-full overflow-x-auto">
                {(Object.entries(TECHNIQUES) as [Technique, TechniqueConfig][]).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => { if (status === "idle") setTechnique(key); }}
                    disabled={status !== "idle"}
                    className={`h-9 px-5 rounded-full text-sm font-semibold capitalize transition-colors whitespace-nowrap ${
                      technique === key
                        ? "bg-accent text-primary-fg shadow-soft"
                        : status !== "idle"
                          ? "text-fg-muted/40 cursor-not-allowed"
                          : "text-fg-muted hover:text-fg-strong"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Timer */}
              <div className="text-center">
                <span className="font-display text-5xl sm:text-6xl font-light text-fg-strong tabular-nums tracking-tight">
                  {formatTime(Math.ceil(remaining))}
                </span>
                {status === "paused" && (
                  <span className="block mt-2 text-sm text-ochre-600 font-semibold animate-pulse-soft">Paused</span>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {status === "idle" && (
                  <button onClick={start} className="h-14 w-14 rounded-full bg-accent text-primary-fg grid place-items-center hover:bg-accent-hover transition-all duration-300 shadow-soft">
                    <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                  </button>
                )}
                {status === "running" && (
                  <button onClick={pause} className="h-14 w-14 rounded-full bg-surface-2 ring-1 ring-border text-fg-strong grid place-items-center hover:bg-surface-2/80 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" /></svg>
                  </button>
                )}
                {status === "paused" && (
                  <button onClick={resume} className="h-14 w-14 rounded-full bg-accent text-primary-fg grid place-items-center hover:bg-accent-hover transition-all duration-300 shadow-soft">
                    <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                  </button>
                )}
                {status !== "idle" && (
                  <button onClick={reset} className="h-14 w-14 rounded-full bg-surface-2 ring-1 ring-border text-fg-muted grid place-items-center hover:text-fg-strong hover:bg-surface-2/80 transition-colors" aria-label="Reset">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                )}
              </div>

              {/* Duration selector (only when idle) */}
              {status === "idle" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-fg-muted font-medium uppercase tracking-wider mr-1">Duration</span>
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`h-8 px-4 rounded-full text-sm font-semibold transition-colors ${
                        duration === d
                          ? "bg-accent text-primary-fg"
                          : "bg-surface-2 text-fg-muted hover:text-fg-strong ring-1 ring-border"
                      }`}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
