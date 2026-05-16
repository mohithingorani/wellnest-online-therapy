interface TherapistCardSkeletonProps {
  show?: number;
}

export default function TherapistCardSkeleton({ show = 6 }: TherapistCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: show }).map((_, index) => (
        <div
          key={index}
          className="w-full bg-white border border-[#EFEAE7] rounded-2xl p-4 md:p-6 flex flex-col gap-4 animate-pulse"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl bg-[#E5E7EB]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="h-4 md:h-5 w-32 md:w-40 bg-[#E5E7EB] rounded" />
                <div className="w-3 h-3 md:w-4 md:h-4 bg-[#E5E7EB] rounded-full" />
              </div>
              <div className="h-3 md:h-4 w-24 md:w-32 bg-[#E5E7EB] rounded mt-1" />
              <div className="flex items-center gap-1 mt-1">
                <div className="h-3 w-8 bg-[#E5E7EB] rounded" />
                <div className="h-3 w-12 bg-[#E5E7EB] rounded" />
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                <div className="h-5 w-14 bg-[#E5E7EB] rounded-full" />
                <div className="h-5 w-16 bg-[#E5E7EB] rounded-full" />
                <div className="h-5 w-12 bg-[#E5E7EB] rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between text-xs md:text-sm">
            <div className="flex items-center gap-1">
              <div className="h-4 w-20 bg-[#E5E7EB] rounded" />
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className="h-4 w-24 bg-[#E5E7EB] rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-10 md:h-11 bg-[#E5E7EB] rounded-lg" />
            <div className="w-10 h-10 md:w-11 md:h-11 bg-[#E5E7EB] rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
}