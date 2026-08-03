import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  User, 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  FileText,
  Check, 
  X, 
  LogOut, 
  Search, 
  Filter,
  CheckCircle,
  Clock3,
  XCircle,
  AlertCircle,
  Video
} from 'lucide-react';
import defaultProfile from '../../assets/default-profile.jpg';

interface Appointment {
  id: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  appointmentDate: string;
  timeSlot: string;
  consultationType: string;
  notes: string;
  status: string;
  doctorId: number;
  doctorName: string;
  doctorSpecialization: string;
}

interface DoctorProfile {
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
  consultationFee: number;
  role: string;
  profileImagePath: string | null;
}

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [successToast, setSuccessToast] = useState('');

  const token = localStorage.getItem('doctorToken');

  useEffect(() => {
    if (!token) {
      navigate('/doctor');
      return;
    }

    const loadDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Fetch Profile
        const profileRes = await fetch('http://localhost:8081/hms-doctor/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!profileRes.ok) throw new Error('Failed to load profile');
        const profileData = await profileRes.json();
        setProfile(profileData);

        // 2. Fetch Appointments
        const appointmentsRes = await fetch('http://localhost:8081/hms-doctor/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!appointmentsRes.ok) throw new Error('Failed to load appointments');
        const appointmentsData = await appointmentsRes.json();
        setAppointments(appointmentsData);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Error connecting to server.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [token, navigate]);

  const handleUpdateStatus = async (appointmentId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8081/hms-doctor/appointments/${appointmentId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const updated = await response.json();
        setAppointments(prev => prev.map(app => app.id === appointmentId ? updated : app));
        
        // Show success toast
        setSuccessToast(`Appointment successfully ${newStatus.toLowerCase()}ed!`);
        setTimeout(() => setSuccessToast(''), 3000);
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('doctorUsername');
    localStorage.removeItem('doctorRole');
    navigate('/doctor');
  };

  // Metrics
  const totalBooked = appointments.length;
  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
  const approvedCount = appointments.filter(a => a.status === 'APPROVED').length;

  // Filter & Search Logic
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = 
      app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.patientPhone.includes(searchTerm) ||
      (app.notes && app.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = statusFilter === 'ALL' ? true : app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => b.appointmentDate.localeCompare(a.appointmentDate));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold text-sm">Loading Doctor Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-teal-50 blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-50/70 blur-3xl" />
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          {successToast}
        </div>
      )}

      {/* Left Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col hidden lg:flex shrink-0 shadow-lg shadow-slate-100/50 z-20">
        {/* Brand */}
        <div className="h-20 flex items-center px-8 border-b border-slate-100 gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-teal-800 to-emerald-600 bg-clip-text text-transparent">
            Doctor Portal
          </span>
        </div>

        {/* Profile Card */}
        {profile && (
          <div className="p-6 border-b border-slate-100 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <img
                src={profile.profileImagePath ? `http://localhost:8081${profile.profileImagePath}` : defaultProfile}
                alt={profile.fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultProfile;
                }}
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight">{profile.fullName}</h3>
            <p className="text-xs text-teal-600 font-bold uppercase tracking-wider mt-1">{profile.specialization}</p>
            
            <div className="w-full mt-6 bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Doctor ID</span>
                <span className="font-bold text-slate-700">{profile.doctorId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">License No</span>
                <span className="font-bold text-slate-700">{profile.licenseNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Experience</span>
                <span className="font-bold text-slate-700">{profile.yearsOfExperience} Years</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Consult Fee</span>
                <span className="font-extrabold text-slate-700">${profile.consultationFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Location</span>
                <span className="font-bold text-slate-700 truncate max-w-[130px]">{profile.departmentWardAssignment || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation / Actions */}
        <div className="flex-1 px-6 py-6 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="bg-teal-50 text-teal-800 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold shadow-sm shadow-teal-500/5">
              <Calendar className="w-5 h-5 text-teal-600" />
              My Booked Slots
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 border border-dashed border-red-200 hover:border-red-300 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Right Content View */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 bg-white/60 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Welcome back, {profile ? profile.fullName.split(' ')[0] : 'Doctor'}
            </h1>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">Here is your clinic schedule overview</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="lg:hidden p-2 text-slate-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>

            <div className="hidden lg:flex items-center gap-3 pl-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center font-bold text-white shadow-lg shadow-teal-600/20">
                {profile ? profile.fullName.substring(0, 2).toUpperCase() : 'DR'}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  {profile?.fullName}
                </p>
                <span className="text-xs text-teal-600 font-bold uppercase tracking-wider">
                  Doctor Account
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 p-8 space-y-8 max-w-6xl w-full mx-auto">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-2xl flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm text-red-700 font-semibold">{error}</div>
            </div>
          )}

          {/* Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Appointments</span>
                <span className="text-2xl font-extrabold text-slate-800 block mt-0.5">{totalBooked}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Clock3 className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Review</span>
                <span className="text-2xl font-extrabold text-slate-800 block mt-0.5">{pendingCount}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Approved Slots</span>
                <span className="text-2xl font-extrabold text-slate-800 block mt-0.5">{approvedCount}</span>
              </div>
            </div>
          </div>

          {/* Booked Slots Appointments Management Area */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Toolbar */}
            <div className="p-6 border-b border-slate-100 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4 bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Clinic Appointment Schedule</h2>
                <p className="text-slate-400 text-xs font-semibold mt-0.5">Filter, find, and update patients booked on your clinic slots</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search patient or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all w-60"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List / Table of Bookings */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Patient Details</th>
                    <th className="py-4 px-6">Appointment Slot</th>
                    <th className="py-4 px-6">Consult Mode</th>
                    <th className="py-4 px-6">Notes / Symtoms</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Patient Details */}
                      <td className="py-4.5 px-6">
                        <div className="font-bold text-slate-800 text-sm">{app.patientName}</div>
                        <div className="space-y-0.5 mt-1 text-slate-400 font-semibold flex flex-col">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-slate-400" /> {app.patientEmail}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400" /> {app.patientPhone}
                          </span>
                        </div>
                      </td>

                      {/* Appointment Slot */}
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" />
                          {app.appointmentDate}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 font-semibold mt-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {app.timeSlot}
                        </div>
                      </td>

                      {/* Consult Mode */}
                      <td className="py-4.5 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                          app.consultationType.toLowerCase().includes('video') 
                          ? 'bg-purple-50 text-purple-700' 
                          : 'bg-blue-50 text-blue-700'
                        }`}>
                          {app.consultationType.toLowerCase().includes('video') ? <Video className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {app.consultationType}
                        </span>
                      </td>

                      {/* Notes */}
                      <td className="py-4.5 px-6 max-w-xs">
                        {app.notes ? (
                          <div className="flex items-start gap-1.5 text-slate-500 font-medium">
                            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <p className="line-clamp-2 leading-relaxed">{app.notes}</p>
                          </div>
                        ) : (
                          <span className="text-slate-300 italic">No notes provided</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4.5 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase ${
                          app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                          app.status === 'CANCELLED' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {app.status === 'APPROVED' && <CheckCircle className="w-3 h-3" />}
                          {app.status === 'CANCELLED' && <XCircle className="w-3 h-3" />}
                          {app.status === 'PENDING' && <Clock3 className="w-3 h-3" />}
                          {app.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {app.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-2 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
                                title="Approve Appointment"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'CANCELLED')}
                                className="bg-red-50 hover:bg-red-100 text-red-700 p-2 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
                                title="Cancel Appointment"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {app.status === 'APPROVED' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'CANCELLED')}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 hover:border-red-200 transition-all text-[10px] font-bold cursor-pointer"
                            >
                              Cancel Booking
                            </button>
                          )}
                          {app.status === 'CANCELLED' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all text-[10px] font-bold cursor-pointer"
                            >
                              Re-Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p className="text-sm font-semibold">No appointments found matching your search.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
