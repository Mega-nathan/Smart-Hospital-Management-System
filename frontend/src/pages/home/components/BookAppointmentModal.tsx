import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Calendar, Video } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addAppointment } from '../../../store/appointmentSlice';
import emailjs from '@emailjs/browser';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledDoctorId?: number | null;
  prefilledDoctorName?: string;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  prefilledDoctorId = null,
  prefilledDoctorName = '',
}) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Form, 2: OTP, 3: Success
  const [timer, setTimer] = useState(20);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    appointmentDate: '',
    timeSlot: '10:00 AM - 11:30 AM',
    consultationType: 'In-Person',
    notes: '',
    doctorId: prefilledDoctorId || 1, // Defaulting to 1 if not provided for now
    doctorName: prefilledDoctorName || 'Dr. pawan',
  });

  // Available dummy time slots
  const timeSlots = [
    '09:00 AM - 10:30 AM',
    '10:00 AM - 11:30 AM',
    '01:00 PM - 02:30 PM',
    '03:00 PM - 04:30 PM'
  ];

  // OTP Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTimer(20);
      setOtp('');
      setFormData(prev => ({
        ...prev,
        doctorId: prefilledDoctorId || 1,
        doctorName: prefilledDoctorName || 'Dr. pawan',
      }));
    }
  }, [isOpen, prefilledDoctorId, prefilledDoctorName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingOtp(true);
    
    // Generate 4-digit OTP
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);

    // Generate Expiration Time string (20 mins from now)
    const expireTime = new Date(new Date().getTime() + 20 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          email: formData.patientEmail,
          passcode: newOtp,
          time: expireTime,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      
      setStep(2);
      setTimer(60); // Giving 60s since emails take a bit longer than SMS
    } catch (error) {
      console.error('Failed to send OTP email', error);
      alert('Failed to send OTP email. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp && timer > 0) {
      // Dispatch to Redux
      dispatch(
        addAppointment({
          id: Math.floor(Math.random() * 10000), // Mock ID
          ...formData,
          status: 'Pending',
        })
      );
      setStep(3); // Success
    } else if (timer === 0) {
      alert('OTP expired. Please resend.');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    setIsSendingOtp(true);
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);

    // Generate Expiration Time string (20 mins from now)
    const expireTime = new Date(new Date().getTime() + 20 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          email: formData.patientEmail,
          passcode: newOtp,
          time: expireTime,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setTimer(60);
      setOtp('');
    } catch (error) {
      console.error('Failed to resend OTP', error);
      alert('Failed to resend OTP email. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-[28px] font-extrabold text-slate-900 leading-tight">Request Appointment</h2>
            <p className="text-slate-500 font-medium mt-1">
              with <span className="text-blue-600 font-bold">{formData.doctorName}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto px-8 pb-8 custom-scrollbar">
          
          {step === 1 && (
            <form onSubmit={handleFormSubmit} className="space-y-6 mt-4">
              {/* PATIENT NAME */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Patient Name *</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* PHONE AND EMAIL (GRID) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Phone Number *</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-slate-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      required
                      type="tel"
                      name="patientPhone"
                      value={formData.patientPhone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Email Address *</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-slate-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      required
                      type="email"
                      name="patientEmail"
                      value={formData.patientEmail}
                      onChange={handleChange}
                      placeholder="patient@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* PREFERRED DATE */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Preferred Date *</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400 pointer-events-none">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* AVAILABLE SCHEDULE / SLOTS */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Available Schedule / Slots *</label>
                <div className="flex flex-wrap gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, timeSlot: slot }))}
                      className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all border ${
                        formData.timeSlot === slot 
                        ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* CONSULTATION MODE */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Consultation Mode</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, consultationType: 'In-Person' }))}
                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${
                      formData.consultationType === 'In-Person'
                      ? 'bg-slate-900 text-white shadow-lg'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    In-Person Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, consultationType: 'Online Video' }))}
                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${
                      formData.consultationType === 'Online Video'
                      ? 'bg-slate-900 text-white shadow-lg'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Video className="w-5 h-5" />
                    Online Video
                  </button>
                </div>
              </div>

              {/* NOTES */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any specific symptoms or reasons for visit?"
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none custom-scrollbar"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSendingOtp ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Request Appointment"
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="mt-8 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Verification Required</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                We've sent a verification code to <strong>{formData.patientEmail}</strong>. Please enter it below to confirm your appointment.
              </p>

              <form onSubmit={handleVerifyOtp} className="max-w-xs mx-auto space-y-6">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP (e.g. 1234)"
                  className="w-full text-center tracking-widest text-2xl font-bold bg-slate-50 border border-slate-200 rounded-2xl py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={4}
                  required
                />
                
                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-colors"
                  >
                    Verify & Book
                  </button>
                  
                  <div className="text-sm font-medium text-slate-500">
                    {timer > 0 ? (
                      <span>Code expires in <strong className="text-red-500">{timer}s</strong></span>
                    ) : (
                      <button 
                        type="button" 
                        onClick={handleResendOtp} 
                        disabled={isSendingOtp}
                        className="text-blue-600 font-bold hover:underline disabled:opacity-50 disabled:no-underline"
                      >
                        {isSendingOtp ? "Sending..." : "Resend OTP"}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="mt-8 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Appointment Confirmed!</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Your appointment with {formData.doctorName} on {formData.appointmentDate} has been successfully booked.
              </p>
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl transition-colors"
              >
                Close Window
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
