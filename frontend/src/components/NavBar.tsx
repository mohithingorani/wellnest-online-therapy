import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const paths = [
  { name: "Therapists", path: "/therapists" },
  { name: "About", path: "/about" },
];

function initial(name?: string) {
  return name?.trim().charAt(0).toUpperCase() || "U";
}

function firstName(name?: string) {
  const first = name?.trim().split(" ")[0] || "";
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : "there";
}

export default function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="w-full bg-[#FFFDF8] border-b border-[#EFEAE7]/70 sticky top-0 z-40">
      <nav className="grid grid-cols-[1fr_auto_1fr] md:flex md:justify-between items-center min-h-[72px] px-4 py-4 md:px-8 lg:px-16">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 -ml-2 justify-self-start"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <img className="w-6" src="/burger.svg" alt="" />
        </button>

        {/* Logo (centered on mobile, left on desktop) */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 justify-self-center"
          aria-label="WellNest home"
        >
          <img className="w-8 md:w-9" src="/logos/wellnest.svg" alt="WellNest" />
          <span className="hidden md:inline-block font-nunito font-bold text-2xl text-[#47898E]">
            WellNest
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="font-nunito text-[#63676A] font-bold text-base hidden md:flex justify-center gap-8 lg:gap-10 xl:gap-12">
          {paths.map((path) => (
            <NavLink
              key={path.path}
              to={path.path}
              className={({ isActive }) =>
                `relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#47898E] after:transition-all after:duration-300 hover:text-[#47898E] hover:after:w-full ${
                  isActive ? "text-[#47898E] after:w-full" : ""
                }`
              }
            >
              {path.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex justify-end gap-3 items-center">
          {user ? (
            <div className="relative group flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#47898E] text-white flex items-center justify-center text-sm font-bold">
                {initial(user.name)}
              </div>
              <span className="font-nunito text-[#63676A] font-bold text-base cursor-pointer hover:text-[#47898E] transition-colors">
                {firstName(user.name)}
              </span>
              <div className="absolute right-0 top-full mt-2 w-28 bg-white rounded-xl shadow-lg border border-[#EFEAE7] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-[#0D393E] hover:bg-[#F9F7F5] rounded-xl"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <>
              <LoginButton />
              <SignUpButton />
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#FFFDF8] z-50 md:hidden flex flex-col">
          <div className="flex justify-between items-center px-4 py-4 border-b border-[#EFEAE7]/70">
            <button onClick={() => navigate("/")} aria-label="WellNest home">
              <img className="w-8" src="/logos/wellnest.svg" alt="WellNest" />
            </button>
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <svg className="w-6 h-6 text-[#0D393E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col items-center gap-8 pt-16 flex-1">
            {paths.map((path) => (
              <NavLink
                key={path.path}
                to={path.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `font-nunito text-xl font-semibold ${
                    isActive ? "text-[#47898E]" : "text-[#0D393E]"
                  }`
                }
              >
                {path.name}
              </NavLink>
            ))}

            <div className="flex flex-col gap-4 mt-4 w-full items-center">
              {user ? (
                <>
                  <span className="font-nunito text-[#63676A]">
                    Signed in as <span className="font-bold">{firstName(user.name)}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="font-nunito w-40 text-base rounded-xl py-2 border bg-[#D9D9D9]/20 text-[#0D393E] border-[#0D393E] hover:bg-[#D9D9D9]/40 transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <LoginButton onClick={() => setMobileMenuOpen(false)} />
                  <SignUpButton onClick={() => setMobileMenuOpen(false)} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

const base =
  "font-nunito w-40 md:w-auto md:px-5 text-base rounded-xl py-2 border transition-all duration-300 hover:shadow-lg";

export function LoginButton({ onClick }: { onClick?: () => void }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        onClick?.();
        navigate("/signin");
      }}
      className={`${base} bg-[#D9D9D9]/20 text-[#0D393E] border-[#0D393E] hover:bg-[#D9D9D9]/40 hover:scale-[1.02]`}
    >
      Log in
    </button>
  );
}

function SignUpButton({ onClick }: { onClick?: () => void }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        onClick?.();
        navigate("/signup");
      }}
      className={`${base} bg-[#0D393E] text-white border-[#0D393E] hover:bg-[#2a5459] hover:scale-[1.02] hover:shadow-lg`}
    >
      Get Started
    </button>
  );
}
