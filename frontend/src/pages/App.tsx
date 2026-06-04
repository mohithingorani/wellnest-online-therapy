import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";
import { websiteSchema, organizationSchema, faqSchema } from "../lib/jsonld";



const btnAccent =
  "group relative inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full font-semibold text-base bg-accent text-primary-fg shadow-lift hover:bg-accent-hover transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
const btnOutline =
  "inline-flex items-center justify-center gap-2 h-14 px-7 rounded-full font-semibold text-base text-fg-strong ring-1 ring-border bg-surface/50 backdrop-blur hover:bg-surface transition-all duration-300";

export default function LandingPage() {
  return (
    <div className="grain relative text-fg bg-bg overflow-x-clip">
      <SEO
        title="WellNest — Online Therapy & Mental Wellness Platform"
        description="Connect with verified, licensed therapists in India. Take free mental health assessments, track your wellbeing, and start your journey to better mental health with WellNest."
        canonical="/"
        jsonLd={[websiteSchema(), organizationSchema(), faqSchema([
          { q: "How does WellNest match me with a therapist?", a: "WellNest uses your preferences, goals, and assessment results to match you with verified therapists who specialise in your areas of concern." },
          { q: "Are the assessments on WellNest free?", a: "Yes. All self-assessments — including burnout, anxiety, stress, and mood checks — are completely free and require no account." },
          { q: "Is my data confidential?", a: "Yes. Your sessions and data are encrypted and never shared with third parties or used for advertising." },
          { q: "How quickly can I see a therapist?", a: "WellNest therapists are being onboarded. Join the waitlist to be matched when they go live." },
        ])]}
      />
      <ScrollProgress />
      <Hero />
      <Marquee />
      <Promise />
      <Journey />
      <WhyFree />
      <Privacy />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </div>
  );
}

/* ================================================================== HERO === */

function Hero() {
  const navigate = useNavigate();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

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
              <button onClick={() => navigate("/assess/burnout")} className={btnAccent}>
                {/* pulsing glow ring */}
                <span aria-hidden className="absolute inset-0 rounded-full bg-accent/40 blur-lg -z-10 animate-pulse-soft" />
                Take the free burnout test
                <span className="transition-transform duration-300">→</span>
              </button>
              <button onClick={() => scrollTo("journey")} className={btnOutline}>See how it works</button>
            </div>
          </Reveal>

          <Reveal delay={370}>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: "Burnout", sub: "2 min", path: "/assess/burnout" },
                { label: "Anxiety", sub: "2 min", path: "/assess/gad7" },
                { label: "Stress", sub: "1 min", path: "/assess/stress" },
                { label: "Mood", sub: "1 min", path: "/assess/mood" },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.path)}
                  className="flex flex-col gap-0.5 rounded-2xl bg-surface/60 ring-1 ring-border/70 px-3.5 py-3 text-left hover:bg-surface hover:ring-border transition-all duration-200 backdrop-blur"
                >
                  <span className="text-[0.82rem] font-semibold text-fg-strong">{a.label}</span>
                  <span className="text-[0.72rem] text-fg-muted">{a.sub} · Free</span>
                </button>
              ))}
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

        {/* "Your match" card — botanical scene */}
        <Reveal delay={180} direction="left" distance={30}>
          <div className="relative mx-auto w-full max-w-[466px]">
            {/* canopy — decorations, only on desktop */}
            <div aria-hidden className="hidden lg:block">
              <div className="absolute left-1/2 top-1/2 h-[110%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-[46%_54%_48%_52%/44%_47%_53%_56%] bg-sage-200/30" />
              <LeafBranch className="absolute top-[52%] -left-32 w-64 -translate-y-1/2 -rotate-2" />
              <LeafBranch className="absolute top-[44%] -right-32 w-64 -translate-y-1/2 -scale-x-100 -rotate-2" />
              <DotGrid className="absolute -top-2 -right-12 text-sage-600/35" />
              <DotGrid className="absolute bottom-6 -left-14 text-sage-600/30" />
            </div>

            {/* card */}
            <div className="relative rounded-[2rem] lg:rounded-[2.7rem] lg:bg-[#efeee7] lg:p-2.5 lg:shadow-[0_44px_90px_-34px_rgba(47,58,50,0.4),0_14px_34px_-20px_rgba(47,58,50,0.22)]">
              {/* side button — desktop only */}
              <span aria-hidden className="hidden lg:block absolute -left-[5px] top-28 h-16 w-[5px] rounded-full bg-[#e4e2d8]" />
              <div className="rounded-[1.3rem] border border-brand-teal/30 lg:border-0 lg:rounded-[2.15rem] bg-white/60 px-5 py-5 sm:px-6 lg:px-7 lg:py-7">
                {/* header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[1.1rem] lg:text-[1.35rem] font-bold text-fg-strong leading-tight">Your match</div>
                    <div className="text-[0.9rem] lg:text-[1.02rem] text-fg-strong/85 mt-0.5 lg:mt-1">carefully chosen for you</div>
                  </div>
                  <span className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-clay-50 grid place-items-center shrink-0">
                    <svg className="w-[22px] h-[22px] lg:w-[26px] lg:h-[26px] text-accent" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.55-4.6-10.05-9.2C.55 9.02 1.4 5.6 4.3 4.6 6.45 3.86 8.6 4.8 12 8c3.4-3.2 5.55-4.14 7.7-3.4 2.9 1 3.75 4.42 2.35 7.2C19.55 16.4 12 21 12 21z" /></svg>
                  </span>
                </div>

                {/* therapist */}
                <div className="mt-5 lg:mt-6 flex items-start gap-4 lg:gap-5">
                  <img src="/therapist.png" alt="Dr. Anjali Rao, Clinical Psychologist" className="w-[88px] h-[88px] lg:w-[116px] lg:h-[116px] rounded-full object-cover shrink-0" />
                  <div className="pt-1 lg:pt-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 text-sage-700 text-[0.82rem] lg:text-[0.92rem] font-medium px-2.5 py-1 lg:px-3 lg:py-1.5">
                      <svg className="w-[13px] h-[13px] lg:w-[15px] lg:h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path strokeLinejoin="round" d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 16.78 6.8 19.52l.99-5.8-4.21-4.1 5.82-.85L12 3.5z" /></svg>
                      Top match
                    </span>
                    <div className="mt-2 lg:mt-2.5 text-[1.25rem] lg:text-[1.55rem] font-bold text-fg-strong leading-[1.1]">Dr. Anjali Rao</div>
                    <div className="text-[0.92rem] lg:text-[1.05rem] text-fg mt-1 lg:mt-1.5">Clinical Psychologist</div>
                    <div className="hidden lg:block text-[1rem] text-fg-muted mt-1">8+ years experience</div>
                  </div>
                </div>

                {/* specialties */}
                <div className="mt-4 lg:mt-5 flex flex-wrap gap-2 lg:gap-2.5">
                  {["Anxiety", "Relationships", "Self-esteem"].map((s) => (
                    <span key={s} className="rounded-full bg-sage-100 text-sage-700 text-[0.85rem] lg:text-[0.95rem] font-medium px-3 py-1.5 lg:px-4 lg:py-2">{s}</span>
                  ))}
                </div>

                {/* options + confidential — desktop only */}
                <div className="hidden lg:block">
                  <div className="mt-5 rounded-[1.5rem] bg-[#f6f5ee] ring-1 ring-black/[0.04] overflow-hidden">
                    <MatchOption icon="video" title="Video sessions" sub="Available this week" />
                    <div className="mx-5 h-px bg-black/[0.06]" />
                    <MatchOption icon="message" title="Message anytime" sub="Support between sessions" />
                    <div className="mx-5 h-px bg-black/[0.06]" />
                    <MatchOption icon="location" title="In-person " sub="HSR Layout" />
                  </div>

                  <div className="mt-5 flex items-center gap-4 rounded-[1.5rem] bg-sage-100/80 px-5 py-4">
                    <span className="shrink-0">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2.6l7.2 2.7v5.5c0 4.7-3.1 7.9-7.2 9.9-4.1-2-7.2-5.2-7.2-9.9V5.3L12 2.6z" fill="#5f7e55" />
                        <path d="M8.7 12.1l2.2 2.2 4.3-4.4" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <div className="text-[1.05rem] font-bold text-fg-strong">Safe. Private. Confidential.</div>
                      <div className="text-[0.95rem] text-fg mt-0.5">Your well-being is always our priority.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Row inside the match card — dark outline icon, label, chevron (hairline-divided) */
function MatchOption({ icon, title, sub }: { icon: "video" | "message" | "location"; title: string; sub: string }) {
  const paths = {
    video: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    message: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    location: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
  };
  return (
    <button className="group w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-black/[0.02]">
      <svg className="w-6 h-6 text-fg-strong shrink-0" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={paths[icon]} /></svg>
      <span className="flex-1 min-w-0">
        <span className="block text-[1.05rem] font-bold text-fg-strong leading-tight">{title}</span>
        <span className="block text-[0.92rem] text-fg-muted mt-0.5">{sub}</span>
      </span>
      <svg className="w-5 h-5 text-fg-muted/70 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
    </button>
  );
}

/* Lush eucalyptus branch — elongated lanceolate leaves with a midrib, two sage
   tones for depth, along a curved stem. Mirror / rotate / scale via className. */
function LeafBranch({ className = "" }: { className?: string }) {
  const light = "#a9c198", mid = "#8aa97a", dark = "#5f7e55";
  const leaves = [
    { x: 96, y: 238, r: -48, t: mid, s: 1.0 },
    { x: 84, y: 214, r: -128, t: light, s: 1.06 },
    { x: 104, y: 188, r: -40, t: light, s: 1.14 },
    { x: 82, y: 160, r: -132, t: mid, s: 1.14 },
    { x: 108, y: 132, r: -34, t: mid, s: 1.08 },
    { x: 90, y: 104, r: -124, t: light, s: 1.0 },
    { x: 114, y: 80, r: -28, t: light, s: 0.9 },
    { x: 100, y: 54, r: -94, t: mid, s: 0.82 },
  ];
  return (
    <svg aria-hidden viewBox="0 0 190 280" className={className} fill="none">
      <path d="M92 276 C 88 230 98 182 102 134 C 105 98 110 66 113 40" stroke={dark} strokeOpacity="0.5" strokeWidth="2.4" strokeLinecap="round" />
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`}>
          <path d="M0 0 C 11 -12 34 -12 54 0 C 34 12 11 12 0 0 Z" fill={l.t} />
          <path d="M5 0 L 49 0" stroke={dark} strokeOpacity="0.32" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

/* Soft dotted texture block */
function DotGrid({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden width="92" height="106" viewBox="0 0 92 106" className={className} fill="currentColor">
      {Array.from({ length: 8 }).map((_, r) =>
        Array.from({ length: 7 }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={4 + c * 14} cy={4 + r * 14} r="2" />
        ))
      )}
    </svg>
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
      <div className="flex w-max animate-marquee [will-change:transform]">{row}{row}</div>
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

const journeySteps = [
  { n: "01", t: "Share how you feel", d: "Answer a few gentle questions — no forms, no pressure. Just you, in your own words.", mock: <ShareMock />, chip: "2 min" },
  { n: "02", t: "Meet your matches", d: "We surface verified therapists, ranked by how well they actually fit your needs.", mock: <MatchMock />, chip: "96% fit" },
  { n: "03", t: "Begin your sessions", d: "Video, chat, or in person — start whenever you feel ready, entirely on your terms.", mock: <SessionMock />, chip: "This week" },
  { n: "04", t: "Track your progress", d: "Watch how you're feeling improve, week over week, with quiet, encouraging insight.", mock: <ProgressMock />, chip: "↑ 31%" },
];

function Journey() {
  const trackRef = useRef<HTMLDivElement>(null);

  /* Scroll-linked spine fill — writes --jp (0→1) as the timeline crosses the
     viewport, so the connecting line "draws" itself as you move through it. */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--jp", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.82, end = vh * 0.45;
      const p = (start - r.top) / (start - end + r.height);
      el.style.setProperty("--jp", Math.min(1, Math.max(0, p)).toFixed(4));
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <Section id="journey">
      <SectionHead eyebrow="Your journey" title="From the first question to feeling better." sub="Four simple steps — see exactly how it works." center />
      <div ref={trackRef} className="relative mt-6 lg:mt-12">
        {/* connecting spine */}
        <div aria-hidden className="absolute top-4 bottom-4 left-[1.45rem] w-px bg-border lg:left-1/2 lg:-translate-x-1/2">
          <div
            className="absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-accent via-accent to-clay-300/0"
            style={{ height: "calc(var(--jp, 0) * 100%)" }}
          />
        </div>
        {journeySteps.map((s, i) => (
          <JourneyStep key={s.n} step={s} index={i} />
        ))}
      </div>
    </Section>
  );
}

function JourneyStep({ step, index }: { step: (typeof journeySteps)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // already shown via initial state
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.unobserve(el); } },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reversed = index % 2 === 1;
  const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
  const slide = (dir: number): CSSProperties => ({
    opacity: shown ? 1 : 0,
    transform: shown ? "none" : `translateX(${dir}px)`,
    transition: `opacity 0.7s ${ease}, transform 0.7s ${ease}`,
  });

  return (
    <div ref={ref} className="relative pl-14 lg:pl-0 py-10 lg:py-20">
      {/* node on the spine */}
      <span aria-hidden className="absolute left-6 top-14 z-10 grid -translate-x-1/2 place-items-center lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2">
        <span className={`block rounded-full transition-all duration-700 ${shown ? "h-4 w-4 bg-accent shadow-[0_0_0_6px_rgba(217,122,88,0.14)]" : "h-2.5 w-2.5 bg-border shadow-[0_0_0_6px_var(--color-bg)]"}`} />
      </span>

      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-24">
        {/* CONTENT */}
        <div className={reversed ? "lg:order-2 lg:pl-6" : "lg:order-1 lg:pr-6"} style={slide(reversed ? 44 : -44)}>
          <div className="relative">
            
            <div className="relative pl-5 lg:pl-8">
              <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Step {step.n}
              </span>
              <h3 className="mt-3 font-display text-[2.1rem] font-medium leading-[1.04] tracking-[-0.02em] text-fg-strong lg:text-[2.7rem]">{step.t}</h3>
              <p className="mt-4 max-w-md text-[1.08rem] leading-relaxed text-fg-muted">{step.d}</p>
            </div>
          </div>
        </div>

        {/* MOCK — scroll-linked parallax drift */}
        <div className={reversed ? "lg:order-1" : "lg:order-2"} style={slide(reversed ? -44 : 44)}>
          <div style={{ transform: `translateY(calc((var(--jp, 0.5) - 0.5) * ${reversed ? 26 : -26}px))` }}>
            <MockFrame chip={step.chip} index={index}>{step.mock}</MockFrame>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockFrame({ children, chip, index }: { children: ReactNode; chip: string; index: number }) {
  const tones = [
    "from-clay-300/30 to-ochre-300/20",
    "from-sage-300/30 to-sage-500/12",
    "from-ochre-300/25 to-clay-300/18",
    "from-clay-300/25 to-sage-300/18",
  ];
  return (
    <div className="group relative">
      <Blob className={`absolute -inset-5 bg-gradient-to-br ${tones[index % 4]} blur-2xl opacity-60`} />
      <div className="relative rounded-[1.7rem] surface-raised-xl p-4 transition-transform duration-500 group-hover:-translate-y-1.5">
        <div className="grid h-52 place-items-center overflow-hidden rounded-[1.3rem] surface-inset p-5">{children}</div>
      </div>
      {/* layered floating chip */}
      <div className="absolute -bottom-4 -right-3 rounded-2xl glass px-3.5 py-2 shadow-lift lg:-right-4">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-fg-strong">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
          {chip}
        </div>
      </div>
    </div>
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

/* ============================================================= WHY FREE === */

function WhyFree() {
  const navigate = useNavigate();
  const props = [
    {
      title: "No account required to start",
      body: "Take any assessment, read every resource, and try the breathing tool — all without signing up. No paywall, no trial.",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>,
    },
    {
      title: "Clinically-grounded tools",
      body: "Our assessments use the same validated frameworks (GAD-7, Maslach, PSS-4) used by therapists worldwide — not generic quizzes.",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    },
    {
      title: "Track your score over time",
      body: "Create a free account and retake assessments every two weeks. See if what you're doing is actually working — with a clear score history.",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    },
    {
      title: "Therapist matching, when you're ready",
      body: "When you're ready for professional support, we match you with an RCI-licensed therapist in under 48 hours. The tools make sure you go in prepared.",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-night text-night-fg my-8 md:my-12 mx-3 md:mx-6 rounded-[2.25rem] ring-1 ring-night-border">
      <Blob className="absolute -top-24 right-6 h-[420px] w-[420px] bg-clay-500/40 blur-[110px]" />
      <Blob className="absolute -bottom-28 -left-12 h-[380px] w-[380px] bg-sage-500/20 blur-[120px]" style={{ animationDelay: "5s" }} />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(95,126,85,0.10),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1080px] px-6 md:px-12 py-20 md:py-28">
        <Reveal>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-400">Free forever</div>
          <h2 className="mt-4 font-display font-medium text-4xl md:text-[3rem] md:leading-[1.05] tracking-[-0.025em] text-balance max-w-xl">
            Better mental health shouldn't require a subscription.
          </h2>
          <p className="mt-5 text-night-muted text-lg leading-relaxed max-w-xl">
            Start with our free tools — no account, no credit card, no catch. The assessments, journal, and breathing exercises are yours to use today.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {props.map((p, i) => (
            <Reveal key={p.title} delay={80 + i * 70}>
              <div className="flex gap-4 rounded-[1.4rem] ring-1 ring-night-border bg-night-2/60 p-6">
                <span className="shrink-0 w-9 h-9 rounded-xl bg-sage-600/30 text-sage-400 grid place-items-center">
                  {p.icon}
                </span>
                <div>
                  <p className="font-semibold text-night-fg">{p.title}</p>
                  <p className="mt-1.5 text-sm text-night-muted leading-relaxed">{p.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={380}>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/assess")}
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full font-semibold text-sm bg-sage-600 text-white hover:bg-sage-500 transition-all duration-300 shadow-soft"
            >
              Try an assessment — it's free →
            </button>
            <button
              onClick={() => navigate("/join")}
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full font-semibold text-sm ring-1 ring-night-border text-night-fg hover:bg-night-2 transition-all duration-300"
            >
              Create free account
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}



/* =============================================================== PRIVACY === */

function Privacy() {
  const assertions = [
    { title: "What you share stays yours.", body: "Conversations and account data are encrypted in transit and at rest. Sessions stay between you and your therapist — no exceptions." },
    { title: "You are always in control.", body: "We never sell your data or use it for advertising. Export or permanently delete your account at any time, with one click." },
    { title: "Every therapist is verified.", body: "Each clinician's license, qualifications, and standing is reviewed before they can be booked. The badge means the check is done." },
  ];
  return (
    <Section>
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-24 items-start">
        {/* left — oversized editorial anchor */}
        <Reveal direction="right">
          <div>
            <Eyebrow>Privacy &amp; safety</Eyebrow>
            <h2 className="mt-5 font-display font-medium tracking-[-0.03em] leading-[0.92] text-fg-strong text-[clamp(3.2rem,6vw,5.5rem)]">
              Reaching<br />out should<br />feel <span className="italic text-accent">safe.</span>
            </h2>
            <p className="mt-7 text-fg-muted leading-relaxed max-w-xs">
              It takes courage to ask for help. The least we can do is protect you while you do.
            </p>
          </div>
        </Reveal>

        {/* right — manifesto list */}
        <div className="divide-y divide-border border-y border-border">
          {assertions.map((a, i) => (
            <Reveal key={a.title} delay={i * 90}>
              <div className="py-7 flex flex-col gap-2">
                <h3 className="font-display text-xl md:text-2xl text-fg-strong">{a.title}</h3>
                <p className="text-fg-muted leading-relaxed">{a.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* seal strip */}
      <Reveal delay={280}>
        <div className="mt-10 flex items-center gap-4 rounded-2xl bg-night/60 ring-1 ring-night-border px-6 py-4">
          <IconShield className="w-5 h-5 text-sage-400 shrink-0" />
          <p className="text-sm font-semibold text-white">
            <span className="">Encrypted &amp; confidential.</span>{" "}
            Your data is never sold, never shared with advertisers, and always yours to delete.
          </p>
        </div>
      </Reveal>
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
        <div className="flex flex-col gap-5">
          {/* first secondary — full card */}
          <Reveal delay={120}>
            <figure className="rounded-[1.5rem] surface-raised p-7 flex flex-col">
              <blockquote className="text-fg leading-relaxed">"{more[0].quote}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <Avatar initials={more[0].initials} tone={more[0].tone} size="w-10 h-10" />
                <div className="flex-1 text-sm"><div className="font-semibold text-fg-strong">{more[0].name}</div><div className="text-fg-muted">{more[0].role}</div></div>
                <span className="rounded-full bg-sage-100 border border-sage-200 px-2.5 py-1 text-[11px] text-sage-700 font-medium">{more[0].outcome}</span>
              </figcaption>
            </figure>
          </Reveal>
          {/* second secondary — compact pull-quote with left accent */}
          <Reveal delay={230}>
            <figure className="rounded-[1.5rem] bg-surface border-l-[3px] border-accent pl-6 pr-6 py-6 flex flex-col gap-4">
              <blockquote className="text-fg-strong font-display text-lg leading-snug italic">"{more[1].quote}"</blockquote>
              <figcaption className="flex items-center gap-2.5">
                <Avatar initials={more[1].initials} tone={more[1].tone} size="w-8 h-8" />
                <div className="text-sm text-fg-muted">{more[1].name} · {more[1].role}</div>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* =============================================================== PRICING === */

/* =================================================================== FAQ === */

function FAQ() {
  const faqs = [
    { q: "How are therapists verified?", a: "We review each therapist's license, credentials, and professional standing before they're listed. The verified badge means that check is complete." },
    { q: "Is what I share confidential?", a: "Yes. Your data and sessions are encrypted, and we never sell your information or use it for advertising." },
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
          <button onClick={() => navigate("/therapists")} className="group relative mt-10 inline-flex items-center justify-center gap-2 h-14 px-9 rounded-full font-semibold text-base bg-accent text-primary-fg hover:bg-accent-hover transition-all duration-300 shadow-lift">
            <span aria-hidden className="absolute inset-0 rounded-full bg-accent/40 blur-lg -z-10 animate-pulse-soft" />
            Find your therapist
            <span className="transition-transform duration-300">→</span>
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

/* Thin top scroll-progress bar — fills left→right as the page scrolls. */
function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${h > 0 ? Math.min(1, window.scrollY / h) : 0})`;
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-accent to-ochre-400" style={{ transform: "scaleX(0)" }} ref={ref} />
  );
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
