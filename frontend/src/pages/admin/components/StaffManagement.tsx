import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X, 
  Eye, 
  ArrowUpDown, 
  Filter,
  User,
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  Building
} from 'lucide-react';

interface Staff {
  id: number;
  staffId: string;
  name: string;
  role: string;
  department: string;
  shift: string; // Morning, Evening, Night
  status: 'Active' | 'Off Duty';
}

export const StaffManagement = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [previewStaff, setPreviewStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter & Sort states
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'department' | 'role'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [formData, setFormData] = useState<Partial<Staff>>({
    name: '',
    role: 'Nurse',
    department: '',
    shift: 'Morning',
    status: 'Active'
  });

  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:8081/hms-admin/staff', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStaffList(data);
      } else {
        console.error('Failed to fetch staff list');
      }
    } catch (err) {
      console.error('Error fetching staff:', err);
    }
  };

  useEffect(() => {
    fetchStaff();

    // Establish real-time SSE stream subscription
    const eventSource = new EventSource('http://localhost:8081/hms-admin/realtime/stream');
    
    eventSource.addEventListener('staff', (event) => {
      console.log('Real-time staff notification received:', event.data);
      fetchStaff();
    });

    eventSource.onerror = (err) => {
      console.error('SSE Connection failed for staff. Re-connecting...', err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleOpenModal = (staff?: Staff) => {
    if (staff) {
      setEditingStaff(staff);
      setFormData(staff);
    } else {
      setEditingStaff(null);
      setFormData({
        name: '',
        role: 'Nurse',
        department: '',
        shift: 'Morning',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingStaff
        ? `http://localhost:8081/hms-admin/staff/${editingStaff.id}`
        : 'http://localhost:8081/hms-admin/staff';

      const method = editingStaff ? 'PUT' : 'POST';

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
        fetchStaff();
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.message || 'Failed to save staff records');
      }
    } catch (err) {
      console.error('Error saving staff member:', err);
      alert('Error connecting to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this staff profile?')) {
      try {
        const response = await fetch(`http://localhost:8081/hms-admin/staff/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        if (response.ok) {
          fetchStaff();
        } else {
          alert('Failed to delete staff member');
        }
      } catch (err) {
        console.error('Error deleting staff:', err);
      }
    }
  };

  // Get unique lists for filters
  const roles = Array.from(new Set(staffList.map(s => s.role).filter(Boolean)));
  const shifts = ['Morning', 'Evening', 'Night'];

  // Filter & Sort
  const filteredAndSortedStaff = staffList
    .filter(s => {
      const nameMatch = s.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const idMatch = s.staffId?.toLowerCase().includes(searchTerm.toLowerCase());
      const deptMatch = s.department?.toLowerCase().includes(searchTerm.toLowerCase());
      const roleMatch = s.role?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = nameMatch || idMatch || deptMatch || roleMatch;

      const matchesRole = selectedRole ? s.role === selectedRole : true;
      const matchesShift = selectedShift ? s.shift === selectedShift : true;
      const matchesStatus = selectedStatus ? s.status === selectedStatus : true;

      return matchesSearch && matchesRole && matchesShift && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'department') {
        comparison = (a.department || '').localeCompare(b.department || '');
      } else if (sortBy === 'role') {
        comparison = (a.role || '').localeCompare(b.role || '');
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Metrics
  const totalStaff = staffList.length;
  const activeCount = staffList.filter(s => s.status === 'Active').length;
  const offDutyCount = staffList.filter(s => s.status === 'Off Duty').length;
  const uniqueDepartmentsCount = Array.from(new Set(staffList.map(s => s.department))).filter(Boolean).length;

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const getAvatarBgColor = (name: string) => {
    const code = name.charCodeAt(0) % 5;
    if (code === 0) return 'bg-blue-50 text-blue-600';
    if (code === 1) return 'bg-emerald-50 text-emerald-600';
    if (code === 2) return 'bg-amber-50 text-amber-600';
    if (code === 3) return 'bg-purple-50 text-purple-600';
    return 'bg-rose-50 text-rose-600';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Staff Roster Management</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage hospital nurses, lab technicians, administration, and support shifts in real-time</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2.5 transition-all shadow-md shadow-blue-500/10 text-sm font-semibold cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" /> Add Staff Member
        </button>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Staff</span>
            <span className="text-2xl font-extrabold text-slate-800 block mt-0.5">{totalStaff}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Shifts</span>
            <span className="text-2xl font-extrabold text-slate-800 block mt-0.5">{activeCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Off Duty</span>
            <span className="text-2xl font-extrabold text-slate-800 block mt-0.5">{offDutyCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Departments</span>
            <span className="text-2xl font-extrabold text-slate-800 block mt-0.5">{uniqueDepartmentsCount}</span>
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
            placeholder="Search by ID, name or role..."
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
              <option value="Active">Active</option>
              <option value="Off Duty">Off Duty</option>
            </select>
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">All Roles</option>
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Shift Filter */}
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">All Shifts</option>
            {shifts.map(s => (
              <option key={s} value={s}>{s}</option>
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
              <option value="department">Sort by Department</option>
              <option value="role">Sort by Role</option>
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
        {filteredAndSortedStaff.map(staff => (
          <div 
            key={staff.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-200 transition-all duration-300 relative group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide">
                  {staff.staffId || 'No ID'}
                </span>
                
                {/* Actions Bar */}
                <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-50 rounded-xl p-1 border border-slate-100">
                  <button 
                    onClick={() => setPreviewStaff(staff)}
                    className="p-1.5 text-blue-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Quick Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleOpenModal(staff)}
                    className="p-1.5 text-amber-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Edit Profile"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(staff.id)}
                    className="p-1.5 text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Delete Profile"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Profile Header Details */}
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-inner shrink-0 ${getAvatarBgColor(staff.name)}`}>
                  {staff.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-md font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                    {staff.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wide ${
                      staff.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {staff.status}
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {staff.shift} Shift
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Fields */}
              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Role: {staff.role}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Department: {staff.department || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAndSortedStaff.length === 0 && (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
            <User className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-semibold">No staff members found matching the criteria.</p>
          </div>
        )}
      </div>

      {/* Modal Form: Add / Edit Staff */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{editingStaff ? 'Edit Staff Profile' : 'Register Staff Member'}</h3>
                <p className="text-slate-400 text-xs font-semibold mt-0.5">{editingStaff ? `Editing roster for ${formData.name}` : 'Onboard a new employee listing'}</p>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" 
                  placeholder="Alice Walker" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role / Job Title</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.role || ''} 
                    onChange={e => setFormData({ ...formData, role: e.target.value })} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" 
                    placeholder="e.g. Nurse, Lab Tech" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.department || ''} 
                    onChange={e => setFormData({ ...formData, department: e.target.value })} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" 
                    placeholder="e.g. Cardiology" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Shift Assignment</label>
                  <select 
                    value={formData.shift || 'Morning'}
                    onChange={e => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
                  >
                    <option value="Morning">Morning Shift</option>
                    <option value="Evening">Evening Shift</option>
                    <option value="Night">Night Shift</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                  <select 
                    value={formData.status || 'Active'}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-semibold"
                  >
                    <option value="Active">Active Duty</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>
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
                  {loading ? 'Saving...' : editingStaff ? 'Update Roster' : 'Register Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upgraded Preview Modal */}
      {previewStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Banner top */}
            <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
              <button 
                onClick={() => setPreviewStaff(null)} 
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-1 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="px-6 pb-6 relative">
              <div className="flex items-end gap-4 -mt-10 mb-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl border-4 border-white shadow-md shrink-0 ${getAvatarBgColor(previewStaff.name)}`}>
                  {previewStaff.name.charAt(0)}
                </div>
                <div className="pb-1">
                  <h4 className="text-lg font-bold text-slate-800">{previewStaff.name}</h4>
                  <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">{previewStaff.staffId}</span>
                </div>
              </div>

              {/* Roster Information details */}
              <div className="grid grid-cols-2 gap-3 mt-5 font-sans">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Job Title</span>
                  <span className="text-xs font-extrabold text-slate-700 block">{previewStaff.role}</span>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Department</span>
                  <span className="text-xs font-extrabold text-slate-700 block">{previewStaff.department || 'N/A'}</span>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Current Shift</span>
                  <span className="text-xs font-extrabold text-slate-700 block">{previewStaff.shift} Shift</span>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Duty Status</span>
                  <span className={`text-xs font-extrabold uppercase block ${
                    previewStaff.status === 'Active' ? 'text-green-600' : 'text-slate-400'
                  }`}>{previewStaff.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
