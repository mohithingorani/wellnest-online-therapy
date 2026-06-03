import { useCallback, useState } from "react";

interface Particle { id: number; amount: number; x: number; }

let nextId = 1;

export function useSeedsCelebration() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const celebrate = useCallback((amount: number) => {
    const id = nextId++;
    const x = 45 + Math.random() * 10; // % from left, cluster near center
    setParticles((p) => [...p, { id, amount, x }]);
    setTimeout(() => setParticles((p) => p.filter((px) => px.id !== id)), 1600);
  }, []);

  const el = (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-24 animate-seed-float"
          style={{ left: `${p.x}%` }}
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-sage-700 text-white text-sm font-bold px-3 py-1.5 shadow-lift">
            +{p.amount} 🌱
          </span>
        </div>
      ))}
    </div>
  );

  return { celebrate, el };
}
