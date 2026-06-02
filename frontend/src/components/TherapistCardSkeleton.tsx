interface TherapistCardSkeletonProps {
  show?: number;
}

export default function TherapistCardSkeleton({ show = 6 }: TherapistCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: show }).map((_, index) => (
        <div
          key={index}
          className="w-full surface-raised rounded-2xl p-4 md:p-6 flex flex-col gap-4 animate-pulse"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex gap-4">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-surface-2 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="h-4 md:h-5 w-32 md:w-40 bg-surface-2 rounded" />
                <div className="w-4 h-4 bg-surface-2 rounded-full" />
              </div>
              <div className="h-3 md:h-4 w-24 md:w-32 bg-surface-2 rounded mt-2" />
              <div className="flex flex-wrap gap-1.5 mt-3">
                <div className="h-5 w-14 bg-surface-2 rounded-full" />
                <div className="h-5 w-16 bg-surface-2 rounded-full" />
                <div className="h-5 w-12 bg-surface-2 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 w-32 bg-surface-2 rounded" />
            <div className="h-4 w-24 bg-surface-2 rounded" />
          </div>
          <div className="h-11 bg-surface-2 rounded-full" />
        </div>
      ))}
    </>
  );
}
