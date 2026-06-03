import { type CSSProperties, useEffect, useMemo, useState } from "react";

interface BreathingCircleProps {
  phase: "idle" | "inhale" | "hold" | "exhale";
  progress: number;
  technique: "478" | "box" | "simple";
}

const PHASE_LABELS: Record<string, string> = {
  idle: "Ready",
  inhale: "Breathe in",
  hold: "Hold",
  exhale: "Breathe out",
};

const TECHNIQUE_DESCRIPTIONS: Record<string, string> = {
  "478": "Inhale 4s \u00b7 Hold 7s \u00b7 Exhale 8s",
  box: "Inhale 4s \u00b7 Hold 4s \u00b7 Exhale 4s \u00b7 Hold 4s",
  simple: "Inhale 4s \u00b7 Exhale 6s",
};

function scaleForPhase(phase: string, progress: number): number {
  switch (phase) {
    case "idle":
      return 1;
    case "inhale":
      return 1 + 0.3 * progress;
    case "hold":
      return 1.3;
    case "exhale":
      return 1.3 - 0.3 * progress;
    default:
      return 1;
  }
}

// Constant — defined once, never recreated
const GLOW_MAP: Record<string, string> = {
  idle: "rgba(188,85,58,0.08)",
  inhale: "rgba(188,85,58,0.30)",
  hold: "rgba(188,85,58,0.18)",
  exhale: "rgba(188,85,58,0.10)",
};

export default function BreathingCircle({ phase, progress, technique }: BreathingCircleProps) {
  const scale = scaleForPhase(phase, progress);
  const isActive = phase !== "idle";

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const circleStyle = useMemo<CSSProperties>(() => prefersReducedMotion
    ? {}
    : { transform: `scale(${scale})`, transition: "transform 0.15s ease-out" },
    [prefersReducedMotion, scale]
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      <div className="relative grid place-items-center w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] overflow-visible mb-16">
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-clay-400 to-ochre-400"
          style={{
            boxShadow: `0 0 100px -10px ${GLOW_MAP[phase]}`,
            transition: "box-shadow 0.5s ease",
            ...circleStyle,
          }}
        />

        <div
          className="absolute inset-4 rounded-full backdrop-blur-sm"
          style={{
            background: "rgba(251, 246, 236, 0.45)",
          }}
        />

        <div className="relative flex flex-col items-center gap-1 px-4 text-center">
          <span className="font-display text-xl sm:text-2xl font-medium text-fg-strong">
            {PHASE_LABELS[phase]}
          </span>
          <span className="text-xs sm:text-sm text-fg-muted font-medium">
            {TECHNIQUE_DESCRIPTIONS[technique]}
          </span>
        </div>
      </div>

      {!isActive && (
        <p className="text-sm text-fg-muted animate-fade-in-up">
          Press start when you&apos;re ready
        </p>
      )}
    </div>
  );
}
