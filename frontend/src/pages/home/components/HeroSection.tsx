import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import bg1 from '../../../assets/bg-image/bg-image-1.png';
import bg2 from '../../../assets/bg-image/bg-image-2.png';
import bg3 from '../../../assets/bg-image/bg-image-3.png';

interface HeroSectionProps {
  onBookAppointment?: () => void;
}

export default function HeroSection({ onBookAppointment }: HeroSectionProps) {
  const images = [bg1, bg2, bg3];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds interval
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative h-screen w-full overflow-hidden select-none font-sans flex flex-col items-center justify-center">
      {/* Background Carousel Images */}
      <div className="absolute inset-0 z-0">
        {images.map((img, idx) => (
          <div
            key={idx}
            style={{ backgroundImage: `url(${img})` }}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${idx === currentIdx ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              } transform duration-[2000ms]`}
          />
        ))}
        {/* Deep Slate Dark Overlay for maximum text readability */}
        <div className="absolute inset-0 bg-slate-950/40 z-10" />
      </div>

      {/* Content wrapper centered vertically with reduced gap */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center gap-10 mt-16">

        {/* Hero Center Contents */}
        <div className="text-center max-w-3xl">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md">
            World-Class Care, <span className="text-[rgb(139,235,28)]">Close to You</span>
          </h1>
          {/* Sub-headline */}
          <p className="mt-4 text-base sm:text-lg text-slate-100 font-medium tracking-wide drop-shadow-sm leading-relaxed">
            Experience advanced medical excellence with a compassionate touch at BrightCare Hospital.
          </p>
        </div>

        {/* Glassy Quick Action Bar */}
        <div className="w-full relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          {/* Glass backdrop */}
          <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-xl -z-10" />

          {/* Action Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 md:divide-x divide-white/15 text-white">
            <button
              onClick={onBookAppointment}
              className="flex items-center justify-between p-6 hover:bg-white/10 transition-colors duration-300 group cursor-pointer w-full text-left"
            >
              <span className="font-bold text-sm tracking-wide uppercase">Book Appointment</span>
              <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-blue-900 group-hover:scale-105 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <a
              href="#doctors"
              className="flex items-center justify-between p-6 hover:bg-white/10 transition-colors duration-300 group cursor-pointer"
            >
              <span className="font-bold text-sm tracking-wide uppercase">Find Doctors</span>
              <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-blue-900 group-hover:scale-105 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </a>

            <Link
              to="/report-explainer"
              className="flex items-center justify-between p-6 hover:bg-white/10 transition-colors duration-300 group cursor-pointer"
            >
              <span className="font-bold text-sm tracking-wide uppercase flex items-center gap-1.5 text-[rgb(139,235,28)]">
                Explain Lab Report <span className="bg-[rgb(139,235,28)] text-slate-950 text-[9px] px-1 py-0.5 rounded-full font-black tracking-widest leading-none">AI</span>
              </span>
              <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-blue-900 group-hover:scale-105 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            <a
              href="#facilities"
              className="flex items-center justify-between p-6 hover:bg-white/10 transition-colors duration-300 group cursor-pointer"
            >
              <span className="font-bold text-sm tracking-wide uppercase">Our Facilities</span>
              <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-blue-900 group-hover:scale-105 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
