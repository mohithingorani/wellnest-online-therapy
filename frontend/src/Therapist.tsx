import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchTherapist } from "./services/api";
import type { Therapist } from "./services/api";
import { messagesService } from "./services/messages";
import StarRating from "./components/StarRating";

function initials(name: string) {
  const p = name.replace(/^(Dr\.?|Mr\.?|Ms\.?|Mrs\.?)\s+/i, "").trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}

/* ── tiny helpers ────────────────────────────────────────────── */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center text-sm font-medium px-4 py-2 rounded-full bg-surface-2 text-fg border border-border/60">
      {children}
    </span>
  );
}
function HeroChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center text-sm font-medium px-4 py-2 rounded-full bg-white/10 text-night-fg border border-white/12">
      {children}
    </span>
  );
}
function Check() {
  return (
    <svg className="w-4 h-4 text-accent mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
function StarFilled() {
  return <svg className="w-3.5 h-3.5 text-ochre-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.36 4.18a1 1 0 00.95.69h4.4c.97 0 1.37 1.24.59 1.81l-3.56 2.59a1 1 0 00-.36 1.12l1.36 4.18c.3.92-.75 1.69-1.54 1.12l-3.56-2.59a1 1 0 00-1.18 0l-3.56 2.59c-.79.57-1.84-.2-1.54-1.12l1.36-4.18a1 1 0 00-.36-1.12L1.4 9.61c-.78-.57-.38-1.81.59-1.81h4.4a1 1 0 00.95-.69l1.36-4.18z" /></svg>;
}
function Stars({ n = 5 }: { n?: number }) {
  return <span className="inline-flex gap-0.5">{Array.from({ length: n }).map((_, i) => <StarFilled key={i} />)}</span>;
}

/* ─────────────────────────────────────────────────────────────── */
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
  const messageTherapist = async () => {
    try { await messagesService.createConversation(therapist.id); } catch { /* ok */ }
    navigate("/messages");
  };

  return (
    <div className="bg-bg pb-24 lg:pb-0">

      {/* ══════════════════ HERO ══════════════════════════════════ */}
      <section className="relative overflow-hidden bg-night text-night-fg">
        {/* Clean radial gradient — no heavy animated blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-10%,rgba(219,172,82,0.1),transparent_60%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_100%,rgba(88,122,79,0.08),transparent_60%)]" />

        <div className="relative mx-auto max-w-[1080px] px-5 md:px-8 pt-7 pb-10 md:pb-12">
          {/* Back link */}
          <Link to="/therapists" className="inline-flex items-center gap-1.5 text-[13px] text-night-muted hover:text-night-fg transition-colors mb-7">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            All therapists
          </Link>

          <div className="flex flex-col sm:flex-row gap-5 sm:gap-7 items-start">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[1.5rem] bg-gradient-to-br from-sage-400 to-sage-600 text-white grid place-items-center font-display text-5xl md:text-6xl font-semibold shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
                {initials(therapist.name)}
              </div>
              <span className="absolute -bottom-2 -right-2 inline-flex items-center gap-1 rounded-full bg-success text-white text-[11px] font-bold px-2.5 py-1 shadow-soft">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-soft" /> Available
              </span>
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-[2.4rem] md:text-[3.2rem] font-medium tracking-[-0.025em] leading-[1.05]">
                  {therapist.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sage-300 bg-sage-500/15 ring-1 ring-sage-400/20 rounded-full px-2.5 py-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Verified
                </span>
              </div>
              <p className="mt-1.5 text-[1.2rem] text-night-fg/80">{therapist.title}</p>

              {/* Inline meta — no separate stat cards */}
              <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.95rem] text-night-muted">
                <span className="flex items-center gap-1.5 text-ochre-300 font-semibold">
                  <Stars />&nbsp;4.9 <span className="text-night-muted font-normal">(128 reviews)</span>
                </span>
                <span className="h-3 w-px bg-night-border hidden sm:block" />
                <span>{therapist.experience}+ yrs experience</span>
                <span className="h-3 w-px bg-night-border hidden sm:block" />
                {languages.length > 0 && <span>{languages.slice(0, 2).join(", ")}</span>}
                {therapist.gender && <><span className="h-3 w-px bg-night-border hidden sm:block" /><span>{therapist.gender}</span></>}
              </div>

              {/* Top specialties in hero */}
              {specialties.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {specialties.slice(0, 4).map((s) => <HeroChip key={s}>{s}</HeroChip>)}
                  {specialties.length > 4 && <HeroChip>+{specialties.length - 4} more</HeroChip>}
                </div>
              )}

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={book} className="h-13 px-8 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-all duration-300 shadow-[0_6px_16px_-6px_rgba(192,97,63,0.6)]">
                  Book a session
                </button>
                <button onClick={messageTherapist} className="h-13 px-8 rounded-full ring-1 ring-night-border text-night-fg font-semibold text-sm hover:bg-night-2 transition-colors">
                  Message first
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ CONTENT ═══════════════════════════════ */}
      <div className="mx-auto max-w-[1080px] px-5 md:px-8 py-8 md:py-10 grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-10 items-start">

        {/* ── MAIN COLUMN ── */}
        <div className="divide-y divide-border/50">

          {/* §1 About */}
          <section className="pb-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-fg-muted mb-5">About {firstName}</p>
            <p className="text-fg leading-relaxed text-[1.15rem]">
              Hi, I'm {firstName}. I help adults navigate anxiety, overthinking, and life
              transitions with warmth and evidence-based care. My style is collaborative and
              judgment-free — we'll move at a pace that feels right for you, building practical
              tools you can carry beyond our sessions.
            </p>
            <blockquote className="mt-5 pl-4 border-l-[3px] border-accent/50 text-fg-strong font-display text-[1.25rem] italic leading-snug">
              "Healing isn't linear — and you don't have to do it alone."
            </blockquote>

            {/* Compact "what to expect" — 3 inline steps */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { n: "1", t: "Book a time", d: "Pick a slot that works for you" },
                { n: "2", t: "Meet & talk", d: "Video, voice, or chat from anywhere" },
                { n: "3", t: "Grow together", d: "Practical tools and steady progress" },
              ].map((s) => (
                <div key={s.n} className="flex flex-col gap-2">
                  <span className="w-9 h-9 rounded-lg bg-sage-100 text-sage-700 grid place-items-center text-[11px] font-bold">{s.n}</span>
                  <div className="text-sm font-semibold text-fg-strong">{s.t}</div>
                  <div className="text-xs text-fg-muted leading-snug">{s.d}</div>
                </div>
              ))}
            </div>
          </section>

          {/* §2 Expertise — one section, no separate cards */}
          <section className="py-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-fg-muted mb-6">Expertise</p>
            <div className="space-y-5">
              {specialties.length > 0 && (
                <div>
                  <p className="text-[13px] font-medium text-fg-muted mb-3">Specialties</p>
                  <div className="flex flex-wrap gap-2">{specialties.map((s) => <Chip key={s}>{s}</Chip>)}</div>
                </div>
              )}
              {therapyTypes.length > 0 && (
                <>
                  <div className="h-px bg-border/40" />
                  <div>
                    <p className="text-[13px] font-medium text-fg-muted mb-3">Therapeutic approaches</p>
                    <div className="flex flex-wrap gap-2">{therapyTypes.map((t) => <Chip key={t}>{t}</Chip>)}</div>
                  </div>
                </>
              )}
              {sessionTypes.length > 0 && (
                <>
                  <div className="h-px bg-border/40" />
                  <div>
                    <p className="text-[13px] font-medium text-fg-muted mb-3">Session formats</p>
                    <div className="flex flex-wrap gap-2">{sessionTypes.map((s) => <Chip key={s}>{s}</Chip>)}</div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* §3 Trust */}
          <section className="py-7">
            {/* Stats — inline band, no cards */}
            <div className="flex flex-wrap gap-x-7 gap-y-4 pb-7 border-b border-border/40">
              {[
                { value: `${therapist.experience}+`, label: "Years experience" },
                { value: `${sessions.toLocaleString()}+`, label: "Sessions held" },
                { value: "4.9 / 5", label: "Average rating" },
                { value: "< 24h", label: "Response time" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-[2.2rem] font-semibold text-fg-strong leading-none tracking-tight">{s.value}</div>
                  <div className="text-xs text-fg-muted mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Reviews — clean list */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-fg-muted">What clients say</p>
                <StarRating value={4.9} count={128} size="sm" />
              </div>
              <div className="space-y-0 divide-y divide-border/40">
                {[
                  { n: "Priya K.", i: "PK", tone: "from-sage-400 to-sage-600",   r: 5, d: "2 weeks ago", t: "Genuinely listens and gives practical tools. I felt comfortable from the very first session — something I never expected." },
                  { n: "Arjun M.", i: "AM", tone: "from-ochre-400 to-ochre-600", r: 5, d: "1 month ago", t: "Helped me understand my patterns without judgment. Three months in and I feel like a different person." },
                  { n: "Neha R.",  i: "NR", tone: "from-accent to-accent-hover", r: 5, d: "2 months ago", t: "Warm, sharp, and easy to talk to. Booking was effortless and the sessions fit my schedule perfectly." },
                ].map((rev) => (
                  <div key={rev.n} className="py-5 first:pt-0">
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className={`w-11 h-11 rounded-full bg-gradient-to-br ${rev.tone} text-white grid place-items-center text-[11px] font-bold shrink-0`}>{rev.i}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-fg-strong text-sm">{rev.n}</span>
                          <span className="text-[11px] text-fg-muted shrink-0">{rev.d}</span>
                        </div>
                        <Stars n={rev.r} />
                      </div>
                    </div>
                    <p className="text-[0.95rem] text-fg leading-relaxed pl-14 italic">"{rev.t}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ── STICKY BOOKING SIDEBAR ── */}
        <aside className="lg:sticky lg:top-24">
          <div className="surface-raised-xl rounded-[1.4rem] p-7">
            {/* Price row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[2rem] font-semibold text-fg-strong">₹—</span>
                <span className="text-fg-muted text-[0.95rem]"> / session</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-success bg-success/10 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success" /> Today
              </span>
            </div>
            <p className="text-sm text-fg-muted mt-1">50-min session · pay as you go</p>

            {/* Next availability */}
            <div className="mt-4 flex items-center gap-2 text-[0.95rem] text-fg-muted">
              <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Next available: <span className="text-fg-strong font-medium">Today</span>
            </div>

            {/* CTA */}
            <button onClick={book} className="mt-5 w-full h-13 rounded-full bg-accent text-primary-fg font-semibold text-sm hover:bg-accent-hover transition-all duration-300 shadow-[0_6px_16px_-6px_rgba(192,97,63,0.55)]">
              Book a session
            </button>
            <button onClick={messageTherapist} className="mt-3 w-full text-center text-[0.95rem] text-fg-muted hover:text-accent transition-colors">
              or message first →
            </button>

            {/* Trust bullets */}
            <ul className="mt-5 space-y-2 border-t border-border/50 pt-4">
              {["Free to browse, no commitment", "Switch therapists anytime", "Private & end-to-end encrypted"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-fg-muted">
                  <Check />{t}
                </li>
              ))}
            </ul>
          </div>

          {/* Therapist credentials (desktop only) */}
          <div className="mt-4 rounded-[1.2rem] surface-inset px-4 py-3.5 flex items-center gap-3">
            <svg className="w-5 h-5 text-sage-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <p className="text-sm text-fg-muted leading-snug">License and credentials verified by WellNest before listing.</p>
          </div>
        </aside>
      </div>

      {/* ══════════════════ MOBILE STICKY BAR ════════════════════ */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-surface/95 backdrop-blur-md border-t border-border px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_-8px_rgba(47,58,50,0.15)]">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-fg-strong text-sm truncate">{therapist.name}</div>
          <div className="text-sm text-fg-muted">₹— / session · Available today</div>
        </div>
        <button onClick={book} className="h-12 px-7 rounded-full bg-accent text-primary-fg font-semibold text-[0.95rem] hover:bg-accent-hover transition-colors shrink-0 shadow-soft">
          Book now
        </button>
      </div>
    </div>
  );
}

/* ── Skeleton ─────────────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="bg-bg">
      <section className="bg-night pt-7 pb-10">
        <div className="mx-auto max-w-[1080px] px-5 md:px-8 animate-pulse">
          <div className="h-4 w-28 bg-night-2 rounded mb-7" />
          <div className="flex gap-6">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-[1.5rem] bg-night-2 shrink-0" />
            <div className="flex-1 space-y-3 pt-1">
              <div className="h-9 w-72 bg-night-2 rounded" />
              <div className="h-4 w-44 bg-night-2 rounded" />
              <div className="h-4 w-56 bg-night-2 rounded" />
              <div className="flex gap-2 pt-1">
                <div className="h-11 w-36 bg-night-2 rounded-full" />
                <div className="h-11 w-32 bg-night-2 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-[1080px] px-5 md:px-8 py-10 grid lg:grid-cols-[1fr_320px] gap-8 animate-pulse">
        <div className="space-y-6">
          {[200, 160, 240].map((h, i) => <div key={i} className="rounded-[1.2rem] bg-surface-2" style={{ height: h }} />)}
        </div>
        <div className="rounded-[1.4rem] bg-surface-2 h-[340px]" />
      </div>
    </div>
  );
}
