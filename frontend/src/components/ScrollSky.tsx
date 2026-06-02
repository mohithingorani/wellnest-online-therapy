import { useEffect, useRef } from "react";

/* ============================================================================
   ScrollSky — a single fixed backdrop for the entire landing page that
   transitions NIGHT → DAWN → DAY as a function of scroll progress. The sunrise
   IS the scroll. Because there are no per-section backgrounds, there are no
   seams. Content sections float over this as transparent layers / cards.

   Implementation: JS writes one CSS var (--p, 0→1 page progress) per frame;
   CSS does all the color crossfading via clamp() on layer opacities. Cheap,
   smooth, and scroll-linked (acceptable under reduced-motion — it responds to
   the user's own scrolling rather than animating on its own).
   ============================================================================ */

const stars = [
  [8, 16, 2], [16, 60, 1], [23, 30, 2], [31, 74, 1], [38, 11, 1], [44, 46, 2],
  [52, 67, 1], [58, 22, 2], [64, 54, 1], [71, 15, 1], [77, 62, 2], [83, 36, 1],
  [89, 70, 1], [93, 20, 2], [12, 42, 1], [27, 84, 1], [49, 8, 1], [67, 80, 1],
  [86, 50, 1], [97, 58, 1], [5, 78, 1], [35, 90, 1], [60, 38, 1], [74, 86, 1],
];

const NIGHT = "clamp(0, calc((0.15 - var(--p, 0)) / 0.15), 1)";
const DAY = "clamp(0, calc((var(--p, 0) - 0.13) / 0.12), 1)";
const SUN = "clamp(0, calc((var(--p, 0) - 0.5) / 0.35), 1)";

export default function ScrollSky() {
  const raf = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const max = root.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      root.style.setProperty("--p", p.toFixed(4));
      raf.current = 0;
    };
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
    {/* scroll-progress "sunrise meter" */}
    <div aria-hidden className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-apricot-500 origin-left"
        style={{ transform: "scaleX(var(--p, 0))" }}
      />
    </div>
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* DAWN — base layer, always present beneath */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#2E2C68_0%,#8784CE_46%,#E5E3F6_100%)]" />

      {/* DAY — fades in as you descend; warms to morning at the bottom */}
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,#FAFAFC_0%,#F4F2FB_42%,#FBE9DC_100%)]"
        style={{ opacity: DAY }}
      />

      {/* SUN — warm glow rising into the morning */}
      <div
        className="absolute left-1/2 bottom-[6%] -translate-x-1/2 h-[46vh] w-[85vw] rounded-full bg-apricot-300/45 blur-[130px]"
        style={{ opacity: SUN }}
      />

      {/* NIGHT — on top, fades out to reveal the dawn/day below */}
      <div className="absolute inset-0" style={{ opacity: NIGHT }}>
        <div className="absolute inset-0 bg-[radial-gradient(140%_120%_at_50%_-10%,#211F44_0%,#14132B_52%,#100F22_100%)]" />
        {/* aurora light fields */}
        <div className="absolute left-1/2 -top-44 h-[620px] w-[820px] -translate-x-1/2 rounded-full bg-indigo-500/25 blur-[150px] animate-aurora" />
        <div className="absolute right-[8%] top-24 h-[360px] w-[360px] rounded-full bg-apricot-500/15 blur-[140px] animate-aurora" style={{ animationDelay: "5s" }} />
        {/* starfield */}
        {stars.map(([l, t, s], i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{ left: `${l}%`, top: `${t}%`, width: `${s}px`, height: `${s}px`, animationDelay: `${(i % 5) * 0.7}s` }}
          />
        ))}
      </div>
    </div>
    </>
  );
}
