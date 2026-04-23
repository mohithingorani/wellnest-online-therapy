export default function Signin() {
    return <div className="h-screen  p-4 w-full font-nunito flex justify-center">
        <div className="bg-[#235C61] max-w-7xl w-full h-full p-6 grid grid-cols-2 rounded-4xl">
            <div className="relative overflow-hidden rounded-bl-4xl">
                <img width={600} className="absolute -bottom-2 -left-2" src="/signup.png" alt="WellNest"/>
            </div>
            <div className="bg-white rounded-3xl p-6 flex flex-col justify-between h-full">

                {/* TOP */}
                <div className="flex justify-between">

                    <div className="flex justify-start gap-2 items-center">
                        <img className="w-8 md:w-fit" src="/logos/wellnest.svg" alt="wellest logo"/>
                        <div className="hidden md:inline-block font-nunito font-bold text-2xl text-[#47898E]">WellNest</div>
                    </div>
                    <button className="flex justify-start gap-2 items-center">
                        <img src="/profile.svg" alt="profile"/>
                        <div>Sign Up</div>
                    </button>

                </div>
                
                {/* FORM */}
                <div className="px-6 flex flex-col gap-4">
                    <div className="text-5xl tracking-wide">Sign In</div>
                     <input type="text" placeholder="Email or Username" className="text-lg px-6 py-4  rounded-full border-2 border-black/20 w-full" />
                   <input type="text" placeholder="Password" className="text-lg px-6 py-4  rounded-full border-2 border-black/20 w-full" />
                   <div  className="flex justify-center gap-4 items-center text-white text-xl px-6 py-4  rounded-full border-2 border-[#235C61] bg-[#235C61] w-full" >
                    <img src="/go.svg" alt="Enter" />
                    <div>
                        Sign In
                        </div>

                   </div>

                </div>

                <div>
                    © 2026 WellNest. All rights reserved.
                </div>


            </div>

        </div>
        
    </div>
}