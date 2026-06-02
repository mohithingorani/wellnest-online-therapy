import { memo } from "react";
import { useNavigate } from "react-router-dom";

interface TherapistCard2Props {
  id: number;
  name: string;
  title: string;
  experience: number;
  specialities: string[];
  languages?: string[];
}

const AVATAR_TINTS = [
  "bg-clay-200 text-clay-800",
  "bg-sage-200 text-sage-600",
  "bg-ochre-200 text-clay-800",
  "bg-surface-2 text-fg",
];

function initials(name: string) {
  const parts = name.replace(/^(Dr\.?|Mr\.?|Ms\.?|Mrs\.?)\s+/i, "").trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function TherapistCard2({ id, name, title, experience, specialities, languages = [] }: TherapistCard2Props) {
  const navigate = useNavigate();
  const tint = AVATAR_TINTS[name.length % AVATAR_TINTS.length];
  return (
    <div className="group w-full surface-raised rounded-2xl p-4 md:p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex gap-4">
        {/* avatar */}
        <div className="relative shrink-0">
          <div className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl flex items-center justify-center font-display text-2xl md:text-3xl font-semibold ${tint}`} aria-hidden="true">
            {initials(name)}
          </div>
          <div className="absolute bottom-1 left-1 rounded-lg bg-surface/90 backdrop-blur text-fg-strong text-[10px] font-semibold px-2 py-0.5 shadow-soft">
            {experience}+ yrs
          </div>
        </div>

        {/* content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base md:text-lg font-display text-fg-strong font-semibold leading-tight truncate">{name}</h3>
            <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-xs md:text-sm text-fg-muted">{title}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {specialities.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[11px] px-2.5 py-0.5 rounded-full bg-clay-50 text-clay-700 border border-clay-100">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* meta */}
      <div className="flex flex-col gap-1.5 text-xs md:text-sm text-fg-muted">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          Video · In person · Chat
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M3.6 9h16.8 M3.6 15h16.8 M12 3a15 15 0 010 18 15 15 0 010-18z" /></svg>
          {languages.length > 0 ? languages.join(", ") : "English"}
        </div>
      </div>

      <button
        onClick={() => navigate(`/therapists/${id}`)}
        className="h-11 rounded-full bg-accent text-primary-fg text-sm font-semibold hover:bg-accent-hover transition-colors"
      >
        View profile
      </button>
    </div>
  );
}

export default memo(TherapistCard2);
