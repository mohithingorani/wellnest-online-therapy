const PROMPTS = [
  "What made you smile today?",
  "What's one thing you're grateful for right now?",
  "How are you feeling, really — no filter?",
  "What's been on your mind lately?",
  "Describe a small win from today.",
  "What do you need more of in your life?",
  "Write about a memory that brings you peace.",
  "What would you tell your younger self?",
  "What are you looking forward to?",
  "Describe your ideal calm moment.",
  "What's something you learned about yourself recently?",
  "Who made a difference in your day today?",
  "What's one thing you can let go of?",
  "What does self-care look like for you right now?",
  "Write about a place where you feel safe.",
  "What's a challenge you're proud of overcoming?",
  "What kindness did you receive or give today?",
  "What's a boundary you want to set?",
  "Describe your perfect morning.",
  "What's something you've been avoiding that you want to face?",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function getDailyPrompt(): string {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const idx = Math.floor(seededRandom(seed) * PROMPTS.length);
  return PROMPTS[idx];
}

export function getAllPrompts(): string[] {
  return PROMPTS;
}
