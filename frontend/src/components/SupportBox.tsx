import SupportCard from "./SupportCard";

export default function SupportBox() {
  return (
    <div className="text-fg-strong font-nunito flex flex-col lg:flex-row xl:gap-16">
      
      {/* LEFT */}
      <div className="flex flex-col gap-4 max-w-60">
        <div className="text-sm font-semibold tracking-wide">
          HOW IT WORKS
        </div>

        <div className="font-playfair font-semibold text-xl lg:text-3xl leading-snug">
          Support, made simple
        </div>

        <div className="text-sm text-fg-muted">
          Take the first step toward feeling like yourself again.
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-4 md:gap-0 md:flex-row w-full items-center justify-between lg:border-l-3 border-border p-6 md:p-2 xl:pl-12">
        <SupportCard
          className="bg-sage-600"
          image="person"
          number={1}
          heading="Share how you feel"
          subtext="Answer few questions to help us understand you."
        />

        <SupportCard
          className="bg-clay-400"
          image="search"
          number={2}
          heading="Find your match"
          subtext="We’ll recommend therapists that are right for you."
        />

        <SupportCard
          className="bg-ochre-400"
          image="calender"
          number={3}
          heading="Book a session"
          subtext="Choose a time that works for your schedule."
        />

        <SupportCard
          className="bg-sage-400"
          image="heart"
          number={4}
          heading="Feel better together"
          subtext="Join your session and start your healing journey."
        />
      </div>
    </div>
  );
}