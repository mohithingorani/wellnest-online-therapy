import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="grain relative bg-bg min-h-screen flex flex-col">
      <NavBar />

      <main className="relative flex-1 flex items-center justify-center px-4 md:px-8 overflow-hidden py-20">
        <div aria-hidden className="pointer-events-none absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-gradient-to-br from-clay-300/40 to-ochre-300/30 blur-3xl animate-blob" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-gradient-to-br from-sage-300/30 to-clay-300/20 blur-3xl animate-blob" style={{ animationDelay: "5s" }} />

        <div className="relative z-10 max-w-xl mx-auto text-center">
          <div className="font-display font-medium text-[clamp(5rem,18vw,11rem)] leading-none tracking-[-0.04em] text-fg-strong">
            4<span className="italic text-accent">0</span>4
          </div>
          <h1 className="mt-4 font-display text-3xl md:text-4xl text-fg-strong">Lost your way?</h1>
          <p className="mt-4 text-lg text-fg-muted max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist — it may have moved, or never been here at all.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate("/")} className="h-12 px-7 rounded-full bg-accent text-primary-fg font-semibold hover:bg-accent-hover transition-all duration-300 hover:-translate-y-0.5 shadow-lift">
              Go home
            </button>
            <button onClick={() => navigate("/therapists")} className="h-12 px-7 rounded-full ring-1 ring-border text-fg-strong font-semibold bg-surface/50 hover:bg-surface transition-colors">
              Browse therapists
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
