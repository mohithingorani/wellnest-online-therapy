import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
    <div className="bg-[#FFFDF8] min-h-screen flex flex-col">
        <NavBar />

      <main className="relative flex-1 flex items-center justify-center px-4 md:px-8 overflow-hidden">
        <div className="absolute top-20 left-10 w-48 h-48 rounded-full bg-[#E77D3C]/10 blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-[#47898E]/10 blur-3xl animate-float pointer-events-none" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-[#0D393E]/5 blur-2xl animate-float pointer-events-none" style={{ animationDelay: "0.5s" }} />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="mb-8 opacity-0 animate-fade-in-up">
            <svg className="w-40 h-40 mx-auto text-[#E77D3C]/20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0" />
              <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8z" opacity="0.3" />
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" opacity="0.5" />
              <text x="12" y="16" textAnchor="middle" fontSize="6" fill="currentColor" fontFamily="Playfair Display" fontWeight="600">404</text>
            </svg>
          </div>

          <h1 className="font-playfair text-5xl md:text-7xl text-[#0D393E] mb-4 opacity-0 animate-fade-in-up animation-delay-200">
            Lost your way?
          </h1>
          
          <p className="font-nunito text-lg md:text-xl text-[#3E464E] mb-8 max-w-md mx-auto leading-relaxed opacity-0 animate-fade-in-up animation-delay-300">
            The page you're looking for doesn't exist. Perhaps it was moved, deleted, or never here to begin with.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up animation-delay-400">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-[#0D393E] text-white font-nunito font-semibold rounded-full hover:bg-[#2a5459] hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Go Home
            </button>
            <button
              onClick={() => navigate("/therapists")}
              className="px-8 py-4 border border-[#0D393E] text-[#0D393E] font-nunito font-semibold rounded-full hover:bg-[#0D393E]/5 hover:scale-105 transition-all duration-300"
            >
              Browse Therapists
            </button>
          </div>

          <div className="mt-16 opacity-0 animate-fade-in-up animation-delay-500">
            <p className="font-nunito text-sm text-[#63676A]">
              Need help finding what you're looking for?
            </p>
            <button
              onClick={() => navigate("/about")}
              className="mt-2 font-nunito text-[#47898E] hover:text-[#0D393E] underline underline-offset-4 transition-colors duration-200"
            >
              Learn about WellNest
            </button>
          </div>
        </div>
      </main>

      <div className="opacity-0 animate-fade-in animation-delay-600">
      </div>
    </div>
      <Footer />
    </>
  );
}