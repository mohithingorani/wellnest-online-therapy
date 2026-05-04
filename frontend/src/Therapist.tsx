// import { useParams } from "react-router-dom"
import NavBar from "./components/NavBar";

export default function TherapistPage2(){
    // const params = useParams();
    // const id = params.id;
    return <div className="bg-linear-to-b from-[#FFFDF8] to-[#EEFFFF] pt-4">
         <nav>
        <NavBar />
      </nav>
      <main className="px-4 md:px-8 lg:px-18 xl:px-16 2xl:px-24 mt-8">
        <section>
            
            <div className="flex justify-start w-full gap-8">
                <div className="relative w-100">
                    <img className="absolute -left-2 top-30 z-0" src="/therapist/bg.svg" alt="flowers" />
                    <img src="/therapist/person.png" className="z-100 absolute" alt="therapist"/>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="font-playfair text-6xl font-medium text-[#0D393E]">
                        Dr. Ananya Sharma
                    </div>
                    <div className="text-2xl">
                        Clinical Psychologist
                    </div>
                </div>
        
        

            </div>
      </section>
    </main>
    </div>
}