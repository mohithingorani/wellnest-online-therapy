const AFFIRMATIONS = [
  "You are doing enough, even when it doesn't feel that way.",
  "This feeling will pass. You've weathered harder days.",
  "Progress isn't linear — and that's perfectly okay.",
  "Rest is not a reward. It's a necessity.",
  "You don't have to have everything figured out today.",
  "Healing happens in small, quiet moments.",
  "Your only task right now is to breathe.",
  "You are worthy of kindness — especially your own.",
  "Comparison is the thief of joy. Stay in your lane.",
  "Asking for help is a sign of strength, not weakness.",
  "You are not your worst thoughts. You are the one observing them.",
  "Growth feels uncomfortable. That means it's working.",
  "Be gentle with yourself. You're doing the best you can.",
  "Mistakes are data, not verdicts.",
  "Your feelings are valid. All of them.",
  "You've survived 100% of your bad days so far.",
  "It's okay to outgrow people and places that no longer fit.",
  "Small steps forward are still steps forward.",
  "You are allowed to take up space.",
  "Not every day needs to be productive. Some days just need to be.",
  "Your body has carried you through so much. Thank it.",
  "Clarity comes from action, not thought.",
  "You can be a work in progress and be enough at the same time.",
  "Setbacks are setups for comebacks.",
  "What you feel today does not define who you are.",
  "You are allowed to change your mind.",
  "Some of the most beautiful things grow slowly.",
  "Your peace is a priority, not a luxury.",
  "Letting go is not giving up. It's making room.",
  "You are exactly where you need to be.",
];

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let m = copy.length;
  while (m) {
    m--;
    seed = (seed * 16807) % 2147483647;
    const i = seed % (m + 1);
    [copy[m], copy[i]] = [copy[i], copy[m]];
  }
  return copy;
}

function getDateSeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function getDailyAffirmation(): string {
  const shuffled = seededShuffle(AFFIRMATIONS, getDateSeed());
  return shuffled[0];
}
