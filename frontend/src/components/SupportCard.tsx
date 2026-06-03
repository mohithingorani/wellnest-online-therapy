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
    <div className="flex w-full md:w-44 md:flex-col gap-4 md:items-center md:text-center lg:gap-2 transition-transform duration-300 cursor-default">
      {/* ICON */}
      <div className={`w-16 h-16 shrink-0 rounded-full ${className} flex items-center justify-center`}>
        <img src={`/support/${image}.svg`} alt="" className="w-6 h-6" />
      </div>

      <div className="md:contents">
        {/* NUMBER */}
        <div className="hidden md:block font-semibold text-xl">{number}</div>

        {/* HEADING */}
        <div className="text-sm font-semibold leading-tight">{heading}</div>

        {/* SUBTEXT */}
        <div className="text-xs text-fg-muted leading-relaxed max-w-40">
          {subtext}
        </div>
      </div>
    </div>
  );
}