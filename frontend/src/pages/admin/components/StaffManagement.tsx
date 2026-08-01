import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Eye } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  shift: string;
  status: 'Active' | 'Off Duty';
}

const initialStaff: Staff[] = [
  { id: '1', name: 'Alice Walker', role: 'Nurse', department: 'Cardiology', shift: 'Morning', status: 'Active' },
  { id: '2', name: 'Bob Johnson', role: 'Technician', department: 'Radiology', shift: 'Night', status: 'Off Duty' },
];

export const StaffManagement = () => {
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [previewStaff, setPreviewStaff] = useState<Staff | null>(null);

  const [formData, setFormData] = useState<Partial<Staff>>({
    name: '', role: '', department: '', shift: 'Morning', status: 'Active'
  });

  const handleOpenModal = (staff?: Staff) => {
    if (staff) {
      setEditingStaff(staff);
      setFormData(staff);
    } else {
      setEditingStaff(null);
      setFormData({ name: '', role: '', department: '', shift: 'Morning', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      setStaffList(staffList.map(s => s.id === editingStaff.id ? { ...formData, id: s.id } as Staff : s));
    } else {
      setStaffList([...staffList, { ...formData, id: Date.now().toString() } as Staff]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this staff member?')) {
      setStaffList(staffList.filter(s => s.id !== id));
    }
  };

  const filteredStaff = staffList.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Staff Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage hospital nurses, technicians, and support staff</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Shift</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStaff.map(staff => (
                <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{staff.name}</td>
                  <td className="px-6 py-4 text-slate-500">{staff.role}</td>
                  <td className="px-6 py-4 text-slate-500">{staff.department}</td>
                  <td className="px-6 py-4 text-slate-500">{staff.shift}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      staff.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setPreviewStaff(staff)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors mr-1" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleOpenModal(staff)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(staff.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="e.g. Nurse"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Shift</label>
                  <select value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'Active' | 'Off Duty'})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                    <option value="Active">Active</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-sm shadow-blue-600/20">{editingStaff ? 'Save Changes' : 'Add Staff'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Staff Details</h3>
              <button onClick={() => setPreviewStaff(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                  {previewStaff.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{previewStaff.name}</h4>
                  <p className="text-slate-500 font-medium">{previewStaff.role}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Department</span>
                  <span className="text-sm font-bold text-slate-800">{previewStaff.department}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Shift</span>
                  <span className="text-sm font-bold text-slate-800">{previewStaff.shift}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Status</span>
                  <span className={`text-sm font-bold ${
                      previewStaff.status === 'Active' ? 'text-green-600' : 'text-slate-600'
                    }`}>{previewStaff.status}</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setPreviewStaff(null)} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 font-medium transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
