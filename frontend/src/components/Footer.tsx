// import "../index.css"
export default function Footer() {
  return (
    <footer className="bg-[#0D393E] text-white ">
      <div className="px-4 md:px-8 lg:px-16 2xl:px-24 py-10">
        
        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* BRAND */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logos/wellnest.svg" className="w-6 h-6" />
              <span className=" tracking-wide text-2xl">WellNest</span>
            </div>

            <p className="text-sm text-gray-300 max-w-sm">
              Compassionate support for your mental well-being. Anytime, anywhere.
            </p>

       
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <button className="w-fit text-left hover:text-white transition-colors duration-200">About us</button>
              <button className="w-fit text-left hover:text-white transition-colors duration-200">Careers</button>
              <button className="w-fit text-left hover:text-white transition-colors duration-200">Contact</button>
            </div>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <button className="w-fit text-left hover:text-white transition-colors duration-200">Help center</button>
              <button className="w-fit text-left hover:text-white transition-colors duration-200">Privacy policy</button>
              <button className="w-fit text-left hover:text-white transition-colors duration-200">Terms of service</button>
            </div>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <button className="w-fit text-left hover:text-white transition-colors duration-200">Articles</button>
              <button className="w-fit text-left hover:text-white transition-colors duration-200">Guides</button>
              <button className="w-fit text-left hover:text-white transition-colors duration-200">Community</button>
            </div>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="mt-10 flex flex-col  lg:justify-between items-start gap-6">
          
          <div>
            <h4 className="font-semibold">Stay in the loop</h4>
            <p className="text-sm text-gray-300">
              Tips, resources, and updates for your mental well-being.
            </p>
          </div>

          <div className="flex w-full lg:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full lg:w-80 h-11 px-4 bg-white rounded-l-lg text-black outline-none focus:ring-2 focus:ring-[#47898E]/50 transition-all duration-200"
            />
            <button className="bg-white px-4 rounded-r-lg flex items-center justify-center hover:bg-[#E6F0F2] transition-colors duration-200">
              <img src="/send.svg" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
          
          <div>© 2026 WellNest. All rights reserved.</div>

          <div className="flex items-center gap-2">
            <img src="/lock.svg" className="w-4 h-4 opacity-80" />
            <span>We follow HIPAA and GDPR standards.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}