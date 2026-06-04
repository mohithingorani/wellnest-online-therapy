import PageShell from "../components/PageShell";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RESOURCES, TOPIC_META, LEVEL_META, type Resource } from "../data/resources";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";

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
  const featured = filtered.length > 0 ? filtered[0] : null;
  const rest = filtered.length > 0 ? filtered.slice(1) : [];

  const filterBar = (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-2">
        {ALL_TOPICS.map((t) => (
          <button key={t} onClick={() => setTopic(t)}
            className={`h-8 px-3.5 rounded-full text-xs font-semibold border transition-all duration-200 ${topic === t ? "bg-accent text-primary-fg border-accent shadow-soft" : "bg-surface border-border text-fg-muted hover:border-accent/50 hover:text-fg"}`}
          >
            {t === "all" ? "All topics" : TOPIC_META[t as Resource["topic"]].label}
          </button>
        ))}
      </div>
      <span className="text-sm text-fg-muted/70">
        <span className="font-semibold text-fg-strong">{filtered.length}</span> article{filtered.length !== 1 ? "s" : ""}
      </span>
    </div>
  );

  return (
    <>
    <SEO title="Mental Health Library" description="Evidence-informed mental health guides written in plain language — covering anxiety, burnout, stress, sleep, and more. Free to read, no account needed." canonical="/resources" />
    <PageShell eyebrow="Free resources" title="Mental Health Library" subtitle="Evidence-informed guides written in plain language. Reading each article earns you +3 Seeds." header={filterBar}>

        {featured && (
        <Reveal className="mb-6 md:mb-7">
          <button
            onClick={() => navigate(`/resources/${featured.slug}`)}
            className="group w-full text-left rounded-[1.6rem] overflow-hidden flex flex-col md:flex-row shadow-[0_2px_8px_-4px_rgba(47,58,50,0.12)] hover:shadow-[0_16px_40px_-20px_rgba(47,58,50,0.3)] transition-all duration-300 hover:scale-[1.008] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            <div className={`${TOPIC_FILL[featured.topic]} md:w-[42%] shrink-0 p-7 flex flex-col justify-between min-h-[180px] md:min-h-0`}>
              <div>
                <span className="text-[11px] font-semibold bg-white/20 text-white/90 rounded-full px-3 py-1">{TOPIC_META[featured.topic].label}</span>
                <h2 className="mt-4 font-display text-[1.55rem] font-medium text-white leading-[1.15] tracking-[-0.01em]">{featured.title}</h2>
              </div>
              <div className="mt-5 flex items-center gap-2 text-white/60 text-xs">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {featured.readMinutes} min read · +3 Seeds
              </div>
            </div>
            <div className="bg-surface flex-1 p-7 flex flex-col justify-between">
              <p className="text-fg-muted leading-relaxed text-[0.92rem]">{featured.subtitle}</p>
              <div className="mt-6">
                <span className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-accent text-primary-fg text-sm font-semibold group-hover:bg-accent-hover transition-colors">
                  Begin reading
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </span>
              </div>
            </div>
          </button>
        </Reveal>
        )}

        {rest.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {rest.map((r, i) => {
            const tm = TOPIC_META[r.topic];
            const lm = LEVEL_META[r.level];
            const border = TOPIC_BORDER[r.topic];
            return (
              <Reveal key={r.slug} delay={i * 45}>
                <button
                  onClick={() => navigate(`/resources/${r.slug}`)}
                  className={`group relative w-full h-full text-left bg-surface rounded-[1.4rem] border-l-[3.5px] ${border} p-5 pl-6 flex flex-col overflow-hidden shadow-[0_1px_4px_-2px_rgba(47,58,50,0.08)] hover:shadow-[0_10px_28px_-16px_rgba(47,58,50,0.22)] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[11px] font-semibold rounded-full border px-2.5 py-1 ${tm.bg} ${tm.color}`}>{tm.label}</span>
                    <span className="text-[11px] text-fg-muted">{lm.label}</span>
                  </div>

                  <h2 className="font-display text-[1.05rem] font-medium text-fg-strong leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-3">{r.title}</h2>

                  <p className="mt-2 text-[0.85rem] text-fg-muted leading-relaxed line-clamp-2">{r.subtitle}</p>

                  <div className="mt-auto pt-4 flex items-center justify-between text-[11px] text-fg-muted">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {r.readMinutes} min read
                    </span>
                    <span className="text-sage-600 font-medium">+3 Seeds</span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
        )}

        {!featured && (
        <div className="surface-raised rounded-2xl text-center py-14 px-6">
          <p className="text-fg-muted">No articles found for this topic.</p>
        </div>
        )}
    </PageShell>
    </>
  );
}
