import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X, 
  Eye, 
  Phone, 
  Calendar, 
  ArrowUpDown, 
  Filter,
  User,
  Heart,
  Activity,
  CheckCircle,
  FileText
} from 'lucide-react';

interface Patient {
  id: number;
  patientId: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contact: string;
  admissionDate: string;
  problem: string;
  status: 'Admitted' | 'Discharged' | 'Under Observation';
}

export const PatientsManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [previewPatient, setPreviewPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter & Sort states
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'admissionDate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [formData, setFormData] = useState<Partial<Patient>>({
    name: '',
    age: 0,
    gender: 'Male',
    bloodGroup: 'A+',
    contact: '',
    admissionDate: '',
    problem: '',
    status: 'Admitted'
  });

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:8081/hms-admin/patients', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        console.error('Failed to fetch patients');
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  useEffect(() => {
    fetchPatients();

    // Establish real-time SSE stream subscription
    const eventSource = new EventSource('http://localhost:8081/hms-admin/realtime/stream');
    
    eventSource.addEventListener('patients', (event) => {
      console.log('Real-time patients notification received:', event.data);
      fetchPatients();
    });

    eventSource.onerror = (err) => {
      console.error('SSE Connection failed. Re-connecting...', err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleOpenModal = (pat?: Patient) => {
    if (pat) {
      setEditingPatient(pat);
      setFormData(pat);
    } else {
      setEditingPatient(null);
      setFormData({
        name: '',
        age: 0,
        gender: 'Male',
        bloodGroup: 'A+',
        contact: '',
        admissionDate: new Date().toISOString().split('T')[0],
        problem: '',
        status: 'Admitted'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingPatient
        ? `http://localhost:8081/hms-admin/patients/${editingPatient.id}`
        : 'http://localhost:8081/hms-admin/patients';

      const method = editingPatient ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        handleCloseModal();
        fetchPatients();
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.message || 'Failed to save patient records');
      }
    } catch (err) {
      console.error('Error saving patient:', err);
      alert('Error connecting to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to permanently delete this patient record?')) {
      try {
        const response = await fetch(`http://localhost:8081/hms-admin/patients/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        if (response.ok) {
          fetchPatients();
        } else {
          alert('Failed to delete patient record');
        }
      } catch (err) {
        console.error('Error deleting patient:', err);
      }
    }
  };

  // Get unique blood groups
  const bloodGroups = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'];

  // Filter & Sort
  const filteredAndSortedPatients = patients
    .filter(p => {
      const nameMatch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const idMatch = p.patientId?.toLowerCase().includes(searchTerm.toLowerCase());
      const problemMatch = p.problem?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = nameMatch || idMatch || problemMatch;

      const matchesStatus = selectedStatus ? p.status === selectedStatus : true;
      const matchesBlood = selectedBloodGroup ? p.bloodGroup === selectedBloodGroup : true;

      return matchesSearch && matchesStatus && matchesBlood;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'age') {
        comparison = (a.age || 0) - (b.age || 0);
      } else if (sortBy === 'admissionDate') {
        comparison = (a.admissionDate || '').localeCompare(b.admissionDate || '');
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Metrics
  const totalPatients = patients.length;
  const admittedCount = patients.filter(p => p.status === 'Admitted').length;
  const observationCount = patients.filter(p => p.status === 'Under Observation').length;
  const dischargedCount = patients.filter(p => p.status === 'Discharged').length;

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Get soft color for initial profile indicator circle
  const getAvatarBgColor = (name: string) => {
    const code = name.charCodeAt(0) % 5;
    if (code === 0) return 'bg-blue-50 text-blue-600';
    if (code === 1) return 'bg-emerald-50 text-emerald-600';
    if (code === 2) return 'bg-amber-50 text-amber-600';
    if (code === 3) return 'bg-rose-50 text-rose-600';
    return 'bg-indigo-50 text-indigo-600';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Patients Management</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Record patient admissions, demographics, and observational statuses in real-time</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2.5 transition-all shadow-md shadow-blue-500/10 text-sm font-semibold cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" /> Add Patient
        </button>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Patients</span>
            <span className="text-2xl font-extrabold text-slate-800 block mt-0.5">{totalPatients}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Admitted</span>
            <span className="text-2xl font-extrabold text-slate-800 block mt-0.5">{admittedCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Observation</span>
            <span className="text-2xl font-extrabold text-slate-800 block mt-0.5">{observationCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Discharged</span>
            <span className="text-2xl font-extrabold text-slate-800 block mt-0.5">{dischargedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, name or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Admitted">Admitted</option>
              <option value="Under Observation">Under Observation</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>

          {/* Blood Group Filter */}
          <select
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">All Blood Groups</option>
            {bloodGroups.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>

          {/* Sort Toggles */}
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border-none bg-transparent px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none"
            >
              <option value="name">Sort by Name</option>
              <option value="age">Sort by Age</option>
              <option value="admissionDate">Sort by Admit Date</option>
            </select>
            <button 
              onClick={toggleSortOrder}
              className="p-1.5 hover:bg-slate-200 transition-colors text-slate-500 border-l border-slate-200"
              title={`Sort order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedPatients.map(patient => (
          <div 
            key={patient.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-200 transition-all duration-300 relative group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide">
                  {patient.patientId || 'No ID'}
                </span>
                
                {/* Actions Bar */}
                <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-50 rounded-xl p-1 border border-slate-100">
                  <button 
                    onClick={() => setPreviewPatient(patient)}
                    className="p-1.5 text-blue-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Quick Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleOpenModal(patient)}
                    className="p-1.5 text-amber-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Edit Profile"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(patient.id)}
                    className="p-1.5 text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Delete Profile"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Profile Header Details */}
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-inner shrink-0 ${getAvatarBgColor(patient.name)}`}>
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-md font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                    {patient.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wide ${
                      patient.status === 'Admitted' ? 'bg-red-50 text-red-700' :
                      patient.status === 'Discharged' ? 'bg-green-50 text-green-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {patient.status}
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {patient.bloodGroup}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Fields */}
              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{patient.age} Years • {patient.gender}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Admitted: {patient.admissionDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Diagnosis: {patient.problem || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Sub-Card Bottom Contact */}
            <div className="mt-5 bg-slate-50 border border-slate-100/50 rounded-xl p-3 flex items-center gap-2 text-xs">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-600">{patient.contact}</span>
            </div>
          </div>
        ))}

        {filteredAndSortedPatients.length === 0 && (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
            <User className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-semibold">No patients found matching the criteria.</p>
          </div>
        )}
      </div>

      {/* Modal Form: Add / Edit Patient */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{editingPatient ? 'Edit Patient Record' : 'Add Patient Admission'}</h3>
                <p className="text-slate-400 text-xs font-semibold mt-0.5">{editingPatient ? `Editing file for ${formData.name}` : 'Register a new patient and assign status'}</p>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name || ''} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" 
                    placeholder="Robert Downey" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Number</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.contact || ''} 
                    onChange={e => setFormData({ ...formData, contact: e.target.value })} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" 
                    placeholder="+919876543210" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Age</label>
                  <input 
                    required 
                    type="number" 
                    min="0"
                    value={formData.age || 0} 
                    onChange={e => setFormData({ ...formData, age: Number(e.target.value) })} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender</label>
                  <select 
                    value={formData.gender || 'Male'}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Blood Group</label>
                  <select 
                    value={formData.bloodGroup || 'A+'}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
                  >
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Admission Date</label>
                  <input 
                    required 
                    type="date" 
                    value={formData.admissionDate || ''} 
                    onChange={e => setFormData({ ...formData, admissionDate: e.target.value })} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                  <select 
                    value={formData.status || 'Admitted'}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
                  >
                    <option value="Admitted">Admitted</option>
                    <option value="Under Observation">Under Observation</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chief Complaint / Problem</label>
                <textarea 
                  required 
                  value={formData.problem || ''} 
                  onChange={e => setFormData({ ...formData, problem: e.target.value })} 
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" 
                  placeholder="Describe patient condition or diagnosis details..."
                />
              </div>

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
                  {loading ? 'Saving...' : editingPatient ? 'Update Patient' : 'Register Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upgraded Preview Modal */}
      {previewPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Banner top */}
            <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
              <button 
                onClick={() => setPreviewPatient(null)} 
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-1 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="px-6 pb-6 relative">
              <div className="flex items-end gap-4 -mt-10 mb-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl border-4 border-white shadow-md shrink-0 ${getAvatarBgColor(previewPatient.name)}`}>
                  {previewPatient.name.charAt(0)}
                </div>
                <div className="pb-1">
                  <h4 className="text-lg font-bold text-slate-800">{previewPatient.name}</h4>
                  <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">{previewPatient.patientId}</span>
                </div>
              </div>

              {/* Patient statistics */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Status</span>
                  <span className={`text-xs font-bold uppercase ${
                    previewPatient.status === 'Admitted' ? 'text-red-600' :
                    previewPatient.status === 'Discharged' ? 'text-green-600' :
                    'text-amber-600'
                  }`}>{previewPatient.status}</span>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Blood Group</span>
                  <span className="text-xs font-extrabold text-slate-700">{previewPatient.bloodGroup}</span>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Age & Gender</span>
                  <span className="text-xs font-extrabold text-slate-700">{previewPatient.age} Yrs • {previewPatient.gender}</span>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Admit Date</span>
                  <span className="text-xs font-extrabold text-slate-700">{previewPatient.admissionDate}</span>
                </div>
              </div>

              <div className="mt-5 space-y-3.5 border-t border-slate-100 pt-4">
                <div>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Chief Complaint</span>
                  <p className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs text-slate-700 font-medium leading-relaxed">
                    {previewPatient.problem || 'No condition details added.'}
                  </p>
                </div>

                {/* Contact info */}
                <div>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase mb-1.5">Family Contact</span>
                  <a href={`tel:${previewPatient.contact}`} className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold transition-all">
                    <Phone className="w-3.5 h-3.5" /> Call {previewPatient.contact}
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
