import React from "react";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FFFDF8] min-h-screen">
      {/* Hero */}
      <section className="relative mt-4 md:mt-8 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#E77D3C]/5 blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-[#47898E]/5 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14 relative">
          <div className="max-w-3xl">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-[#0D393E] leading-tight opacity-0 animate-fade-in-up">
              Making therapy more
              <span className="block text-[#E77D3C] italic">accessible.</span>
            </h1>
            <p className="font-nunito text-lg md:text-xl text-[#3E464E] mt-6 max-w-xl leading-relaxed opacity-0 animate-fade-in-up animation-delay-200">
              We believe finding the right therapist shouldn't be complicated. 
              WellNest connects you with licensed professionals who match your needs — simply, safely, and with care.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 opacity-0 animate-fade-in-up animation-delay-300">
              <button
                onClick={() => navigate("/therapists")}
                className="px-6 py-3 bg-[#0D393E] text-white font-nunito rounded-full hover:bg-[#2a5459] hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Find a Therapist
              </button>
              <button
                onClick={() => navigate("/how-it-works")}
                className="px-6 py-3 border border-[#0D393E] text-[#0D393E] font-nunito rounded-full hover:bg-[#0D393E]/5 hover:scale-105 transition-all duration-300"
              >
                How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-[#0D393E] via-[#0f4a50] to-[#0D393E] py-12 md:py-16 opacity-0 animate-fade-in-up animation-delay-400">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Licensed Therapists" },
              { number: "10k+", label: "Sessions Completed" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "24h", label: "Avg. Booking Time" },
            ].map((stat, i) => (
              <div key={stat.label} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${500 + i * 100}ms` }}>
                <div className="font-nunito text-3xl md:text-4xl text-white font-bold">{stat.number}</div>
                <div className="font-nunito text-sm text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="opacity-0 animate-fade-in-up animation-delay-600">
              <h2 className="font-playfair text-3xl md:text-4xl text-[#0D393E] mb-6">
                Our Mission
              </h2>
              <p className="font-nunito text-base md:text-lg text-[#3E464E] leading-relaxed mb-4">
                We started WellNest because we saw how hard it was for people to find the right mental health support. 
                The process was often confusing, overwhelming, and shrouded in uncertainty.
              </p>
              <p className="font-nunito text-base md:text-lg text-[#3E464E] leading-relaxed">
                Our mission is simple: make finding a therapist feel as natural as finding any other kind of support. 
                No gatekeeping. No guesswork. Just clear, compassionate help when you need it.
              </p>
            </div>
            <div className="relative opacity-0 animate-fade-in-up animation-delay-700">
              <div className="aspect-square max-w-sm mx-auto">
                <div className="w-full h-full rounded-3xl bg-[#E77D3C]/10 flex items-center justify-center">
                  <svg className="w-32 h-32 text-[#E77D3C]/30 animate-float" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 md:-right-8 bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <p className="font-nunito text-sm text-[#3E464E]">
                  <span className="font-semibold text-[#0D393E]">Trusted by</span><br/>
                  10,000+ clients
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="font-playfair text-3xl md:text-4xl text-[#0D393E] text-center mb-4 opacity-0 animate-fade-in-up animation-delay-800">
            What We Stand For
          </h2>
          <p className="font-nunito text-base text-[#3E464E] text-center max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in-up animation-delay-900">
            These principles guide everything we do at WellNest
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { number: "01", title: "Trust & Transparency", description: "Every therapist is verified, licensed, and transparent about their experience and approach. No hidden fees, no surprise costs." },
              { number: "02", title: "Choice & Autonomy", description: "You deserve a therapist who feels right for you. We make it easy to browse, compare, and switch if needed — on your terms." },
              { number: "03", title: "Accessibility", description: "Therapy should fit into your life, not the other way around. Flexible sessions, multiple formats, and thoughtful matching." },
            ].map((item, i) => (
              <div key={item.title} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${1000 + i * 100}ms` }}>
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="font-playfair text-xl text-[#E77D3C] font-semibold mb-4">{item.number}</div>
                  <h3 className="font-playfair text-xl text-[#0D393E] mb-3">{item.title}</h3>
                  <p className="font-nunito text-sm text-[#3E464E] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-[#F9F7F5]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl text-[#0D393E] text-center mb-4 opacity-0 animate-fade-in-up animation-delay-1300">
            How It Works
          </h2>
          <p className="font-nunito text-base text-[#3E464E] text-center max-w-xl mx-auto mb-12 opacity-0 animate-fade-in-up animation-delay-1400">
            Getting started is simple. No complicated forms, no long waits.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: "1", title: "Browse Therapists", description: "Explore profiles of licensed therapists. Filter by specialty, session type, language, and more." },
              { number: "2", title: "Book a Session", description: "Choose a time that works for you. Whether video, chat, or in-person — book in just a few clicks." },
              { number: "3", title: "Start Your Journey", description: "Meet your therapist and begin your path to feeling better. Switch anytime if needed." },
            ].map((step, i) => (
              <div key={step.number} className="text-center opacity-0 animate-fade-in-up" style={{ animationDelay: `${1500 + i * 100}ms` }}>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#E77D3C]/10 flex items-center justify-center hover:bg-[#E77D3C]/20 transition-colors duration-300">
                  <span className="font-playfair text-2xl text-[#E77D3C] font-semibold">{step.number}</span>
                </div>
                <h3 className="font-playfair text-xl text-[#0D393E] mb-3">{step.title}</h3>
                <p className="font-nunito text-sm text-[#3E464E]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl text-[#0D393E] mb-12 text-center opacity-0 animate-fade-in-up animation-delay-1800">
            Why WellNest
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "verified", title: "Verified Therapists", description: "Every therapist passes our strict credential verification process." },
              { icon: "flexible", title: "Flexible Sessions", description: "Video, voice, or chat — book sessions that fit your schedule and comfort." },
              { icon: "private", title: "Private & Secure", description: "Your data is encrypted and protected. Your sessions stay confidential." },
              { icon: "support", title: "Ongoing Support", description: "Not just matching — we're here to help you throughout your journey." },
            ].map((feature, i) => (
              <div key={feature.title} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${1900 + i * 100}ms` }}>
                <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-[#F5F1ED] to-[#FFFDF8]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl text-[#0D393E] text-center mb-4 opacity-0 animate-fade-in-up animation-delay-2300">
            Frequently Asked Questions
          </h2>
          <p className="font-nunito text-base text-[#3E464E] text-center mb-12 opacity-0 animate-fade-in-up animation-delay-2400">
            Everything you need to know before getting started
          </p>
          <div className="space-y-3">
            {[
              { q: "How do you verify therapists?", a: "We verify every therapist's license, credentials, and identity through official licensing boards. We also conduct background checks and ongoing quality monitoring." },
              { q: "Is my information kept confidential?", a: "Yes. Your data is encrypted end-to-end, and therapy sessions are protected by strict confidentiality agreements. We never share your personal information with third parties." },
              { q: "Can I switch therapists if I'm not comfortable?", a: "Absolutely. If you don't feel the right fit, you can browse and book with another therapist at any time — no questions asked, no awkward conversations needed." },
              { q: "What types of therapy do you offer?", a: "Our platform offers various therapy types including CBT, DBT, psychodynamic therapy, EMDR, and more. Each therapist has their own specialty areas listed on their profile." },
              { q: "How much does therapy cost?", a: "Pricing varies by therapist and session type. You'll always see the full price before booking — no hidden fees or surprise charges." },
              { q: "Do you accept insurance?", a: "Some therapists on our platform accept insurance. You can filter by insurance accepted on the therapist search page." },
            ].map((item, i) => (
              <div key={item.q} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${2500 + i * 100}ms` }}>
                <FAQItem question={item.q} answer={item.a} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-[#0D393E]">
        <div className="max-w-3xl mx-auto text-center opacity-0 animate-fade-in-up animation-delay-3100">
          <h2 className="font-playfair text-3xl md:text-4xl text-white mb-4">
            Ready to begin?
          </h2>
          <p className="font-nunito text-base md:text-lg text-white/80 mb-8">
            Take the first step toward feeling better. Browse our therapists and find the right match for you.
          </p>
          <button
            onClick={() => navigate("/therapists")}
            className="px-8 py-4 bg-white text-[#0D393E] font-nunito font-semibold rounded-full hover:bg-[#EEFFFF] hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Browse Therapists
          </button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  const iconList: Record<string, React.ReactElement> = {
    verified: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    flexible: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    private: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    support: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
      <div className="w-12 h-12 rounded-full bg-[#47898E]/10 flex items-center justify-center text-[#47898E] mb-4">
        {iconList[icon]}
      </div>
      <h3 className="font-nunito font-semibold text-[#0D393E] text-lg mb-2">{title}</h3>
      <p className="font-nunito text-sm text-[#3E464E]">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-[#E5E7EB] last:border-0">
      <details className="group py-4 cursor-pointer">
        <summary className="flex justify-between items-center font-nunito font-semibold text-[#0D393E] list-none hover:text-[#47898E] transition-colors duration-200">
          <span>{question}</span>
          <span className="ml-4 flex-shrink-0 transition-transform duration-300 group-open:rotate-180">
            <svg className="w-5 h-5 text-[#47898E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </summary>
        <p className="font-nunito text-sm text-[#3E464E] mt-3 leading-relaxed">{answer}</p>
      </details>
    </div>
  );
}