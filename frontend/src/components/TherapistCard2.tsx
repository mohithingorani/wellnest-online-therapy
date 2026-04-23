export default function TherapistCard2() {
  return (
    <div className="w-full bg-white border border-[#EFEAE7] rounded-2xl p-4 md:p-6 flex flex-col gap-4">
      
      {/* TOP: IMAGE + CONTENT */}
      <div className="flex gap-4">
        
        {/* IMAGE */}
        <div className="relative shrink-0">
          <img
            src="/therapist.png"
            alt="therapist"
            className="w-20 h-20 md:w-28 md:h-28 rounded-xl object-cover"
          />

          <div className="absolute bottom-1 left-1 bg-white/90 text-[#0D393E] text-[10px] px-2 py-[2px] rounded shadow">
            8+ yrs
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          
          {/* Name */}
          <div className="flex items-center gap-1">
            <h3 className="text-sm md:text-lg font-playfair text-[#0D393E] font-semibold leading-tight">
              Dr. Ananya Sharma
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
            {["Anxiety", "Depression", "Stress"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] md:text-xs px-2 py-[2px] rounded-full bg-[#E6F0F2] text-[#0D393E]"
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
          <img src="/camera.svg" className="w-3 h-3 md:w-4 md:h-4"/>
          Video, Chat
        </div>

        <div className="flex items-center gap-1">
          <img src="/globe.svg" className="w-3 h-3 md:w-4 md:h-4"/>
          English, Hindi
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-2">
        <button className="flex-1 h-10 md:h-11 rounded-lg bg-[#0D393E] text-white text-sm font-medium">
          View profile
        </button>

        <button className="w-10 h-10 md:w-11 md:h-11 rounded-full shadow flex items-center justify-center">
          <img src="/heart2.svg" className="w-4 h-4"/>
        </button>
      </div>
    </div>
  );
}