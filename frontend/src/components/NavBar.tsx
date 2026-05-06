import { useNavigate } from "react-router-dom";
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
  const [user, setUser] = useState(getAuthUser());

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


    return <div className="flex justify-between  items-center px-8 py-4 lg:py-6 lg:px-16 ">
        
      
      <div className="md:hidden">
        <img className="" src="/burger.svg" alt="menu"/>
      </div> 

  {/* LOGO */}
        <button onClick={()=>{
          navigate("/");
        }} className="flex  items-center gap-3">
            <img className="w-8 md:w-fit" src="/logos/wellnest.svg" alt="wellest logo"/>
            <div className="hidden md:inline-block font-nunito font-bold text-2xl text-[#47898E]">WellNest</div>
        </button>

 
{/* ROUTES */}
        <div className=" font-nunito text-[#63676A] font-bold text-base hidden md:flex justify-center md:gap-6 lg:gap-10 xl:gap-12 2xl:gap-15   ">
          {paths.map((path)=>{
            return <button onClick={()=>{
              navigate(path.path);
            }} className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#47898E] after:transition-all after:duration-300 hover:text-[#47898E] hover:after:w-full">{path.name}</button>
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

