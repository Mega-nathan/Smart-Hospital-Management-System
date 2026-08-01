import React from 'react';
import { Search } from 'lucide-react';

const HeroSection = () => {
  return (
    <>
      {/* Background Decorations (Matching AdminLogin light theme) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 blur-[100px]" />
        <div className="absolute top-[20%] right-[0%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[50%] rounded-full bg-blue-100/40 blur-[120px]" />
      </div>

      {/* Main Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-48 px-4 text-center">
        
        <div className="max-w-4xl w-full mt-24 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-8">
            Advanced Healthcare at Your Fingertips
          </h1>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
            Find the best doctors, book appointments, and access world-class medical services with ease.
          </p>

          {/* Search Bar */}
          <div className="relative group max-w-3xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white/90 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/50 rounded-full p-2 pl-6">
              <input 
                type="text" 
                placeholder="Search For Doctors, Specialities And Health Check Packages..."
                className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-lg py-3 px-2 w-full"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full transition-colors shadow-lg shadow-blue-600/30 flex-shrink-0">
                <Search className="w-6 h-6" />
              </button>
            </div>
          </div>

        </div>

      </main>
    </>
  );
};

export default HeroSection;
