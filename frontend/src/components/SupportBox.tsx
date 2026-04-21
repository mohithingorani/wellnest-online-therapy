import SupportCard from "./SupportCard";

export default function SupportBox() {
  return (
    <div className="text-[#0D393E] font-nunito flex flex-col lg:flex-row xl:gap-16">
      
      {/* LEFT */}
      <div className="flex flex-col gap-4 max-w-60">
        <div className="text-sm font-semibold tracking-wide">
          HOW IT WORKS
        </div>

        <div className="font-playfair font-semibold text-xl lg:text-3xl leading-snug">
          Support, made simple
        </div>

        <div className="text-sm text-[#3A5F63]">
          Take the first step toward feeling like yourself again.
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-4 md:gap-0 md:flex-row items-center justify-between lg:border-l-3 border-[#CDD7D9] p-6 md:p-2 xl:pl-12">
        <SupportCard
          className="bg-[#235C61]"
          image="person"
          number={1}
          heading="Share how you feel"
          subtext="Answer few questions to help us understand you."
        />

        <SupportCard
          className="bg-[#E77D3C]"
          image="search"
          number={2}
          heading="Find your match"
          subtext="We’ll recommend therapists that are right for you."
        />

        <SupportCard
          className="bg-[#B5D6E2]"
          image="calender"
          number={3}
          heading="Book a session"
          subtext="Choose a time that works for your schedule."
        />

        <SupportCard
          className="bg-[#A3BFA9]"
          image="heart"
          number={4}
          heading="Feel better together"
          subtext="Join your session and start your healing journey."
        />
      </div>
    </div>
  );
}