import React from 'react';
import { ChevronRight, X } from 'lucide-react';

interface MegaMenuProps {
  activeMenu: string | null;
  setActiveMenu: (menu: string | null) => void;
}

const getMenuContent = (id: string) => {
  switch (id) {
    case 'discover':
      return {
        topics: ['The Healthcare Story', 'Leadership', 'Academics & Research', 'CSR & Sustainability', 'Corporate Governance'],
        subtopics: ['Overview', 'Vision & Mission', 'Anthem', 'Our Group Brands', 'Awards & Accolades', 'Achievements']
      };
    case 'hospital':
      return {
        topics: ['Locations', 'Facilities', 'Room Types', 'Visiting Hours', 'Cafeteria'],
        subtopics: ['Find by City', 'Find by Specialty', 'Virtual Tour', 'Admission Process', 'Discharge Process']
      };
    case 'services':
      return {
        topics: ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics'],
        subtopics: ['Diagnostics', 'Surgical Procedures', 'Emergency Care', 'Rehabilitation', 'Telemedicine']
      };
    case 'library':
      return {
        topics: ['Health Conditions', 'Medications', 'Wellness Tips', 'Nutrition', 'First Aid'],
        subtopics: ['Latest Articles', 'Video Resources', 'Patient Stories', 'Podcasts', 'Glossary']
      };
    default:
      return { topics: [], subtopics: [] };
  }
};

const MegaMenu: React.FC<MegaMenuProps> = ({ activeMenu, setActiveMenu }) => {
  if (!activeMenu) return null;

  return (
    <div 
      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl max-h-[calc(100vh-100px)] overflow-y-auto bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-900/10 rounded-2xl border-t-4 border-t-blue-600 border-x border-b border-white animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-12">
        
        {/* Left Column - Topics */}
        <div className="col-span-3 bg-transparent py-6 border-r border-slate-200/60">
          <ul className="space-y-1">
            {getMenuContent(activeMenu).topics.map((item, idx) => (
              <li key={idx}>
                <a href="#" className="flex items-center justify-between px-6 py-3 text-sm font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50/50 transition-colors group">
                  {item}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Middle Column - Subtopics */}
        <div className="col-span-6 bg-transparent p-8 grid grid-cols-2 gap-x-8 gap-y-6 content-start">
          {getMenuContent(activeMenu).subtopics.map((item, idx) => (
            <a key={idx} href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              {item}
            </a>
          ))}
        </div>

        {/* Right Column - Quick Links */}
        <div className="col-span-3 bg-slate-50/50 p-8 border-l border-slate-200/60">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-slate-900 text-lg">Quick Links</h4>
            <button className="text-slate-400 hover:text-slate-600 bg-white/50 hover:bg-white p-1 rounded-full shadow-sm transition-colors" onClick={() => setActiveMenu(null)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 mb-1">Emergency</p>
              <p className="text-lg font-bold text-red-600">1066</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
              <p className="text-xs font-semibold text-blue-600 mb-1">Lifeline International</p>
              <p className="text-base font-bold text-slate-800">+91 4043441066</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 mb-1">Health Help Line</p>
              <p className="text-base font-bold text-slate-800">1860-500-1066</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MegaMenu;
