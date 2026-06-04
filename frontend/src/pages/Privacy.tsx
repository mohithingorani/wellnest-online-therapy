import { type ReactNode } from "react";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";

export default function PrivacyPage() {
  return (
    <div className="grain relative text-fg bg-bg overflow-x-clip">
      <SEO title="Privacy Policy" description="Read WellNest's privacy policy to understand how we collect, use, and protect your personal data. Your privacy is fundamental to our service." canonical="/privacy" />
      <section className="relative pt-[68px]">
        <div className="mx-auto max-w-[1080px] px-5 md:px-8 py-16 md:py-24">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-surface/70 ring-1 ring-border px-3 py-1.5 text-[0.8rem] font-medium text-fg backdrop-blur shadow-soft mb-6">
              Last updated: {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long" })}
            </div>
            <h1 className="font-display font-medium tracking-[-0.03em] text-fg-strong text-[clamp(2.6rem,7vw,5rem)] leading-[0.92]">
              Privacy Policy
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-fg leading-relaxed">
              Your privacy matters deeply to us. This policy explains what data we collect, why we collect it, and how we protect it.
            </p>
          </Reveal>
        </div>
      </section>

      <Section>
        <Prose>
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly — such as your name, email address, and any information you share during onboarding. We also collect information about how you use the platform to improve your experience.</p>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to match you with therapists, personalise your experience, communicate with you about your sessions, and improve our platform. We do not use your data for advertising.</p>

          <h2>3. Data Sharing</h2>
          <p>We do not sell your personal data. We may share information with therapists you book sessions with, and with service providers who help us operate the platform (under strict confidentiality agreements). We may disclose information if required by law.</p>

          <h2>4. Mental Health Data</h2>
          <p>We treat all health-related information with the highest level of care. Your journal entries, mood logs, and session content are private and are not shared with any third party without your explicit consent.</p>

          <h2>5. Data Security</h2>
          <p>We use industry-standard encryption to protect your data in transit and at rest. Access to personal data is restricted to authorised personnel only.</p>

          <h2>6. Cookies</h2>
          <p>We use cookies to keep you signed in and to understand how people use our platform. You can control cookie settings through your browser.</p>

          <h2>7. Your Rights</h2>
          <p>You may request to view, update, or delete your personal data at any time by contacting us at <a href="mailto:privacy@wellnest.in">privacy@wellnest.in</a>. You may also delete your account directly from your dashboard settings.</p>

          <h2>8. Contact</h2>
          <p>For any privacy-related questions, email us at <a href="mailto:privacy@wellnest.in">privacy@wellnest.in</a>.</p>
        </Prose>
      </Section>
    </div>
  );
}

function Section({ children }: { children: ReactNode }) {
  return (
    <section className="relative">
      <div className="mx-auto max-w-[1080px] px-5 md:px-8 pb-20">{children}</div>
    </section>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="prose-wellnest max-w-3xl space-y-6 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-fg-strong [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:text-fg [&_p]:leading-relaxed [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-accent-hover">
      {children}
    </div>
  );
}

