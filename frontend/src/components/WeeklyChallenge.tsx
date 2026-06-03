import { useNavigate } from "react-router-dom";
import { getCurrentChallenge, getChallengeProgress, markChallengeDay } from "../data/challenges";
import { IcPen, IcWind, IcTarget, IcMoon, IcLeaf, IcCheck } from "./Icon";

const API = import.meta.env.VITE_API_URL ?? "/api";

/* Claim the weekly challenge reward from the backend (idempotent — deduped by week key). */
async function claimChallengeReward(challengeId: string, seeds: number) {
  try {
    await fetch(`${API}/seeds/complete-challenge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ challengeId, seeds }),
    });
  } catch {
    // Non-fatal — seeds will be claimed next time
  }
}

const ACTION_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  checkin: IcMoon,
  journal: IcPen,
  breathe: IcWind,
  assess:  IcTarget,
};

export default function WeeklyChallenge() {
  const navigate = useNavigate();
  const challenge = getCurrentChallenge();
  const done = getChallengeProgress(challenge.id);
  const completed = done >= challenge.days;
  const ActionIcon = ACTION_ICON[challenge.action] ?? IcLeaf;

  if (completed) {
    return (
      <div className="relative rounded-[1.4rem] overflow-hidden bg-sage-600 p-6 md:p-7">
        <div className="relative flex items-center gap-4">
          <span className="w-10 h-10 rounded-2xl bg-white/20 grid place-items-center shrink-0">
            <IcCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
          </span>
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Week complete</p>
            <h3 className="mt-0.5 font-display text-[1.15rem] text-white font-medium">{challenge.title}</h3>
          </div>
          <span className="ml-auto shrink-0 flex items-center gap-1 bg-white/20 text-white text-sm font-bold rounded-full px-3 py-1">
            +{challenge.seeds} <IcLeaf className="w-3.5 h-3.5" />
          </span>
        </div>
        <p className="relative mt-3 text-sm text-white/70">You completed this week's challenge. Seeds added to your balance.</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-[1.4rem] overflow-hidden card-feature p-6 md:p-7">
      {/* decorative icon bg */}
      <div aria-hidden className="pointer-events-none absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/[0.04] grid place-items-center">
        <ActionIcon className="w-12 h-12 text-white/[0.07]" />
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-night-muted">This week</p>
          <h3 className="mt-1.5 font-display text-[1.2rem] text-night-fg font-medium leading-tight">{challenge.title}</h3>
          <p className="mt-1.5 text-xs text-night-muted leading-relaxed max-w-xs">{challenge.description}</p>
        </div>
        <span className="shrink-0 flex items-center gap-1 text-[13px] font-bold bg-ochre-300/20 text-ochre-200 rounded-full px-3 py-1.5 ring-1 ring-ochre-300/20">
          +{challenge.seeds} <IcLeaf className="w-3 h-3" />
        </span>
      </div>

      {/* day dots */}
      <div className="relative mt-5 flex items-center gap-1.5">
        {Array.from({ length: challenge.days }).map((_, i) => (
          <span key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i < done ? "bg-ochre-300" : "bg-white/10"}`}
            style={{ transitionDelay: `${i * 60}ms` }} />
        ))}
      </div>
      <div className="relative mt-2 flex justify-between text-[10px] text-night-muted/60">
        <span>{done}/{challenge.days} days</span>
        <span>{challenge.days - done} remaining</span>
      </div>

      <div className="relative mt-5">
        <button onClick={() => {
          markChallengeDay(challenge.id);
          // If this click completes the challenge, claim the reward from backend
          const newDone = getChallengeProgress(challenge.id);
          if (newDone >= challenge.days) {
            claimChallengeReward(challenge.id, challenge.seeds);
          }
          navigate(challenge.actionRoute);
        }}
          className="inline-flex items-center gap-2 h-9 px-5 rounded-full bg-ochre-300 text-night text-sm font-semibold hover:bg-ochre-200 transition-all duration-200">
          <ActionIcon className="w-4 h-4" />
          {challenge.actionLabel}
        </button>
      </div>
    </div>
  );
}
