export interface Resource {
  slug: string;
  title: string;
  subtitle: string;
  topic: "anxiety" | "burnout" | "relationships" | "sleep" | "stress" | "therapy";
  level: "understanding" | "coping" | "thriving";
  readMinutes: number;
  body: string; // markdown-lite (paragraphs separated by \n\n, ## for headings, **bold**)
}

export const TOPIC_META: Record<Resource["topic"], { label: string; color: string; bg: string }> = {
  anxiety:       { label: "Anxiety",       color: "text-clay-700",  bg: "bg-clay-50 border-clay-200" },
  burnout:       { label: "Burnout",       color: "text-ochre-700", bg: "bg-ochre-100 border-ochre-200" },
  relationships: { label: "Relationships", color: "text-sage-700",  bg: "bg-sage-50 border-sage-200" },
  sleep:         { label: "Sleep",         color: "text-fg",        bg: "bg-surface-2 border-border" },
  stress:        { label: "Stress",        color: "text-clay-600",  bg: "bg-clay-50 border-clay-100" },
  therapy:       { label: "Therapy",       color: "text-sage-600",  bg: "bg-sage-100 border-sage-200" },
};

export const LEVEL_META: Record<Resource["level"], { label: string }> = {
  understanding: { label: "Understanding" },
  coping:        { label: "Coping tools" },
  thriving:      { label: "Thriving" },
};

export const RESOURCES: Resource[] = [
  {
    slug: "what-is-anxiety",
    title: "What is anxiety — and how do you know when it's a problem?",
    subtitle: "Understanding the difference between normal worry and clinical anxiety.",
    topic: "anxiety",
    level: "understanding",
    readMinutes: 4,
    body: `## Anxiety is not a character flaw

Everyone experiences anxiety. It is, at its core, your body's alarm system — a survival mechanism that evolved to protect you from danger. When you feel your heart race before a presentation or your stomach tighten before a difficult conversation, that is anxiety doing exactly what it was designed to do.

The problem is that this system can become miscalibrated. It starts firing in situations that are not actually dangerous. And when it fires too often, too intensely, or for too long, it stops being useful and starts interfering with your life.

## The spectrum: helpful to harmful

**Helpful anxiety** sharpens your focus before an exam, keeps you alert during a difficult negotiation, and makes sure you don't walk into traffic. It motivates action and then fades when the situation passes.

**Unhelpful anxiety** persists long after the situation is resolved. It shows up in the middle of the night with "what if" thoughts that spiral. It makes you avoid things that matter to you — social situations, opportunities, conversations. It feels physical: tight chest, shallow breathing, constant tension in your shoulders.

The distinction is not how much you feel it, but how much it controls your life.

## Signs it may be worth taking seriously

You do not need to have a diagnosis for anxiety to be worth addressing. Ask yourself:

- Am I spending significant time worrying about things I cannot control?
- Am I avoiding situations because of anxiety that I would otherwise want to engage with?
- Is my sleep affected by racing thoughts?
- Do I feel physically tense or exhausted most of the time?
- Has anxiety stopped me from doing something important to me in the last month?

If you answered yes to two or more of these, your anxiety is worth paying attention to. That is not a verdict — it is information.

## What helps

The most well-researched approach to anxiety is **Cognitive Behavioural Therapy (CBT)** — a structured way of identifying thought patterns that fuel anxiety and gradually changing them. It works. Studies consistently show 60-80% of people with anxiety disorders improve significantly with CBT.

Other evidence-based tools include breathing regulation (slowing your exhale activates the parasympathetic nervous system), regular aerobic exercise (shown to reduce anxiety as effectively as medication in mild cases), and reducing stimulants like caffeine.

The most important thing is not to treat anxiety as a permanent feature of who you are. It is a pattern, and patterns can change.`,
  },
  {
    slug: "science-of-burnout",
    title: "The science of burnout — and the 3 signs you're already there",
    subtitle: "Why burnout isn't just being tired, and what your body is actually telling you.",
    topic: "burnout",
    level: "understanding",
    readMinutes: 5,
    body: `## Burnout is not the same as being tired

Tiredness resolves with rest. Burnout does not. This is the most important distinction, and it explains why so many people try to "sleep it off" and feel exactly the same — or worse — after a week off.

Burnout is a state of chronic depletion that affects three dimensions simultaneously: emotional exhaustion, depersonalisation (a detachment or cynicism about your work or the people in it), and a reduced sense of personal accomplishment. This three-part definition comes from Christina Maslach, whose decades of research established burnout as a legitimate occupational syndrome — not a weakness.

## The 3 signs

**1. Exhaustion that rest doesn't fix**
This is the core of burnout. You wake up tired. You get through the day by willpower alone. A good night's sleep or even a holiday restores nothing. This happens because burnout disrupts your body's cortisol rhythm — the hormonal pattern that normally gives you energy in the morning and lets you wind down at night.

**2. Cynicism and emotional distance**
You start to feel detached from your work in a way that surprises you. Things that used to matter feel hollow. You become less patient, more irritable, and sometimes sarcastically dismissive — often about things you genuinely care about. This is not a personality change. It is a protective mechanism. Your mind is trying to reduce exposure to the source of depletion.

**3. Feeling ineffective regardless of output**
Even when you are producing, it feels meaningless. You complete tasks but feel no satisfaction. You receive praise but cannot internalise it. This loss of a sense of accomplishment is the most demoralising aspect of burnout because it creates a loop: you feel like you're failing, so you work harder, which deepens the depletion.

## Why it happens

Burnout is fundamentally a mismatch — between what your job demands and what your environment provides. Research identifies six key mismatches: workload, control, reward, community, fairness, and values. You do not need all six to burn out. Sustained mismatch in even one or two is enough.

The modern knowledge economy has made this worse. Work follows us everywhere. The boundary between "on" and "off" has collapsed. And there is enormous cultural pressure to frame overwork as dedication.

## What actually helps

**Rest is necessary but not sufficient.** You also need to address the source of the mismatch. That usually means having a direct conversation about workload, taking something off your plate (not just adding self-care to it), and rebuilding a sense of control somewhere in your life.

Therapy — specifically approaches focused on values, identity, and sustainable performance — can be transformative for burnout. Not because you're broken, but because an outside perspective can see the patterns you're too exhausted to notice.

The first step is always the same: stop treating burnout as a productivity problem to be optimised. It is a signal that something needs to change.`,
  },
  {
    slug: "how-to-journal",
    title: "How to start journaling — and actually stick to it",
    subtitle: "The science-backed approach that makes journaling a habit, not a chore.",
    topic: "stress",
    level: "coping",
    readMinutes: 4,
    body: `## Most people quit journaling within a week

They buy a beautiful notebook, write three earnest pages, then never open it again. This is not a discipline problem. It is a setup problem.

The way journaling is usually taught — "write about your feelings every night" — ignores how habits actually form and what makes writing therapeutic rather than tedious.

## What the research actually says

James Pennebaker at the University of Texas has spent decades studying expressive writing. His findings are consistent: writing about emotionally difficult experiences for 15–20 minutes, three or four days in a row, produces measurable improvements in mood, immune function, and cognitive clarity. The mechanism is not catharsis. It is **meaning-making** — the process of organising chaotic emotional experience into a coherent narrative gives your brain something to do with the material instead of ruminating on it.

This has implications for how you approach journaling.

## The approach that actually works

**Write to understand, not to record.** You are not keeping a diary. You are processing. The goal is to finish a session with slightly more clarity than you started with — not a complete account of your day.

**Start with a prompt.** Blank pages are intimidating. Begin with a question:
- What am I avoiding thinking about right now?
- What am I pretending is fine?
- If I were giving advice to a friend in my exact situation, what would I say?
- What was hard today, and why did it land the way it did?

**Keep it short and regular.** Ten minutes three times a week beats an hour once a month. Habit formation research (BJ Fogg's work at Stanford) shows that frequency matters more than duration, especially in the early stages. Attach journaling to an existing habit — morning coffee, the end of the workday, before bed.

**Don't edit yourself.** The therapeutic benefit comes from unfiltered expression, not polished prose. Spelling, grammar, coherence — none of it matters. Write as if no one will ever read it (and keep it somewhere that ensures that).

## What to do when nothing comes

Some days you will sit down and feel blank. Write that: "I sat down to write and nothing came. I think I'm avoiding something but I don't know what." That single line often breaks the logjam.

The goal is not brilliant insights every session. The goal is to build a habit of turning inward rather than away.`,
  },
  {
    slug: "cbt-techniques",
    title: "5 CBT techniques you can use without a therapist",
    subtitle: "The most effective self-help tools from Cognitive Behavioural Therapy — in plain language.",
    topic: "anxiety",
    level: "coping",
    readMinutes: 6,
    body: `## CBT is the most researched psychological intervention in history

Cognitive Behavioural Therapy has more clinical trials behind it than any other form of psychotherapy. Its core insight is deceptively simple: how you think about a situation determines how you feel about it — and feelings drive behaviour. Change the thought pattern, change the feeling, change the behaviour.

This does not mean "just think positive." It means learning to identify thoughts that are inaccurate, exaggerated, or unhelpful, and systematically replacing them with more realistic alternatives.

Here are five techniques you can start using today.

## 1. The Thought Record

When you notice a strong negative emotion, stop and write down:
- **Situation**: What happened?
- **Automatic thought**: What went through your mind immediately?
- **Emotion**: What did you feel? How intense (0–100)?
- **Evidence for**: What facts support this thought?
- **Evidence against**: What facts contradict it?
- **Balanced thought**: What is a more accurate way to see this?
- **Outcome**: How do you feel now (0–100)?

This process takes 10–15 minutes and interrupts the emotional momentum of a difficult thought. With practice, you will start doing it automatically.

## 2. Behavioural Activation

Depression and low mood create a vicious cycle: you feel bad, so you stop doing things, so you feel worse. Behavioural activation breaks the cycle by scheduling activities that provide either pleasure or a sense of accomplishment — regardless of whether you "feel like it."

Make a list of activities in two columns: things that used to bring you pleasure, and things that give you a sense of achievement. Schedule at least one item from each column every day. The feeling of motivation often follows the action, not the other way around.

## 3. Cognitive Restructuring — Identifying Distortions

CBT has catalogued recurring patterns of inaccurate thinking. Recognising yours is the first step to changing them:

- **All-or-nothing thinking**: "I failed one part, so the whole thing is ruined."
- **Catastrophising**: "This will definitely lead to the worst possible outcome."
- **Mind reading**: "They're definitely judging me negatively."
- **Personalisation**: "When things go wrong, it's always my fault."
- **Overgeneralisation**: "This always happens to me."

When you notice a distressing thought, ask: which pattern is this? Naming it creates psychological distance.

## 4. Graded Exposure

Anxiety is maintained by avoidance. Every time you avoid something because it makes you anxious, you reinforce the belief that it is genuinely dangerous. Graded exposure is the structured process of gradually confronting avoided situations, starting with the least anxiety-provoking and moving up.

Create a "fear ladder" — list 8–10 versions of the thing you avoid, from mildly uncomfortable to very difficult. Start at the bottom. Stay in the situation until your anxiety naturally peaks and then decreases (usually 20–40 minutes). Move up only when the current step produces minimal anxiety.

## 5. Problem-Solving

Much anxiety is underpinned by real, unsolved problems. Problem-solving therapy breaks the process into steps:
1. Define the problem precisely (vague problems produce vague solutions)
2. Brainstorm all possible solutions, without judging any of them
3. Evaluate each for pros, cons, and feasibility
4. Choose one and implement it
5. Review: did it work? If not, go back to step 2.

The goal is not to solve every problem perfectly. It is to restore a sense of agency — the feeling that you can take effective action — which is itself therapeutic.`,
  },
  {
    slug: "understanding-therapy",
    title: "Understanding therapy — what to expect, and how to get the most from it",
    subtitle: "Everything you wish someone had told you before your first session.",
    topic: "therapy",
    level: "understanding",
    readMinutes: 5,
    body: `## Therapy is a skill, not a prescription

The biggest misconception about therapy is that it is something done to you. You arrive, describe your problems, and the therapist fixes them. This model leads to disappointment.

Therapy is more like physiotherapy. You attend sessions, learn techniques, and practise them between appointments. The therapist is an expert guide, but the work happens in your life — not in the room.

## What actually happens in a session

**The first session** is almost always an assessment. Your therapist will ask about what brought you in, your history, what you want from therapy, and your goals. It is normal to feel uncertain or emotional. You are not expected to have everything figured out.

Subsequent sessions vary enormously depending on the therapist's approach and your needs. In CBT-focused sessions, you might review homework from the previous week, identify a current challenge, and work through techniques together. In more exploratory approaches, sessions feel more like a conversation.

**The therapeutic relationship itself is therapeutic.** Research consistently shows that the quality of the relationship between therapist and client predicts outcomes more than the specific techniques used. This is why finding the right fit matters so much.

## How to find the right therapist

The most important criterion is whether you feel safe, heard, and not judged — usually apparent within the first two sessions. Secondary criteria include:

- **Approach**: CBT is evidence-based for anxiety and depression. Psychodynamic approaches suit deeper, longer-term work on patterns and identity. ACT (Acceptance and Commitment Therapy) is excellent for values-based reorientation. Ask the therapist what they practice and how it might help your specific situation.
- **Specialisation**: If you have a specific concern — trauma, relationships, OCD — look for someone with specific training in that area.
- **Practical fit**: Session format (video, phone, in-person), frequency, and cost.

It is completely normal to try two or three therapists before finding the right fit. This is not failure. It is informed choice.

## How to get the most from it

- **Come prepared**: Before each session, note one or two things you want to discuss. Sessions pass faster than expected.
- **Do the work between sessions**: Whatever your therapist suggests — journaling, behavioural experiments, thought records — the between-session practice is where change actually happens.
- **Be honest about what isn't working**: If an approach isn't resonating, say so. Good therapists adjust. They are not attached to their techniques.
- **Track your progress**: Notice what changes over time — in your mood, your relationships, your ability to handle difficulty. Progress in therapy is often gradual and easy to miss in the day-to-day.

## What therapy is not

It is not advice-giving (a therapist helps you find your own answers, not tell you what to do). It is not venting (though venting can be part of it). It is not a quick fix. And it is not only for people in crisis — it is for anyone who wants to understand themselves better and live more intentionally.`,
  },
  {
    slug: "talking-about-mental-health",
    title: "How to talk to someone about mental health for the first time",
    subtitle: "What to say, when to say it, and how to make it less terrifying.",
    topic: "relationships",
    level: "coping",
    readMinutes: 4,
    body: `## The hardest part is starting

Most people who are struggling do not tell anyone. Not because they don't want support — they do — but because they don't know how to begin. They worry about burdening others, being misunderstood, or having their experience minimised with well-meaning but unhelpful responses.

These concerns are valid. But isolation makes almost everything worse. Connection — even imperfect connection — is one of the strongest protective factors in mental health.

## Choosing who to tell

You do not owe anyone access to your inner life. Start with someone who has demonstrated that they can hold difficult things without fixing, judging, or immediately redirecting to themselves.

Think about a conversation where someone was vulnerable with you. Did they feel heard? If yes, that person is probably a good candidate.

Avoid leading with the most difficult disclosures. It is easier to say "I've been struggling with my mental health lately" than "I've been having panic attacks every night." Start with as much or as little as feels safe.

## What to say

You do not need a script, but having language helps. Some starting points:

- "I've been having a harder time than I've let on. I don't need you to fix anything — I just wanted you to know."
- "I've been dealing with some anxiety / low mood / stress lately, and I thought it might help to talk about it."
- "I want to tell you something but I'm nervous. Can I have a few minutes without you jumping in with solutions?"

That last one is important. Explicitly asking for the kind of support you want — being listened to, rather than advised — saves both of you from a frustrating exchange.

## What to expect (and what not to)

Even thoughtful people sometimes respond imperfectly. Common unhelpful responses include: "Everyone feels like that," "Just exercise more / sleep more / eat better," or pivoting to their own struggles. These responses come from discomfort, not indifference. Most people do not know how to respond to vulnerability.

If this happens, you can redirect: "I know — it might just help to talk about it a bit more before I get to solutions." Or you can note that this person is not the right confidant for this topic and try someone else. One poor response does not mean you should stop trying.

## If the person is you — telling yourself it's okay to struggle

For many people, the hardest conversation is internal. There is a voice that says struggling means weakness, that it should be manageable, that other people have bigger problems.

Acknowledge that voice. Then gently ask it where that belief came from — and whether it is actually true, or just a rule you absorbed from somewhere.

You are not failing by struggling. You are human, under real pressure, doing the best you can. Asking for support is not weakness. It is how human beings were designed to cope.`,
  },
];

export function getResource(slug: string): Resource | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}
