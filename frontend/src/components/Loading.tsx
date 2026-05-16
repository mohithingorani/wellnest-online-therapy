"use client";

import { useEffect, useState } from "react";

interface LoadingPageProps {
  minDisplayTime?: number;
}

export default function LoadingPage({
  minDisplayTime = 1800,
}: LoadingPageProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;

      /**
       * Much more natural easing curve
       * Fast at start, slower near end
       */
      const easedProgress = Math.min(
        100,
        100 * (1 - Math.exp(-elapsed / 600))
      );

      setProgress(Math.floor(easedProgress));

      if (elapsed >= minDisplayTime) {
        setProgress(100);
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [minDisplayTime]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f6f1] text-[#0D393E]">
      
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-15%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#47898E]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#E77D3C]/10 blur-3xl animate-pulse" />
      </div>

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.025] bg-[url('/noise.png')]" />

      {/* Main */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between p-8 md:p-12">
        
        {/* Header */}
        <div className="flex items-center justify-between animate-[fadeIn_0.8s_ease]">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#0D393E] animate-pulse" />

            <h1 className="text-xs uppercase tracking-[0.35em] font-medium">
              WellNest
            </h1>
          </div>

          <span className="text-xs uppercase tracking-[0.25em] text-[#0D393E]/40">
            Loading
          </span>
        </div>

        {/* Hero */}
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-4xl font-nunito ">
            
            <div className="overflow-hidden">
              <h2 className="animate-[slideUp_1s_cubic-bezier(0.16,1,0.3,1)] text-5xl md:text-7xl lg:text-8xl font-light tracking-[-0.04em] leading-[0.95]">
                Mental wellness,
              </h2>
            </div>

            <div className=" mt-2">
              <h2 className="animate-[slideUp_1s_cubic-bezier(0.16,1,0.3,1)] text-5xl md:text-7xl lg:text-8xl font-light tracking-[-0.04em] leading-[0.95] text-[#0D393E]/55">
                reimagined digitally.
              </h2>
            </div>

            <p className="mt-8 max-w-md text-sm md:text-base leading-relaxed text-[#0D393E]/50 animate-[fadeIn_1.4s_ease]">
              Preparing a thoughtful experience designed to support clarity,
              balance, and emotional wellbeing.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between">
          
          {/* Percentage */}
          <div className="flex items-end gap-2">
            <span className="text-7xl md:text-9xl font-light tracking-[-0.06em] leading-none">
              {String(progress).padStart(2, "0")}
            </span>

            <span className="mb-3 text-sm text-[#0D393E]/40">
              %
            </span>
          </div>

          {/* Progress Line */}
          <div className="w-[42%]">
            <div className="mb-3 flex justify-between text-[10px] uppercase tracking-[0.25em] text-[#0D393E]/35">
              <span>Initializing</span>
              <span>{progress}/100</span>
            </div>

            <div className="relative h-[1px] overflow-hidden bg-[#0D393E]/10">
              <div
                className="absolute left-0 top-0 h-full bg-[#0D393E] transition-all duration-200 ease-out"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
        <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(120%);
          }
          to {
            opacity: 1;
            transform: translateY(0%);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}