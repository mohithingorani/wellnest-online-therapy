export default function Signin() {
    return <div className="h-screen  lg:p-4 w-full font-nunito flex justify-center">
        <div className="bg-[#235C61] max-w-7xl w-full h-full md:p-4 lg:p-6 grid lg:grid-cols-2 lg:rounded-4xl">
            <div className="relative overflow-hidden hidden lg:inline-block rounded-bl-4xl">
                <div className="absolute text-4xl leading-10 font-medium top-20 text-white left-1/2 -translate-x-1/2">
                    Your story matters here.
                </div>
                <img width={600} className="absolute -bottom-2 -left-2" src="/signup.png" alt="WellNest"/>
            </div>
            <div className="bg-white md:rounded-2xl lg:rounded-3xl p-6 flex flex-col justify-between h-full">

                {/* TOP */}
                <div className="flex justify-between">

                    <div className="flex justify-start gap-2 items-center">
                        <img className="w-8 md:w-fit" src="/logos/wellnest.svg" alt="wellest logo"/>
                        <div className="hidden md:inline-block font-nunito font-bold text-2xl text-[#47898E]">WellNest</div>
                    </div>
                    <button className="flex text-lg justify-start gap-2 items-center">
                        <img src="/profile.svg" alt="profile"/>
                        <div>Sign Up</div>
                    </button>

                </div>
                
                {/* FORM */}
              
                <div className="px-6 flex text-sm flex-col gap-4">
                    <div className="lg:text-3xl md:text-5xl mb-2 tracking-wide">Sign In</div>
                    <input type="text" placeholder="Email ID" className="px-5 py-4  rounded-2xl border-2 border-black/20 w-full" />

                   <input type="text" placeholder="Password" className=" px-5 py-4  rounded-2xl border-2 border-black/20 w-full" />

                   <div  className="flex justify-center text-lg gap-4 items-center text-white px-3 py-2 md:px-5 md:py-3  rounded-2xl border-2 border-[#235C61] bg-[#235C61] w-full" >
                        <img src="/go.svg" alt="Enter" />
                        <div>
                            Sign In
                        </div>

                   </div>
                   <div className="text-base text-center">
                    or
                   </div>

    <div  className="flex justify-center text-lg gap-4 items-center text-black px-3 py-2 md:px-5 md:py-3  rounded-2xl border-2 border-black/20 bg-white w-full" >
                        <img src="/google.svg" alt="Enter" />
                        <div>
                            Continue With Google
                        </div>

                   </div>
                </div>

                <div className="text-sm">
                    © 2026 WellNest. All rights reserved.
                </div>


            </div>

        </div>
        
    </div>
}