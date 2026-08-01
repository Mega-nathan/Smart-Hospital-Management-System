import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Eye } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contact: string;
  admissionDate: string;
  problem: string;
  status: 'Admitted' | 'Discharged' | 'Under Observation';
}

const initialPatients: Patient[] = [
  { id: '1', name: 'Robert Downey', age: 45, gender: 'Male', bloodGroup: 'O+', contact: '+1122334455', admissionDate: '2026-07-28', problem: 'Severe chest pain', status: 'Admitted' },
  { id: '2', name: 'Scarlett Johansson', age: 39, gender: 'Female', bloodGroup: 'A+', contact: '+1554433221', admissionDate: '2026-08-01', problem: 'Mild concussion', status: 'Under Observation' },
];

export const PatientsManagement = () => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [previewPatient, setPreviewPatient] = useState<Patient | null>(null);

  const [formData, setFormData] = useState<Partial<Patient>>({
    name: '', age: 0, gender: 'Male', bloodGroup: '', contact: '', admissionDate: '', problem: '', status: 'Admitted'
  });

  const handleOpenModal = (pat?: Patient) => {
    if (pat) {
      setEditingPatient(pat);
      setFormData(pat);
    } else {
      setEditingPatient(null);
      setFormData({ name: '', age: 0, gender: 'Male', bloodGroup: '', contact: '', admissionDate: new Date().toISOString().split('T')[0], problem: '', status: 'Admitted' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatient) {
      setPatients(patients.map(p => p.id === editingPatient.id ? { ...formData, id: p.id } as Patient : p));
    } else {
      setPatients([...patients, { ...formData, id: Date.now().toString() } as Patient]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this patient record?')) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Patients Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage patient records and admissions</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Add Patient
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search patients..."
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
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPatients.map(patient => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{patient.name}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {patient.age} yrs • {patient.gender}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-lg text-xs font-bold">
                      {patient.bloodGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      patient.status === 'Admitted' ? 'bg-red-50 text-red-700' :
                      patient.status === 'Discharged' ? 'bg-green-50 text-green-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setPreviewPatient(patient)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors mr-1" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleOpenModal(patient)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(patient.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No patients found.
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
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                  <input required type="text" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"/>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                  <input required type="number" value={formData.age || ''} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                  <input required type="text" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="e.g. O+"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Admission Date</label>
                  <input required type="date" value={formData.admissionDate} onChange={e => setFormData({...formData, admissionDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                    <option value="Admitted">Admitted</option>
                    <option value="Under Observation">Under Observation</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Problem / Diagnosis</label>
                <textarea rows={2} required value={formData.problem} onChange={e => setFormData({...formData, problem: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" placeholder="Describe the patient's condition..."></textarea>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-sm shadow-blue-600/20">{editingPatient ? 'Save Changes' : 'Create Patient'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Patient Details</h3>
              <button onClick={() => setPreviewPatient(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                  {previewPatient.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{previewPatient.name}</h4>
                  <p className="text-slate-500">{previewPatient.age} years old • {previewPatient.gender}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium mb-1">Blood Group</p>
                  <p className="text-sm font-bold text-red-600">{previewPatient.bloodGroup}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium mb-1">Status</p>
                  <p className={`text-sm font-bold ${
                      previewPatient.status === 'Admitted' ? 'text-red-600' :
                      previewPatient.status === 'Discharged' ? 'text-green-600' :
                      'text-amber-600'
                    }`}>{previewPatient.status}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium mb-1">Contact</p>
                  <p className="text-sm font-semibold text-slate-700">{previewPatient.contact}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium mb-1">Admission Date</p>
                  <p className="text-sm font-semibold text-slate-700">{previewPatient.admissionDate}</p>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-bold text-slate-800 mb-2">Problem / Diagnosis</h5>
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                  {previewPatient.problem}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setPreviewPatient(null)} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 font-medium transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
