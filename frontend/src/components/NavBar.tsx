import { useNavigate, NavLink } from "react-router-dom";
import { getAuthUser, authService, clearAuthUser } from "../services/auth";
import { useEffect, useState } from "react";

const paths = [
  { name: "Therapists", path: "/therapists" },
  { name: "About", path: "/about" },
];

export default function NavBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getAuthUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {}

    clearAuthUser();
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <div className="w-full bg-[#FFFDF8] md:bg-white">
        <div className="flex justify-between items-center min-h-[72px] px-4 py-4 md:px-8 lg:px-16 lg:py-6 bg-white">
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <img className="w-6" src="/burger.svg" alt="menu" />
          </button>

          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <img
              className="w-8 md:w-fit"
              src="/logos/wellnest.svg"
              alt="wellnest logo"
            />

            <div className="hidden md:inline-block font-nunito font-bold text-2xl text-[#47898E]">
              WellNest
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="font-nunito text-[#63676A] font-bold text-base hidden md:flex justify-center md:gap-6 lg:gap-10 xl:gap-12 2xl:gap-15">
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

          {/* Desktop Auth Buttons */}
          <div className="hidden xl:flex justify-between gap-4 items-center">
            {user ? (
              <div className="relative group flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#47898E] text-white flex items-center justify-center text-xs font-bold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <span className="font-nunito text-[#63676A] font-bold text-lg cursor-pointer hover:text-[#47898E] transition-colors">
                  {user.name?.split(" ")[0]?.charAt(0).toUpperCase() +
                    user.name?.split(" ")[0]?.slice(1)}
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
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="flex justify-between items-center p-4 bg-white">
            <button onClick={() => navigate("/")}>
              <img className="w-8" src="/logos/wellnest.svg" alt="logo" />
            </button>

            <button onClick={() => setMobileMenuOpen(false)}>
              <svg
                className="w-6 h-6 text-[#0D393E]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col items-center gap-8 mt-12 bg-white min-h-screen">
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

            <div className="flex flex-col gap-4 mt-4">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="font-nunito w-40 text-base rounded-xl py-2 border bg-[#D9D9D9]/20 text-[#0D393E] border-[#0D393E]"
                >
                  Log out
                </button>
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
    </>
  );
}

const base =
  "font-nunito w-40 text-base rounded-xl py-2 border transition-all duration-300 hover:shadow-lg";

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