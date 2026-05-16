import { useNavigate } from "react-router-dom";
import SecureButton from "../components/SecureButton";
import SupportBox from "../components/SupportBox";
import Tag from "../components/Tag";
import { tagsData } from "../data";

export default function LandingPage() {
  return (
    <div className="bg-linear-to-b from-[#FFFDF8] to-[#EEFFFF] pt-4">
      <main className="px-4 md:px-8 pb-8 lg:px-18 xl:px-16 2xl:px-24">
        <section className="flex mt-6 justify-between">
          <div className="flex-1">
            <div className="mb-4 opacity-0 animate-fade-in-up">
              <SecureButton />
            </div>
            <div className="font-playfair text-center md:text-start text-4xl md:text-6xl xl:text-7xl flex flex-col gap-2 opacity-0 animate-fade-in-up animation-delay-100">
              <div className="text-[#0D393E] font-medium">You don't have to</div>
              <div className="text-[#0D393E] font-medium">go through this</div>
              <div className="text-[#E77D3C] font-semibold italic">alone.</div>
            </div>
            <div className="font-nunito text-center md:text-start text-sm md:text-xl 2xl:text-2xl mt-6 text-[#3E464E] opacity-0 animate-fade-in-up animation-delay-200">
              <div>Thoughtful, personalised therapy that</div>
              <div>fits your life. Anytime, anywhere .</div>
            </div>
            <div className="flex justify-around w-full md:w-fit md:justify-start mt-6 md:gap-6 lg:gap-12 opacity-0 animate-fade-in-up animation-delay-300">
              <FindTherapistButton />
              <ExploreResourcesButton />
            </div>
            <div className="mt-8 w-fit lg:h-18 2xl:mt-16 grid sm:grid-cols-3 gap-3 opacity-0 animate-fade-in-up animation-delay-400">
              {tagsData.map((tag, i) => (
                <div key={tag.heading} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${500 + i * 100}ms` }}>
                  <Tag color={tag.color} heading={tag.heading} text={tag.text} logo={tag.logo} />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden xl:inline-block flex-1 relative opacity-0 animate-fade-in animation-delay-500">
            <img src="/image.png" alt="image" className="w-full" />
            <img src="/petal.svg" alt="petal" className="absolute top-5 left-10 animate-float" />
            <img src="/leaves.svg" alt="leaf" className="absolute bottom-20 -left-20 animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute shadow-sm bottom-8 left-10 2xl:text-xl font-bold w-48 text-[#1A555B] p-4 rounded-xl font-nunito bg-[#F5F1ED] opacity-0 animate-fade-in-up animation-delay-600">
              A safe space to be heard.
            </div>
            <div className="absolute shadow-sm top-50 right-5 2xl:text-xl w-38 h-60 2xl:w-52 2xl:h-72 p-4 rounded-xl font-nunito bg-[#F5F1ED] opacity-0 animate-fade-in-up animation-delay-700">
              <div className="relative w-full h-full">
                <div className="w-12 h-12 2xl:w-15 2xl:h-15 flex justify-center p-4 bg-[#417C7E] rounded-full">
                  <img src="/heart.svg" alt="heart" />
                </div>
                <div className="mt-2 font-bold text-[#1A555B]">It's okay to not be okay.</div>
                <div className="text-sm font-medium mt-2 text-[#868B8F]">We're here when you're ready.</div>
                <img src="/leaf2.svg" alt="leaf" className="absolute -bottom-15 right-0 animate-float" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 w-full rounded-3xl p-4 lg:p-8 bg-linear-to-r from-[#DCEAED] to-[#C5E9F1] opacity-0 animate-fade-in-up animation-delay-600">
          <SupportBox />
        </div>
      </main>
    </div>
  );
}

const base = "w-38 md:w-45 2xl:w-52 rounded-full border font-nunito h-12 md:h-14 border-[#0D393E] text-sm transition-all duration-300 hover:shadow-lg hover:scale-105";

function FindTherapistButton() {
  const navigate = useNavigate();

  return <button onClick={()=>navigate("/therapists")} className={`${base} text-white bg-[#0D393E] hover:bg-[#2a5459]`}>Find a therapist</button>;
}

function ExploreResourcesButton() {
  return <button className={`${base} hover:shadow-lg hover:scale-105`}>Explore Resources</button>;
}