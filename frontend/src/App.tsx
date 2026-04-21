import NavBar from "./components/NavBar";
import SecureButton from "./components/SecureButton";
import Tag from "./components/Tag";
import { tagsData } from "./data";



export default function LandingPage() {

  return (
    <>
      <nav>
        <NavBar />
      </nav>

      <main className="px-28">
        <SecureButton />

        <section className="flex mt-6 justify-between">
          <div className=" flex-1">
            {/* HEADING  */}
            <div className="font-playfair text-7xl flex flex-col gap-2">
              <div className="text-[#0D393E] font-medium">
                You don't have to
              </div>
              <div className="text-[#0D393E] font-medium">go through this</div>
              <div className="text-[#E77D3C] font-semibold italic">alone.</div>
            </div>

            {/* SUBTEXT */}
            <div className="font-nunito text-2xl mt-6 text-[#3E464E]">
              <div>Thoughtful, personalised therapy that</div>
              <div>fits your life. Anytime, anywhere.</div>
            </div>

            <div className="flex mt-6 gap-12">
              <FindTherapistButton />
              <ExploreResourcesButton />
            </div>

            <div className="mt-8 flex gap-4">
              {tagsData.map((tag) => (
                <Tag
                  color={tag.color}
                  heading={tag.heading}
                  text={tag.text}
                  logo={tag.logo}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 relative">
            <img src="/image.png" alt="image" className="w-full"/>
            <img src="/petal.svg" alt="petal" className="absolute top-5 left-10" />
            <img src="/leaves.svg" alt="petal" className="absolute  bottom-20 -left-20" />
            <div className="absolute shadow-sm bottom-8 left-10 text-xl font-bold w-48 text-[#1A555B] p-4 rounded-xl font-nunito bg-[#F5F1ED]">
              A safe space to be heard.

            </div>

             <div className="absolute shadow-sm top-50 right-5 text-xl w-52 h-72 p-4 rounded-xl font-nunito bg-[#F5F1ED]">
              <div className="relative w-full h-full">
                <div className="w-15 h-15 flex justify-center p-4 bg-[#417C7E] rounded-full">
                <img src="/heart.svg" alt="heart" />
                </div>
                <div className="mt-2 font-bold text-[#1A555B] ">
                  It’s okay to not be okay.
                </div>
                <div className="text-sm font-medium mt-2 text-[#868B8F]">
                  We’re here when you’re ready.
                </div>
                <img src="/leaf2.svg" alt="leaf" className="absolute -bottom-15 right-0 "/>
               </div>

            </div>

          </div>
        </section>
      </main>
    </>
  );
}



const base = "w-48 rounded-full border font-nunito h-12 border-[#0D393E]";

function FindTherapistButton() {
  return (
    <button className={`${base} text-white bg-[#0D393E]`}>
      Find a therapist
    </button>
  );
}
function ExploreResourcesButton() {
  return <button className={`${base}`}>Explore Resources</button>;
}

