export default function SupportCard({
  image,
  number,
  heading,
  subtext,
  className,
}: {
  image: string;
  number: number;
  heading: string;
  subtext: string;
  className: string;
}) {
  return (
    <div className="flex w-full md:w-44 md:flex-col gap-4 md:items-center md:text-center lg:gap-2 hover:scale-105 transition-transform duration-300 cursor-default">
      
      {/* ICON */}
      <div className={`w-17.5 h-17.5 rounded-full ${className} flex items-center justify-center`}>
        <img src={`/support/${image}.svg`} alt={heading} className="w-6 h-6" />
      </div>
<div>
      {/* NUMBER */}
      <div className="hidden md:inline-block font-semibold text-xl">
        {number}
      </div>

      {/* HEADING */}
      <div className="text-sm font-semibold leading-tight">
        {heading}
      </div>

      {/* SUBTEXT */}
      <div className="text-xs text-[#3A5F63] leading-relaxed max-w-40">
        {subtext}
      </div>
      </div>
    </div>
  );
}