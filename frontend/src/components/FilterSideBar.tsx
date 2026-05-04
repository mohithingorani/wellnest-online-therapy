function FilterSection({ title, children,img }:{
    title:string,children:any,img:string
}) {
  return (
    <div className="border-b border-[#EFEAE7] pb-4">
      <div className="flex justify-start gap-1 items-center mb-3">
        <img width={16} height={14} src={`/filter/${img}.svg`} alt="" />
        <h4 className="font-nunito text-sm font-semibold text-[#0D393E]">
          {title}
        </h4>
        {/* <span className="text-xs text-[#6B7280] cursor-pointer">⌃</span> */}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Checkbox({ label }:{label:string}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#4B5563] cursor-pointer">
      <input type="checkbox" className="accent-[#0D393E]" />
      {label}
    </label>
  );
}

function Radio({ label, name }:{label:string, name:string}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#4B5563] cursor-pointer">
      <input type="radio" name={name} className="accent-[#0D393E]" />
      {label}
    </label>
  );
}

export default function FiltersSidebar() {
  return (
<div className="bg-[#F9F7F5]/50 border border-[#EFEAE7] rounded-2xl p-4 flex flex-col gap-5 sticky top-6 max-h-[90vh] overflow-y-auto">      
      {/* Hide filters */}
      <div className="text-sm text-[#0D393E] flex items-center gap-2 font-medium cursor-pointer">
        <img src="/filter.svg" alt="filter"/>
        <div>
            Hide filters
            </div>

      </div>

      {/* Concerns */}
      <FilterSection title="Concerns" img="leaf" >
        <Checkbox label="Anxiety" />
        <Checkbox label="Depression" />
        <Checkbox label="Stress" />
        <Checkbox label="Relationship issues" />
        <Checkbox label="Trauma" />
        <span className="text-xs text-[#0D393E] cursor-pointer mt-1">
          Show more
        </span>
      </FilterSection>

      {/* Therapy approaches */}
      <FilterSection title="Therapy approaches" img="tree">
        <Checkbox label="CBT" />
        <Checkbox label="Mindfulness" />
        <Checkbox label="Psychodynamic" />
        <Checkbox label="Humanistic" />
        <Checkbox label="Solution-focused" />
        <span className="text-xs text-[#0D393E] cursor-pointer mt-1">
          Show more
        </span>
      </FilterSection>

      {/* Session type */}
      <FilterSection title="Session type" img="camera">
        <Radio name="session" label="All" />
        <Radio name="session" label="Video" />
        <Radio name="session" label="In-person" />
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" img="calender">
        <Radio name="availability" label="All" />
        <Radio name="availability" label="Available this week" />
        <Radio name="availability" label="Available this weekend" />
      </FilterSection>

      {/* Gender */}
      <FilterSection title="Gender preference" img="person">
        <Radio name="gender" label="No preference" />
        <Radio name="gender" label="Female" />
        <Radio name="gender" label="Male" />
        <Radio name="gender" label="Non-binary" />
      </FilterSection>

      {/* Clear */}
      <div className="text-sm text-[#0D393E] font-medium cursor-pointer">
        Clear all
      </div>
    </div>
  );
}