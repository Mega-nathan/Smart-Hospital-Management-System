import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Eye } from 'lucide-react';

interface Bed {
  id: string;
  bedNumber: string;
  ward: string;
  status: 'Available' | 'Occupied' | 'Maintenance';
  patientId?: string;
}

const initialBeds: Bed[] = [
  { id: '1', bedNumber: 'B-101', ward: 'General Ward', status: 'Available' },
  { id: '2', bedNumber: 'ICU-01', ward: 'Intensive Care Unit', status: 'Occupied', patientId: 'Patient XYZ' },
  { id: '3', bedNumber: 'B-102', ward: 'General Ward', status: 'Maintenance' },
];

export const BedManagement = () => {
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBed, setEditingBed] = useState<Bed | null>(null);
  const [previewBed, setPreviewBed] = useState<Bed | null>(null);

  const [formData, setFormData] = useState<Partial<Bed>>({
    bedNumber: '', ward: '', status: 'Available', patientId: ''
  });

  const handleOpenModal = (bed?: Bed) => {
    if (bed) {
      setEditingBed(bed);
      setFormData(bed);
    } else {
      setEditingBed(null);
      setFormData({ bedNumber: '', ward: '', status: 'Available', patientId: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBed(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBed) {
      setBeds(beds.map(b => b.id === editingBed.id ? { ...formData, id: b.id } as Bed : b));
    } else {
      setBeds([...beds, { ...formData, id: Date.now().toString() } as Bed]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to remove this bed?')) {
      setBeds(beds.filter(b => b.id !== id));
    }
  };

  const filteredBeds = beds.filter(b => 
    b.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.ward.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Bed Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage hospital bed availability and assignments</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Add Bed
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by bed or ward..."
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
                <th className="px-6 py-4">Bed Number</th>
                <th className="px-6 py-4">Ward</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned Patient</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBeds.map(bed => (
                <tr key={bed.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{bed.bedNumber}</td>
                  <td className="px-6 py-4 text-slate-500">{bed.ward}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      bed.status === 'Available' ? 'bg-green-50 text-green-700' :
                      bed.status === 'Occupied' ? 'bg-red-50 text-red-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {bed.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{bed.patientId || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setPreviewBed(bed)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors mr-1" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleOpenModal(bed)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(bed.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBeds.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No beds found.
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
              <h3 className="text-lg font-bold text-slate-800">{editingBed ? 'Edit Bed' : 'Add New Bed'}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bed Number</label>
                  <input required type="text" value={formData.bedNumber} onChange={e => setFormData({...formData, bedNumber: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="e.g. B-101"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ward</label>
                  <input required type="text" value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="e.g. ICU"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Patient</label>
                  <input type="text" disabled={formData.status !== 'Occupied'} value={formData.patientId || ''} onChange={e => setFormData({...formData, patientId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-slate-100 disabled:text-slate-400" placeholder={formData.status === 'Occupied' ? 'Patient Name' : 'N/A'}/>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-sm shadow-blue-600/20">{editingBed ? 'Save Changes' : 'Add Bed'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Bed Information</h3>
              <button onClick={() => setPreviewBed(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                  {previewBed.bedNumber.split('-')[1] || previewBed.bedNumber.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{previewBed.bedNumber}</h4>
                  <p className="text-slate-500 font-medium">{previewBed.ward}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Status</span>
                  <span className={`text-sm font-bold ${
                      previewBed.status === 'Available' ? 'text-green-600' :
                      previewBed.status === 'Occupied' ? 'text-red-600' :
                      'text-amber-600'
                    }`}>{previewBed.status}</span>
                </div>
                {previewBed.status === 'Occupied' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1">
                    <span className="text-sm font-medium text-slate-500">Assigned Patient</span>
                    <span className="text-base font-bold text-slate-800">{previewBed.patientId}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setPreviewBed(null)} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 font-medium transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
