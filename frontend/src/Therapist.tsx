import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import Tag from "./components/Tag";

export default function TherapistPage2() {
  return (
    <div className="bg-linear-to-b from-[#FFFDF8] to-[#EEFFFF] pt-4 text-[#235C61]">
      <NavBar />

      <main className="px-4 md:px-8 lg:px-18 xl:px-16 2xl:px-24 mt-8">
        {/* HERO SECTION */}
        <section className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
          {/* IMAGE */}
          <div className="relative w-[280px] md:w-[360px]">
            <img
              src="/therapist/bg.svg"
              className="absolute -left-6 top-20 z-0"
              alt="bg"
            />
            <img
              src="/therapist/person.png"
              className="relative z-10 rounded-3xl"
              alt="therapist"
            />
          </div>

          {/* INFO */}
          <div className="flex-1 flex flex-col gap-4 text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <div className="text-xs bg-[#E6F4F1] text-[#0D393E] px-3 py-1 rounded-full">
                Verified Therapist
              </div>
            </div>

            <h1 className="font-playfair text-3xl md:text-5xl text-[#0D393E] font-medium">
              Dr. Ananya Sharma
            </h1>

            <p className="text-lg md:text-xl text-[#3E464E]">
              Clinical Psychologist
            </p>

            {/* STATS */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-[#5F6C72]">
              <div>8+ years experience</div>
              <div>5000+ sessions</div>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {["Anxiety", "Depression", "Stress", "Trauma", "Self-esteem"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#E6F4F1] text-[#0D393E] rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-[#3E464E] max-w-xl">
              Hi, I’m Ananya. I help adults navigate anxiety, overthinking, and
              life transitions with compassion and evidence-based care.
              Together, we’ll work toward clarity, healing, and growth.
            </p>

            {/* BUTTONS */}
            <div className="flex gap-4 justify-center lg:justify-start mt-2">
              <button className="bg-[#0D393E] w-50 text-white px-6 py-3 rounded-2xl">
                Book a session
              </button>
              <button className="border border-[#0D393E] w-50 px-6 py-3 rounded-2xl">
                Message first
              </button>
            </div>
          </div>
        </section>

        {/* INFO STRIP */}
        <div className="div flex justify-center w-full">
          <section className="mt-10 grid md:grid-cols-3 w-full md:w-fit gap-4 bg-[#E6F4F6] lg:px-24 p-6 lg:py-12 rounded-2xl">
            {/* ITEM 1 */}
            <div className="flex items-center gap-4">
              <div className="bg-[#c5e1ea] w-12 h-12 rounded-full flex justify-center items-center">
                <img src="/info/calender.svg" alt="calendar" />
              </div>
              <div>
                <div className="font-semibold text-[#0D393E]">
                  Next available
                </div>
                <div className="text-[#3E464E] text-sm">Today, 6:30 PM</div>
              </div>
            </div>

            {/* ITEM 2 */}
            <div className="flex items-center gap-4">
              <div className="bg-[#c5e1ea] w-12 h-12 rounded-full flex justify-center items-center">
                <img src="/info/camera.svg" alt="session type" />
              </div>
              <div>
                <div className="font-semibold text-[#0D393E]">Session type</div>
                <div className="text-[#3E464E] text-sm">Video, In person</div>
              </div>
            </div>

            {/* ITEM 3 */}
            <div className="flex items-center gap-4">
              <div className="bg-[#c5e1ea] w-12 h-12 rounded-full flex justify-center items-center">
                <img src="/info/secure.svg" alt="confidential" />
              </div>
              <div>
                <div className="font-semibold text-[#0D393E]">
                  100% Confidential
                </div>
                <div className="text-[#3E464E] text-sm">
                  Your privacy is our priority
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* LOWER SECTION */}
        <section className="mt-10 bg-[#F1F2F1] grid lg:grid-cols-2 gap-8 rounded-2xl">
          {/* LEFT */}
          <div className=" p-6 ">
            <div className="lg:border-r border-black/10">
            <div className="flex justify-start items-center mb-4 gap-2">
            <img src="/ticks/leaf.svg" alt="leaf"/>
            <h2 className="font-playfair text-2xl text-[#0D393E] ">
              Is this right for you?
            </h2>
</div>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                
                <h3 className="font-semibold mb-2">I can help you with</h3>
                <ul className="space-y-3 text-[#3E464E]">
                  {[
                    "Anxiety & overthinking",
                    "Stress & burnout",
                    "Relationship challenges",
                    "Life transitions",
                    "Low self-esteem",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <img src="/ticks/tick.svg" alt="tick" className="mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  I may not be the best fit if
                </h3>
                <ul className="space-y-3 text-[#3E464E]">
                  {[
                    "Need medication management",
                    "In crisis / immediate help",
                    "Prefer quick fixes only",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <img
                        src="/ticks/cross.svg" // use a cross icon instead of tick
                        alt="not suitable"
                        className="mt-1 shrink-0"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className=" p-6 ">
            <h2 className="font-playfair text-2xl text-[#0D393E] mb-4">
              Get to know me
            </h2>

            <div className="rounded-xl overflow-hidden">
              <img src="/therapist/video.png" alt="video" className="w-full" />
            </div>
          </div>
        </section>
        {/* APPROACH + REVIEWS */}
        <section className="mt-10 bg-[#F5F1ED] rounded-2xl p-6 md:p-8 grid lg:grid-cols-2 gap-8">
          {/* LEFT - APPROACH */}
          <div>
            <h2 className="font-playfair text-2xl text-[#0D393E] mb-4">
              My approach
            </h2>

            <p className="text-[#3E464E] mb-6 max-w-xl">
              My approach is collaborative, compassionate, and tailored to you.
              I draw from evidence-based methods to help you understand
              patterns, build coping tools, and create meaningful change.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              <ApproachItem
                title="Evidence-based"
                text="CBT, mindfulness, and trauma-informed care."
              />

              <ApproachItem
                title="Holistic & Personalized"
                text="We address thoughts, emotions, behaviors, and environment."
              />

              <ApproachItem
                title="Safe & Supportive"
                text="A judgment-free space to explore and grow."
              />
            </div>

            <button className="mt-6 text-[#0D393E] font-medium">
              Learn more about my approach →
            </button>
          </div>

          {/* RIGHT - REVIEWS */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-playfair text-2xl text-[#0D393E]">
                What clients say
              </h2>

              <button className="text-sm text-[#0D393E]">
                View all reviews →
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <ReviewCard
                text="Ananya is warm, understanding, and an amazing listener. I always leave our sessions feeling lighter and more in control."
                name="Riya S."
              />

              <ReviewCard
                text="I was nervous about starting therapy, but Ananya made me feel comfortable from day one. Highly recommend!"
                name="Karan M."
              />
            </div>

            {/* dots */}
            <div className="flex gap-2 mt-4 justify-center lg:justify-start">
              <span className="w-2 h-2 bg-[#0D393E] rounded-full"></span>
              <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
              <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
              <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
function ApproachItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-12 h-12 rounded-full bg-[#E6F4F1] flex items-center justify-center">
        {/* replace with icons later */}
        <div className="w-5 h-5 bg-[#0D393E] rounded-full" />
      </div>
      <div className="font-semibold text-[#0D393E]">{title}</div>
      <div className="text-sm text-[#3E464E]">{text}</div>
    </div>
  );
}

function ReviewCard({ text, name }: { text: string; name: string }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="text-yellow-400 text-sm mb-2">★★★★★ 5.0</div>
      <p className="text-[#3E464E] text-sm mb-3">“{text}”</p>
      <div className="text-sm font-medium text-[#0D393E]">— {name}</div>
    </div>
  );
}
