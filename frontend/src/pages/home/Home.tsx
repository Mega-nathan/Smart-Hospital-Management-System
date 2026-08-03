import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DoctorsList from './components/DoctorsList';
import { BookAppointmentModal } from './components/BookAppointmentModal';

const Home = () => {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>('');

  const openAppointmentModal = (doctorId: number | null = null, doctorName: string = '') => {
    setSelectedDoctorId(doctorId);
    setSelectedDoctorName(doctorName);
    setIsAppointmentModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-slate-900 font-sans">
      <Navbar />
      <HeroSection onBookAppointment={() => openAppointmentModal()} />
      <DoctorsList onBookAppointment={(id, name) => openAppointmentModal(id, name)} />
      
      <BookAppointmentModal 
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        prefilledDoctorId={selectedDoctorId}
        prefilledDoctorName={selectedDoctorName}
      />
    </div>
  );
};

export default Home;
