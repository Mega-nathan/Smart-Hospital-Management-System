import { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, Award, ArrowRight, CheckCircle2, User, Phone, Mail, FileText, Video, X, Search, SlidersHorizontal, ArrowUp, ArrowDown } from 'lucide-react';

interface AvailabilitySlot {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface Doctor {
  id: number;
  doctorId: string;
  fullName: string;
  specialization: string;
  qualifications: string[];
  licenseNumber: string;
  yearsOfExperience: number;
  contactNumber: string;
  email: string;
  consultationTypes: string[];
  departmentWardAssignment: string;
  availability: AvailabilitySlot[];
  consultationFee: number;
  profileImagePath: string | null;
}

export default function DoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  // Filtering & Sorting states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'experience' | 'fee'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Booking Form State
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [consultationType, setConsultationType] = useState('IN_PERSON');
  const [notes, setNotes] = useState('');
  
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch doctors list (public GET endpoint)
  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:8081/hms-admin/doctors');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        console.error('Failed to fetch doctors list');
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Handle booking submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !patientName || !patientPhone || !patientEmail || !appointmentDate || !selectedSlot) {
      setBookingError('Please fill out all required fields and pick a slot.');
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    const payload = {
      patientName,
      patientPhone,
      patientEmail,
      appointmentDate,
      timeSlot: selectedSlot,
      consultationType,
      notes,
      doctorId: selectedDoctor.id
    };

    try {
      const response = await fetch('http://localhost:8081/hms-public/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setBookingSuccess(data);
        // Clear fields
        setPatientName('');
        setPatientPhone('');
        setPatientEmail('');
        setAppointmentDate('');
        setSelectedSlot('');
        setNotes('');
      } else {
        const errText = await response.text();
        setBookingError(errText || 'Failed to submit booking. Please try again.');
      }
    } catch (err) {
      setBookingError('Network error connecting to booking server.');
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  // Close Booking Dialogs
  const handleCloseModal = () => {
    setSelectedDoctor(null);
    setBookingSuccess(null);
    setBookingError(null);
  };

  // Extract unique list of specialties for filter dropdown
  const specialties = Array.from(new Set(doctors.map(d => d.specialization).filter(Boolean)));

  // Filtered and Sorted Doctors List
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = 
      doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.qualifications.some(q => q.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecialty = selectedSpecialty ? doc.specialization === selectedSpecialty : true;

    const matchesDay = selectedDay
      ? doc.availability?.some(slot => slot.dayOfWeek.toUpperCase() === selectedDay.toUpperCase())
      : true;

    return matchesSearch && matchesSpecialty && matchesDay;
  }).sort((a, b) => {
    let valueA: any;
    let valueB: any;

    if (sortBy === 'name') {
      valueA = a.fullName.toLowerCase();
      valueB = b.fullName.toLowerCase();
      return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else if (sortBy === 'experience') {
      valueA = a.yearsOfExperience;
      valueB = b.yearsOfExperience;
    } else if (sortBy === 'fee') {
      valueA = a.consultationFee;
      valueB = b.consultationFee;
    }

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <section className="py-24 bg-slate-50 text-slate-800 font-sans" id="doctors-section">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 px-3 py-1 bg-blue-50 rounded-full">
            Our Medical Experts
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-3">
            Consult Specialists Online & In-Person
          </h2>
          <p className="text-sm sm:text-md text-slate-500 mt-3 font-medium">
            Book highly qualified healthcare professionals across multiple departments at BrightCare Hospital.
          </p>
        </div>

        {/* Filter and Search Controls (Admin-style Home Filter) */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm mb-12 flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, specialty, qualifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-400 focus:bg-white text-sm font-semibold transition-all"
              />
            </div>

            {/* Select Dropdowns */}
            <div className="w-full flex flex-col sm:flex-row gap-4 items-center flex-1 lg:justify-end">
              
              {/* Specialty Filter */}
              <div className="w-full sm:w-auto relative flex-1 max-w-[200px]">
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-400 focus:bg-white text-xs font-bold text-slate-600 appearance-none cursor-pointer"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Day Filter */}
              <div className="w-full sm:w-auto relative flex-1 max-w-[200px]">
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-400 focus:bg-white text-xs font-bold text-slate-600 appearance-none cursor-pointer"
                >
                  <option value="">Any Work Day</option>
                  <option value="MONDAY">Monday</option>
                  <option value="TUESDAY">Tuesday</option>
                  <option value="WEDNESDAY">Wednesday</option>
                  <option value="THURSDAY">Thursday</option>
                  <option value="FRIDAY">Friday</option>
                  <option value="SATURDAY">Saturday</option>
                  <option value="SUNDAY">Sunday</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Sort Controls */}
              <div className="flex gap-2 w-full sm:w-auto items-center">
                <div className="relative flex-1 sm:w-40">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-400 focus:bg-white text-xs font-bold text-slate-600 appearance-none cursor-pointer"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="experience">Sort by Experience</option>
                    <option value="fee">Sort by Fee</option>
                  </select>
                </div>
                
                <button
                  type="button"
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl transition-colors cursor-pointer text-slate-600 active:scale-95"
                  title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {sortOrder === 'asc' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-bold bg-white rounded-3xl border border-slate-100 shadow-sm">
            No doctors found matching the selected search filters.
          </div>
        ) : (
          /* Doctors Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => (
              <div 
                key={doc.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Doctor Avatar / Top Info */}
                <div className="p-6 flex gap-4 border-b border-slate-50">
                  <div className="relative shrink-0">
                    {doc.profileImagePath ? (
                      <img 
                        src={`http://localhost:8081${doc.profileImagePath}`}
                        alt={doc.fullName}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-50 group-hover:border-blue-100 transition-colors"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                        <User className="w-7 h-7" />
                      </div>
                    )}
                    {/* Active availability dot */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Available for booking" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-md text-slate-900 leading-tight group-hover:text-blue-600 transition-colors truncate">
                      {doc.fullName}
                    </h3>
                    <p className="text-[13px] font-bold text-blue-600 mt-1 truncate">
                      {doc.specialization}
                    </p>
                    {/* Display Qualifications */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.qualifications.map((q, idx) => (
                        <span key={idx} className="bg-slate-50 text-[10px] text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-100">
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 space-y-3.5 flex-1 text-[13px] font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Experience: <strong className="text-slate-800 font-bold">{doc.yearsOfExperience} Years</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Consultation Fee: <strong className="text-slate-900 font-bold">${doc.consultationFee}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div className="truncate">
                      <span>Schedule: </span>
                      <strong className="text-slate-800 font-bold">
                        {doc.availability && doc.availability.length > 0
                          ? doc.availability.map(a => a.dayOfWeek.substring(0, 3)).join(', ')
                          : 'On Call'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Booking Call Action */}
                <div className="p-6 pt-0 mt-auto">
                  <button
                    onClick={() => setSelectedDoctor(doc)}
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all shadow-md hover:shadow-blue-200 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Book Appointment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Interactive Glassmorphic Booking Form */}
        {selectedDoctor && !bookingSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-xl bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Request Appointment</h3>
                  <p className="text-[13px] font-bold text-slate-500 mt-0.5">
                    with <strong className="text-blue-600 font-extrabold">{selectedDoctor.fullName}</strong>
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 font-sans text-sm">
                
                {bookingError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold text-xs">
                    {bookingError}
                  </div>
                )}

                {/* Patient Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter full name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-2xl outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Phone & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="Enter phone number"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-2xl outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="patient@example.com"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-2xl outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Appointment Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-2xl outline-none transition-all font-semibold cursor-pointer"
                    />
                  </div>
                </div>

                {/* Time Slots (Rendered as active slot chips) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Available Schedule / Slots *</label>
                  {selectedDoctor.availability && selectedDoctor.availability.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {selectedDoctor.availability.map((slot, idx) => {
                        const slotStr = `${slot.dayOfWeek}: ${slot.startTime} - ${slot.endTime}`;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedSlot(slotStr)}
                            className={`p-3 border rounded-2xl font-bold text-xs text-left transition-all flex items-center justify-between cursor-pointer ${
                              selectedSlot === slotStr
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{slot.dayOfWeek}</span>
                            <span className="font-extrabold opacity-95">{slot.startTime} - {slot.endTime}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 font-bold text-xs text-center">
                      Flexible Timing / Contact Hospital Desk for Slots
                    </div>
                  )}
                </div>

                {/* Consultation Type Toggle */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Consultation Mode</label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setConsultationType('IN_PERSON')}
                      className={`py-3.5 border rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        consultationType === 'IN_PERSON'
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      In-Person Visit
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setConsultationType('VIDEO')}
                      className={`py-3.5 border rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        consultationType === 'VIDEO'
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      Online Video
                    </button>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Reason for Visit / Symptoms</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <textarea
                      placeholder="Briefly describe your medical concerns..."
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:bg-white rounded-2xl outline-none transition-all font-semibold resize-none"
                    />
                  </div>
                </div>

                {/* Form Action Footer */}
                <div className="pt-4 border-t border-slate-50 shrink-0">
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-2 cursor-pointer disabled:bg-blue-400"
                  >
                    {bookingLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Confirm Appointment Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Success Feedback Overlay */}
        {bookingSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-2xl p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Appointment Request Submitted!</h3>
              <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                Your request has been recorded. The administration team will verify and approve your slot shortly.
              </p>

              {/* Reference Info Card */}
              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-6 text-left space-y-2 text-xs font-bold text-slate-600">
                <div className="flex justify-between">
                  <span>Patient:</span>
                  <span className="text-slate-800">{bookingSuccess.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Doctor:</span>
                  <span className="text-slate-800">{bookingSuccess.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Slot:</span>
                  <span className="text-slate-800">{bookingSuccess.appointmentDate} ({bookingSuccess.timeSlot.split(':')[0]})</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-emerald-600 uppercase tracking-widest">{bookingSuccess.status}</span>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-full mt-8 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all cursor-pointer"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
