import { useEffect, useState, useMemo } from "react";
import FiltersSidebar, { type FiltersState } from "../components/FilterSideBar";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import SecureButton from "../components/SecureButton";
import TherapistCard2 from "../components/TherapistCard2";
import { fetchTherapists } from "../services/api";
import type { Therapist } from "../services/api";

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topFilters, setTopFilters] = useState({
    concern: "",
    therapyType: "",
    sessionType: "",
    location: "",
  });
  const [filters, setFilters] = useState<FiltersState>({
    concerns: [],
    therapyApproaches: [],
    sessionType: "",
    gender: "",
  });

  useEffect(() => {
    fetchTherapists()
      .then(setTherapists)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredTherapists = useMemo(() => {
    return therapists.filter((t) => {
      if (topFilters.concern) {
        const therapistConcerns = t.specialities.map((s) => s.name.toLowerCase());
        if (!therapistConcerns.some((tc) => tc.includes(topFilters.concern.toLowerCase()))) {
          return false;
        }
      }

      if (topFilters.therapyType) {
        const therapistTherapyTypes = t.therapyTypes.map((tt) => tt.name.toLowerCase());
        if (!therapistTherapyTypes.includes(topFilters.therapyType.toLowerCase())) {
          return false;
        }
      }

      if (topFilters.sessionType) {
        const sessionTypes = t.sessionTypes.map((s) => s.name.toLowerCase());
        if (!sessionTypes.includes(topFilters.sessionType.toLowerCase())) {
          return false;
        }
      }

      if (filters.concerns.length > 0) {
        const therapistConcerns = t.specialities.map((s) => s.name.toLowerCase());
        const hasMatch = filters.concerns.some((c) =>
          therapistConcerns.some((tc) => tc.includes(c.toLowerCase()))
        );
        if (!hasMatch) return false;
      }

      if (filters.therapyApproaches.length > 0) {
        const therapistTherapyTypes = t.therapyTypes.map((tt) => tt.name.toLowerCase());
        const hasMatch = filters.therapyApproaches.some((a) =>
          therapistTherapyTypes.includes(a.toLowerCase())
        );
        if (!hasMatch) return false;
      }

      if (filters.sessionType) {
        const sessionTypes = t.sessionTypes.map((s) => s.name.toLowerCase());
        if (!sessionTypes.includes(filters.sessionType.toLowerCase())) {
          return false;
        }
      }

      if (filters.gender) {
        if (t.gender.toLowerCase() !== filters.gender.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [therapists, filters, topFilters]);

  return (
    <div className="bg-linear-to-b bg-[#FFFDF8] pt-4">
      <nav className="opacity-0 animate-fade-in">
        <NavBar />
      </nav>

      <main className="px-4 md:px-8 lg:px-18 xl:px-16 2xl:px-24">
        <section className="flex mt-6 justify-between">
          <div className=" flex-1 ">
            <div className="mb-4 opacity-0 animate-fade-in-up">
              <SecureButton />
            </div>
            <div className="font-playfair text-center md:text-start text-4xl md:text-6xl xl:text-7xl flex flex-col gap-2 opacity-0 animate-fade-in-up animation-delay-100">
              <div className="text-[#0D393E] font-medium">
                Find the right
              </div>
              <div className="text-[#E77D3C] font-semibold italic">therapist for you.</div>
            </div>
            <div className="font-nunito text-center md:text-start text-sm md:text-xl 2xl:text-2xl mt-6 text-[#3E464E] opacity-0 animate-fade-in-up animation-delay-200">
              <div>Browse verified therapists and find the perfect</div>
              <div>match for your needs.</div>
            </div>
          </div>
          <div className=" hidden xl:inline-block justify-end">
            <img className=" w-xl" src="/sofa.png" alt="sofa"/>
          </div>
        </section>
        
        <section className="mt-10 opacity-0 animate-fade-in-up animation-delay-300">
          <div className="bg-[#F9F7F5] border border-[#EFEAE7] rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-center">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6B7280] font-nunito">
                  What can we help you with?
                </label>
                <select
                  className="h-12 px-4 rounded-lg border border-[#E5E7EB] bg-white text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all duration-200 cursor-pointer hover:border-[#d1d5db]"
                  value={topFilters.concern}
                  onChange={(e) => setTopFilters((prev) => ({ ...prev, concern: e.target.value }))}
                >
                  <option value="">Select a concern</option>
                  <option value="Anxiety">Anxiety</option>
                  <option value="Depression">Depression</option>
                  <option value="Stress">Stress</option>
                  <option value="Relationship">Relationship Issues</option>
                  <option value="Trauma">Trauma</option>
                  <option value="Burnout">Burnout</option>
                  <option value="Self Esteem">Self Esteem</option>
                  <option value="Panic">Panic Attacks</option>
                  <option value="OCD">OCD</option>
                  <option value="ADHD">ADHD</option>
                  <option value="Grief">Grief</option>
                  <option value="Anger">Anger Management</option>
                  <option value="Social">Social Anxiety</option>
                  <option value="Loneliness">Loneliness</option>
                  <option value="Family">Family Conflict</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6B7280] font-nunito">
                  Therapy type
                </label>
                <select
                  className="h-12 px-4 rounded-lg border border-[#E5E7EB] bg-white text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all duration-200 cursor-pointer hover:border-[#d1d5db]"
                  value={topFilters.therapyType}
                  onChange={(e) => setTopFilters((prev) => ({ ...prev, therapyType: e.target.value }))}
                >
                  <option value="">All therapy types</option>
                  <option value="CBT">CBT</option>
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Psychodynamic">Psychodynamic</option>
                  <option value="Humanistic">Humanistic</option>
                  <option value="Solution-focused">Solution-focused</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6B7280] font-nunito">
                  Session type
                </label>
                <select
                  className="h-12 px-4 rounded-lg border border-[#E5E7EB] bg-white text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all duration-200 cursor-pointer hover:border-[#d1d5db]"
                  value={topFilters.sessionType}
                  onChange={(e) => setTopFilters((prev) => ({ ...prev, sessionType: e.target.value }))}
                >
                  <option value="">All session types</option>
                  <option value="Online">Video</option>
                  <option value="Offline">In-person</option>
                  <option value="Chat">Chat</option>
                  <option value="Group">Group</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6B7280] font-nunito">
                  Location / Language
                </label>
                <select
                  className="h-12 px-4 rounded-lg border border-[#E5E7EB] bg-white text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all duration-200 cursor-pointer hover:border-[#d1d5db]"
                  value={topFilters.location}
                  onChange={(e) => setTopFilters((prev) => ({ ...prev, location: e.target.value }))}
                >
                  <option value="">All</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  className="w-full h-12 rounded-lg font-nunito bg-[#0D393E] text-white font-medium flex items-center justify-center gap-3 hover:bg-[#2a5459] hover:shadow-lg transition-all duration-300"
                  onClick={() => {
                    setTopFilters({ concern: "", therapyType: "", sessionType: "", location: "" });
                    setFilters({ concerns: [], therapyApproaches: [], sessionType: "", gender: "" });
                  }}
                >
                  <img src="/search.svg" alt="search" />
                  <div>Clear</div>
                </button>
              </div>
            </div>
          </div>
        </section> 

        <section className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="hidden lg:block lg:col-span-1">
              <FiltersSidebar filters={filters} setFilters={setFilters} />
            </div>
            <div className="col-span-1 lg:col-span-3 flex flex-col gap-4 opacity-0 animate-fade-in-up animation-delay-400">
              {loading && <div className="text-center py-8">Loading...</div>}
              {error && <div className="text-center py-8 text-red-500">{error}</div>}
              {!loading && !error && filteredTherapists.length === 0 && (
                <div className="text-center py-8 text-gray-500">No therapists match your filters</div>
              )}
              {!loading && !error && filteredTherapists.map((t, i) => (
                <div key={t.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${500 + i * 100}ms` }}>
                  <TherapistCard2
                    id={t.id}
                    name={t.name}
                    experience={t.experience}
                    specialities={t.specialities.map((s) => s.name)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main> 
      <Footer/>
    </div>
  );
}