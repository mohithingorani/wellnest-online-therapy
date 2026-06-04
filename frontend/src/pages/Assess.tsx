import { useNavigate } from "react-router-dom";
import { ASSESSMENTS } from "../data/assessments";
import Reveal from "../components/Reveal";
import PageShell from "../components/PageShell";

/* Each assessment gets its own color identity — content drives the design */
const CARD_STYLES: Record<string, {
  bg: string; accent: string; num: string; glow: string;
}> = {
  // Each card has a clearly distinct color identity
  gad7:    { bg: "bg-[#1e2535]",      accent: "bg-blue-400/20 hover:bg-blue-400/30",   num: "text-white/[0.06]", glow: "from-blue-400/15 to-transparent" },
  burnout: { bg: "bg-[#2c1c12]",      accent: "bg-ochre-300/20 hover:bg-ochre-300/30", num: "text-white/[0.06]", glow: "from-ochre-300/25 to-transparent" },
  stress:  { bg: "bg-sage-700",       accent: "bg-white/12 hover:bg-white/22",          num: "text-white/[0.06]", glow: "from-sage-300/25 to-transparent" },
  mood:    { bg: "bg-ochre-600",       accent: "bg-white/12 hover:bg-white/22",          num: "text-white/[0.06]", glow: "from-white/10 to-transparent" },
};

const ICONS: Record<string, string> = {
  gad7:    "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  burnout: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
  stress:  "M13 10V3L4 14h7v7l9-11h-7z",
  mood:    "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
};

const NUMS = ["01", "02", "03", "04"];

export default function Assess() {
  const navigate = useNavigate();

  return (
    <PageShell
      eyebrow="Free tools"
      title="Self-Assessments"
      subtitle="Clinically-informed, free, and private. Takes 1–2 minutes each. Results are stored so you can track your progress over time."
    >
        {/* cards — each has its own color identity */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {ASSESSMENTS.map((a, i) => {
            const s = CARD_STYLES[a.id];
            return (
              <Reveal key={a.id} delay={i * 80}>
                <button
                  onClick={() => navigate(`/assess/${a.id}`)}
                  className={`group relative w-full text-left rounded-[1.6rem] p-7 flex flex-col overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 hover:scale-[1.015] hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] ${s.bg}`}
                >
                  {/* ambient glow from top */}
                  <div aria-hidden className={`pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b ${s.glow}`} />

                  {/* ghost number — decorative */}
                  <span aria-hidden className={`pointer-events-none select-none absolute -bottom-4 right-3 font-display font-bold leading-none text-[7rem] ${s.num}`}>
                    {NUMS[i]}
                  </span>

                  {/* top row: icon + duration */}
                  <div className="relative flex items-start justify-between gap-3">
                    <svg className="w-8 h-8 text-white/75 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[a.id]} />
                    </svg>
                    <span className="text-[11px] font-semibold bg-white/15 text-white/90 rounded-full px-3 py-1 backdrop-blur-sm shrink-0">
                      {a.duration}
                    </span>
                  </div>

                  {/* title + desc */}
                  <div className="relative mt-5 flex-1">
                    <h2 className="font-display text-[1.4rem] font-medium text-white leading-tight tracking-[-0.01em]">{a.title}</h2>
                    <p className="mt-2.5 text-[0.85rem] text-white/65 leading-relaxed line-clamp-2">{a.description}</p>
                  </div>

                  {/* CTA */}
                  <div className="relative mt-6">
                    <span className={`inline-flex items-center gap-2 ${s.accent} text-white text-sm font-semibold rounded-full px-4 py-2 transition-all duration-200 backdrop-blur-sm`}>
                      Start
                      <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={340}>
          <p className="mt-6 text-xs text-fg-muted/70 max-w-lg leading-relaxed">
            These tools are for self-reflection and are not a clinical diagnosis. If you're in crisis, please contact iCall: <a href="tel:9152987821" className="underline">9152987821</a> or a mental health professional.
          </p>
        </Reveal>
    </PageShell>
  );
}
