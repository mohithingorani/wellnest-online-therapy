import { useEffect, useRef, useState, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: ReactNode;
  /** Delay in ms before the reveal animates (use for staggering siblings). */
  delay?: number;
  /** Direction the content travels in from. Defaults to "up". */
  direction?: Direction;
  /** Distance in px the content travels. Defaults to 16. */
  distance?: number;
  /** IntersectionObserver threshold. Defaults to 0.15. */
  threshold?: number;
  /** Animate only the first time it enters the viewport. Defaults to true. */
  once?: boolean;
  className?: string;
}

const OFFSETS: Record<Direction, (d: number) => string> = {
  up: (d) => `translateY(${d}px)`,
  down: (d) => `translateY(-${d}px)`,
  left: (d) => `translateX(${d}px)`,
  right: (d) => `translateX(-${d}px)`,
  none: () => "none",
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Scroll-triggered reveal. Replaces the brittle `opacity-0 animate-fade-in-up`
 * pattern: content is never left invisible (reduced-motion users and SSR see it
 * immediately), and motion is driven by IntersectionObserver so off-screen
 * content doesn't animate before it's seen.
 */
export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  distance = 16,
  threshold = 0.15,
  once = true,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Reduced-motion users start fully visible — no animation at all.
  const [visible, setVisible] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) return; // already visible via initial state
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : OFFSETS[direction](distance),
        filter: visible ? "blur(0px)" : "blur(8px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.7s cubic-bezier(0.16,1,0.3,1)`,
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  );
}
