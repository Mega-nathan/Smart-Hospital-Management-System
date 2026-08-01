import React, { useState } from 'react';
import { ChevronDown, Search, Phone, Globe, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MegaMenu from './MegaMenu';

interface NavbarProps {
  activeMenu: string | null;
  setActiveMenu: (menu: string | null) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeMenu, setActiveMenu }) => {
  const navigate = useNavigate();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [language, setLanguage] = useState('English');

  const navItems = [
    { id: 'discover', label: 'DISCOVER HEALTHCARE' },
    { id: 'hospital', label: 'FIND HOSPITAL' },
    { id: 'services', label: 'MEDICAL SERVICES' },
    { id: 'library', label: 'HEALTH LIBRARY' }
  ];

  const languages = ['English', 'Hindi', 'Spanish', 'French'];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
               <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Health<span className="text-blue-600">Care</span></span>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div 
                key={item.id}
                className="relative group"
                onMouseEnter={() => setActiveMenu(item.id)}
              >
                <button className="flex items-center text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-wider py-8">
                  {item.label}
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeMenu === item.id ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 p-2 rounded-full border border-blue-100">
              <Phone className="w-5 h-5" fill="currentColor" />
            </button>
            <button className="text-slate-600 hover:text-blue-600 transition-colors bg-slate-100 p-2 rounded-full border border-slate-200">
              <Search className="w-5 h-5" />
            </button>
            
            {/* Language Dropdown */}
            <div className="relative">
              <div 
                className="flex items-center text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-200 transition-colors border border-slate-200"
                onClick={() => setIsLangOpen(!isLangOpen)}
              >
                <Globe className="w-4 h-4 mr-1 text-slate-500" />
                {language} <ChevronDown className={`ml-1 w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </div>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        language === lang ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mega Menu Component */}
        <MegaMenu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      </div>
    </nav>
  );
};

export default Navbar;
