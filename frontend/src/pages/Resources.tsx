import PageShell from "../components/PageShell";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RESOURCES, TOPIC_META, type Resource } from "../data/resources";
import Reveal from "../components/Reveal";

const ALL_TOPICS = ["all", "anxiety", "burnout", "stress", "relationships", "sleep", "therapy"] as const;

/* Solid fill colors for the featured card left panel & border accents */
const TOPIC_FILL: Record<Resource["topic"], string> = {
  anxiety:       "bg-night",
  burnout:       "bg-night",
  stress:        "bg-sage-700",
  relationships: "bg-ochre-600",
  sleep:         "bg-night",
  therapy:       "bg-sage-600",
};

const TOPIC_BORDER: Record<Resource["topic"], string> = {
  anxiety:       "border-night",
  burnout:       "border-accent/50",
  stress:        "border-sage-500",
  relationships: "border-ochre-400",
  sleep:         "border-fg-muted",
  therapy:       "border-sage-400",
};

export default function Resources() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState<string>("all");

  const filtered = topic === "all" ? RESOURCES : RESOURCES.filter((r) => r.topic === topic);

  const filterBar = (
    <div className="flex flex-wrap gap-2">
      {ALL_TOPICS.map((t) => (
        <button key={t} onClick={() => setTopic(t)}
          className={`h-8 px-3.5 rounded-full text-xs font-semibold border transition-all duration-200 ${topic === t ? "bg-accent text-primary-fg border-accent shadow-soft" : "bg-surface border-border text-fg-muted hover:border-accent/50 hover:text-fg"}`}
        >
          {t === "all" ? "All topics" : TOPIC_META[t as Resource["topic"]].label}
        </button>
      ))}
    </div>
  );

  return (
    <PageShell eyebrow="Free resources" title="Mental Health Library" subtitle="Evidence-informed guides written in plain language. Reading each article earns you +3 Seeds." header={filterBar}>
        {/* grid — first card is featured wide, rest are standard */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filtered.map((r, i) => {
            const tm = TOPIC_META[r.topic];
            const fill = TOPIC_FILL[r.topic];
            const border = TOPIC_BORDER[r.topic];
            const isFeatured = i === 0;

            if (isFeatured) {
              return (
                <Reveal key={r.slug} className="md:col-span-2 lg:col-span-2">
                  <button
                    onClick={() => navigate(`/resources/${r.slug}`)}
                    className="group w-full h-full text-left rounded-[1.6rem] overflow-hidden flex flex-col md:flex-row shadow-[0_2px_8px_-4px_rgba(47,58,50,0.12)] hover:shadow-[0_16px_40px_-20px_rgba(47,58,50,0.3)] transition-all duration-300 hover:scale-[1.008] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  >
                    {/* left panel — color fill */}
                    <div className={`${fill} md:w-[42%] shrink-0 p-7 flex flex-col justify-between min-h-[180px] md:min-h-0`}>
                      <div>
                        <span className="text-[11px] font-semibold bg-white/20 text-white/90 rounded-full px-3 py-1">{tm.label}</span>
                        <h2 className="mt-4 font-display text-[1.55rem] font-medium text-white leading-[1.15] tracking-[-0.01em]">{r.title}</h2>
                      </div>
                      <div className="mt-5 flex items-center gap-2 text-white/60 text-xs">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {r.readMinutes} min read · +3 Seeds
                      </div>
                    </div>

                    {/* right panel — white */}
                    <div className="bg-surface flex-1 p-7 flex flex-col justify-between">
                      <p className="text-fg-muted leading-relaxed text-[0.92rem]">{r.subtitle}</p>
                      <div className="mt-6">
                        <span className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-accent text-primary-fg text-sm font-semibold group-hover:bg-accent-hover transition-colors">
                          Begin reading
                          <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </span>
                      </div>
                    </div>
                  </button>
                </Reveal>
              );
            }

            /* Standard cards — left color border, decorative read-time number */
            return (
              <Reveal key={r.slug} delay={i * 45}>
                <button
                  onClick={() => navigate(`/resources/${r.slug}`)}
                  className={`group relative w-full h-full text-left bg-surface rounded-[1.4rem] border-l-[3.5px] ${border} p-5 pl-6 flex flex-col overflow-hidden shadow-[0_1px_4px_-2px_rgba(47,58,50,0.08)] hover:shadow-[0_10px_28px_-16px_rgba(47,58,50,0.22)] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30`}
                >
                  {/* decorative read-time — reveals on hover */}
                  <span aria-hidden className="pointer-events-none select-none absolute top-2 right-4 font-display font-bold leading-none text-[3.5rem] text-fg-muted/[0.09] group-hover:text-fg-muted/[0.22] transition-all duration-500">
                    {r.readMinutes}
                  </span>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[11px] font-semibold rounded-full border px-2.5 py-1 ${tm.bg} ${tm.color}`}>{tm.label}</span>
                  </div>

                  <h2 className="relative font-display text-[1.05rem] font-medium text-fg-strong leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-3 flex-1">{r.title}</h2>

                  <div className="mt-4 flex items-center justify-between text-[11px] text-fg-muted">
                    <span>{r.readMinutes} min read</span>
                    <span className="text-sage-600 font-medium">🌱 +3</span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
    </PageShell>
  );
}
