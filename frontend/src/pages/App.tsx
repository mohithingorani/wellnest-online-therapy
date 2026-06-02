import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";

/* ============================================================================
   WellNest — "Sanctuary" (exceptional pass).

   Warm bone canvas, espresso ink, terracotta signature, ochre + sage support.
   Immersive pointer-reactive hero demo, a visual product journey, atmospheric
   espresso focal sections, layered depth, and specific trust proof.

   PRE-LAUNCH placeholders (search "PLACEHOLDER"): metrics, therapist details,
   testimonials (incl. avatars), and pricing must be real & consented.
   ============================================================================ */

const btnAccent =
  "group relative inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full font-semibold text-base bg-accent text-primary-fg shadow-lift hover:bg-accent-hover hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
const btnOutline =
  "inline-flex items-center justify-center gap-2 h-14 px-7 rounded-full font-semibold text-base text-fg-strong ring-1 ring-border bg-surface/50 backdrop-blur hover:bg-surface transition-all duration-300";

/* Pointer-reactive tilt/parallax — writes --px/--py (-1..1) on a container. */
function usePointer<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
        el.style.setProperty("--py", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
        raf = 0;
      });
    };
    const reset = () => { el.style.setProperty("--px", "0"); el.style.setProperty("--py", "0"); };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", reset); cancelAnimationFrame(raf); };
  }, []);
  return ref;
}

export default function LandingPage() {
  return (
    <div className="grain relative text-fg bg-bg overflow-x-clip">
      <Hero />
      <Marquee />
      <Promise />
      <Journey />
      <Outcomes />
      <Therapists />
      <Privacy />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </div>
  );
}

/* ================================================================== HERO === */

function Hero() {
  const navigate = useNavigate();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const stage = usePointer<HTMLDivElement>();

  /* Auto-rotating demo: 0=finding, 1=matched, 2=booked */
  const [demo, setDemo] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) return;
    const t = setInterval(() => setDemo((s) => (s + 1) % 3), 4500);
    return () => clearInterval(t);
  }, [hovered]);

  /* Count-up match %s on each matched-state entry */
  const [counts, setCounts] = useState({ m1: 0, m2: 0 });
  useEffect(() => {
    if (demo !== 1) {
      const id = requestAnimationFrame(() => setCounts({ m1: 0, m2: 0 }));
      return () => cancelAnimationFrame(id);
    }
    const dur = 900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setCounts({ m1: Math.round(96 * e), m2: Math.round(90 * e) });
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [demo]);

  return (
    <section className="relative -mt-[68px] overflow-hidden pt-[68px]">
      <Blob className="absolute top-1/3 -left-44 h-[460px] w-[460px] bg-gradient-to-br from-sage-300/45 to-sage-500/20 blur-2xl opacity-60" style={{ animationDelay: "6s" }} />

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8 grid lg:grid-cols-[1.02fr_0.98fr] gap-12 lg:gap-8 items-center min-h-[92vh] py-16">
        {/* message */}
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2.5 rounded-full bg-surface/70 ring-1 ring-border px-3 py-1.5 text-[0.8rem] font-medium text-fg backdrop-blur shadow-soft">
              <span className="flex -space-x-1.5">
                {["bg-clay-300", "bg-ochre-300", "bg-sage-300"].map((c, i) => (
                  <span key={i} className={`h-4 w-4 rounded-full ring-2 ring-surface ${c}`} />
                ))}
              </span>
              <span><b className="text-fg-strong">12,000+</b> matched with care</span>
            </div>
          </Reveal>

          <h1 className="mt-6 font-display font-medium tracking-[-0.035em] text-fg-strong text-[clamp(3.4rem,9vw,7rem)] leading-[0.9]">
            <Reveal delay={60}><span className="block">Somewhere</span></Reveal>
            <Reveal delay={130}><span className="block">soft to <span className="italic text-accent">land.</span></span></Reveal>
          </h1>

          <Reveal delay={220}>
            <p className="mt-7 max-w-md text-lg md:text-xl text-fg leading-relaxed">
              Get matched with a licensed therapist who truly fits — usually within
              <b className="text-fg-strong"> 48 hours</b>. Meet by video, chat, or in person.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate("/therapists")} className={btnAccent}>
                {/* pulsing glow ring */}
                <span aria-hidden className="absolute inset-0 rounded-full bg-accent/40 blur-lg -z-10 animate-pulse-soft" />
                Find your therapist
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </button>
              <button onClick={() => scrollTo("journey")} className={btnOutline}>See how it works</button>
            </div>
          </Reveal>

          <Reveal delay={380}>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
              <div className="flex items-center gap-2">
                <span className="text-ochre-500 text-lg tracking-tight">★★★★★</span>
                <span className="text-sm text-fg"><b className="text-fg-strong">4.9</b> · 3,800+ reviews</span>
              </div>
              <span className="hidden sm:block h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-sm text-fg">
                <IconShield className="w-4 h-4 text-accent" /> RCI-licensed clinicians
              </div>
            </div>
          </Reveal>
        </div>

        {/* immersive product demo */}
        <Reveal delay={180} direction="left" distance={30}>
          <div
            ref={stage}
            className="relative mx-auto w-full max-w-[460px] [perspective:1400px]"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Blob className="absolute -inset-8 bg-gradient-to-br from-clay-300/60 to-ochre-300/45 blur-2xl" />

            {/* animated gradient border */}
            <div className="relative rounded-[calc(1.9rem+2px)] bg-gradient-to-br from-accent/80 via-ochre-400/70 to-sage-400/60 bg-[length:200%_200%] animate-gradient p-[2px]">
              {/* main app window — tilts toward cursor */}
              <div
                className="relative rounded-[1.9rem] surface-raised-xl overflow-hidden transition-transform duration-300 ease-out will-change-transform"
                style={{ transform: "rotateX(calc(var(--py,0) * -4deg)) rotateY(calc(var(--px,0) * 5deg))" }}
              >
                <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
                  <div className="flex gap-1.5"><i className="h-3 w-3 rounded-full bg-border not-italic" /><i className="h-3 w-3 rounded-full bg-border not-italic" /><i className="h-3 w-3 rounded-full bg-border not-italic" /></div>
                  <div className="mx-auto flex items-center gap-2 rounded-full bg-surface-2 px-4 py-1.5 text-xs text-fg-muted"><IconLock className="w-3.5 h-3.5" /> wellnest.com / match</div>
                </div>

                {/* cross-fade demo states */}
                <div className="relative min-h-[252px]">
                  {/* State 0: Finding */}
                  {demo === 0 && (
                    <div className="p-5 animate-fade-in-up">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-fg-strong">Finding your match</span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted">
                          <span className="flex gap-0.5">
                            {[0,1,2].map((i) => (
                              <span key={i} className="h-1.5 w-1.5 rounded-full bg-ochre-400 animate-pulse-soft" style={{ animationDelay: `${i * 300}ms` }} />
                            ))}
                          </span>
                          Analyzing
                        </span>
                      </div>
                      <div className="mt-3 space-y-3">
                        {[0,1].map((i) => (
                          <div key={i} className="flex items-center gap-3.5 rounded-2xl border border-border bg-surface p-3.5">
                            <div className="w-11 h-11 rounded-xl bg-surface-2 animate-pulse-soft" />
                            <div className="flex-1 space-y-2">
                              <div className="h-3 w-2/3 rounded bg-surface-2 animate-pulse-soft" />
                              <div className="h-2.5 w-1/3 rounded bg-surface-2 animate-pulse-soft" />
                            </div>
                            <div className="h-8 w-10 rounded bg-surface-2 animate-pulse-soft" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* State 1: Matched */}
                  {demo === 1 && (
                    <div className="p-5 animate-fade-in-up">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-fg-strong">Your matches</span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" /> 3 found</span>
                      </div>
                      <div className="mt-3 space-y-3">
                        <div className="animate-fade-in-up">
                          <MatchRow name="Dr. Anjali Rao" title="Clinical Psychologist · 9 yrs" tags={["Anxiety", "CBT"]} match={counts.m1} tone="clay" featured />
                        </div>
                        <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
                          <MatchRow name="Sahil Mehta" title="Counselling Psychologist" tags={["Burnout"]} match={counts.m2} tone="sage" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* State 2: Booked */}
                  {demo === 2 && (
                    <div className="p-5 animate-fade-in-up">
                      <div className="flex flex-col items-center text-center pt-2 pb-1">
                        <span className="grid place-items-center w-12 h-12 rounded-full bg-success/15 text-success mb-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </span>
                        <span className="text-sm font-semibold text-fg-strong">Session confirmed!</span>
                        <span className="text-xs text-fg-muted mt-1">Your therapist will see you soon</span>
                        <div className="mt-4 w-full rounded-xl border border-border bg-surface p-3.5 text-left">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-clay-200 text-clay-800 flex items-center justify-center font-display font-semibold text-sm">AR</div>
                            <div>
                              <div className="text-sm font-semibold text-fg-strong">Dr. Anjali Rao</div>
                              <div className="text-xs text-fg-muted">Clinical Psychologist</div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-surface-2 text-fg border border-border">
                              <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              Thu 4 Apr
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-surface-2 text-fg border border-border">
                              <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              4:00 PM
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-surface-2 text-fg border border-border">
                              <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                              Video
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* floating chips — parallax at depth */}
            <div
              className="absolute -top-6 -left-5 rounded-2xl glass px-4 py-2.5 animate-float"
              style={{ transform: "translate3d(calc(var(--px,0) * 22px), calc(var(--py,0) * 18px), 0)" }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-fg-strong"><span className="text-ochre-500">★</span> 4.9 average</div>
            </div>
            <div
              className="absolute -bottom-7 -right-4 rounded-2xl surface-raised px-4 py-3 animate-float"
              style={{ transform: "translate3d(calc(var(--px,0) * -26px), calc(var(--py,0) * -16px), 0)", animationDelay: "1.2s" }}
            >
              <div className="text-[10px] uppercase tracking-wide text-fg-muted">Matched in</div>
              <div className="text-sm font-semibold text-fg-strong">38 hours</div>
            </div>
            {/* deep-depth chip */}
            <div
              className="absolute -bottom-4 -left-8 rounded-2xl glass px-3 py-2 animate-float"
              style={{ transform: "translate3d(calc(var(--px,0) * 36px), calc(var(--py,0) * 24px), 0)", animationDelay: "2s" }}
            >
              <div className="flex items-center gap-1.5 text-xs font-medium text-fg"><svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> 100+ licensed
              </div>
            </div>
            {/* far-depth chip */}
            <div
              className="absolute -top-8 -right-6 rounded-2xl surface-raised px-3 py-2 animate-float"
              style={{ transform: "translate3d(calc(var(--px,0) * -34px), calc(var(--py,0) * -22px), 0)", animationDelay: "0.6s" }}
            >
              <div className="flex items-center gap-1.5 text-xs font-medium text-fg"><svg className="w-3 h-3 text-success" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> No waitlist
              </div>
            </div>

            {/* floating particles */}
            <div className="absolute -inset-16 pointer-events-none overflow-hidden" aria-hidden>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="absolute h-2 w-2 rounded-full bg-accent/20"
                  style={{
                    top: `${15 + i * 17}%`,
                    left: `${10 + i * 19}%`,
                    animationDelay: `${i * 0.8}s`,
                    animationDuration: `${3 + i * 0.6}s`,
                    transform: `translate3d(calc(var(--px,0) * ${12 + i * 6}px), calc(var(--py,0) * ${10 + i * 5}px), 0)`,
                  }}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MatchRow({ name, title, tags, match, tone, featured = false }: { name: string; title: string; tags: string[]; match: number; tone: "clay" | "sage" | "ochre"; featured?: boolean }) {
  const toneCls = { clay: "bg-clay-200 text-clay-800", sage: "bg-sage-200 text-sage-600", ochre: "bg-ochre-200 text-clay-800" }[tone];
  const initials = name.replace(/^Dr\.?\s+/, "").split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <div className={`flex items-center gap-3.5 rounded-2xl border p-3.5 ${featured ? "border-clay-300 bg-clay-50/70" : "border-border bg-surface"}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-display font-semibold ${toneCls}`}>{initials}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5"><span className="font-semibold text-fg-strong truncate text-sm">{name}</span><IconVerified className="w-4 h-4 text-accent shrink-0" /></div>
        <div className="text-xs text-fg-muted truncate">{title}</div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">{tags.map((t) => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-surface-2 text-fg border border-border">{t}</span>)}</div>
      </div>
      <div className="text-right shrink-0"><div className="text-base font-display font-semibold text-accent leading-none">{match}%</div><div className="text-[10px] uppercase tracking-wide text-fg-muted mt-1">match</div></div>
    </div>
  );
}

/* =============================================================== MARQUEE === */

function Marquee() {
  const items = ["Anxiety", "Burnout", "Grief", "Relationships", "Stress", "Trauma", "Self-worth", "Loneliness", "ADHD", "Sleep"];
  const row = (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((c) => (
        <span key={c} className="flex items-center gap-8 font-display text-3xl md:text-4xl text-night-fg/90">{c} <span className="text-accent text-xl">✳</span></span>
      ))}
    </div>
  );
  return (
    <section aria-hidden className="relative bg-night py-6 overflow-hidden">
      <div className="flex w-max animate-marquee">{row}{row}</div>
    </section>
  );
}

/* =============================================================== PROMISE === */

function Promise() {
  return (
    <Section>
      <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-20">
        <Reveal>
          <h2 className="font-display font-medium text-4xl md:text-[3.2rem] md:leading-[1.04] tracking-[-0.025em] text-fg-strong text-balance">
            Finding help shouldn't be the hardest part.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="space-y-5 text-lg md:text-xl leading-relaxed">
            <p className="text-fg">
              Reaching out already takes everything you have. Then come the endless
              directories, the cold calls, the not-knowing if someone's even right for
              you — and most people give up before they begin.
            </p>
            <p className="text-fg-muted">
              We made the start gentle. A few honest questions, and we match you with
              verified therapists who fit your needs, your budget, and the way you want
              to meet. The right person, sooner.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ======================================================= PRODUCT JOURNEY === */

function Journey() {
  const steps = [
    { n: "01", t: "Share how you feel", d: "Answer a few gentle questions — no paperwork.", mock: <ShareMock /> },
    { n: "02", t: "Meet your matches", d: "Verified therapists, ranked by how well they fit you.", mock: <MatchMock /> },
    { n: "03", t: "Begin your sessions", d: "Video, chat, or in person — whenever you're ready.", mock: <SessionMock /> },
    { n: "04", t: "Track your progress", d: "See how you're feeling improve, week over week.", mock: <ProgressMock /> },
  ];
  return (
    <Section id="journey">
      <SectionHead eyebrow="Your journey" title="From the first question to feeling better." sub="Four simple steps — and you can see exactly how it works." center />
      <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 110}>
            <div className={`group h-full rounded-[1.5rem] surface-raised p-5 transition-transform duration-300 hover:-translate-y-1.5 ${i % 2 ? "lg:mt-8" : ""}`}>
              <div className="rounded-2xl surface-inset h-40 p-4 overflow-hidden flex items-center justify-center">{s.mock}</div>
              <div className="mt-5 flex items-center gap-2">
                <span className="font-display text-sm font-semibold text-accent">{s.n}</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <h3 className="mt-2 font-display text-xl text-fg-strong">{s.t}</h3>
              <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{s.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---- mini product mockups (CSS, no images) ---- */
function ShareMock() {
  return (
    <div className="w-full space-y-2">
      <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-accent text-primary-fg text-xs px-3 py-2">What's been weighing on you?</div>
      <div className="flex flex-wrap gap-1.5">
        {["Anxiety", "Burnout", "Sleep"].map((t, i) => (
          <span key={t} className={`text-[11px] px-2.5 py-1 rounded-full border ${i === 0 ? "bg-clay-200 border-clay-300 text-clay-800" : "bg-surface border-border text-fg"}`}>{t}</span>
        ))}
      </div>
    </div>
  );
}
function MatchMock() {
  return (
    <div className="w-full rounded-xl bg-surface border border-border p-3 shadow-soft">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-clay-200 text-clay-800 flex items-center justify-center font-display text-sm font-semibold">AR</div>
        <div className="flex-1 min-w-0"><div className="text-xs font-semibold text-fg-strong truncate">Dr. Anjali Rao</div><div className="text-[10px] text-fg-muted">Clinical Psychologist</div></div>
        <div className="text-sm font-display font-semibold text-accent">96%</div>
      </div>
    </div>
  );
}
function SessionMock() {
  return (
    <div className="w-full h-full grid grid-rows-[1fr_auto] gap-2">
      <div className="rounded-xl bg-gradient-to-br from-clay-700 to-night relative overflow-hidden grid place-items-center">
        <div className="w-10 h-10 rounded-full bg-ochre-300/90 text-clay-900 flex items-center justify-center font-display font-semibold text-sm">AR</div>
        <div className="absolute bottom-1.5 right-1.5 w-8 h-6 rounded-md bg-surface/90 ring-1 ring-border" />
      </div>
      <div className="flex justify-center gap-2">
        <span className="w-6 h-6 rounded-full bg-surface ring-1 ring-border" />
        <span className="w-6 h-6 rounded-full bg-accent" />
        <span className="w-6 h-6 rounded-full bg-surface ring-1 ring-border" />
      </div>
    </div>
  );
}
function ProgressMock() {
  const bars = [38, 52, 47, 64, 73, 88];
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[10px] text-fg-muted mb-2"><span>Mood</span><span className="text-success font-semibold">↑ 31%</span></div>
      <div className="flex items-end gap-1.5 h-20">
        {bars.map((h, i) => (
          <span key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-clay-300 to-accent" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

/* ============================================================== OUTCOMES === */
/* Atmospheric espresso focal section. Metrics are PLACEHOLDER. */

function Outcomes() {
  const stats = [
    { to: 92, suffix: "%", label: "would recommend WellNest to a friend" },
    { to: 4.9, decimals: 1, suffix: "/5", label: "from 3,847 verified client reviews" },
    { to: 14200, suffix: "+", label: "therapy sessions completed" },
    { to: 38, suffix: "h", label: "average wait to a first session" },
  ];
  return (
    <section className="relative overflow-hidden bg-night text-night-fg my-8 md:my-12 mx-3 md:mx-6 rounded-[2.25rem] ring-1 ring-night-border">
      {/* rich lighting */}
      <Blob className="absolute -top-24 right-6 h-[420px] w-[420px] bg-clay-500/40 blur-[110px]" />
      <Blob className="absolute -bottom-28 -left-12 h-[380px] w-[380px] bg-ochre-500/25 blur-[120px]" style={{ animationDelay: "5s" }} />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(220,166,75,0.12),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1080px] px-6 md:px-12 py-20 md:py-28">
        <Reveal>
          <div className="max-w-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ochre-300">Proof it works</div>
            <h2 className="mt-4 font-display font-medium text-4xl md:text-[3rem] md:leading-[1.05] tracking-[-0.025em] text-balance">
              Care that actually moves the needle.
            </h2>
          </div>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div>
                <div className="font-display text-[clamp(2.8rem,5vw,4rem)] font-medium tracking-tight text-ochre-300 leading-none">
                  <CountUp to={s.to} decimals={s.decimals ?? 0} suffix={s.suffix} />
                </div>
                <div className="mt-3 h-px w-10 bg-night-border" />
                <p className="mt-3 text-sm text-night-muted leading-relaxed max-w-[20ch]">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ THERAPISTS === */

function Therapists() {
  const navigate = useNavigate();
  // PLACEHOLDER — replace with real therapists & credentials.
  const people = [
    { name: "Dr. Anjali Rao", title: "Clinical Psychologist", cred: "PhD · RCI-licensed · 9 yrs", tags: ["Anxiety", "CBT"], tone: "clay" as const },
    { name: "Sahil Mehta", title: "Counselling Psychologist", cred: "M.Phil · 6 yrs", tags: ["Burnout", "Mindfulness"], tone: "sage" as const },
    { name: "Dr. Leah Fernandes", title: "Psychotherapist", cred: "PsyD · EMDR-certified · 12 yrs", tags: ["Trauma", "EMDR"], tone: "ochre" as const },
  ];
  return (
    <Section>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <Eyebrow>The people behind the care</Eyebrow>
          <h2 className="mt-4 font-display font-medium text-4xl md:text-[2.8rem] md:leading-[1.05] tracking-[-0.025em] text-fg-strong text-balance">
            Real clinicians. Verified before they ever reach you.
          </h2>
        </div>
        <button onClick={() => navigate("/therapists")} className="inline-flex items-center gap-2 h-12 px-6 rounded-full font-semibold text-sm ring-1 ring-border text-fg-strong hover:bg-surface transition-colors self-start">See all therapists →</button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {people.map((p, i) => {
          const initials = p.name.replace(/^Dr\.?\s+/, "").split(" ").map((w) => w[0]).slice(0, 2).join("");
          const toneCls = { clay: "from-clay-300 to-clay-500", sage: "from-sage-300 to-sage-500", ochre: "from-ochre-300 to-ochre-500" }[p.tone];
          return (
            <Reveal key={p.name} delay={i * 100}>
              <div className="group h-full rounded-2xl surface-raised p-6 transition-transform duration-300 hover:-translate-y-1.5">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${toneCls} text-white flex items-center justify-center font-display text-2xl font-semibold shadow-soft`}>{initials}</div>
                  <div>
                    <div className="flex items-center gap-1.5"><span className="font-semibold text-fg-strong text-lg">{p.name}</span><IconVerified className="w-4 h-4 text-accent" /></div>
                    <div className="text-sm text-fg-muted">{p.title}</div>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full surface-inset px-3 py-1 text-xs font-medium text-fg"><IconShield className="w-3.5 h-3.5 text-accent" /> {p.cred}</div>
                <div className="mt-4 flex flex-wrap gap-1.5">{p.tags.map((t) => <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-clay-50 text-clay-700 border border-clay-100">{t}</span>)}</div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* =============================================================== PRIVACY === */

function Privacy() {
  const cards = [
    { icon: <IconLock />, title: "What you share stays yours", body: "Conversations and account data are encrypted in transit and at rest. Sessions stay between you and your therapist." },
    { icon: <IconShield />, title: "You're always in control", body: "We never sell your data or use it for advertising. Export or permanently delete your account at any time." },
    { icon: <IconVerified />, title: "Verified professionals", body: "Every therapist's license, qualifications, and standing is reviewed before they can be booked." },
  ];
  return (
    <Section>
      <SectionHead eyebrow="Privacy & safety" title="Reaching out should feel safe." sub="It takes courage to ask for help. The least we can do is protect you while you do." />
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 100}>
            <div className="h-full rounded-2xl surface-raised p-7">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-clay-400 to-clay-600 text-white flex items-center justify-center shadow-soft">{c.icon}</div>
              <h3 className="mt-5 font-display text-xl text-fg-strong">{c.title}</h3>
              <p className="mt-2 text-fg-muted leading-relaxed">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* =========================================================== TESTIMONIALS === */
/* PLACEHOLDER — replace with real, consented testimonials, names & photos. */

function Avatar({ initials, tone, size = "w-12 h-12" }: { initials: string; tone: string; size?: string }) {
  return (
    <span className={`relative ${size} rounded-full p-[2px] bg-gradient-to-br ${tone} shrink-0`}>
      <span className="grid place-items-center w-full h-full rounded-full bg-surface font-display font-semibold text-fg-strong">{initials}</span>
    </span>
  );
}

function Testimonials() {
  const feature = {
    quote: "I'd put off therapy for years because starting felt impossible. WellNest matched me with someone who got me in two days. Eight sessions in, my anxiety is the lowest it's been in a decade.",
    name: "Aanya Sharma", role: "Product designer · Bengaluru", outcome: "Anxiety · 8 sessions", initials: "AS", tone: "from-clay-300 to-clay-500",
  };
  const more = [
    { quote: "Filtering by language and approach meant I found someone who actually understood me on the first try. No more starting over.", name: "Rohan Verma", role: "Software engineer · Pune", outcome: "Burnout · 5 sessions", initials: "RV", tone: "from-sage-300 to-sage-500" },
    { quote: "Talking from home took away the dread I used to feel about therapy. I finally look forward to my Thursdays.", name: "Meera Iyer", role: "Grad student · Chennai", outcome: "Stress · 12 sessions", initials: "MI", tone: "from-ochre-300 to-ochre-500" },
  ];
  return (
    <Section>
      <SectionHead eyebrow="Real stories" title="People who took the first step." center />
      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
        <Reveal>
          <figure className="relative h-full flex flex-col justify-between rounded-[1.9rem] bg-night text-night-fg p-9 md:p-11 shadow-lift overflow-hidden ring-1 ring-night-border">
            <Blob className="absolute -top-20 -right-16 h-72 w-72 bg-clay-500/30 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_80%_0%,rgba(220,166,75,0.12),transparent_55%)]" />
            <div className="relative">
              <div className="text-ochre-300 text-5xl font-display leading-none">"</div>
              <blockquote className="mt-2 font-display font-medium text-2xl md:text-[1.9rem] md:leading-[1.3] tracking-[-0.01em] text-balance">{feature.quote}</blockquote>
            </div>
            <figcaption className="relative mt-8 flex items-center gap-3.5">
              <Avatar initials={feature.initials} tone={feature.tone} size="w-14 h-14" />
              <div className="flex-1">
                <div className="font-semibold">{feature.name}</div>
                <div className="text-sm text-night-muted">{feature.role}</div>
              </div>
              <span className="rounded-full bg-night-2 ring-1 ring-night-border px-3 py-1 text-xs text-ochre-300 font-medium">{feature.outcome}</span>
            </figcaption>
          </figure>
        </Reveal>
        <div className="grid gap-6">
          {more.map((t, i) => (
            <Reveal key={t.name} delay={120 + i * 110}>
              <figure className="h-full rounded-[1.5rem] surface-raised p-7 flex flex-col">
                <blockquote className="text-fg leading-relaxed flex-1">"{t.quote}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <Avatar initials={t.initials} tone={t.tone} size="w-11 h-11" />
                  <div className="flex-1 text-sm"><div className="font-semibold text-fg-strong">{t.name}</div><div className="text-fg-muted">{t.role}</div></div>
                  <span className="rounded-full bg-clay-50 border border-clay-100 px-2.5 py-1 text-[11px] text-clay-700 font-medium">{t.outcome}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* =============================================================== PRICING === */

function Pricing() {
  const navigate = useNavigate();
  // PLACEHOLDER pricing — set real numbers before launch.
  const plans = [
    { name: "Pay as you go", price: "₹—", unit: "/ session", blurb: "No subscription. Book only when you need to.", features: ["Browse all therapists free", "Video, chat, or in person", "Cancel up to 24h before", "No commitment, ever"], featured: false },
    { name: "Monthly", price: "₹—", unit: "/ month", blurb: "Steady weekly support at a lower per-session rate.", features: ["4 sessions / month", "Priority booking", "Message between sessions", "Progress tracking & summaries"], featured: true },
  ];
  return (
    <Section id="pricing">
      <SectionHead eyebrow="Pricing" title="Pay for sessions — not subscriptions you forget." sub="Browsing is always free. You only pay when you book." center />
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 110}>
            <div className={`relative h-full rounded-[1.6rem] p-8 flex flex-col ${p.featured ? "bg-night text-night-fg shadow-lift ring-1 ring-night-border overflow-hidden" : "surface-raised"}`}>
              {p.featured && <Blob className="absolute -top-16 -right-12 h-56 w-56 bg-clay-500/25 blur-3xl" />}
              <div className="relative flex items-center justify-between">
                <h3 className={`font-display text-2xl ${p.featured ? "text-night-fg" : "text-fg-strong"}`}>{p.name}</h3>
                {p.featured && <span className="text-[11px] font-semibold uppercase tracking-wider bg-accent text-primary-fg px-3 py-1 rounded-full">Popular</span>}
              </div>
              <div className="relative mt-4 flex items-baseline gap-1.5"><span className="text-4xl font-display font-medium">{p.price}</span><span className={p.featured ? "text-night-muted" : "text-fg-muted"}>{p.unit}</span></div>
              <p className={`relative mt-2 text-sm ${p.featured ? "text-night-muted" : "text-fg-muted"}`}>{p.blurb}</p>
              <ul className="relative mt-6 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm"><IconCheck className={`w-4 h-4 mt-0.5 shrink-0 ${p.featured ? "text-ochre-300" : "text-accent"}`} /><span className={p.featured ? "text-night-fg/90" : "text-fg"}>{f}</span></li>
                ))}
              </ul>
              <button onClick={() => navigate("/therapists")} className={`relative mt-7 h-12 rounded-full font-semibold text-sm transition-all duration-300 ${p.featured ? "bg-ochre-300 text-night hover:bg-ochre-200" : "bg-accent text-primary-fg hover:bg-accent-hover"}`}>Get started</button>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* =================================================================== FAQ === */

function FAQ() {
  const faqs = [
    { q: "How are therapists verified?", a: "We review each therapist's license, credentials, and professional standing before they're listed. The verified badge means that check is complete." },
    { q: "Is what I share confidential?", a: "Yes. Your data and sessions are encrypted, and we never sell your information or use it for advertising." },
    { q: "How much does it cost?", a: "Browsing is always free. You only pay when you book — pay-as-you-go or a monthly plan. Exact rates appear on each therapist's profile." },
    { q: "What if my therapist isn't the right fit?", a: "That's completely normal, and you can switch anytime — no awkwardness, no questions asked." },
    { q: "How do sessions happen?", a: "By video, chat, or in person, depending on the therapist — whatever feels most comfortable for you." },
  ];
  return (
    <Section id="faq">
      <div className="max-w-3xl mx-auto">
        <SectionHead eyebrow="FAQ" title="Questions, answered." center />
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f, i) => (
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
  );
}

/* ============================================================= FINAL CTA === */

function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-night text-night-fg mx-3 md:mx-6 mb-8 rounded-[2.25rem] ring-1 ring-night-border">
      <Blob className="absolute left-1/2 -bottom-28 h-[440px] w-[700px] -translate-x-1/2 bg-clay-500/35 blur-[120px]" />
      <Blob className="absolute top-0 right-0 h-[280px] w-[280px] bg-ochre-500/25 blur-[110px]" style={{ animationDelay: "4s" }} />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_110%,rgba(220,166,75,0.14),transparent_55%)]" />
      <div className="relative mx-auto max-w-[860px] px-6 md:px-8 py-24 md:py-36 text-center">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ochre-300">A new morning</span>
        </Reveal>
        <Reveal delay={90}>
          <h2 className="mt-5 font-display font-medium text-[clamp(2.8rem,7vw,5.5rem)] tracking-[-0.03em] leading-[0.95] text-balance">
            Tomorrow can feel <span className="italic text-ochre-300">different.</span>
          </h2>
        </Reveal>
        <Reveal delay={170}>
          <p className="mx-auto mt-6 max-w-lg text-lg text-night-muted leading-relaxed">
            The first step is the hardest. Take it with us — find someone who's right
            for you. It's free to start.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <button onClick={() => navigate("/therapists")} className="group relative mt-10 inline-flex items-center justify-center gap-2 h-14 px-9 rounded-full font-semibold text-base bg-accent text-primary-fg hover:bg-accent-hover transition-all duration-300 hover:-translate-y-0.5 shadow-lift">
            <span aria-hidden className="absolute inset-0 rounded-full bg-accent/40 blur-lg -z-10 animate-pulse-soft" />
            Find your therapist
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </button>
        </Reveal>
      </div>
    </section>
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
function IconVerified({ className = "w-5 h-5" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function IconLock({ className = "w-5 h-5" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
}
function IconShield({ className = "w-5 h-5" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
}
function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
}
