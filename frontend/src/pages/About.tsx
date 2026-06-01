
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function AboutPage() {
  const navigate = useNavigate();
  const { ref: heroRef, inView: heroInView } = useInView(0.2);
  const { ref: problemRef, inView: problemInView } = useInView(0.2);
  const { ref: whyRef, inView: whyInView } = useInView(0.2);
  const { ref: howRef, inView: howInView } = useInView(0.2);
  const { ref: faqRef, inView: faqInView } = useInView(0.2);
  const { ref: ctaRef, inView: ctaInView } = useInView(0.2);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FFFDF8] to-[#EEFFFF] font-nunito text-[#3E464E]">
      
      {/* HERO */}
      <section
        ref={heroRef}
        className={`border-b border-[#EFEAE7] relative overflow-hidden transition-all duration-700 ${heroInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <img
          src="/petal.svg"
          alt=""
          className="absolute -top-10 right-10 w-32 opacity-30 animate-float pointer-events-none"
        />
        <img
          src="/leaves.svg"
          alt=""
          className="absolute bottom-10 left-0 w-28 opacity-20 animate-float pointer-events-none"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative z-10">
          
          <div className="max-w-4xl">
            
            <div className="inline-flex items-center gap-2 border border-[#EFEAE7] rounded-full px-4 py-2 text-sm text-[#3E464E] mb-8">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Built for accessible mental healthcare
            </div>

            <h1 className="font-playfair leading-15 md:leading-20 text-5xl md:text-7xl font-extrabold tracking-tight text-[#0D393E]">
              Finding the right therapist
              <span className="block text-[#E77D3C] italic">
                should not feel overwhelming.
              </span>
            </h1>

            <p className="mt-8 text-lg md:text-xl leading-relaxed text-[#3E464E] max-w-2xl">
              WellNest helps students and young adults discover trusted,
              verified mental health professionals without the confusion,
              friction, or long wait times traditional systems create.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/therapists")}
                className="h-12 px-6 rounded-xl bg-[#0D393E] text-white font-semibold hover:opacity-90 transition"
              >
                Find a therapist
              </button>

              <button
                onClick={() => scrollTo("how-it-works")}
                className="h-12 px-6 rounded-xl border border-[#E8E2DD] bg-white text-[#0D393E] font-semibold hover:bg-[#F9F7F5] transition"
              >
                Learn more
              </button>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-[#6B7280] mt-12">
              <span>Verified professionals</span>
              <span>Privacy-first</span>
              <span>Flexible sessions</span>
              <span>Built for young adults</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section
        ref={problemRef}
        className={`py-24 border-b border-[#EFEAE7] transition-all duration-700 ${problemInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="grid lg:grid-cols-2 gap-16">
            
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-[#0D393E] mb-4">
                The Problem
              </div>

              <h2 className="text-4xl font-playfair md:text-5xl font-bold tracking-tight leading-tight text-[#0D393E]">
                Mental healthcare is still too hard to access.
              </h2>
            </div>

            <div className="space-y-6 text-lg text-[#3E464E] leading-relaxed">
              <p>
                Finding a therapist today is often confusing, expensive,
                and emotionally exhausting — especially for students and
                young adults already dealing with stress, anxiety,
                burnout, or uncertainty.
              </p>

              <p>
                Most platforms focus on directories instead of actual
                trust, compatibility, and accessibility.
              </p>

              <p>
                We’re building WellNest to make discovering the right
                support feel simpler, safer, and more human.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY WELLNEST */}
      <section
        ref={whyRef}
        className={`py-24 transition-all duration-700 ${whyInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="max-w-2xl mb-16">
            <div className="text-sm font-semibold uppercase tracking-wider text-[#0D393E] mb-4">
              Why WellNest
            </div>

            <h2 className="text-4xl md:text-5xl font-playfair leading-15 font-bold tracking-tight text-[#0D393E]">
              Designed for trust, clarity, and accessibility.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <FeatureCard
              title="Verified Professionals"
              description="Every therapist on the platform is reviewed and verified before onboarding."
            />

            <FeatureCard
              title="Flexible Sessions"
              description="Book video, chat, or voice sessions that fit your schedule and comfort."
            />

            <FeatureCard
              title="Privacy First"
              description="Your conversations and personal data stay secure and confidential."
            />

            <FeatureCard
              title="Built for Young Adults"
              description="Designed specifically around the challenges students and young professionals face."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        ref={howRef}
        className={`py-24 border-y border-[#EFEAE7] bg-[#F8F5F2] transition-all duration-700 ${howInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="max-w-2xl mb-16">
            <div className="text-sm font-semibold uppercase tracking-wider text-[#0D393E] mb-4">
              How It Works
            </div>

            <h2 className="text-4xl md:text-5xl font-playfair leading-15 font-bold tracking-tight text-[#0D393E]">
              Getting support should feel simple.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            <StepCard
              number="01"
              title="Browse Therapists"
              description="Explore verified professionals based on specialties, experience, and preferences."
            />

            <StepCard
              number="02"
              title="Book a Session"
              description="Choose a time and format that works best for you — quickly and securely."
            />

            <StepCard
              number="03"
              title="Start Your Journey"
              description="Connect with the right therapist and begin getting the support you need."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        ref={faqRef}
        className={`py-24 transition-all duration-700 ${faqInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <div className="max-w-3xl mx-auto px-6">
          
          <div className="mb-16 text-center">
            <div className="text-sm font-semibold uppercase tracking-wider text-[#0D393E] mb-4">
              FAQ
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0D393E]">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            
            <FAQItem
              question="How are therapists verified?"
              answer="We review therapist licenses, credentials, and professional information before onboarding."
            />

            <FAQItem
              question="Is my information confidential?"
              answer="Yes. Your data and sessions are protected using secure, privacy-first systems."
            />

            <FAQItem
              question="Can I switch therapists?"
              answer="Absolutely. Finding the right fit matters, and you can switch anytime."
            />

            <FAQItem
              question="What types of sessions are supported?"
              answer="Depending on therapist availability, sessions may include video, voice, or chat."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        ref={ctaRef}
        className={`border-t border-[#EFEAE7] relative overflow-hidden transition-all duration-700 ${ctaInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <img
          src="/flowers.svg"
          alt=""
          className="absolute -bottom-6 right-6 w-24 opacity-25 animate-float pointer-events-none"
        />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-[#0D393E] font-playfair leading-15">
            Better mental healthcare,
            <span className="block text-[#0D393E]">
              designed for modern life.
            </span>
          </h2>

          <p className="mt-6 text-lg text-[#3E464E] max-w-2xl mx-auto leading-relaxed">
            Start exploring therapists who match your needs and preferences.
          </p>

          <button
            onClick={() => navigate("/therapists")}
            className="mt-10 h-12 px-8 rounded-xl bg-[#0D393E] text-white font-semibold hover:opacity-90 transition"
          >
            Browse therapists
          </button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-[#EFEAE7] rounded-2xl p-6 bg-white hover:border-[#47898E] hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
      <h3 className="text-xl font-bold text-[#0D393E] mb-3">
        {title}
      </h3>

      <p className="text-[#3E464E] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-[#EFEAE7] rounded-2xl p-8 hover:border-[#47898E] hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
      
      <div className="text-sm font-bold text-[#0D393E] mb-6">
        {number}
      </div>

      <h3 className="text-2xl font-bold text-[#0D393E] mb-4">
        {title}
      </h3>

      <p className="text-[#3E464E] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group border border-[#EFEAE7] rounded-2xl p-6 bg-white transition-all duration-300 open:border-[#0D393E] open:shadow-md">
      
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <span className="text-lg font-semibold text-[#0D393E] group-open:text-[#0D393E] transition-colors duration-300">
          {question}
        </span>

        <svg
          className="w-5 h-5 text-[#6B7280] transition-all duration-300 group-open:rotate-180 group-open:text-[#0D393E]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>

      <p className="mt-4 text-[#3E464E] leading-relaxed">
        {answer}
      </p>
    </details>
  );
}