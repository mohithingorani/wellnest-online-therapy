export interface Question {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

export interface AssessmentDef {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  frame: string;          // displayed above each question as context
  accent: string;         // tailwind bg class for option selection highlight
  accentText: string;     // tailwind text class
  accentFill: string;     // hex for the fill indicator
  questions: Question[];
  score: (answers: Record<string, number>) => { score: number; band: "minimal" | "mild" | "moderate" | "high" };
  result: (band: string) => { headline: string; body: string; steps: string[] };
}

const FREQ_OPTIONS = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

export const ASSESSMENTS: AssessmentDef[] = [

  /* ── 1. Anxiety (GAD-7) ── */
  {
    id: "gad7",
    title: "Anxiety Check",
    subtitle: "7 questions · 2 min",
    description: "Based on the GAD-7 — a clinically validated screen used by mental health professionals worldwide.",
    duration: "2 min",
    frame: "Over the past 2 weeks, how often have you been bothered by…",
    accent: "bg-sage-100 border-sage-400",
    accentText: "text-sage-700",
    accentFill: "#4a6b52",
    questions: [
      { id: "q1", text: "Feeling nervous, anxious, or on edge", options: FREQ_OPTIONS },
      { id: "q2", text: "Not being able to stop or control worrying", options: FREQ_OPTIONS },
      { id: "q3", text: "Worrying too much about different things", options: FREQ_OPTIONS },
      { id: "q4", text: "Trouble relaxing, even when you have the time", options: FREQ_OPTIONS },
      { id: "q5", text: "Being so restless it's hard to sit still", options: FREQ_OPTIONS },
      { id: "q6", text: "Becoming easily annoyed or irritable", options: FREQ_OPTIONS },
      { id: "q7", text: "Feeling afraid — as if something awful might happen", options: FREQ_OPTIONS },
    ],
    score(a) {
      const s = Object.values(a).reduce((t, v) => t + v, 0);
      return { score: s, band: s <= 4 ? "minimal" : s <= 9 ? "mild" : s <= 14 ? "moderate" : "high" };
    },
    result(band) {
      const map: Record<string, { headline: string; body: string; steps: string[] }> = {
        minimal:  { headline: "Minimal anxiety",   body: "Your responses suggest little to no anxiety right now. That's genuinely good.",            steps: ["Check in weekly — anxiety can build quietly",          "Maintain sleep and movement routines, they protect you",         "Journal when you notice tension building"] },
        mild:     { headline: "Mild anxiety",       body: "You're experiencing some anxiety. It's manageable, but worth paying attention to.",        steps: ["Try the 4-7-8 breathing technique daily for one week",  "Reduce caffeine and screen time in the hour before bed",         "Write down what's worrying you — externalising it reduces its weight"] },
        moderate: { headline: "Moderate anxiety",   body: "Your anxiety is at a level where support would genuinely help. You're not alone.",         steps: ["4–6 therapy sessions can make a measurable difference",  "Practice the 5-4-3-2-1 grounding technique when overwhelmed",   "Limit news and social media to specific windows each day"] },
        high:     { headline: "High anxiety",       body: "Your responses suggest significant anxiety. Reaching out to a professional is brave.",     steps: ["Please speak to a therapist as soon as possible",       "Tell someone you trust how you've been feeling",                "During acute anxiety: focus on slow exhales — longer out than in"] },
      };
      return map[band] ?? map.mild;
    },
  },

  /* ── 2. Burnout (Maslach adapted) ── */
  {
    id: "burnout",
    title: "Burnout Screen",
    subtitle: "8 questions · 2 min",
    description: "Based on the Maslach Burnout Inventory — the most widely used burnout measure in research and clinical practice.",
    duration: "2 min",
    frame: "How much has this been true for you recently?",
    accent: "bg-clay-100 border-clay-400",
    accentText: "text-clay-700",
    accentFill: "#c9795a",
    questions: [
      { id: "q1", text: "I feel emotionally drained by my work or responsibilities", options: FREQ_OPTIONS },
      { id: "q2", text: "I feel used up by the end of the day", options: FREQ_OPTIONS },
      { id: "q3", text: "I feel tired when I wake up, even after a full night's sleep", options: FREQ_OPTIONS },
      { id: "q4", text: "Working or meeting commitments feels like a real strain", options: FREQ_OPTIONS },
      { id: "q5", text: "I feel frustrated by what I'm doing with my time", options: FREQ_OPTIONS },
      { id: "q6", text: "I feel like I'm pushing myself too hard", options: FREQ_OPTIONS },
      { id: "q7", text: "I feel like I'm at the end of my rope", options: FREQ_OPTIONS },
      { id: "q8", text: "I've become less interested in things I used to care about", options: FREQ_OPTIONS },
    ],
    score(a) {
      const s = Object.values(a).reduce((t, v) => t + v, 0);
      return { score: s, band: s <= 7 ? "minimal" : s <= 13 ? "mild" : s <= 19 ? "moderate" : "high" };
    },
    result(band) {
      const map: Record<string, { headline: string; body: string; steps: string[] }> = {
        minimal:  { headline: "Low burnout risk",  body: "You're managing well. Stay aware of early warning signs.",                                   steps: ["Protect rest time — it's not negotiable",              "Notice when work bleeds into personal time",                   "Do one thing this week that has nothing to do with output"] },
        mild:     { headline: "Early burnout signs", body: "You're showing early signs. This is the easiest stage to address.",                        steps: ["Identify your two biggest energy drains and reduce one", "Take actual breaks during the day — walk, don't scroll",      "Talk to someone you trust about how you've been feeling"] },
        moderate: { headline: "Moderate burnout",  body: "You're burning out. Your mind and body are asking for a real change.",                       steps: ["Have a direct conversation about your workload",        "Book time off — even a few days resets the nervous system",   "Therapy for burnout can be genuinely life-changing"] },
        high:     { headline: "Severe burnout",    body: "This is serious. You need rest, support, and possibly a significant change.",                steps: ["This warrants speaking to a doctor or therapist",       "Don't push through — recovery requires genuine rest",          "You're not failing. Burnout is systemic, not personal weakness"] },
      };
      return map[band] ?? map.mild;
    },
  },

  /* ── 3. Stress (PSS-4) ── */
  {
    id: "stress",
    title: "Stress Level",
    subtitle: "4 questions · 1 min",
    description: "Based on the Perceived Stress Scale (PSS-4) — the most widely used psychological instrument for measuring stress.",
    duration: "1 min",
    frame: "In the last month, how often have you felt…",
    accent: "bg-ochre-100 border-ochre-400",
    accentText: "text-ochre-700",
    accentFill: "#c9960a",
    questions: [
      { id: "q1", text: "Unable to control the important things in your life", options: FREQ_OPTIONS },
      { id: "q2", text: "That difficulties were piling up too high to overcome", options: FREQ_OPTIONS },
      { id: "q3", text: "Nervous, stressed, or tense", options: FREQ_OPTIONS },
      {
        id: "q4",
        text: "That things were going your way",
        options: [
          { value: 3, label: "Never" },
          { value: 2, label: "Almost never" },
          { value: 1, label: "Sometimes" },
          { value: 0, label: "Fairly often" },
        ],
      },
    ],
    score(a) {
      const s = Object.values(a).reduce((t, v) => t + v, 0);
      return { score: s, band: s <= 3 ? "minimal" : s <= 6 ? "mild" : s <= 9 ? "moderate" : "high" };
    },
    result(band) {
      const map: Record<string, { headline: string; body: string; steps: string[] }> = {
        minimal:  { headline: "Low stress",       body: "Your stress levels seem manageable right now.",                                           steps: ["Keep your daily routines — they're your anchor",        "Notice what's working and do more of it",                       "Check in again next week"] },
        mild:     { headline: "Mild stress",      body: "A bit elevated. Worth addressing before it compounds.",                                   steps: ["Identify one thing to delegate or drop this week",     "20 minutes of movement daily meaningfully reduces perceived stress", "Evening journaling helps process the day"] },
        moderate: { headline: "Moderate stress",  body: "You're carrying a significant load. Your body is noticing.",                             steps: ["Prioritise ruthlessly — not everything is urgent",      "Breathing exercises activate your parasympathetic system",       "Stress at this level benefits from professional support"] },
        high:     { headline: "High stress",      body: "This level of stress has real physical and mental health consequences. Take it seriously.", steps: ["Something needs to change — not just be managed",      "Talk to someone: a therapist, doctor, or a person you trust",   "Your wellbeing is not a nice-to-have. It's the foundation of everything"] },
      };
      return map[band] ?? map.mild;
    },
  },

  /* ── 4. Mood Check ── */
  {
    id: "mood",
    title: "Mood Check",
    subtitle: "5 questions · 1 min",
    description: "A quick snapshot of your emotional wellbeing right now. Not diagnostic — just reflective.",
    duration: "1 min",
    frame: "Right now, honestly…",
    accent: "bg-sage-100 border-sage-400",
    accentText: "text-sage-700",
    accentFill: "#4a6b52",
    questions: [
      { id: "q1", text: "How have you been feeling overall?",                     options: [{ value: 0, label: "Very low" },       { value: 1, label: "Low" },          { value: 2, label: "Okay" },               { value: 3, label: "Good" }] },
      { id: "q2", text: "How is your energy?",                                    options: [{ value: 0, label: "Completely drained" }, { value: 1, label: "Low" },       { value: 2, label: "Moderate" },           { value: 3, label: "Energised" }] },
      { id: "q3", text: "How well are you sleeping?",                             options: [{ value: 0, label: "Very poorly" },    { value: 1, label: "Poorly" },       { value: 2, label: "Okay" },               { value: 3, label: "Well" }] },
      { id: "q4", text: "How connected do you feel to the people in your life?",  options: [{ value: 0, label: "Very isolated" },  { value: 1, label: "Disconnected" }, { value: 2, label: "Somewhat connected" }, { value: 3, label: "Well connected" }] },
      { id: "q5", text: "How hopeful do you feel about the near future?",         options: [{ value: 0, label: "Not hopeful" },    { value: 1, label: "Uncertain" },    { value: 2, label: "Cautiously hopeful" }, { value: 3, label: "Hopeful" }] },
    ],
    score(a) {
      const s = Object.values(a).reduce((t, v) => t + v, 0);
      return { score: s, band: s <= 4 ? "high" : s <= 8 ? "moderate" : s <= 11 ? "mild" : "minimal" };
    },
    result(band) {
      const map: Record<string, { headline: string; body: string; steps: string[] }> = {
        minimal:  { headline: "Doing well",          body: "You're in a good place right now. Keep nurturing that.",                                        steps: ["Journal what's contributing to this — knowing the recipe helps", "Share your energy with someone who might need it",    "Check in again next week to track the trend"] },
        mild:     { headline: "A bit up and down",   body: "Some areas are okay, others need a little attention.",                                          steps: ["Notice which areas are lower and what might be behind it",       "One small act of self-care today can shift momentum",  "Your journal is a great place to explore this"] },
        moderate: { headline: "Struggling a bit",    body: "You're not at your best right now, and that's okay. Let's look at what might help.",            steps: ["Don't isolate — reach out to someone today",                     "A breathing exercise can help regulate you right now", "Consider whether talking to a therapist might help"] },
        high:     { headline: "Having a hard time",  body: "It sounds like you're going through something difficult. You don't have to carry this alone.",  steps: ["Please talk to someone you trust today",                         "In distress? iCall is free: 9152987821",               "A therapist can provide real, practical support for exactly this"] },
      };
      return map[band] ?? map.mild;
    },
  },
];

export function getAssessment(id: string): AssessmentDef | undefined {
  return ASSESSMENTS.find((a) => a.id === id);
}
