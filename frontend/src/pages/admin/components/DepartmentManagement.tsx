import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Eye } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  head: string;
  capacity: number;
  description: string;
}

const initialDepartments: Department[] = [
  { id: '1', name: 'Cardiology', head: 'Dr. Sarah Smith', capacity: 50, description: 'Heart and cardiovascular diseases' },
  { id: '2', name: 'Dental', head: 'Dr. Alan Wake', capacity: 20, description: 'Odontology and dental care' },
  { id: '3', name: 'Neurology', head: 'Dr. John Doe', capacity: 30, description: 'Nervous system disorders' },
];

export const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [previewDept, setPreviewDept] = useState<Department | null>(null);

  const [formData, setFormData] = useState<Partial<Department>>({
    name: '', head: '', capacity: 0, description: ''
  });

  const handleOpenModal = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setFormData(dept);
    } else {
      setEditingDept(null);
      setFormData({ name: '', head: '', capacity: 0, description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDept(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDept) {
      setDepartments(departments.map(d => d.id === editingDept.id ? { ...formData, id: d.id } as Department : d));
    } else {
      setDepartments([...departments, { ...formData, id: Date.now().toString() } as Department]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  const filteredDepartments = departments.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Department Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage hospital departments and their capacities</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search departments..."
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
                <th className="px-6 py-4">Department Name</th>
                <th className="px-6 py-4">Head of Department</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDepartments.map(dept => (
                <tr key={dept.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{dept.name}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{dept.head}</td>
                  <td className="px-6 py-4 text-slate-500">{dept.capacity} patients</td>
                  <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{dept.description}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setPreviewDept(dept)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors mr-1" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleOpenModal(dept)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(dept.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDepartments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No departments found.
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
              <h3 className="text-lg font-bold text-slate-800">{editingDept ? 'Edit Department' : 'Add New Department'}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="e.g. Cardiology"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Head of Department</label>
                <input required type="text" value={formData.head} onChange={e => setFormData({...formData, head: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="e.g. Dr. Sarah Smith"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                <input required type="number" value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"></textarea>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-sm shadow-blue-600/20">{editingDept ? 'Save Changes' : 'Add Department'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Department Details</h3>
              <button onClick={() => setPreviewDept(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                  {previewDept.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{previewDept.name}</h4>
                  <p className="text-slate-500 font-medium">Capacity: {previewDept.capacity} patients</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-500">Head of Department</span>
                  <span className="text-base font-bold text-slate-800">{previewDept.head}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-500">Description</span>
                  <p className="text-sm text-slate-700 leading-relaxed">{previewDept.description}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setPreviewDept(null)} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 font-medium transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
