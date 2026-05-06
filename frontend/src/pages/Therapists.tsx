import FiltersSidebar from "../components/FilterSideBar";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import SecureButton from "../components/SecureButton";
import TherapistCard2 from "../components/TherapistCard2";

export default function TherapistsPage() {

  return (
    <div className="bg-linear-to-b bg-[#FFFDF8]  pt-4">
      <nav>
        <NavBar />
      </nav>

     <main className="px-4 md:px-8 lg:px-18 xl:px-16 2xl:px-24">
            <section className="flex mt-6 justify-between">
                <div className=" flex-1 ">
                    {/* HEADING  */}

                <div className="mb-4 animate-fade-in-up">
                    <SecureButton />
                </div>
                    <div className="font-playfair text-center md:text-start text-4xl md:text-6xl xl:text-7xl flex flex-col gap-2 animate-fade-in-up animation-delay-100">
                    <div className="text-[#0D393E] font-medium">
                        Find the right
                    </div>
                    <div className="text-[#E77D3C] font-semibold italic">therapist for you.</div>
                    </div>
                    <div className="font-nunito text-center md:text-start text-sm md:text-xl 2xl:text-2xl mt-6 text-[#3E464E] animate-fade-in-up animation-delay-200">
                    <div>Browse verified therapists and find the perfect</div>
                    <div>match for your needs.</div>
                    </div>


          </div>
          <div className=" hidden xl:inline-block justify-end">
            <img className=" w-xl" src="/sofa.png" alt="sofa"/>

          </div>
        </section>
        
      <section className="mt-10">
  <div className="bg-[#F9F7F5] border border-[#EFEAE7] rounded-2xl p-4 md:p-6 shadow-sm animate-fade-in-up animation-delay-300">
    
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-center">
      
      {/* Concern */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[#6B7280] font-nunito">
          What can we help you with?
        </label>
        <select className="h-12 px-4 rounded-lg border border-[#E5E7EB] bg-white text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all duration-200 cursor-pointer hover:border-[#d1d5db]">
          <option>Select a concern</option>
        </select>
      </div>

      {/* Therapy Type */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[#6B7280] font-nunito">
          Therapy type
        </label>
        <select className="h-12 px-4 rounded-lg border border-[#E5E7EB] bg-white text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all duration-200 cursor-pointer hover:border-[#d1d5db]">
          <option>All therapy types</option>
        </select>
      </div>

      {/* Session Type */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[#6B7280] font-nunito">
          Session type
        </label>
        <select className="h-12 px-4 rounded-lg border border-[#E5E7EB] bg-white text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all duration-200 cursor-pointer hover:border-[#d1d5db]">
          <option>All session types</option>
        </select>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[#6B7280] font-nunito">
          Location / Language
        </label>
        <select className="h-12 px-4 rounded-lg border border-[#E5E7EB] bg-white text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all duration-200 cursor-pointer hover:border-[#d1d5db]">
          <option>All</option>
        </select>
      </div>

      {/* Search Button */}
      <div className="flex items-end">
        <button className="w-full h-12 rounded-lg font-nunito bg-[#0D393E] text-white font-medium flex items-center justify-center gap-3 hover:bg-[#2a5459] hover:shadow-lg transition-all duration-300">
          <img src="/search.svg" alt="search" />
          <div>Search</div>
        </button>
      </div>

    </div>
  </div>
</section> 

<section className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT SECTION */}
         <div className="hidden lg:block lg:col-span-1 animate-fade-in-up animation-delay-400">
           <FiltersSidebar />
         </div>

         {/* RIGHT SECTION */}
<div className="col-span-1 lg:col-span-3 flex flex-col gap-4">
              <TherapistCard2/>
            <TherapistCard2/>
            <TherapistCard2/>
            <TherapistCard2/>
            <TherapistCard2/>
            <TherapistCard2/>
        </div>
    </div>

    </section>
        </main> 
        <Footer/>
    </div>
  );
}



