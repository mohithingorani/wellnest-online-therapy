import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, setAuthUser } from "../services/auth";

export default function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        setAuthUser(response.data);
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

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
                    <button onClick={() => navigate("/signup")} className="flex text-lg justify-start gap-2 items-center hover:text-[#47898E] transition-colors duration-200">
                        <img src="/profile.svg" alt="profile"/>
                        <div>Sign Up</div>
                    </button>

                </div>
                
                {/* FORM */}
              
                <div className="px-6 flex text-sm flex-col gap-4">
                    <div className="lg:text-3xl md:text-5xl mb-2 tracking-wide">Sign In</div>

                    {error && (
                      <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <input 
                        type="email" 
                        placeholder="Email ID" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-5 py-4 rounded-2xl border-2 border-black/20 w-full focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all duration-200" 
                        required
                      />

                      <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-5 py-4 rounded-2xl border-2 border-black/20 w-full focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all duration-200" 
                        required
                        minLength={8}
                      />

                      <button 
                        type="submit"
                        disabled={loading}
                        className="flex justify-center text-lg gap-4 items-center text-white px-3 py-2 md:px-5 md:py-3 rounded-2xl border-2 border-[#235C61] bg-[#235C61] w-full cursor-pointer hover:bg-[#1a474b] hover:border-[#1a474b] hover:shadow-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                      >
                        <img src="/go.svg" alt="Enter" />
                        <div>{loading ? "Signing In..." : "Sign In"}</div>

                      </button>
                    </form>
                    <div className="text-base text-center">
                     or
                    </div>

    <div  className="flex justify-center text-lg gap-4 items-center text-black px-3 py-2 md:px-5 md:py-3 rounded-2xl border-2 border-black/20 bg-white w-full cursor-pointer hover:bg-gray-50 hover:border-gray-400 hover:scale-[1.01] transition-all duration-200" >
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