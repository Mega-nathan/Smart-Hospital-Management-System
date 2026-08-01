import React from 'react';
import { ArrowRight } from 'lucide-react';

const QuickActionBar = () => {
  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-2xl shadow-blue-900/10 border border-white flex overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <button className="flex items-center justify-center gap-3 py-4 px-10 font-bold text-slate-800 hover:text-blue-700 hover:bg-blue-50 transition-colors group">
          Book Appointment 
          <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default QuickActionBar;
