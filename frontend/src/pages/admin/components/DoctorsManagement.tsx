import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Eye,
  Phone,
  Mail,
  Award,
  DollarSign,
  Clock,
  ArrowUpDown,
  Stethoscope,
  Briefcase,
  Upload,
  Shield,
  MapPin,
  Calendar
} from 'lucide-react';
import defaultProfile from '../../../assets/default-profile.jpg';

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
  role: string;
  profileImagePath: string | null;
  password?: string;
}

export const DoctorsManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [previewDoctor, setPreviewDoctor] = useState<Doctor | null>(null);
  const [previewDoctorAppointments, setPreviewDoctorAppointments] = useState<any[]>([]);
  const [loadingPreviewAppointments, setLoadingPreviewAppointments] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch appointments for the previewed doctor
  useEffect(() => {
    if (previewDoctor) {
      const fetchPreviewDoctorAppointments = async () => {
        setLoadingPreviewAppointments(true);
        try {
          const response = await fetch(`http://localhost:8081/hms-admin/appointments/doctor/${previewDoctor.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setPreviewDoctorAppointments(data);
          } else {
            console.error('Failed to fetch doctor appointments');
            setPreviewDoctorAppointments([]);
          }
        } catch (err) {
          console.error('Error fetching doctor appointments:', err);
          setPreviewDoctorAppointments([]);
        } finally {
          setLoadingPreviewAppointments(false);
        }
      };
      fetchPreviewDoctorAppointments();
    } else {
      setPreviewDoctorAppointments([]);
    }
  }, [previewDoctor]);

  // Filtering & Sorting states
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'experience' | 'fee'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Image Upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Doctor>>({
    fullName: '',
    specialization: '',
    email: '',
    contactNumber: '',
    licenseNumber: '',
    yearsOfExperience: 0,
    consultationFee: 0.0,
    departmentWardAssignment: '',
    qualifications: [],
    consultationTypes: [],
    availability: [],
    password: ''
  });

  const [qualificationsText, setQualificationsText] = useState('');
  const [consultationTypesText, setConsultationTypesText] = useState('');
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '17:00'
  });

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:8081/hms-admin/doctors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        console.error('Failed to fetch doctors');
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Handle local image file URL preview creation & cleanup
  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleOpenModal = (doc?: Doctor) => {
    setImageFile(null);
    setImagePreviewUrl(null);
    if (doc) {
      setEditingDoctor(doc);
      setFormData({
        ...doc,
        password: ''
      });
      setQualificationsText(doc.qualifications ? doc.qualifications.join(', ') : '');
      setConsultationTypesText(doc.consultationTypes ? doc.consultationTypes.join(', ') : '');
    } else {
      setEditingDoctor(null);
      setFormData({
        fullName: '',
        specialization: '',
        email: '',
        contactNumber: '',
        licenseNumber: '',
        yearsOfExperience: 0,
        consultationFee: 0.0,
        departmentWardAssignment: '',
        qualifications: [],
        consultationTypes: [],
        availability: [],
        password: ''
      });
      setQualificationsText('');
      setConsultationTypesText('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDoctor(null);
    setImageFile(null);
    setImagePreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = {
        fullName: formData.fullName,
        specialization: formData.specialization,
        email: formData.email,
        contactNumber: formData.contactNumber,
        licenseNumber: formData.licenseNumber,
        yearsOfExperience: Number(formData.yearsOfExperience),
        consultationFee: Number(formData.consultationFee),
        departmentWardAssignment: formData.departmentWardAssignment,
        qualifications: qualificationsText.split(',').map(q => q.trim()).filter(Boolean),
        consultationTypes: consultationTypesText.split(',').map(c => c.trim()).filter(Boolean),
        availability: formData.availability
      };

      if (formData.password && formData.password.trim() !== '') {
        payload.password = formData.password;
      }

      const formDataToSend = new FormData();
      const doctorJson = JSON.stringify(payload);
      formDataToSend.append('doctor', new Blob([doctorJson], { type: 'application/json' }));

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const url = editingDoctor
        ? `http://localhost:8081/hms-admin/doctors/${editingDoctor.id}`
        : 'http://localhost:8081/hms-admin/doctors';

      const method = editingDoctor ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        handleCloseModal();
        fetchDoctors();
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.message || 'Failed to save doctor details');
      }
    } catch (err) {
      console.error('Error saving doctor:', err);
      alert('Error connecting to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this doctor profile?')) {
      try {
        const response = await fetch(`http://localhost:8081/hms-admin/doctors/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        if (response.ok) {
          fetchDoctors();
        } else {
          alert('Failed to delete doctor');
        }
      } catch (err) {
        console.error('Error deleting doctor:', err);
      }
    }
  };

  // Get unique specialties for the filter list
  const allSpecialties = Array.from(new Set(doctors.map(d => d.specialization).filter(Boolean)));

  // Filter & Sort Doctors
  const filteredAndSortedDoctors = doctors
    .filter(d => {
      const nameMatch = d.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
      const specialtyMatch = d.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
      const idMatch = d.doctorId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = nameMatch || specialtyMatch || idMatch;

      const matchesSpecialty = selectedSpecialty ? d.specialization === selectedSpecialty : true;
      const matchesDay = selectedDay
        ? d.availability?.some(slot => slot.dayOfWeek.toUpperCase() === selectedDay.toUpperCase())
        : true;

      return matchesSearch && matchesSpecialty && matchesDay;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = (a.fullName || '').localeCompare(b.fullName || '');
      } else if (sortBy === 'experience') {
        comparison = (a.yearsOfExperience || 0) - (b.yearsOfExperience || 0);
      } else if (sortBy === 'fee') {
        comparison = (a.consultationFee || 0) - (b.consultationFee || 0);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Calculate Metrics stats
  // const totalDoctors = doctors.length;
  // const uniqueSpecialtiesCount = allSpecialties.length;
  // const totalWeeklySlots = doctors.reduce((acc, curr) => acc + (curr.availability?.length || 0), 0);
  // const avgFee = doctors.length > 0
  //   ? doctors.reduce((acc, curr) => acc + (curr.consultationFee || 0), 0) / doctors.length
  //   : 0;

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Doctors Management</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Configure doctor rosters, professional profiles, and weekly clinic schedules</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2.5 transition-all shadow-md shadow-blue-500/10 text-sm font-semibold cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" /> Add Doctor
        </button>
      </div>

      {/* Metric Cards Banner */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Doctors</span>
            <span className="text-2xl font-extrabold text-slate-800 block mt-0.5">{totalDoctors}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Specialties</span>
            <span className="text-2xl font-extrabold text-slate-800 block mt-0.5">{uniqueSpecialtiesCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Weekly Slots</span>
            <span className="text-2xl font-extrabold text-slate-800 block mt-0.5">{totalWeeklySlots}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Avg. Fee</span>
            <span className="text-2xl font-extrabold text-slate-800 block mt-0.5">${avgFee.toFixed(2)}</span>
          </div>
        </div>
      </div> */}

      {/* Filter and Control Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Specialty Filter */}
          <div className="flex items-center gap-1.5">
            {/* <Filter className="w-3.5 h-3.5 text-slate-400" /> */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">All Specialties</option>
              {allSpecialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Availability Day Filter */}
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">Any Schedule Day</option>
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            <option value="FRIDAY">Friday</option>
            <option value="SATURDAY">Saturday</option>
            <option value="SUNDAY">Sunday</option>
          </select>

          {/* Sort Toggles */}
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border-none bg-transparent px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none"
            >
              <option value="name">Sort by Name</option>
              <option value="experience">Sort by Experience</option>
              <option value="fee">Sort by Fee</option>
            </select>
            <button
              onClick={toggleSortOrder}
              className="p-1.5 hover:bg-slate-200 transition-colors text-slate-500 border-l border-slate-200"
              title={`Sort order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View Toggles */}
          {/* <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 transition-all ${viewMode === 'table' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div> */}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedDoctors.map(doctor => (
          <div
            key={doctor.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-200 transition-all duration-300 relative group flex flex-col justify-between"
          >
            <div>
              {/* ID badge & Action floaters */}
              <div className="flex justify-between items-start mb-4">
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide">
                  {doctor.doctorId || 'No ID'}
                </span>

                {/* Actions Bar */}
                <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-50 rounded-xl p-1 border border-slate-100">
                  <button
                    onClick={() => setPreviewDoctor(doctor)}
                    className="p-1.5 text-blue-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Quick Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenModal(doctor)}
                    className="p-1.5 text-amber-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Edit Profile"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(doctor.id)}
                    className="p-1.5 text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Delete Profile"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Profile Header Details */}
              <div className="flex items-center gap-4">
                <img
                  src={doctor.profileImagePath ? `http://localhost:8081${doctor.profileImagePath}` : defaultProfile}
                  alt={doctor.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow-sm shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultProfile;
                  }}
                />
                <div>
                  <h3 className="text-md font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                    {doctor.fullName}
                  </h3>
                  <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md mt-1.5 uppercase tracking-wide">
                    {doctor.specialization}
                  </span>
                </div>
              </div>

              {/* Info Fields */}
              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                {doctor.qualifications && doctor.qualifications.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doctor.qualifications.join(', ')}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{doctor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{doctor.contactNumber}</span>
                </div>
              </div>
            </div>

            {/* Sub-Card Bottom Analytics */}
            <div className="mt-5 bg-slate-50 border border-slate-100/50 rounded-xl p-3 grid grid-cols-2 gap-2 text-center text-xs">
              <div>
                <span className="block text-slate-400 font-semibold text-[10px] uppercase">Experience</span>
                <span className="font-extrabold text-slate-700 text-sm mt-0.5 block">{doctor.yearsOfExperience} Years</span>
              </div>
              <div className="border-l border-slate-200">
                <span className="block text-slate-400 font-semibold text-[10px] uppercase">Consultation</span>
                <span className="font-extrabold text-slate-700 text-sm mt-0.5 block">${doctor.consultationFee?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredAndSortedDoctors.length === 0 && (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
            <Stethoscope className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-semibold">No doctors found matching the filter criteria.</p>
          </div>
        )}
      </div>

      {/* Upgraded Modal Form: Create / Edit Doctor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor Profile'}</h3>
                <p className="text-slate-400 text-xs font-semibold mt-0.5">{editingDoctor ? `Editing details for ${formData.fullName}` : 'Create a new provider listing in the portal'}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Photo & Basic Details section */}
              <div className="flex flex-col sm:flex-row gap-5 items-center pb-5 border-b border-slate-100">
                <div className="relative group shrink-0">
                  <img
                    src={imagePreviewUrl || (editingDoctor?.profileImagePath ? `http://localhost:8081${editingDoctor.profileImagePath}` : defaultProfile)}
                    alt="Upload Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                  />
                  <label className="absolute inset-0 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="w-4.5 h-4.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formData.fullName || ''}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                      placeholder="Dr. Sarah Jenkins"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specialization</label>
                    <input
                      required
                      type="text"
                      value={formData.specialization || ''}
                      onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                      placeholder="e.g. Cardiology"
                    />
                  </div>
                </div>
              </div>

              {/* Login Credentials and Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email (Username)</label>
                  <input
                    required
                    type="email"
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    placeholder="jenkins@hospital.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Number</label>
                  <input
                    required
                    type="text"
                    value={formData.contactNumber || ''}
                    onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    placeholder="+919876543210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">License No.</label>
                  <input
                    required
                    type="text"
                    value={formData.licenseNumber || ''}
                    onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    placeholder="LIC-12345"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Exp (Years)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.yearsOfExperience || 0}
                    onChange={e => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fee ($)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.consultationFee || 0.0}
                    onChange={e => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold"
                  />
                </div>
              </div>

              {/* Qualifications & Consultation Types */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Qualifications</label>
                  <input
                    type="text"
                    value={qualificationsText}
                    onChange={e => setQualificationsText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    placeholder="MBBS, MD (comma separated)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Consultation Types</label>
                  <input
                    type="text"
                    value={consultationTypesText}
                    onChange={e => setConsultationTypesText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    placeholder="In-Person, Video (comma separated)"
                  />
                </div>
              </div>

              {/* Department and Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department/Ward Assignment</label>
                  <input
                    type="text"
                    value={formData.departmentWardAssignment || ''}
                    onChange={e => setFormData({ ...formData, departmentWardAssignment: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    placeholder="Cardiology Ward B"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Password {editingDoctor && "(Leave blank to preserve)"}
                  </label>
                  <input
                    type={editingDoctor ? "password" : "text"}
                    required={!editingDoctor}
                    value={formData.password || ''}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    placeholder="Temporary Password"
                  />
                </div>
              </div>

              {/* Interactive Availability Slot Scheduler */}
              <div className="border border-slate-200 p-4.5 rounded-2xl bg-slate-50/50 space-y-3">
                <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider">Availability Scheduler</label>

                {/* Existing added slots list */}
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {formData.availability?.map((slot, index) => (
                    <div key={index} className="flex justify-between items-center bg-white px-3.5 py-2 rounded-xl border border-slate-100 shadow-sm text-xs">
                      <span className="font-bold text-slate-700">{slot.dayOfWeek}</span>
                      <span className="text-slate-400 font-semibold">{slot.startTime} - {slot.endTime}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            availability: formData.availability?.filter((_, i) => i !== index)
                          });
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(!formData.availability || formData.availability.length === 0) && (
                    <p className="text-xs text-slate-400 italic text-center py-4 bg-white/55 border border-dashed border-slate-200 rounded-xl">No slots scheduled yet. Add availability slots below.</p>
                  )}
                </div>

                {/* Add new slots drawer */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/50">
                  <select
                    value={newSlot.dayOfWeek}
                    onChange={e => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
                    className="px-2.5 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-600 font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="MONDAY">Monday</option>
                    <option value="TUESDAY">Tuesday</option>
                    <option value="WEDNESDAY">Wednesday</option>
                    <option value="THURSDAY">Thursday</option>
                    <option value="FRIDAY">Friday</option>
                    <option value="SATURDAY">Saturday</option>
                    <option value="SUNDAY">Sunday</option>
                  </select>
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    className="px-2.5 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white text-slate-600 font-semibold focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    className="px-2.5 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white text-slate-600 font-semibold focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const formatTime = (time: string) => time.length === 5 ? `${time}:00` : time;
                    if (newSlot.startTime && newSlot.endTime) {
                      setFormData({
                        ...formData,
                        availability: [
                          ...(formData.availability || []),
                          {
                            dayOfWeek: newSlot.dayOfWeek,
                            startTime: formatTime(newSlot.startTime),
                            endTime: formatTime(newSlot.endTime)
                          }
                        ]
                      });
                      setNewSlot({ dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00' });
                    }
                  }}
                  className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 text-blue-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  + Add Clinic Hours
                </button>
              </div>

              {/* Modal controls */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold transition-colors text-sm cursor-pointer"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-md shadow-blue-500/10 text-sm cursor-pointer"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingDoctor ? 'Update Profile' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upgraded Preview Modal */}
      {previewDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Banner top */}
            <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
              <button
                onClick={() => setPreviewDoctor(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-1 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pb-6 relative">
              {/* Profile image overlapping the banner */}
              <div className="flex items-end gap-4 -mt-10 mb-4">
                <img
                  src={previewDoctor.profileImagePath ? `http://localhost:8081${previewDoctor.profileImagePath}` : defaultProfile}
                  alt={previewDoctor.fullName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultProfile;
                  }}
                />
                <div className="pb-1">
                  <h4 className="text-lg font-bold text-slate-800">{previewDoctor.fullName}</h4>
                  <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">{previewDoctor.specialization}</span>
                </div>
              </div>

              {/* Quick statistics layout grid */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">License</span>
                    <span className="text-xs font-extrabold text-slate-700 truncate block max-w-[130px]">{previewDoctor.licenseNumber}</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">Experience</span>
                    <span className="text-xs font-extrabold text-slate-700 block">{previewDoctor.yearsOfExperience} Years</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">Consult Fee</span>
                    <span className="text-xs font-extrabold text-slate-700 block">${previewDoctor.consultationFee?.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">Location</span>
                    <span className="text-xs font-extrabold text-slate-700 block truncate max-w-[130px]">{previewDoctor.departmentWardAssignment || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Structured attributes section */}
              <div className="mt-5 space-y-3.5 border-t border-slate-100 pt-4">
                {previewDoctor.qualifications && previewDoctor.qualifications.length > 0 && (
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Qualifications</span>
                    <div className="flex flex-wrap gap-1">
                      {previewDoctor.qualifications.map(q => (
                        <span key={q} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">{q}</span>
                      ))}
                    </div>
                  </div>
                )}

                {previewDoctor.consultationTypes && previewDoctor.consultationTypes.length > 0 && (
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Types of Consultations</span>
                    <div className="flex flex-wrap gap-1">
                      {previewDoctor.consultationTypes.map(c => (
                        <span key={c} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md">{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability Timetable display */}
                <div>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Clinic Consultation Hours
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {previewDoctor.availability?.map((slot, index) => (
                      <div key={index} className="flex justify-between items-center bg-slate-50 border border-slate-100/50 px-3 py-1.5 rounded-xl text-xs">
                        <span className="font-bold text-slate-600">{slot.dayOfWeek}</span>
                        <span className="text-slate-500 font-semibold">{slot.startTime} - {slot.endTime}</span>
                      </div>
                    ))}
                    {(!previewDoctor.availability || previewDoctor.availability.length === 0) && (
                      <p className="text-xs text-slate-400 italic">No schedule slots configured for this practitioner.</p>
                    )}
                  </div>
                </div>

                {/* Booked Slots Display */}
                <div className="border-t border-slate-100 pt-4">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase mb-2.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Booked Slots & Appointments
                  </span>
                  {loadingPreviewAppointments ? (
                    <div className="flex justify-center py-4">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : previewDoctorAppointments && previewDoctorAppointments.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {previewDoctorAppointments.map((app) => (
                        <div key={app.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-700">{app.appointmentDate}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                              app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                              app.status === 'CANCELLED' ? 'bg-red-50 text-red-700' :
                              'bg-amber-50 text-amber-700'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-slate-500 font-semibold">
                            <span>{app.timeSlot}</span>
                            <span className="text-slate-700 font-bold">{app.patientName}</span>
                          </div>
                          {app.notes && (
                            <p className="text-[10px] text-slate-400 italic bg-white/50 p-1.5 rounded-lg border border-slate-100">
                              Note: {app.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic text-center py-2 bg-slate-50 border border-dashed border-slate-200 rounded-xl">No active bookings for this doctor.</p>
                  )}
                </div>

                {/* Contact quick actions */}
                <div className="flex items-center gap-2.5 pt-2 text-xs border-t border-slate-100">
                  <a href={`mailto:${previewDoctor.email}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold transition-all">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </a>
                  <a href={`tel:${previewDoctor.contactNumber}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold transition-all">
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
