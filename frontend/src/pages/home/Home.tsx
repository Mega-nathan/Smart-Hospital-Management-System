import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DoctorsList from './components/DoctorsList';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-slate-900 font-sans">
      <Navbar />
      <HeroSection />
      <DoctorsList />
    </div>
  );
};

export default Home;
