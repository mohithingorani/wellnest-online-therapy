import { useNavigate } from "react-router-dom";

export default function NavBar(){

  const paths = [
  { name: "Therapy", path: "/therapy" },
  { name: "How it Works", path: "/how-it-works" },
  { name: "Therapists", path: "/therapists" },
  { name: "Resources", path: "/resources" },
  { name: "About", path: "/about" },
];
  const navigate = useNavigate();



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
        <div className=" font-nunito *:hover:text-green-900 text-[#63676A] font-bold text-base hidden md:flex justify-center md:gap-6 lg:gap-10 xl:gap-12  2xl:gap-15   ">
          {paths.map((path)=>{
            return <button onClick={()=>{
              navigate(path.path);
            }}>{path.name}</button>
          })}
        </div>

        {/* BUTTONS */}
        <div className="hidden  xl:flex  justify-between gap-4 ">
            <LoginButton/>
            <SignUpButton/>
        </div>

    </div>
}


const base =
  "font-nunito w-40 text-base rounded-xl py-2 border";

export function LoginButton() {
  return (
    <button className={`${base} bg-[#D9D9D9]/20 text-[#0D393E] border-[#0D393E]`}>
      Log in
    </button>
  );
}

function SignUpButton() {
  return (
    <button className={`${base} bg-[#0D393E] text-white border-[#0D393E]`}>
      Get Started
    </button>
  );
}

