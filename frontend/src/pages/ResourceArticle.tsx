import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResource, TOPIC_META, LEVEL_META } from "../data/resources";
import { awardClientSeeds } from "../services/seeds";
import { useAuth } from "../contexts/AuthContext";
import { useSeedsCelebration } from "../components/SeedsCelebration";

/* Very simple markdown-lite renderer: ## headings, **bold**, \n\n paragraphs */
function renderBody(body: string) {
  return body.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return <h2 key={i} className="font-display text-[1.35rem] font-medium text-fg-strong mt-8 mb-3 tracking-[-0.01em]">{block.slice(3)}</h2>;
    }
    if (block.startsWith("- ")) {
      const items = block.split("\n").filter(Boolean);
      return (
        <ul key={i} className="space-y-2 my-4 pl-1">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2.5 text-fg leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-[0.45rem]" />
              <span dangerouslySetInnerHTML={{ __html: item.slice(2).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="text-fg leading-[1.75] my-4"
        dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
    );
  });
}

export default function ResourceArticle() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const article = getResource(slug ?? "");
  const seedAwarded = useRef(false);
  const { celebrate, el: celebrationEl } = useSeedsCelebration();

  // Award seeds once user has been on page for 30s (read threshold)
  useEffect(() => {
    if (!user || !article || seedAwarded.current) return;
    const timer = setTimeout(async () => {
      if (seedAwarded.current) return;
      seedAwarded.current = true;
      const res = await awardClientSeeds("resource_read").catch(() => null);
      if (res?.data?.awarded) celebrate(3);
    }, 30_000);
    return () => clearTimeout(timer);
  }, [user, article, celebrate]);

  if (!article) {
    return (
      <div className="journal-canvas min-h-[calc(100vh-68px)] grid place-items-center">
        <div className="text-center">
          <p className="text-fg-muted">Article not found.</p>
          <button onClick={() => navigate("/resources")} className="mt-4 h-10 px-5 rounded-full bg-accent text-primary-fg text-sm font-semibold">Back to library</button>
        </div>
      </div>
    );
  }

  const tm = TOPIC_META[article.topic];
  const lm = LEVEL_META[article.level];

  return (
    <div className="journal-canvas min-h-[calc(100vh-68px)]">
      {celebrationEl}
      <div className="mx-auto max-w-[720px] px-5 md:px-8 py-8 md:py-12 animate-page">

        {/* back */}
        <button onClick={() => navigate("/resources")} className="flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg-strong transition-colors mb-7">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to library
        </button>

        {/* meta */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className={`text-[11px] font-semibold rounded-full border px-2.5 py-1 ${tm.bg} ${tm.color}`}>{tm.label}</span>
          <span className="text-[11px] text-fg-muted">{lm.label}</span>
          <span className="text-[11px] text-fg-muted">{article.readMinutes} min read</span>
          {user && <span className="ml-auto text-[11px] text-sage-600 font-medium">🌱 +3 Seeds for reading</span>}
        </div>

        {/* title */}
        <h1 className="font-display text-[1.8rem] md:text-[2.2rem] font-medium text-fg-strong leading-[1.1] tracking-[-0.025em]">{article.title}</h1>
        <p className="mt-3 text-fg-muted text-lg leading-relaxed">{article.subtitle}</p>

        {/* article body */}
        <article className="mt-8 border-t border-border/60 pt-8">
          {renderBody(article.body)}
        </article>

        {/* footer CTA */}
        <div className="mt-12 surface-raised rounded-[1.4rem] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-fg-strong text-sm">Want to talk to someone about this?</p>
            <p className="text-xs text-fg-muted mt-0.5">A therapist can help you apply these ideas to your specific situation.</p>
          </div>
          <button onClick={() => navigate("/therapists")} className="h-10 px-5 rounded-full bg-accent text-primary-fg text-sm font-semibold hover:bg-accent-hover transition-all shrink-0">
            Find a therapist
          </button>
        </div>
      </div>
    </div>
  );
}
