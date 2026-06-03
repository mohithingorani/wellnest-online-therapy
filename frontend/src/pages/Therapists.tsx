import { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import FiltersSidebar, { type FiltersState } from "../components/FilterSideBar";
import SecureButton from "../components/SecureButton";
import TherapistCard2 from "../components/TherapistCard2";
import TherapistCardSkeleton from "../components/TherapistCardSkeleton";
import { fetchTherapists } from "../services/api";
import type { Therapist } from "../services/api";

export default function TherapistsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [topFilters, setTopFilters] = useState({
    concern: searchParams.get("concern") || "",
    therapyType: searchParams.get("therapy") || "",
    sessionType: searchParams.get("session") || "",
    language: searchParams.get("language") || "",
    location: "",
  });
  const [filters, setFilters] = useState<FiltersState>({
    concerns: [],
    therapyApproaches: [],
    sessionType: "",
    gender: "",
  });

  const loadTherapists = () => {
    setLoading(true);
    setError("");
    fetchTherapists()
      .then(setTherapists)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTherapists(); }, []);

  // Keep shareable filters in the URL (so /therapists?concern=Anxiety works).
  useEffect(() => {
    const p: Record<string, string> = {};
    if (search) p.q = search;
    if (topFilters.concern) p.concern = topFilters.concern;
    if (topFilters.therapyType) p.therapy = topFilters.therapyType;
    if (topFilters.sessionType) p.session = topFilters.sessionType;
    if (topFilters.language) p.language = topFilters.language;
    setSearchParams(p, { replace: true });
  }, [search, topFilters, setSearchParams]);

  const filteredTherapists = useMemo(() => {
    return therapists.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        const hay = [t.name, t.title, ...t.specialities.map((s) => s.name)].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }

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

      if (topFilters.language) {
        const therapistLanguages = t.languages.map((l) => l.name.toLowerCase());
        if (!therapistLanguages.includes(topFilters.language.toLowerCase())) {
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
  }, [therapists, filters, topFilters, search]);

  // Stable clear-all handler
  const clearAll = useCallback(() => {
    setSearch("");
    setTopFilters({ concern: "", therapyType: "", sessionType: "", language: "", location: "" });
    setFilters({ concerns: [], therapyApproaches: [], sessionType: "", gender: "" });
  }, []);

  // Removable active-filter chips — memoized so children don't re-render on unrelated state changes
  const activeChips = useMemo(() => {
    const chips: { label: string; clear: () => void }[] = [];
    if (search) chips.push({ label: `"${search}"`, clear: () => setSearch("") });
    (["concern", "therapyType", "sessionType", "language"] as const).forEach((k) => {
      if (topFilters[k]) chips.push({ label: topFilters[k], clear: () => setTopFilters((p) => ({ ...p, [k]: "" })) });
    });
    filters.concerns.forEach((c) => chips.push({ label: c, clear: () => setFilters((p) => ({ ...p, concerns: p.concerns.filter((x) => x !== c) })) }));
    filters.therapyApproaches.forEach((a) => chips.push({ label: a, clear: () => setFilters((p) => ({ ...p, therapyApproaches: p.therapyApproaches.filter((x) => x !== a) })) }));
    if (filters.gender) chips.push({ label: filters.gender, clear: () => setFilters((p) => ({ ...p, gender: "" })) });
    if (filters.sessionType) chips.push({ label: filters.sessionType, clear: () => setFilters((p) => ({ ...p, sessionType: "" })) });
    return chips;
  }, [search, topFilters, filters]);

  const hasActiveFilters =
    Object.values(topFilters).some(Boolean) ||
    filters.concerns.length > 0 ||
    filters.therapyApproaches.length > 0 ||
    !!filters.sessionType ||
    !!filters.gender;

  return (
    <div className="bg-bg min-h-screen pt-4">
      <main className="px-4 md:px-8 lg:px-16 2xl:px-24">
        <section className="flex mt-6 justify-between gap-8">
          <div className=" flex-1 ">
            <div className="mb-4 opacity-0 animate-fade-in-up">
              <SecureButton />
            </div>
            <div className="font-display text-center md:text-start text-4xl md:text-6xl xl:text-7xl flex flex-col gap-2 opacity-0 animate-fade-in-up animation-delay-100">
              <div className="text-fg-strong font-medium">
                Find the right
              </div>
              <div className="text-accent font-semibold italic">therapist for you.</div>
            </div>
            <div className="font-body text-center md:text-start text-sm md:text-xl 2xl:text-2xl mt-6 text-fg opacity-0 animate-fade-in-up animation-delay-200">
              <div>Browse verified therapists and find the perfect</div>
              <div>match for your needs.</div>
            </div>
          </div>
          <div className=" hidden xl:inline-block justify-end">
            <img className="w-xl" src="/sofa.png" alt="" loading="lazy" decoding="async" />
          </div>
        </section>
        
        <section className="mt-10 opacity-0 animate-fade-in-up animation-delay-300">
          <div className="bg-surface-2 border border-border rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-fg-muted font-body">
                  What can we help you with?
                </label>
                <select
                  className="h-12 px-4 rounded-lg border border-border bg-surface text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-200 cursor-pointer hover:border-border"
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
                <label className="text-xs text-fg-muted font-body">
                  Therapy type
                </label>
                <select
                  className="h-12 px-4 rounded-lg border border-border bg-surface text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-200 cursor-pointer hover:border-border"
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
                <label className="text-xs text-fg-muted font-body">
                  Session type
                </label>
                <select
                  className="h-12 px-4 rounded-lg border border-border bg-surface text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-200 cursor-pointer hover:border-border"
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
                <label className="text-xs text-fg-muted font-body">
                  Language
                </label>
                <select
                  className="h-12 px-4 rounded-lg border border-border bg-surface text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-200 cursor-pointer hover:border-border"
                  value={topFilters.language}
                  onChange={(e) => setTopFilters((prev) => ({ ...prev, language: e.target.value }))}
                >
                  <option value="">All languages</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Marathi">Marathi</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  disabled={!hasActiveFilters}
                  className="w-full h-12 rounded-lg font-body border border-fg-strong text-fg-strong font-medium flex items-center justify-center gap-2 hover:bg-fg-strong/5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => {
                    setTopFilters({ concern: "", therapyType: "", sessionType: "", language: "", location: "" });
                    setFilters({ concerns: [], therapyApproaches: [], sessionType: "", gender: "" });
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <div>Clear filters</div>
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
            <div className="col-span-1 lg:col-span-3">
              {/* search */}
              <div className="mb-4 mt-2 flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
                  </span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or specialty…"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-surface text-sm text-fg-strong placeholder:text-fg-muted/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/12 transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowMobileFilters((v) => !v)}
                  className="lg:hidden h-11 flex items-center gap-2 text-sm font-medium text-fg-strong border border-border bg-surface rounded-xl px-4 hover:border-accent transition-colors"
                >
                  <img src="/filter.svg" alt="" className="w-4 h-4" />
                  Filters
                </button>
              </div>

              <div className="mb-5 flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-sm text-fg-muted">
                  Showing <span className="font-semibold text-fg-strong">{filteredTherapists.length}</span>
                  {filteredTherapists.length !== therapists.length && <> of {therapists.length}</>} therapist{filteredTherapists.length !== 1 ? "s" : ""}
                </h2>
              </div>

              {/* active filter chips */}
              {activeChips.length > 0 && (
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  {activeChips.map((c, i) => (
                    <button key={i} onClick={c.clear} className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full bg-clay-50 text-clay-700 border border-clay-100 pl-3 pr-2 py-1.5 hover:bg-clay-100 transition-colors">
                      {c.label}
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  ))}
                  <button onClick={clearAll} className="text-xs font-medium text-fg-muted hover:text-accent transition-colors ml-1">Clear all</button>
                </div>
              )}

              {/* Mobile filters (collapsible) */}
              {showMobileFilters && (
                <div className="lg:hidden mb-6">
                  <FiltersSidebar filters={filters} setFilters={setFilters} />
                </div>
              )}
              <div className={`flex flex-col gap-4 ${loading ? '' : 'opacity-0 animate-fade-in-up animation-delay-400'}`}>
              {loading && <TherapistCardSkeleton />}
              {error && (
                <div className="surface-raised rounded-2xl text-center py-12 px-6">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-error/10 grid place-items-center text-error">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                  </div>
                  <p className="mt-4 font-semibold text-fg-strong">Couldn't load therapists</p>
                  <p className="mt-1 text-sm text-fg-muted">{error}</p>
                  <button onClick={loadTherapists} className="mt-4 h-10 px-5 rounded-full bg-accent text-primary-fg text-sm font-semibold hover:bg-accent-hover transition-colors">Try again</button>
                </div>
              )}
              {!loading && !error && filteredTherapists.length === 0 && (
                <div className="surface-raised rounded-2xl text-center py-14 px-6">
                  <div className="mx-auto w-12 h-12 rounded-2xl surface-inset grid place-items-center text-accent">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
                  </div>
                  <p className="mt-4 font-semibold text-fg-strong">No therapists match your filters</p>
                  <p className="mt-1 text-sm text-fg-muted">Try broadening your search or clearing a few filters.</p>
                  <button onClick={clearAll} className="mt-4 h-10 px-5 rounded-full bg-accent text-primary-fg text-sm font-semibold hover:bg-accent-hover transition-colors">Clear filters</button>
                </div>
              )}
              {!loading && !error && filteredTherapists.map((t, i) => (
                <div key={t.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${500 + i * 100}ms` }}>
                  <TherapistCard2
                    id={t.id}
                    name={t.name}
                    title={t.title}
                    experience={t.experience}
                    specialities={t.specialities.map((s) => s.name)}
                    languages={t.languages.map((l) => l.name)}
                  />
                </div>
              ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}