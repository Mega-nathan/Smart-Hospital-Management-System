import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Eye } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  status: 'Active' | 'On Leave';
}

const initialDoctors: Doctor[] = [
  { id: '1', name: 'Dr. Meganathan', specialty: 'Cardiology', email: 'mega@hms.com', phone: '+1234567890', status: 'Active' },
  { id: '2', name: 'Dr. Kishor kumar', specialty: 'Neurology', email: 'kishor@hms.com', phone: '+1987654321', status: 'On Leave' },
];

export const DoctorsManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [previewDoctor, setPreviewDoctor] = useState<Doctor | null>(null);

  const [formData, setFormData] = useState<Partial<Doctor>>({
    name: '', specialty: '', email: '', phone: '', status: 'Active'
  });

  const handleOpenModal = (doc?: Doctor) => {
    if (doc) {
      setEditingDoctor(doc);
      setFormData(doc);
    } else {
      setEditingDoctor(null);
      setFormData({ name: '', specialty: '', email: '', phone: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDoctor(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoctor) {
      setDoctors(doctors.map(d => d.id === editingDoctor.id ? { ...formData, id: d.id } as Doctor : d));
    } else {
      setDoctors([...doctors, { ...formData, id: Date.now().toString() } as Doctor]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this doctor?')) {
      setDoctors(doctors.filter(d => d.id !== id));
    }
  };

  const filteredDoctors = doctors.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Doctors Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage hospital doctors and their specialties</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search doctors..."
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
                <th className="px-6 py-4">Specialty</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDoctors.map(doctor => (
                <tr key={doctor.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{doctor.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                      {doctor.specialty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span>{doctor.email}</span>
                      <span className="text-xs text-slate-400">{doctor.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      doctor.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {doctor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setPreviewDoctor(doctor)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors mr-1" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleOpenModal(doctor)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(doctor.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDoctors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Dr. John Doe"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                <input required type="text" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="e.g. Cardiology"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'Active' | 'On Leave'})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-sm shadow-blue-600/20">{editingDoctor ? 'Save Changes' : 'Create Doctor'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Doctor Profile</h3>
              <button onClick={() => setPreviewDoctor(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                  {previewDoctor.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{previewDoctor.name}</h4>
                  <p className="text-slate-500 font-medium">{previewDoctor.specialty}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium mb-1">Status</p>
                  <p className={`text-sm font-bold ${
                      previewDoctor.status === 'Active' ? 'text-green-600' : 'text-amber-600'
                    }`}>{previewDoctor.status}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium mb-1">Phone</p>
                  <p className="text-sm font-semibold text-slate-700">{previewDoctor.phone}</p>
                </div>
                <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium mb-1">Email Address</p>
                  <p className="text-sm font-semibold text-slate-700">{previewDoctor.email}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setPreviewDoctor(null)} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 font-medium transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
