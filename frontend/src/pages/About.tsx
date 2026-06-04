import { useNavigate } from "react-router-dom";
import { type ReactNode, type CSSProperties } from "react";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";

const btnAccent =
  "group relative inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full font-semibold text-base bg-accent text-primary-fg shadow-lift hover:bg-accent-hover transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
const btnOutline =
  "inline-flex items-center justify-center gap-2 h-14 px-7 rounded-full font-semibold text-base text-fg-strong ring-1 ring-border bg-surface/50 backdrop-blur hover:bg-surface transition-all duration-300";

export default function AboutPage() {
  const navigate = useNavigate();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="grain relative text-fg bg-bg overflow-x-clip">
      <SEO title="About" description="Learn about WellNest — our mission to make quality mental health support accessible, compassionate, and personal for everyone in India." canonical="/about" />
      {/* ============================================================ HERO === */}
      <section className="relative overflow-hidden pt-[68px]">
        <Blob className="absolute top-1/3 -right-44 h-[500px] w-[500px] bg-gradient-to-br from-sage-300/40 to-clay-500/15 blur-2xl opacity-60" style={{ animationDelay: "6s" }} />

        <div className="relative mx-auto max-w-[1080px] px-5 md:px-8 py-20 md:py-32">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-surface/70 ring-1 ring-border px-3 py-1.5 text-[0.8rem] font-medium text-fg backdrop-blur shadow-soft">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
              About WellNest
            </div>
          </Reveal>

          <h1 className="mt-6 font-display font-medium tracking-[-0.035em] text-fg-strong text-[clamp(3rem,8vw,6rem)] leading-[0.9] max-w-4xl">
            <Reveal delay={60}><span className="block">Finding the right therapist</span></Reveal>
            <Reveal delay={130}><span className="block italic text-accent">should not feel overwhelming.</span></Reveal>
          </h1>

          <Reveal delay={220}>
            <p className="mt-7 max-w-2xl text-lg md:text-xl text-fg leading-relaxed">
              WellNest helps students and young adults discover trusted, verified mental health professionals without the confusion, friction, or long wait times traditional systems create.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate("/therapists")} className={btnAccent}>
                <span aria-hidden className="absolute inset-0 rounded-full bg-accent/40 blur-lg -z-10 animate-pulse-soft" />
                Find a therapist
                <span className="transition-transform duration-300">→</span>
              </button>
              <button onClick={() => scrollTo("how-it-works")} className={btnOutline}>How it works</button>
            </div>
          </Reveal>

          <Reveal delay={380}>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-fg"><IconShield className="w-4 h-4 text-accent" /> Verified professionals</div>
              <span className="hidden sm:block h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-sm text-fg"><IconLock className="w-4 h-4 text-accent" /> Privacy-first</div>
              <span className="hidden sm:block h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-sm text-fg"><IconCheck className="w-4 h-4 text-accent" /> Flexible sessions</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================================= PROBLEM === */}
      <Section>
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-20">
          <Reveal>
            <div>
              <Eyebrow>The Problem</Eyebrow>
              <h2 className="mt-4 font-display font-medium text-4xl md:text-[3.2rem] md:leading-[1.04] tracking-[-0.025em] text-fg-strong text-balance">
                Mental healthcare is still too hard to access.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-5 text-lg md:text-xl leading-relaxed">
              <p className="text-fg">
                Finding a therapist today is often confusing, expensive, and emotionally exhausting — especially for students and young adults already dealing with stress, anxiety, burnout, or uncertainty.
              </p>
              <p className="text-fg-muted">
                Most platforms focus on directories instead of actual trust, compatibility, and accessibility.
              </p>
              <p className="text-fg-muted">
                We&apos;re building WellNest to make discovering the right support feel simpler, safer, and more human.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================================================= VALUES === */}
      <Section>
        <SectionHead eyebrow="Why WellNest" title="Designed for trust, clarity, and accessibility." />
        <div className="divide-y divide-border border-y border-border">
          {[
            { n: "01", title: "Verified Professionals", desc: "Every therapist on the platform is reviewed and verified before onboarding — license, credentials, standing.", tag: "100% verified" },
            { n: "02", title: "Flexible Sessions", desc: "Book video, chat, or voice sessions that fit your schedule and comfort. Switch formats anytime.", tag: "Your way" },
            { n: "03", title: "Privacy First", desc: "Your conversations and personal data stay secure and confidential. We never sell your information.", tag: "Encrypted" },
            { n: "04", title: "Built for Young Adults", desc: "Designed specifically around the challenges students and young professionals face — accessible and human.", tag: "For you" },
          ].map((v, i) => (
            <Reveal key={v.n} delay={i * 70}>
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 md:gap-12 py-7 md:py-9">
                <span aria-hidden className="font-display font-semibold leading-none text-fg-muted/15 text-[4.5rem] md:text-[7rem] select-none w-20 md:w-36 text-right">{v.n}</span>
                <div>
                  <h3 className="font-display text-xl md:text-2xl text-fg-strong">{v.title}</h3>
                  <p className="mt-2 text-fg-muted leading-relaxed max-w-lg">{v.desc}</p>
                </div>
                <span className="hidden md:inline-flex rounded-full ring-1 ring-border px-3.5 py-1.5 text-xs font-medium text-fg-muted whitespace-nowrap">{v.tag}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ====================================================== HOW IT WORKS === */}
      <Section id="how-it-works">
        <SectionHead eyebrow="How It Works" title="Getting support should feel simple." />

        {/* desktop: horizontal zigzag timeline; mobile: vertical left-line */}
        <div className="relative mt-4">
          {/* horizontal connector (desktop) */}
          <div aria-hidden className="hidden md:block absolute top-[3.25rem] left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px border-t-2 border-dashed border-border/60" />

          <div className="grid md:grid-cols-3 gap-0 md:gap-8">
            {[
              { n: "1", t: "Browse Therapists", d: "Explore verified professionals filtered by specialty, language, and how you'd like to meet.", above: true },
              { n: "2", t: "Book a Session", d: "Choose a time and format that works for you — quickly, securely, no phone calls required.", above: false },
              { n: "3", t: "Start Your Journey", d: "Connect with the right therapist and begin getting the support you actually need.", above: true },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                {/* mobile: left-border vertical layout */}
                <div className="md:hidden border-l-2 border-border pl-6 pb-10 last:pb-0 relative">
                  <div className="absolute -left-[1.1rem] top-0 w-9 h-9 rounded-full bg-accent text-primary-fg grid place-items-center font-display font-semibold text-base shadow-soft">{s.n}</div>
                  <h3 className="font-display text-xl text-fg-strong pt-1">{s.t}</h3>
                  <p className="mt-2 text-fg-muted leading-relaxed text-sm">{s.d}</p>
                </div>

                {/* desktop: zigzag — content above/below the timeline */}
                <div className={`hidden md:flex flex-col items-center text-center gap-0 ${s.above ? "" : "pt-28"}`}>
                  {s.above && (
                    <div className="pb-8 px-4">
                      <h3 className="font-display text-xl text-fg-strong">{s.t}</h3>
                      <p className="mt-2 text-sm text-fg-muted leading-relaxed">{s.d}</p>
                    </div>
                  )}
                  <div className="w-12 h-12 rounded-full bg-accent text-primary-fg grid place-items-center font-display font-semibold text-lg shadow-[0_8px_20px_-6px_rgba(192,97,63,0.5)] z-10 shrink-0">{s.n}</div>
                  {!s.above && (
                    <div className="pt-8 px-4">
                      <h3 className="font-display text-xl text-fg-strong">{s.t}</h3>
                      <p className="mt-2 text-sm text-fg-muted leading-relaxed">{s.d}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================== FAQ === */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <SectionHead eyebrow="FAQ" title="Frequently asked questions" center />
          <div className="divide-y divide-border border-y border-border">
            {[
              { q: "How are therapists verified?", a: "We review therapist licenses, credentials, and professional information before onboarding." },
              { q: "Is my information confidential?", a: "Yes. Your data and sessions are protected using secure, privacy-first systems." },
              { q: "Can I switch therapists?", a: "Absolutely. Finding the right fit matters, and you can switch anytime." },
              { q: "What types of sessions are supported?", a: "Depending on therapist availability, sessions may include video, voice, or chat." },
            ].map((f, i) => (
              <Reveal key={f.q} delay={i * 50}>
                <details className="group py-5">
                  <summary className="flex items-center justify-between cursor-pointer list-none gap-4">
                    <span className="font-semibold text-fg-strong text-lg">{f.q}</span>
                    <span className="grid place-items-center w-7 h-7 rounded-full border border-border text-fg-muted shrink-0 transition-all duration-300 group-open:rotate-45 group-open:border-accent group-open:text-accent">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
                    </span>
                  </summary>
                  <p className="mt-3 pr-10 text-fg-muted leading-relaxed">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* =========================================================== CTA === */}
      <section className="relative overflow-hidden bg-night text-night-fg mx-3 md:mx-6 mb-8 rounded-[2.25rem] ring-1 ring-night-border">
        <Blob className="absolute left-1/2 -bottom-28 h-[440px] w-[700px] -translate-x-1/2 bg-clay-500/35 blur-[120px]" />
        <Blob className="absolute top-0 right-0 h-[280px] w-[280px] bg-ochre-500/25 blur-[110px]" style={{ animationDelay: "4s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_110%,rgba(220,166,75,0.14),transparent_55%)]" />
        <div className="relative mx-auto max-w-[860px] px-6 md:px-8 py-24 md:py-36 text-center">
          <Reveal>
            <h2 className="font-display font-medium text-[clamp(2.8rem,7vw,5.5rem)] tracking-[-0.03em] leading-[0.95] text-balance text-night-fg">
              Better mental healthcare,<br />
              <span className="italic text-ochre-300">designed for modern life.</span>
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <p className="mx-auto mt-6 max-w-lg text-lg text-night-muted leading-relaxed">Start exploring therapists who match your needs and preferences.</p>
          </Reveal>
          <Reveal delay={170}>
            <button onClick={() => navigate("/therapists")} className="group relative mt-10 inline-flex items-center justify-center gap-2 h-14 px-9 rounded-full font-semibold text-base bg-accent text-primary-fg hover:bg-accent-hover transition-all duration-300 shadow-lift">
              <span aria-hidden className="absolute inset-0 rounded-full bg-accent/40 blur-lg -z-10 animate-pulse-soft" />
              Browse therapists
              <span className="transition-transform duration-300">→</span>
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* ============================================================ PRIMITIVES === */
function Blob({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <div aria-hidden className={`pointer-events-none animate-blob ${className}`} style={style} />;
}
function Section({ id, className = "", children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`relative ${className}`}>
      <div className="mx-auto max-w-[1080px] px-5 md:px-8 py-16 md:py-24">{children}</div>
    </section>
  );
}
function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{children}</div>;
}
function SectionHead({ eyebrow, title, sub, center = false }: { eyebrow: string; title: string; sub?: string; center?: boolean }) {
  return (
    <Reveal>
      <div className={`mb-12 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-4 font-display font-medium text-4xl md:text-[2.9rem] md:leading-[1.05] tracking-[-0.025em] text-fg-strong text-balance">{title}</h2>
        {sub && <p className="mt-4 text-lg text-fg-muted leading-relaxed">{sub}</p>}
      </div>
    </Reveal>
  );
}

/* ================================================================= ICONS === */
function IconShield({ className = "w-5 h-5" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
}
function IconLock({ className = "w-5 h-5" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
}
function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
}
