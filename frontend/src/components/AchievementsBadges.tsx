import { useEffect, useState } from "react";
import { getAchievements, ACHIEVEMENT_META, type Achievement } from "../services/seeds";

const ALL_SLUGS = Object.keys(ACHIEVEMENT_META);

export default function AchievementsBadges() {
  const [earned, setEarned] = useState<Achievement[]>([]);

  useEffect(() => {
    getAchievements().then(setEarned).catch(() => {});
  }, []);

  const earnedSlugs = new Set(earned.map((a) => a.slug));
  // Most recently earned — gets a highlighted ring
  const latest = earned.sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())[0]?.slug;
  const earnedCount = earnedSlugs.size;

  return (
    <div className="surface-raised rounded-[1.4rem] p-5 md:p-6 h-full flex flex-col">
      {/* header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-[1.15rem] text-fg-strong">Achievements</h3>
          <p className="text-xs text-fg-muted mt-0.5">{earnedCount} of {ALL_SLUGS.length} earned</p>
        </div>
        {earnedCount > 0 && (
          <div className="h-8 w-8 rounded-full bg-sage-100 text-sage-700 grid place-items-center text-sm font-bold">
            {earnedCount}
          </div>
        )}
      </div>

      {/* progress strip */}
      <div className="h-1 rounded-full bg-border/50 overflow-hidden mb-5">
        <div
          className="h-full rounded-full bg-sage-500 transition-all duration-700"
          style={{ width: `${(earnedCount / ALL_SLUGS.length) * 100}%` }}
        />
      </div>

      {/* badges grid — earned = bigger, locked = smaller + faded */}
      <div className="grid grid-cols-4 gap-x-3 gap-y-4">
        {ALL_SLUGS.map((slug) => {
          const meta = ACHIEVEMENT_META[slug];
          const got = earnedSlugs.has(slug);
          const isLatest = slug === latest && got;

          return (
            <div
              key={slug}
              className="flex flex-col items-center gap-1.5"
              title={got ? `${meta.label} — ${meta.desc}` : `Locked: ${meta.desc}`}
            >
              <span
                className={`grid place-items-center rounded-2xl text-xl transition-all duration-300 ${
                  got
                    ? isLatest
                      ? "w-14 h-14 bg-sage-100 shadow-[0_0_0_3px_rgba(74,107,82,0.25),0_4px_12px_-6px_rgba(74,107,82,0.4)] scale-105"
                      : "w-12 h-12 bg-sage-100 shadow-[0_0_0_2px_rgba(74,107,82,0.15)]"
                    : "w-10 h-10 bg-surface-2 grayscale opacity-35"
                }`}
              >
                {meta.emoji}
              </span>
              <span
                className={`text-[10px] font-medium text-center leading-tight transition-colors ${
                  got ? "text-fg-strong" : "text-fg-muted/40"
                }`}
              >
                {meta.label}
              </span>
            </div>
          );
        })}
      </div>

      {earnedCount === 0 && (
        <p className="mt-4 text-[11px] text-fg-muted/60 text-center">
          Complete actions to earn your first badge.
        </p>
      )}
    </div>
  );
}
