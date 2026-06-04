import { type ReactNode } from "react";
import Reveal from "../components/Reveal";
import SEO from "../components/SEO";

export default function TermsPage() {
  return (
    <div className="grain relative text-fg bg-bg overflow-x-clip">
      <SEO title="Terms of Service" description="Review WellNest's terms of service governing the use of our therapy matching platform and mental wellness tools." canonical="/terms" />
      <section className="relative pt-[68px]">
        <div className="mx-auto max-w-[1080px] px-5 md:px-8 py-16 md:py-24">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-surface/70 ring-1 ring-border px-3 py-1.5 text-[0.8rem] font-medium text-fg backdrop-blur shadow-soft mb-6">
              Last updated: {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long" })}
            </div>
            <h1 className="font-display font-medium tracking-[-0.03em] text-fg-strong text-[clamp(2.6rem,7vw,5rem)] leading-[0.92]">
              Terms of Service
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-fg leading-relaxed">
              Please read these terms carefully before using WellNest. By using our platform you agree to these terms.
            </p>
          </Reveal>
        </div>
      </section>

      <Section>
        <Prose>
          <h2>1. About WellNest</h2>
          <p>WellNest is an online platform that connects individuals with licensed mental health professionals. We are not a medical provider and do not provide clinical advice directly. All therapy is delivered by independent, licensed therapists.</p>

          <h2>2. Eligibility</h2>
          <p>You must be at least 18 years of age to use WellNest. By creating an account, you confirm that you meet this requirement.</p>

          <h2>3. Your Account</h2>
          <p>You are responsible for keeping your login credentials secure and for all activity under your account. Please notify us immediately at <a href="mailto:support@wellnest.in">support@wellnest.in</a> if you suspect unauthorised access.</p>

          <h2>4. Bookings and Payments</h2>
          <p>Session bookings are confirmed only after payment is successfully processed. Cancellation and rescheduling policies are set by individual therapists and will be displayed before you confirm your booking.</p>

          <h2>5. Therapist Relationships</h2>
          <p>Therapists on WellNest are independent professionals. WellNest facilitates your connection with them but is not responsible for the content of therapy sessions, therapeutic outcomes, or advice given by therapists.</p>

          <h2>6. Prohibited Use</h2>
          <p>You may not use WellNest for any unlawful purpose, to harm others, or to misrepresent your identity. Abusing the platform or our therapists will result in immediate account termination.</p>

          <h2>7. Limitation of Liability</h2>
          <p>WellNest is provided "as is". We make no guarantees about therapeutic outcomes. Our liability is limited to the amount you have paid to us in the 3 months preceding any claim.</p>

          <h2>8. Changes to Terms</h2>
          <p>We may update these terms from time to time. We will notify you of significant changes via email. Continued use of the platform after changes constitutes acceptance.</p>

          <h2>9. Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Bangalore, Karnataka.</p>

          <h2>10. Contact</h2>
          <p>Questions about these terms? Email us at <a href="mailto:legal@wellnest.in">legal@wellnest.in</a>.</p>
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
    <div className="max-w-3xl space-y-6 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-fg-strong [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:text-fg [&_p]:leading-relaxed [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-accent-hover">
      {children}
    </div>
  );
}
