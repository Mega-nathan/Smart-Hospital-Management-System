import { useState } from 'react';
import { ChevronDown, Phone, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav 
      className="fixed top-0 left-0 w-full z-50 bg-white border-b border-slate-100 shadow-sm py-5 text-slate-800 font-sans"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Vector SVG Logo for BrightCare Hospital */}
        <div className="flex items-center gap-3 select-none cursor-pointer">
          <div className="relative flex items-center justify-center">
            <svg
              className="w-10 h-10 filter drop-shadow-sm transition-transform duration-300 hover:scale-105"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" rx="20" fill="#eff6ff" />
              <path
                d="M50 82C50 82 22 62 22 41C22 25.5 34.5 18 50 34C65.5 18 78 25.5 78 41C78 62 50 82 50 82Z"
                fill="#2563eb"
              />
              <path
                d="M50 38V58M40 48H60"
                stroke="#8beb1c"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black tracking-tight text-blue-900">
                BrightCare
              </span>
              <span className="text-lg font-extrabold tracking-tight text-[rgb(139,235,28)]">
                Hospital
              </span>
            </div>
            <span className="block text-[9px] font-bold tracking-widest uppercase -mt-0.5 text-slate-400">
              A Multispeciality Institution
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links (using matching admin style typography) */}
        <div className="hidden lg:flex items-center gap-7">
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-[13px] font-bold tracking-wide text-slate-700 hover:text-blue-600 transition-colors uppercase cursor-pointer">
              Discover BrightCare <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-full left-0 mt-2 bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 w-60 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
              <div className="space-y-1 text-slate-700 text-[13px] font-bold">
                <a href="#about" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">About Our Group</a>
                <a href="#leadership" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">Board & Leadership</a>
                <a href="#accreditations" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">Accreditations</a>
                <a href="#careers" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">Careers</a>
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1.5 text-[13px] font-bold tracking-wide text-slate-700 hover:text-blue-600 transition-colors uppercase cursor-pointer">
              Hospital Facilities <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-full left-0 mt-2 bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 w-60 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
              <div className="space-y-1 text-slate-700 text-[13px] font-bold">
                <a href="#icu" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">Emergency & ICU</a>
                <a href="#diagnostics" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">Diagnostics Laboratory</a>
                <a href="#wards" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">Wards & Premium Rooms</a>
                <a href="#pharmacy" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">24/7 Pharmacy</a>
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1.5 text-[13px] font-bold tracking-wide text-slate-700 hover:text-blue-600 transition-colors uppercase cursor-pointer">
              Medical Services <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-full left-0 mt-2 bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 w-60 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
              <div className="space-y-1 text-slate-700 text-[13px] font-bold">
                <a href="#cardiology" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">Cardiology</a>
                <a href="#neurology" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">Neurology</a>
                <a href="#orthopedics" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">Orthopedics</a>
                <a href="#paediatrics" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">Paediatrics</a>
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1.5 text-[13px] font-bold tracking-wide text-slate-700 hover:text-blue-600 transition-colors uppercase cursor-pointer">
              Patient Care <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-full left-0 mt-2 bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 w-60 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
              <div className="space-y-1 text-slate-700 text-[13px] font-bold">
                <a href="#admission" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">Admission Guidelines</a>
                <a href="#insurance" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">Insurance Partners</a>
                <a href="#visitors" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">Visitor Policy</a>
                <a href="#feedback" className="block px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">Patient Feedback</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions: Emergency & Socials */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Emergency badge */}
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border bg-blue-50 border-blue-100 text-blue-600">
            <Phone className="w-4 h-4" />
            <div className="text-left font-sans">
              <span className="block text-[8px] uppercase tracking-widest font-bold opacity-80 leading-none">Emergency Contact</span>
              <span className="block text-xs font-black tracking-tight mt-0.5">+91 93424 12345</span>
            </div>
          </div>

          {/* Social media icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Slide */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-2xl py-6 px-6 text-slate-800 flex flex-col gap-5 animate-in slide-in-from-top-5 duration-200 font-sans">
          <div className="space-y-4 font-bold text-sm">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">Discover BrightCare</span>
              <div className="pl-3 space-y-2 text-slate-600 text-[13px] font-bold">
                <a href="#about" className="block py-1">About Our Group</a>
                <a href="#leadership" className="block py-1">Board & Leadership</a>
              </div>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">Hospital Facilities</span>
              <div className="pl-3 space-y-2 text-slate-600 text-[13px] font-bold">
                <a href="#icu" className="block py-1">Emergency & ICU</a>
                <a href="#diagnostics" className="block py-1">Diagnostics</a>
              </div>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">Medical Services</span>
              <div className="pl-3 space-y-2 text-slate-600 text-[13px] font-bold">
                <a href="#Paediatrics" className="Paediatrics">Cardiology</a>
                <a href="#Paediatrics" className="Paediatrics">Neurology</a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col gap-4">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600">
              <Phone className="w-5 h-5 shrink-0" />
              <div className="text-left">
                <span className="block text-[8px] uppercase tracking-widest font-bold opacity-80 leading-none">Emergency Contact</span>
                <span className="block text-sm font-black tracking-tight mt-0.5">+91 78 2688 2688</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <a href="https://facebook.com" className="p-2 border border-slate-200 rounded-full text-slate-500">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a href="https://instagram.com" className="p-2 border border-slate-200 rounded-full text-slate-500">
                <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
