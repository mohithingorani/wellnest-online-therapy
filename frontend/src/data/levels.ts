export interface Level {
  n: number;
  name: string;
  tagline: string;
  min: number;
  max: number | null; // null = no cap (last level)
  accent: string;     // Tailwind text colour for the level name
  ring: string;       // hex colour for the SVG progress ring
}

export const LEVELS: Level[] = [
  { n: 1, name: "Seedling",    tagline: "Your journey begins.",       min: 0,    max: 99,   accent: "text-sage-400",  ring: "#9cb791" },
  { n: 2, name: "Sprout",      tagline: "Something is growing.",      min: 100,  max: 299,  accent: "text-sage-500",  ring: "#75976a" },
  { n: 3, name: "Sapling",     tagline: "Roots taking hold.",         min: 300,  max: 599,  accent: "text-sage-400",  ring: "#587a4f" },
  { n: 4, name: "Bloom",       tagline: "Starting to flourish.",      min: 600,  max: 999,  accent: "text-ochre-300", ring: "#dbac52" },
  { n: 5, name: "Grove",       tagline: "A quiet strength.",          min: 1000, max: 1499, accent: "text-ochre-300", ring: "#c7943c" },
  { n: 6, name: "Flourishing", tagline: "Thriving in full.",          min: 1500, max: 2499, accent: "text-accent",    ring: "#e08a6b" },
  { n: 7, name: "Forest",      tagline: "Deep, grounded, strong.",    min: 2500, max: 3999, accent: "text-accent",    ring: "#d06f4d" },
  { n: 8, name: "Ancient",     tagline: "Wisdom through practice.",   min: 4000, max: null, accent: "text-ochre-200", ring: "#e6c279" },
];

export function getLevel(seeds: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (seeds >= LEVELS[i].min) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getProgressPct(seeds: number): number {
  const lvl = getLevel(seeds);
  if (lvl.max === null) return 100;
  const range = lvl.max - lvl.min + 1;
  return Math.min(100, Math.round(((seeds - lvl.min) / range) * 100));
}

export function seedsToNextLevel(seeds: number): number {
  const lvl = getLevel(seeds);
  if (lvl.max === null) return 0;
  return lvl.max + 1 - seeds;
}

export function getNextLevel(seeds: number): Level | null {
  const cur = getLevel(seeds);
  return LEVELS.find((l) => l.n === cur.n + 1) ?? null;
}
