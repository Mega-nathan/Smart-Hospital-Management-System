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

interface DoctorsListProps {
  onBookAppointment?: (doctorId: number, doctorName: string) => void;
}

export default function DoctorsList({ onBookAppointment }: DoctorsListProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Sorting states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'experience' | 'fee'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
                    onClick={() => onBookAppointment && onBookAppointment(doc.id, doc.fullName)}
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
      </div>
    </section>
  );
}
