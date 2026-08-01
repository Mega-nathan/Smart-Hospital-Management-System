import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import QuickActionBar from './components/QuickActionBar';

const Home = () => {
  // State for which mega menu is currently locked open
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // Close menu on click anywhere
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans">
      <Navbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <HeroSection />
      <QuickActionBar />
    </div>
  );
};

export default Home;
