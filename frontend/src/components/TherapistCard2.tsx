import { useNavigate } from "react-router-dom";

interface TherapistCard2Props {
  id: number;
  name: string;
  experience: number;
  specialities: string[];
  languages?: string[];
}

export default function TherapistCard2({ id, name, experience, specialities, languages = [] }: TherapistCard2Props) {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white border border-[#EFEAE7] rounded-2xl p-4 md:p-6 flex flex-col gap-4 hover:shadow-lg hover:border-[#d4d0cc] hover:-translate-y-1 transition-all duration-300">
      {/* TOP: IMAGE + CONTENT */}
      <div className="flex gap-4">
        {/* IMAGE */}
        <div className="relative shrink-0">
          <img
            src="/therapist.png"
            alt="therapist"
            className="w-20 h-20 md:w-28 md:h-28 rounded-xl object-cover"
          />

          <div className="absolute bottom-1 left-1 bg-white/90 text-[#0D393E] text-[10px] px-2 py-0.5 rounded shadow">
            {experience}+ yrs
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          {/* Name */}
          <div className="flex items-center gap-1">
            <h3 className="text-sm md:text-lg font-playfair text-[#0D393E] font-semibold leading-tight">
              {name}
            </h3>
            <img src="/verified.svg" className="w-3 h-3 md:w-4 md:h-4" />
          </div>

          <p className="text-xs md:text-sm text-[#6B7280] font-nunito">
            Clinical Psychologist
          </p>

          {/* Rating */}
          <div className="flex items-center text-[#6B7280] gap-1 mt-1 text-xs md:text-sm">
            <span className="text-yellow-500">★</span>
            <span>5.0</span>
            <span>(248)</span>
          </div>

          {/* Tags (limit on mobile) */}
          <div className="flex flex-wrap gap-1 mt-2">
            {specialities.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-[#E6F0F2] text-[#0D393E]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* META (mobile compact) */}
      <div className="flex flex-col justify-between text-xs md:text-sm text-[#4B5563]">
        <div className="flex items-center gap-1">
          <img src="/camera.svg" className="w-3 h-3 md:w-4 md:h-4" />
          Video, In-Person
        </div>

        <div className="flex items-center gap-1">
          <img src="/globe.svg" className="w-3 h-3 md:w-4 md:h-4" />
          {languages.length > 0 ? languages.join(", ") : "English, Hindi"}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-2">
        <button onClick={()=>{
          navigate(`/therapists/${id}`);
        }} className="flex-1 h-10 md:h-11 rounded-lg bg-[#0D393E] text-white text-sm font-medium hover:bg-[#2a5459] hover:shadow-lg transition-all duration-300 ">
          View profile
        </button>

        <button className="w-10 h-10 md:w-11 md:h-11 rounded-full shadow flex items-center justify-center hover:bg-[#E6F0F2] hover:scale-110 transition-all duration-300">
          <img src="/heart2.svg" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
