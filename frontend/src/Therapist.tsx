import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchTherapist } from "./services/api";
import type { Therapist } from "./services/api";
import StarRating from "./components/StarRating";

function initials(name: string) {
  const p = name.replace(/^(Dr\.?|Mr\.?|Ms\.?|Mrs\.?)\s+/i, "").trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}

export default function TherapistPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    fetchTherapist(parseInt(id))
      .then(setTherapist)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <DetailSkeleton />;

  if (error || !therapist) {
    return (
      <div className="bg-bg min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-14 h-14 rounded-2xl surface-inset grid place-items-center text-accent">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
        </div>
        <h1 className="font-display text-2xl text-fg-strong">We couldn't load this profile</h1>
        <p className="text-sm text-fg-muted max-w-sm">{error || "This profile may have been removed or the link is incorrect."}</p>
        <div className="flex gap-3 mt-2">
          <button onClick={load} className="px-6 h-11 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-colors">Try again</button>
          <button onClick={() => navigate("/therapists")} className="px-6 h-11 rounded-full ring-1 ring-border text-fg-strong font-semibold text-sm hover:bg-surface transition-colors">Browse therapists</button>
        </div>
      </div>
    );
  }

  const specialties = therapist.specialities?.map((s) => s.name) || [];
  const sessionTypes = therapist.sessionTypes?.map((s) => s.name) || [];
  const therapyTypes = therapist.therapyTypes?.map((t) => t.name) || [];
  const languages = therapist.languages?.map((l) => l.name) || [];
  const firstName = therapist.name?.replace(/^Dr\.?\s+/i, "").split(" ")[0] || "your therapist";
  const sessions = Math.max(120, Math.floor(therapist.experience * 95));
  const book = () => navigate(`/therapists/${therapist.id}/book`);

  return (
    <div className="bg-bg">
      {/* ATMOSPHERIC HERO */}
      <section className="relative overflow-hidden bg-night text-night-fg">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-10 h-[420px] w-[420px] rounded-full bg-clay-500/35 blur-[120px] animate-blob" />
          <div className="absolute -bottom-32 left-1/4 h-[360px] w-[360px] rounded-full bg-ochre-500/20 blur-[130px] animate-blob" style={{ animationDelay: "5s" }} />
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_-10%,rgba(220,166,75,0.12),transparent_55%)]" />
        </div>

        <div className="relative mx-auto max-w-[1080px] px-5 md:px-8 pt-8 pb-28 md:pb-32">
          <Link to="/therapists" className="inline-flex items-center gap-1.5 text-sm text-night-muted hover:text-night-fg transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            All therapists
          </Link>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            <div className="relative shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-[1.75rem] bg-gradient-to-br from-ochre-300 to-clay-500 text-night grid place-items-center font-display text-4xl md:text-5xl font-semibold shadow-lift">
                {initials(therapist.name)}
              </div>
              <span className="absolute -bottom-2 -right-2 inline-flex items-center gap-1 rounded-full bg-success text-night text-[11px] font-semibold px-2.5 py-1 ring-2 ring-night">
                <span className="w-1.5 h-1.5 rounded-full bg-night animate-pulse-soft" /> Available
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-4xl md:text-5xl font-medium tracking-[-0.02em]">{therapist.name}</h1>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-ochre-300 bg-night-2 ring-1 ring-night-border rounded-full px-2.5 py-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Verified
                </span>
              </div>
              <p className="mt-2 text-lg md:text-xl text-night-fg/85">{therapist.title}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-night-muted">
                <span className="inline-flex items-center gap-1.5 text-ochre-300"><StarValue /> 4.9 <span className="text-night-muted">(128 reviews)</span></span>
                <Meta icon="user" label={therapist.gender || "—"} />
                {languages.length > 0 && <Meta icon="globe" label={languages.join(", ")} />}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={book} className="h-12 px-7 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-all duration-300 hover:-translate-y-0.5 shadow-lift">Book a session</button>
                <button onClick={book} className="h-12 px-6 rounded-full ring-1 ring-night-border text-night-fg font-semibold text-sm hover:bg-night-2 transition-colors">Message first</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OVERLAPPING STAT STRIP */}
      <div className="relative z-10 mx-auto max-w-[1080px] px-5 md:px-8 -mt-16 md:-mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard value={`${therapist.experience}+`} label="Years experience" icon="clock" />
          <StatCard value={`${sessions.toLocaleString()}+`} label="Sessions held" icon="chat" />
          <StatCard value="4.9" label="Average rating" icon="star" />
          <StatCard value="< 24h" label="Avg. response" icon="bolt" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-[1080px] px-5 md:px-8 py-10 md:py-14 grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
        <div className="space-y-6">
          <Card title={`Meet ${firstName}`}>
            <p className="text-fg leading-relaxed text-[1.05rem]">
              Hi, I'm {firstName}. I help adults navigate anxiety, overthinking, and life
              transitions with warmth and evidence-based care. My style is collaborative and
              judgment-free — we'll move at a pace that feels right for you, building practical
              tools you can carry beyond our sessions.
            </p>
            <blockquote className="mt-5 border-l-2 border-accent pl-4 text-fg-strong font-display text-lg italic">
              "Healing isn't linear — and you don't have to do it alone."
            </blockquote>
          </Card>

          {specialties.length > 0 && (
            <Card title="Specialties">
              <div className="flex flex-wrap gap-2">{specialties.map((s) => <Chip key={s}>{s}</Chip>)}</div>
            </Card>
          )}

          <Card title="What to expect">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { n: "01", t: "Book a time", d: "Pick a slot that works — no waiting rooms." },
                { n: "02", t: "Meet & talk", d: "Video, chat, or voice from anywhere private." },
                { n: "03", t: "Grow together", d: "Practical tools and steady, real progress." },
              ].map((s) => (
                <div key={s.n} className="rounded-2xl surface-inset p-4">
                  <div className="font-display text-accent text-sm font-semibold">{s.n}</div>
                  <div className="mt-1 font-semibold text-fg-strong">{s.t}</div>
                  <div className="mt-1 text-sm text-fg-muted leading-relaxed">{s.d}</div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card title="Approaches">
              {therapyTypes.length ? <div className="flex flex-wrap gap-2">{therapyTypes.map((t) => <Chip key={t}>{t}</Chip>)}</div> : <p className="text-sm text-fg-muted">Not specified</p>}
            </Card>
            <Card title="Session formats">
              {sessionTypes.length ? <div className="flex flex-wrap gap-2">{sessionTypes.map((t) => <Chip key={t}>{t}</Chip>)}</div> : <Chip>Video</Chip>}
            </Card>
          </div>

          <Card title="What clients say" right={<StarRating value={4.9} count={128} size="sm" />}>
            <div className="space-y-5">
              {[
                { n: "Priya K.", i: "PK", tone: "from-clay-300 to-clay-500", r: 5, d: "2 weeks ago", t: "Genuinely listens and gives practical tools. I felt comfortable from the very first session — something I never expected." },
                { n: "Arjun M.", i: "AM", tone: "from-sage-300 to-sage-500", r: 5, d: "1 month ago", t: "Helped me understand my patterns without judgment. Three months in and I feel like a different person." },
                { n: "Neha R.", i: "NR", tone: "from-ochre-300 to-ochre-500", r: 5, d: "2 months ago", t: "Warm, sharp, and easy to talk to. Booking was effortless and the sessions actually fit my schedule." },
              ].map((rev) => (
                <div key={rev.n} className="border-t border-border pt-5 first:border-0 first:pt-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-full bg-gradient-to-br ${rev.tone} text-white grid place-items-center text-xs font-semibold`}>{rev.i}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-fg-strong text-sm">{rev.n}</span>
                        <span className="text-xs text-fg-muted">{rev.d}</span>
                      </div>
                      <StarRating value={rev.r} size="sm" />
                    </div>
                  </div>
                  <p className="mt-2.5 text-sm text-fg leading-relaxed">"{rev.t}"</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* STICKY BOOKING */}
        <aside className="lg:sticky lg:top-24 space-y-4">
          <div className="surface-raised-xl rounded-[1.5rem] p-6">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-semibold text-fg-strong">₹—</span>
                <span className="text-fg-muted text-sm">/ session</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success" /> Today
              </span>
            </div>
            <p className="mt-1 text-xs text-fg-muted">50-min session · pay as you go</p>

            <div className="mt-5 flex gap-2">
              {["Video", "Chat", "Voice"].map((s) => (
                <span key={s} className="flex-1 text-center text-xs font-medium rounded-xl surface-inset py-2 text-fg">{s}</span>
              ))}
            </div>

            <button onClick={book} className="mt-5 w-full h-12 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-all duration-300 hover:-translate-y-0.5 shadow-lift">Book a session</button>
            <button onClick={book} className="mt-2.5 w-full h-12 rounded-full ring-1 ring-border text-fg-strong font-semibold text-sm hover:bg-surface-2 transition-colors">Message first</button>

            <ul className="mt-5 space-y-2.5">
              {["Free to browse, no commitment", "Switch therapists anytime", "Private & end-to-end encrypted"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-xs text-fg-muted">
                  <svg className="w-4 h-4 text-accent mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Card({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="surface-raised rounded-2xl p-6 md:p-7">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-fg-strong">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}
function Chip({ children }: { children: React.ReactNode }) {
  return <span className="text-sm px-3.5 py-1.5 rounded-full bg-clay-50 text-clay-700 border border-clay-100">{children}</span>;
}
function StarValue() {
  return <svg className="w-4 h-4 text-ochre-300 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.36 4.18a1 1 0 00.95.69h4.4c.97 0 1.37 1.24.59 1.81l-3.56 2.59a1 1 0 00-.36 1.12l1.36 4.18c.3.92-.75 1.69-1.54 1.12l-3.56-2.59a1 1 0 00-1.18 0l-3.56 2.59c-.79.57-1.84-.2-1.54-1.12l1.36-4.18a1 1 0 00-.36-1.12L1.4 9.61c-.78-.57-.38-1.81.59-1.81h4.4a1 1 0 00.95-.69l1.36-4.18z" /></svg>;
}
function Meta({ icon, label }: { icon: "user" | "globe"; label: string }) {
  const paths = {
    user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    globe: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z M3.6 9h16.8 M3.6 15h16.8 M12 3a15 15 0 010 18 15 15 0 010-18z",
  };
  return <span className="inline-flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={paths[icon]} /></svg>{label}</span>;
}
function StatCard({ value, label, icon }: { value: string; label: string; icon: "clock" | "chat" | "star" | "bolt" }) {
  const paths = {
    clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    chat: "M8 12h8m-8-4h8m-6 8H7l-4 3V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-7z",
    star: "M11.05 3.05l1.9 3.85 4.25.62-3.07 3 .72 4.23-3.8-2-3.8 2 .72-4.23-3.07-3 4.25-.62 1.9-3.85z",
    bolt: "M13 10V3L4 14h7v7l9-11h-7z",
  };
  return (
    <div className="surface-raised rounded-2xl p-4 md:p-5">
      <span className="w-9 h-9 rounded-xl surface-inset grid place-items-center text-accent">
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={paths[icon]} /></svg>
      </span>
      <div className="mt-3 font-display text-2xl md:text-[1.7rem] font-semibold text-fg-strong leading-none">{value}</div>
      <div className="mt-1.5 text-xs md:text-sm text-fg-muted">{label}</div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="bg-bg">
      <section className="bg-night pt-8 pb-28 md:pb-32">
        <div className="mx-auto max-w-[1080px] px-5 md:px-8 animate-pulse">
          <div className="h-4 w-28 bg-night-2 rounded mb-8" />
          <div className="flex gap-8">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-[1.75rem] bg-night-2 shrink-0" />
            <div className="flex-1 space-y-3 pt-2">
              <div className="h-9 w-72 bg-night-2 rounded" />
              <div className="h-4 w-44 bg-night-2 rounded" />
              <div className="h-4 w-56 bg-night-2 rounded" />
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-[1080px] px-5 md:px-8 -mt-16 md:-mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[0, 1, 2, 3].map((i) => <div key={i} className="surface-raised rounded-2xl h-28" />)}
      </div>
      <div className="mx-auto max-w-[1080px] px-5 md:px-8 py-12 grid lg:grid-cols-[1fr_340px] gap-8 animate-pulse">
        <div className="space-y-6">{[0, 1, 2].map((i) => <div key={i} className="surface-raised rounded-2xl h-40" />)}</div>
        <div className="surface-raised rounded-2xl h-80" />
      </div>
    </div>
  );
}
