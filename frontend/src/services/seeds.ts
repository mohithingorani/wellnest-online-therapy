const API = import.meta.env.VITE_API_URL ?? "/api";
const authFetch = (path: string, init?: RequestInit) =>
  fetch(`${API}${path}`, { credentials: "include", ...init });

export interface SeedsData {
  total: number;
  lifetimeEarned: number;
  transactions: { id: number; amount: number; reason: string; createdAt: string }[];
}

export interface Achievement {
  id: number;
  slug: string;
  earnedAt: string;
}

export const ACHIEVEMENT_META: Record<string, { label: string; desc: string; emoji: string }> = {
  first_seed:       { emoji: "🌱", label: "First Seed",        desc: "Earned your first seeds." },
  first_reflection: { emoji: "✍️",  label: "First Reflection",  desc: "Wrote your first journal entry." },
  week_warrior:     { emoji: "🔥", label: "Week Warrior",       desc: "Checked in 7 days in a row." },
  calm_mind:        { emoji: "🧘", label: "Calm Mind",          desc: "Completed 10 breathing sessions." },
  self_aware:       { emoji: "🎯", label: "Self-Aware",         desc: "Completed all 4 assessments." },
  connector:        { emoji: "🤝", label: "Connector",          desc: "Referred your first friend." },
  month_strong:     { emoji: "💯", label: "Month Strong",       desc: "Checked in 30 days in a row." },
};

export async function getSeeds(): Promise<SeedsData> {
  const res = await authFetch("/api/seeds/me");
  const json = await res.json();
  return json.data;
}

export async function getAchievements(): Promise<Achievement[]> {
  const res = await authFetch("/api/seeds/achievements");
  const json = await res.json();
  return json.data;
}

export async function awardClientSeeds(reason: "breathing_session" | "resource_read" | "daily_checkin") {
  const res = await authFetch("/api/seeds/award", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  return res.json();
}

export async function getWaitlistCount(): Promise<number> {
  const res = await fetch(`${import.meta.env.VITE_API_URL ?? "/api"}/waitlist/count`);
  const json = await res.json();
  return json.data?.count ?? 0;
}

export async function joinWaitlist(email: string, city?: string, concern?: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL ?? "/api"}/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, city, concern }),
    credentials: "include",
  });
  return res.json();
}
