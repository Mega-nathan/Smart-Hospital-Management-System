import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Calendar, Video, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addAppointment } from '../../../store/appointmentSlice';

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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Email Input, 2: OTP verification, 3: Full Details, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    appointmentDate: '',
    timeSlot: '10:00 AM - 11:30 AM',
    consultationType: 'In-Person',
    notes: '',
    doctorId: prefilledDoctorId || 1,
    doctorName: prefilledDoctorName || 'Dr. Pawan',
  });

  // Available slots
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
      setTimer(60);
      setEmail('');
      setOtp('');
      setError('');
      setLoading(false);
      setFormData(prev => ({
        ...prev,
        patientName: '',
        patientPhone: '',
        appointmentDate: '',
        timeSlot: '10:00 AM - 11:30 AM',
        consultationType: 'In-Person',
        notes: '',
        doctorId: prefilledDoctorId || 1,
        doctorName: prefilledDoctorName || 'Dr. Pawan',
      }));
    }
  }, [isOpen, prefilledDoctorId, prefilledDoctorName]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/hms-public/appointments/send-otp?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });
      if (response.ok) {
        setStep(2);
        setTimer(60);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || 'Failed to send verification code. Please check your email.');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      setError('Connection failed. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the 4-digit verification code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/hms-public/appointments/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, {
        method: 'POST',
      });
      if (response.ok) {
        setStep(3);
      } else {
        setError('Invalid or expired verification code. Please try again.');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError('Verification failed due to a network connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/hms-public/appointments/send-otp?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });
      if (response.ok) {
        setTimer(60);
        setOtp('');
      } else {
        setError('Failed to resend code.');
      }
    } catch (err) {
      setError('Network error resending verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.patientPhone || !formData.appointmentDate) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/hms-public/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: formData.patientName,
          patientPhone: formData.patientPhone,
          patientEmail: email,
          appointmentDate: formData.appointmentDate,
          timeSlot: formData.timeSlot,
          consultationType: formData.consultationType,
          notes: formData.notes,
          doctorId: formData.doctorId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        dispatch(addAppointment(result));
        setStep(4);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || 'Failed to save appointment. Please try again.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError('Failed to book appointment due to connection issue.');
    } finally {
      setLoading(false);
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
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto px-8 pb-8 custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm text-red-700 font-medium">{error}</div>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6 mt-4">
              <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50 mb-2">
                <p className="text-sm text-blue-800 font-medium leading-relaxed">
                  We use secure SMTP email verification to protect patient accounts. Please enter your email address to receive a 4-digit verification code before proceeding.
                </p>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Verification Code
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 2 && (
            <div className="mt-4 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Verification Code Sent</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">
                We've sent a 4-digit code to <strong className="text-slate-800">{email}</strong>. Please enter it below.
              </p>

              <form onSubmit={handleVerifyOtp} className="max-w-xs mx-auto space-y-6">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="0000"
                  className="w-full text-center tracking-widest text-3xl font-extrabold bg-slate-50 border border-slate-200 rounded-2xl py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  maxLength={4}
                  required
                  disabled={loading}
                />
                
                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-colors cursor-pointer flex items-center justify-center disabled:opacity-75"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Verify & Continue'
                    )}
                  </button>
                  
                  <div className="text-sm font-semibold text-slate-500">
                    {timer > 0 ? (
                      <span>Code expires in <strong className="text-red-500">{timer}s</strong></span>
                    ) : (
                      <button 
                        type="button" 
                        onClick={handleResendOtp} 
                        disabled={loading}
                        className="text-blue-600 font-bold hover:underline cursor-pointer disabled:opacity-50"
                      >
                        {loading ? 'Resending...' : 'Resend Verification Code'}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: Full Booking Form */}
          {step === 3 && (
            <form onSubmit={handleBookAppointment} className="space-y-6 mt-4">
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs font-bold w-fit">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Email Verified: {email}
              </div>

              {/* PATIENT NAME */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Patient Full Name *</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* PHONE */}
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Phone Number *</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type="tel"
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                    placeholder="Enter contact number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    disabled={loading}
                  />
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
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
                    disabled={loading}
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
                      disabled={loading}
                      onClick={() => setFormData((prev) => ({ ...prev, timeSlot: slot }))}
                      className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all border cursor-pointer ${
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
                    disabled={loading}
                    onClick={() => setFormData((prev) => ({ ...prev, consultationType: 'In-Person' }))}
                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all cursor-pointer ${
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
                    disabled={loading}
                    onClick={() => setFormData((prev) => ({ ...prev, consultationType: 'Online Video' }))}
                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all cursor-pointer ${
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
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any specific symptoms or reasons for visit?"
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none custom-scrollbar"
                  disabled={loading}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Confirm Appointment Booking"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && (
            <div className="mt-8 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Appointment Confirmed!</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">
                Your appointment with <strong className="text-slate-800">{formData.doctorName}</strong> on <strong className="text-slate-800">{formData.appointmentDate}</strong> at <strong className="text-slate-800">{formData.timeSlot}</strong> has been successfully booked and recorded in our system.
              </p>
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-10 rounded-2xl transition-colors cursor-pointer shadow-md shadow-blue-600/10"
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
