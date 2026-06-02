/* Local mood-check-in store. Frontend-only (no backend yet): persists daily
   mood (1–5) to localStorage and seeds ~14 days of realistic history so the
   trend chart is meaningful on first visit. */

export interface MoodEntry {
  date: string; // YYYY-MM-DD
  value: number; // 1..5
}

export const MOODS = [
  { v: 1, label: "Rough", tone: "from-clay-400 to-clay-600" },
  { v: 2, label: "Low", tone: "from-clay-300 to-clay-500" },
  { v: 3, label: "Okay", tone: "from-ochre-300 to-ochre-500" },
  { v: 4, label: "Good", tone: "from-sage-300 to-sage-500" },
  { v: 5, label: "Great", tone: "from-sage-400 to-sage-600" },
];

const KEY = "wellnest_moods";

function key(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function seed(): MoodEntry[] {
  const out: MoodEntry[] = [];
  const base = [2, 3, 2, 3, 3, 4, 3, 4, 4, 3, 4, 5, 4, 4];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({ date: key(d), value: base[13 - i] });
  }
  return out;
}

function read(): MoodEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw);
  } catch {
    return seed();
  }
}

export const moods = {
  series(): MoodEntry[] {
    return read().sort((a, b) => a.date.localeCompare(b.date));
  },
  today(): MoodEntry | undefined {
    return read().find((e) => e.date === key(new Date()));
  },
  log(value: number): MoodEntry[] {
    const k = key(new Date());
    const list = read().filter((e) => e.date !== k);
    list.push({ date: k, value });
    localStorage.setItem(KEY, JSON.stringify(list));
    return this.series();
  },
  /** Current consecutive-day check-in streak. */
  streak(): number {
    const set = new Set(read().map((e) => e.date));
    let n = 0;
    const d = new Date();
    while (set.has(key(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  },
  average(): number {
    const s = read();
    return s.length ? s.reduce((a, e) => a + e.value, 0) / s.length : 0;
  },
};
