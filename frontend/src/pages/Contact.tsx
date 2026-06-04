import { useState } from "react";
import { type ReactNode } from "react";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO(backend): wire to email service (SendGrid / Resend / etc.)
    await new Promise((r) => setTimeout(r, 600));
    setSent(true);
    setLoading(false);
  };

  const inputCls =
    "w-full rounded-xl border border-border/70 bg-surface/60 px-4 py-3.5 text-[0.95rem] text-fg-strong placeholder:text-fg-muted/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all duration-200";

  return (
    <div className="grain relative text-fg bg-bg overflow-x-clip">
      <SEO title="Contact Us" description="Get in touch with the WellNest team. We're here to help with questions about therapy matching, your account, or mental wellness resources." canonical="/contact" />
      <section className="relative pt-[68px]">
        <div className="mx-auto max-w-[1080px] px-5 md:px-8 py-16 md:py-24">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-surface/70 ring-1 ring-border px-3 py-1.5 text-[0.8rem] font-medium text-fg backdrop-blur shadow-soft mb-6">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
              We're here to help
            </div>
            <h1 className="font-display font-medium tracking-[-0.03em] text-fg-strong text-[clamp(2.6rem,7vw,5rem)] leading-[0.92]">
              Get in touch.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-fg leading-relaxed">
              Have a question, feedback, or need support? We usually respond within one business day.
            </p>
          </Reveal>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
          {/* Contact info */}
          <Reveal>
            <div className="space-y-8">
              {[
                { label: "General enquiries", value: "hello@wellnest.in", href: "mailto:hello@wellnest.in", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                { label: "Support", value: "support@wellnest.in", href: "mailto:support@wellnest.in", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" },
                { label: "Privacy & legal", value: "legal@wellnest.in", href: "mailto:legal@wellnest.in", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-sage-100 text-sage-600 grid place-items-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={c.icon} /></svg>
                  </span>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.15em] text-fg-muted">{c.label}</div>
                    <a href={c.href} className="mt-0.5 text-fg-strong font-medium hover:text-accent transition-colors">{c.value}</a>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={80}>
            {sent ? (
              <div className="surface-raised rounded-2xl p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-success/15 text-success grid place-items-center mx-auto mb-4">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="font-display text-2xl text-fg-strong">Message sent!</h2>
                <p className="mt-2 text-fg-muted">Thanks for reaching out. We'll get back to you within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="surface-raised rounded-2xl p-6 md:p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="c-name" className="block text-sm font-semibold text-fg-strong mb-2">Name</label>
                    <input id="c-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="c-email" className="block text-sm font-semibold text-fg-strong mb-2">Email</label>
                    <input id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label htmlFor="c-subject" className="block text-sm font-semibold text-fg-strong mb-2">Subject</label>
                  <input id="c-subject" type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="How can we help?" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="c-message" className="block text-sm font-semibold text-fg-strong mb-2">Message</label>
                  <textarea id="c-message" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us more..." className={`${inputCls} resize-none`} />
                </div>
                <button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-accent text-primary-fg font-semibold text-sm shadow-lift hover:bg-accent-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading && <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
                  {loading ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </Section>
    </div>
  );
}

function Section({ children }: { children: ReactNode }) {
  return (
    <section className="relative">
      <div className="mx-auto max-w-[1080px] px-5 md:px-8 pb-24">{children}</div>
    </section>
  );
}
