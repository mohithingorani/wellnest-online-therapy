export default function NavBar(){
    return <div className="flex justify-between items-center py-6 px-16 ">
        
        {/* LOGO */}
        <div className="flex items-center gap-3">
            <img src="/logos/wellnest.svg" alt="wellest logo"/>
            <div className="font-nunito font-bold text-2xl text-[#47898E]">WellNest</div>
        </div>

        {/* ROUTES */}
        <div className=" font-nunito text-[#63676A] font-bold text-base flex justify-center gap-16">
            <div>Therapy</div>
            <div>How it Works</div>
            <div>Therapists</div>
            <div>Resources</div>
            <div>About</div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between gap-4 ">
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

