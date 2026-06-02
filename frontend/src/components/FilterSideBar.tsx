import { useState } from "react";

export interface FiltersState {
  concerns: string[];
  therapyApproaches: string[];
  sessionType: string;
  gender: string;
}

interface FilterProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}

function FilterSection({ title, children, img }: {
  title: string;
  children: React.ReactNode;
  img: string;
}) {
  return (
    <div className="border-b border-border pb-4">
      <div className="flex justify-start gap-1 items-center mb-3">
        <img width={16} height={14} src={`/filter/${img}.svg`} alt="" />
        <h4 className="font-nunito text-sm font-semibold text-fg-strong">
          {title}
        </h4>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-fg-muted cursor-pointer">
      <input
        type="checkbox"
        className="accent-accent"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

interface RadioProps {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
}

function Radio({ label, name, value, checked, onChange }: RadioProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-fg-muted cursor-pointer">
      <input
        type="radio"
        name={name}
        className="accent-accent"
        checked={checked}
        onChange={() => onChange(value)}
      />
      {label}
    </label>
  );
}

const CONCERNS = [
  "Anxiety", "Depression", "Stress", "Relationship Issues", "Trauma",
  "Burnout", "Self Esteem", "Panic Attacks", "OCD", "ADHD",
  "Grief", "Anger Management", "Social Anxiety", "Loneliness", "Family Conflict"
];

const THERAPY_APPROACHES = [
  "CBT", "Mindfulness", "Psychodynamic", "Humanistic", "Solution-focused"
];

export default function FiltersSidebar({ filters, setFilters }: FilterProps) {
  const [showAllConcerns, setShowAllConcerns] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleConcernChange = (concern: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      concerns: checked
        ? [...prev.concerns, concern]
        : prev.concerns.filter((c) => c !== concern),
    }));
  };

  const handleTherapyApproachChange = (approach: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      therapyApproaches: checked
        ? [...prev.therapyApproaches, approach]
        : prev.therapyApproaches.filter((a) => a !== approach),
    }));
  };

  const handleSessionTypeChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      sessionType: prev.sessionType === value ? "" : value,
    }));
  };

  const handleGenderChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      gender: prev.gender === value ? "" : value,
    }));
  };

  const clearAll = () => {
    setFilters({
      concerns: [],
      therapyApproaches: [],
      sessionType: "",
      gender: "",
    });
  };

  const visibleConcerns = showAllConcerns ? CONCERNS : CONCERNS.slice(0, 6);

  if (!isVisible) {
    return (
      <div className="lg:col-span-1">
        <button
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-2 text-sm text-fg-strong font-medium cursor-pointer hover:text-accent transition-colors duration-200 bg-surface-2/50 border border-border rounded-2xl p-4"
        >
          <img src="/filter.svg" alt="filter" />
          <div>Show filters</div>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-2/50 border border-border rounded-2xl p-4 flex flex-col gap-5 sticky top-6 max-h-[90vh] overflow-y-auto hover:shadow-md transition-shadow duration-300">      
      <div 
        className="text-sm text-fg-strong flex items-center gap-2 font-medium cursor-pointer hover:text-accent transition-colors duration-200"
        onClick={() => setIsVisible(false)}
      >
        <img src="/filter.svg" alt="filter"/>
        <div>Hide filters</div>
      </div>

      <FilterSection title="Concerns" img="leaf">
        {visibleConcerns.map((concern) => (
          <Checkbox
            key={concern}
            label={concern}
            checked={filters.concerns.includes(concern)}
            onChange={(checked) => handleConcernChange(concern, checked)}
          />
        ))}
        {!showAllConcerns && (
          <span 
            className="text-xs text-fg-strong cursor-pointer mt-1 hover:text-accent hover:underline transition-all duration-200"
            onClick={() => setShowAllConcerns(true)}
          >
            Show more
          </span>
        )}
        {showAllConcerns && (
          <span 
            className="text-xs text-fg-strong cursor-pointer mt-1 hover:text-accent hover:underline transition-all duration-200"
            onClick={() => setShowAllConcerns(false)}
          >
            Show less
          </span>
        )}
      </FilterSection>

      <FilterSection title="Therapy approaches" img="tree">
        {THERAPY_APPROACHES.map((approach) => (
          <Checkbox
            key={approach}
            label={approach}
            checked={filters.therapyApproaches.includes(approach)}
            onChange={(checked) => handleTherapyApproachChange(approach, checked)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Session type" img="camera">
        <Radio name="session" label="All" value="" checked={filters.sessionType === ""} onChange={handleSessionTypeChange} />
        <Radio name="session" label="Video" value="Online" checked={filters.sessionType === "Online"} onChange={handleSessionTypeChange} />
        <Radio name="session" label="In-person" value="Offline" checked={filters.sessionType === "Offline"} onChange={handleSessionTypeChange} />
        <Radio name="session" label="Chat" value="Chat" checked={filters.sessionType === "Chat"} onChange={handleSessionTypeChange} />
      </FilterSection>

      <FilterSection title="Gender preference" img="person">
        <Radio name="gender" label="No preference" value="" checked={filters.gender === ""} onChange={handleGenderChange} />
        <Radio name="gender" label="Female" value="Female" checked={filters.gender === "Female"} onChange={handleGenderChange} />
        <Radio name="gender" label="Male" value="Male" checked={filters.gender === "Male"} onChange={handleGenderChange} />
      </FilterSection>

      <div
        className="text-sm text-fg-strong font-medium cursor-pointer hover:text-accent transition-colors duration-200"
        onClick={clearAll}
      >
        Clear all
      </div>
    </div>
  );
}