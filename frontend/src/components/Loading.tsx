export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center p-4">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-[#E6F4F1] flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#0D393E]/10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[#0D393E] animate-pulse"></div>
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#E77D3C] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        </div>
      </div>
      
      <h1 className="font-playfair text-3xl text-[#0D393E] mb-2">WellNest</h1>
      <p className="text-[#6B7280] font-nunito mb-8">Loading your wellness journey...</p>
      
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-[#E77D3C] animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-[#0D393E] animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-[#47898E] animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      
      <div className="mt-12 w-64 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#0D393E] via-[#47898E] to-[#E77D3C] rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };
  
  return (
    <div className={`${sizes[size]} relative`}>
      <div className="absolute inset-0 rounded-full border-2 border-[#E6F4F1]"></div>
      <div className="absolute inset-0 rounded-full border-2 border-[#0D393E] border-t-transparent animate-spin"></div>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-[#6B7280] font-nunito text-sm">Loading...</p>
      </div>
    </div>
  );
}