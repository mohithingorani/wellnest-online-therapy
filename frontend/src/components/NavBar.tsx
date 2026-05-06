import { useNavigate, useLocation } from "react-router-dom";
import { getAuthUser, authService, clearAuthUser } from "../services/auth";
import { useEffect, useState } from "react";

export default function NavBar(){

  const paths = [
  { name: "Therapy", path: "/therapy" },
  { name: "How it Works", path: "/how-it-works" },
  { name: "Therapists", path: "/therapists" },
  { name: "Resources", path: "/resources" },
  { name: "About", path: "/about" },
];
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };


    return <div className="flex justify-between items-center px-4 md:px-8 lg:py-6 lg:px-16 py-4">
        
      
      <button 
        className="md:hidden p-2"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <img className="w-6" src="/burger.svg" alt="menu"/>
      </button> 

  {/* LOGO */}
        <button onClick={()=>{
          navigate("/");
        }} className="flex items-center gap-3">
            <img className="w-8 md:w-fit" src="/logos/wellnest.svg" alt="wellest logo"/>
            <div className="hidden md:inline-block font-nunito font-bold text-2xl text-[#47898E]">WellNest</div>
        </button>

 
{/* ROUTES */}
        <div className=" font-nunito text-[#63676A] font-bold text-base hidden md:flex justify-center md:gap-6 lg:gap-10 xl:gap-12 2xl:gap-15   ">
          {paths.map((path)=>{
            const isActive = location.pathname === path.path;
            return <button onClick={()=>{
              navigate(path.path);
            }} className={`relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#47898E] after:transition-all after:duration-300 hover:text-[#47898E] hover:after:w-full ${isActive ? 'text-[#47898E] after:w-full' : ''}`}>{path.name}</button>
          })}
        </div>

        {/* BUTTONS */}
        <div className="hidden  xl:flex  justify-between gap-4 ">
            {user ? (
              <button 
                onClick={handleLogout}
                className="font-nunito w-40 text-base rounded-xl py-2 border transition-all duration-300 bg-[#D9D9D9]/20 text-[#0D393E] border-[#0D393E] hover:bg-[#D9D9D9]/40 hover:scale-[1.02]"
              >
                Log out
              </button>
            ) : (
              <>
                <LoginButton />
                <SignUpButton />
              </>
            )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-50 md:hidden">
            <div className="flex justify-between items-center p-4">
              <button onClick={()=> navigate("/")}>
                <img className="w-8" src="/logos/wellnest.svg" alt="logo"/>
              </button>
              <button onClick={() => setMobileMenuOpen(false)}>
                <svg className="w-6 h-6 text-[#0D393E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center gap-8 mt-12">
              {paths.map((path) => {
                const isActive = location.pathname === path.path;
                return (
                <button 
                  key={path.path}
                  onClick={() => handleNavClick(path.path)}
                  className={`font-nunito text-xl font-semibold ${isActive ? 'text-[#47898E]' : 'text-[#0D393E]'}`}
                >
                  {path.name}
                </button>
              )})}
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
                    <LoginButton />
                    <SignUpButton />
                  </>
                )}
              </div>
            </div>
          </div>
        )}

    </div>
}


const base =
  "font-nunito w-40 text-base rounded-xl py-2 border transition-all duration-300";

export function LoginButton() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/signin")} className={`${base} bg-[#D9D9D9]/20 text-[#0D393E] border-[#0D393E] hover:bg-[#D9D9D9]/40 hover:scale-[1.02]`}>
      Log in
    </button>
  );
}

function SignUpButton() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/signup")} className={`${base} bg-[#0D393E] text-white border-[#0D393E] hover:bg-[#2a5459] hover:scale-[1.02] hover:shadow-lg`}>
      Get Started
    </button>
  );
}

