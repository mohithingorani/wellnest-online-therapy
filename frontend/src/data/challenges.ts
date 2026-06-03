export interface Challenge {
  id: string;
  title: string;
  description: string;
  days: number;
  action: "checkin" | "journal" | "breathe" | "assess";
  actionLabel: string;
  actionRoute: string;
  seeds: number;
}

export const CHALLENGES: Challenge[] = [
  { id: "mood_week", title: "Mood Check Week", description: "Log your mood every day for 7 days.", days: 7, action: "checkin", actionLabel: "Log mood", actionRoute: "/dashboard", seeds: 35 },
  { id: "reflection_week", title: "Reflection Week", description: "Write one journal entry every day for 5 days.", days: 5, action: "journal", actionLabel: "Write entry", actionRoute: "/journal", seeds: 35 },
  { id: "breath_break", title: "Breath Break", description: "Complete one breathing session per day for 5 days.", days: 5, action: "breathe", actionLabel: "Breathe", actionRoute: "/breathe", seeds: 35 },
  { id: "self_aware_week", title: "Know Yourself", description: "Take all 4 self-assessments this week.", days: 7, action: "assess", actionLabel: "Take assessment", actionRoute: "/assess", seeds: 40 },
];

/* Deterministically pick the current week's challenge based on week number */
export function getCurrentChallenge(): Challenge {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  return CHALLENGES[week % CHALLENGES.length];
}

/* Days completed this week for a given action type — uses localStorage for client-side tracking */
const STORAGE_KEY = "wn_challenge_progress";

interface Progress { challengeId: string; dates: string[] }

function load(): Progress | null {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null"); } catch { return null; }
}

export function getChallengeProgress(challengeId: string): number {
  const p = load();
  if (!p || p.challengeId !== challengeId) return 0;
  const mon = getMondayISO();
  return p.dates.filter((d) => d >= mon).length;
}

export function markChallengeDay(challengeId: string): void {
  const today = new Date().toISOString().slice(0, 10);
  const existing = load();
  const dates = existing?.challengeId === challengeId ? existing.dates : [];
  if (!dates.includes(today)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ challengeId, dates: [...dates, today] }));
  }
}

function getMondayISO(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}
