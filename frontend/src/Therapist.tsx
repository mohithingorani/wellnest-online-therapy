import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTherapist } from "./services/api";

export default function TherapistPage2() {
  const { id } = useParams<{ id: string }>();
  const [therapist, setTherapist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchTherapist(parseInt(id))
        .then(setTherapist)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-linear-to-b from-[#FFFDF8] to-[#EEFFFF] pt-4">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-[#0D393E]">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !therapist) {
    return (
      <div className="bg-linear-to-b from-[#FFFDF8] to-[#EEFFFF] pt-4">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-red-500">Therapist not found</div>
        </div>
      </div>
    );
  }

  const specialties = therapist.specialities?.map((s: any) => s.name) || [];
  const sessionTypes = therapist.sessionTypes?.map((s: any) => s.name) || [];
  const therapyTypes = therapist.therapyTypes?.map((t: any) => t.name) || [];
  const languages = therapist.languages?.map((l: any) => l.name) || [];

  return (
    <div className="bg-[#FFFDF8]  pt-4 text-[#235C61] font-nunito">
      <main className="px-4 md:px-8 lg:px-18 xl:px-16 2xl:px-24 mt-8">
        {/* HERO SECTION */}
        <section className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
          {/* IMAGE */}
          <div className="relative w-70 md:w-90 opacity-0 animate-fade-in">
            <img
              src="/therapist/bg.svg"
              className="absolute -left-6 top-20 z-0 animate-float"
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
            <div className="flex items-center gap-2 justify-center lg:justify-start opacity-0 animate-fade-in-up">
              <div className="text-xs bg-[#E6F4F1] text-[#0D393E] px-3 py-1 rounded-full">
                Verified Therapist
              </div>
              <div className="text-xs bg-[#E77D3C]/10 text-[#E77D3C] px-3 py-1 rounded-full">
                {therapist.gender || "Gender not specified"}
              </div>
            </div>

            <h1 className="font-playfair text-3xl md:text-5xl text-[#0D393E] font-medium opacity-0 animate-fade-in-up animation-delay-100">
              {therapist.name}
            </h1>

            <p className="text-lg md:text-xl text-[#3E464E] opacity-0 animate-fade-in-up animation-delay-200">
              {therapist.title}
            </p>

            {/* STATS */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-[#5F6C72] opacity-0 animate-fade-in-up animation-delay-300">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                {therapist.experience}+ years experience
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                {Math.floor(therapist.experience * 50)}+ sessions
              </div>
              {languages.length > 0 && (
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H3.828a1 1 0 01-.707-.293L2.293 8H5a1 1 0 110 2H3V3a1 1 0 011-1zm0 6a1 1 0 011 1v1h3a1 1 0 110 2H3.828a1 1 0 01-.707-.293L2.293 12H5a1 1 0 110 2H3v-1a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {languages.join(", ")}
                </div>
              )}
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start opacity-0 animate-fade-in-up animation-delay-400">
              {specialties.slice(0, 5).map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#E6F4F1] text-[#0D393E] rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
              {specialties.length > 5 && (
                <span className="px-3 py-1 bg-[#E6F4F1] text-[#0D393E] rounded-full text-sm">
                  +{specialties.length - 5} more
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-[#3E464E] max-w-xl">
              Hi, I'm {therapist.name?.split(" ")[1] || "there"}. I help adults
              navigate anxiety, overthinking, and life transitions with
              compassion and evidence-based care. Together, we'll work toward
              clarity, healing, and growth.
            </p>

            {/* BUTTONS */}
            <div className="flex gap-4 justify-center lg:justify-start mt-2">
              <button className="bg-[#0D393E] w-50 text-white px-6 py-3 rounded-2xl hover:bg-[#2a5459] transition-all duration-300 shadow-lg hover:shadow-xl flex justify-center items-center gap-2">
                <img width="16" src="/book/calender.svg" alt="" />
                <div>Book a session</div>
              </button>
              <button className="border border-[#0D393E] flex justify-center items-center gap-2 w-50 px-6 py-3 rounded-2xl hover:bg-[#E6F4F1] transition-all duration-300">
                <img src="/book/chat.svg" alt="chat" />
                <div>Message First</div>
                
              </button>
            </div>
          </div>
        </section>

        {/* INFO STRIP */}
        <div className="div flex justify-center w-full">
          <section className="mt-10 grid md:grid-cols-3 w-full md:w-fit gap-4 bg-[#E6F4F6] lg:px-12 p-6 lg:py-6 rounded-2xl">
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
                <div className="text-[#3E464E] text-sm">
                  {sessionTypes.join(", ") || "Not specified"}
                </div>
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

        {/* IS THIS RIGHT FOR YOU */}
        <section className="mt-10 mb-10">
          <div className="bg-[#F8F5F2] rounded-3xl border border-[#E8E2DD] shadow-sm p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#47898E]/10 flex items-center justify-center">
                  <img src="/ticks/leaf.svg" alt="leaf" />
                </div>
                <h2 className="font-playfair text-2xl md:text-3xl text-[#0D393E]">
                  Is this right for you?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F0EBE7] hover:shadow-md transition-all duration-300">
                  <h3 className="font-nunito font-semibold text-[#0D393E] text-lg mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#E77D3C]/10 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-[#E77D3C]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    I can help you with
                  </h3>
                  <ul className="space-y-3">
                    {specialties.slice(0, 5).map((item: string) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#E6F4F1] flex items-center justify-center mt-0.5 shrink-0">
                          <svg
                            className="w-3 h-3 text-[#47898E]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="font-nunito text-[#3E464E]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F0EBE7] hover:shadow-md transition-all duration-300">
                  <h3 className="font-nunito font-semibold text-[#0D393E] text-lg mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#E77D3C]/10 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-[#E77D3C]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </span>
                    I may not be the best fit if
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Need medication management",
                      "In crisis / immediate help",
                      "Prefer quick fixes only",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#FEF3EF] flex items-center justify-center mt-0.5 shrink-0">
                          <svg
                            className="w-3 h-3 text-[#E77D3C]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="font-nunito text-[#3E464E]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* APPROACH SECTION */}
        <section className="mt-10 mb-10">
          <div className="bg-[#F8F5F2] rounded-3xl border border-[#E8E2DD] shadow-sm p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#E77D3C]/10 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-[#E77D3C]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h2 className="font-playfair text-3xl md:text-4xl text-[#0D393E] mb-4">
                  My approach
                </h2>
                <p className="font-nunito text-[#3E464E] text-lg max-w-2xl mx-auto leading-relaxed">
                  My approach is collaborative, compassionate, and tailored to
                  you. I draw from evidence-based methods to help you understand
                  patterns, build coping tools, and create meaningful change.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-10">
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-[#F0EBE7]">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#E77D3C]/10 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-[#E77D3C]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-nunito font-semibold text-[#0D393E] text-lg mb-2">
                    Evidence-based
                  </h3>
                  <p className="font-nunito text-sm text-[#3E464E] leading-relaxed">
                    CBT, mindfulness, and trauma-informed care.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-[#F0EBE7]">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#47898E]/10 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-[#47898E]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <h3 className="font-nunito font-semibold text-[#0D393E] text-lg mb-2">
                    Holistic & Personalized
                  </h3>
                  <p className="font-nunito text-sm text-[#3E464E] leading-relaxed">
                    We address thoughts, emotions, behaviors, and environment.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-[#F0EBE7]">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#E77D3C]/10 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-[#E77D3C]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <h3 className="font-nunito font-semibold text-[#0D393E] text-lg mb-2">
                    Safe & Supportive
                  </h3>
                  <p className="font-nunito text-sm text-[#3E464E] leading-relaxed">
                    A judgment-free space to explore and grow.
                  </p>
                </div>
              </div>

              <div className="text-center mt-10">
                <button className="font-nunito text-[#47898E] hover:text-[#0D393E] font-medium transition-colors duration-200 inline-flex items-center gap-2 group">
                  Learn more about my approach
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* THERAPY APPROACHES */}
        <section className="mt-10 mb-10">
          <h2 className="font-playfair text-2xl text-[#0D393E] mb-6 text-center">
            Therapy Approaches
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {therapyTypes.map((type: string) => (
              <span
                key={type}
                className="px-4 py-2 bg-[#E6F4F1] text-[#0D393E] rounded-full"
              >
                {type}
              </span>
            ))}
            {therapyTypes.length === 0 && (
              <span className="text-[#3E464E]">
                No specific approaches listed
              </span>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

// function ApproachItem({ title, text }: { title: string; text: string }) {
//   return (
//     <div className="flex flex-col gap-2">
//       <div className="w-12 h-12 rounded-full bg-[#E6F4F1] flex items-center justify-center">
//         <div className="w-5 h-5 bg-[#0D393E] rounded-full" />
//       </div>
//       <div className="font-semibold text-[#0D393E]">{title}</div>
//       <div className="text-sm text-[#3E464E]">{text}</div>
//     </div>
//   );
// }

// function ReviewCard({
//   text,
//   name,
//   rating,
// }: {
//   text: string;
//   name: string;
//   rating: number;
// }) {
//   return (
//     <div className="bg-white p-4 rounded-xl shadow-sm">
//       <div className="text-yellow-400 text-sm mb-2">
//         {"★".repeat(rating)}
//         {"☆".repeat(5 - rating)} 5.0
//       </div>
//       <p className="text-[#3E464E] text-sm mb-3">"{text}"</p>
//       <div className="text-sm font-medium text-[#0D393E]">— {name}</div>
//     </div>
//   );
// }
