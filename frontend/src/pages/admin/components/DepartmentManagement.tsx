import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Eye, LayoutGrid, Settings } from 'lucide-react';

interface BedType {
  id: number;
  bedCode: string;
  isOccupied: boolean;
  departmentId: number;
  departmentName: string;
  patientId?: number;
  patientName?: string;
  patientStatus?: string;
}

interface Department {
  id: number;
  name: string;
  parentId?: number | null;
  parentName?: string | null;
  subDepartments?: Department[];
  beds?: BedType[];
}

export const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [viewMode, setViewMode] = useState<'visual' | 'manage'>('visual');
  const [selectedRootDept, setSelectedRootDept] = useState<string>('Clinical Departments');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [previewDept, setPreviewDept] = useState<Department | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    parentId: '' as string | number,
    totalBeds: 0
  });

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/hms-public/departments');
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenModal = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({
        name: dept.name,
        parentId: dept.parentId || '',
        totalBeds: dept.beds ? dept.beds.length : 0
      });
    } else {
      setEditingDept(null);
      setFormData({ name: '', parentId: '', totalBeds: 0 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDept(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingDept 
      ? `http://localhost:8081/hms-admin/departments/${editingDept.id}` 
      : 'http://localhost:8081/hms-admin/departments';
    const method = editingDept ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          name: formData.name,
          parentId: formData.parentId ? Number(formData.parentId) : null,
          totalBeds: Number(formData.totalBeds)
        })
      });

      if (response.ok) {
        fetchDepartments();
        handleCloseModal();
      } else {
        const error = await response.text();
        alert(error || 'Failed to save department');
      }
    } catch (err) {
      console.error('Error saving department:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this department? This will delete all sub-departments and beds.')) {
      try {
        const response = await fetch(`http://localhost:8081/hms-admin/departments/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        if (response.ok) {
          fetchDepartments();
        } else {
          alert('Failed to delete department');
        }
      } catch (err) {
        console.error('Error deleting department:', err);
      }
    }
  };

  const getFlatDepartments = (depts: Department[]): Department[] => {
    let list: Department[] = [];
    depts.forEach(d => {
      list.push(d);
      if (d.subDepartments && d.subDepartments.length > 0) {
        list = list.concat(getFlatDepartments(d.subDepartments));
      }
    });
    return list;
  };

  const flatDepartments = getFlatDepartments(departments);
  const filteredDepartments = flatDepartments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeRootNode = departments.find(d => d.name === selectedRootDept);

  const renderBedCard = (bed: BedType) => {
    let colorClasses = '';
    let statusText = 'Available';

    if (!bed.isOccupied) {
      colorClasses = 'bg-emerald-50/70 border-emerald-400 text-emerald-800 hover:bg-emerald-50 hover:shadow-emerald-100/50';
      statusText = 'Ready';
    } else {
      if (bed.patientStatus === 'Under Observation') {
        colorClasses = 'bg-slate-100/80 border-slate-400 text-slate-700 hover:bg-slate-100 hover:shadow-slate-200/50';
        statusText = bed.patientName || 'Under Observation';
      } else {
        colorClasses = 'bg-rose-50 border-rose-400 text-rose-800 hover:bg-rose-100/70 hover:shadow-rose-100/50';
        statusText = bed.patientName || 'Admitted';
      }
    }

    return (
      <div 
        key={bed.id}
        className={`flex items-center gap-3.5 p-3.5 border-2 rounded-2xl w-48 shadow-sm transition-all duration-200 cursor-pointer ${colorClasses} hover:-translate-y-0.5 hover:shadow-md`}
        title={`Bed Code: ${bed.bedCode}\nPatient: ${bed.patientName || 'None'}\nStatus: ${bed.patientStatus || (bed.isOccupied ? 'Occupied' : 'Available')}`}
      >
        <div className="w-3.5 h-7 rounded-full border border-current bg-white shrink-0 shadow-inner flex-none" />
        
        <div className="flex-1 min-w-0 leading-tight">
          <div className="font-bold text-sm tracking-wide">{bed.bedCode}</div>
          <div className="text-[11px] font-semibold opacity-90 truncate mt-0.5" style={{ textTransform: 'capitalize' }}>
            {statusText}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Department & Bed Management</h2>
          <p className="text-slate-500 text-sm mt-1">Monitor bed layouts and manage hospital departments</p>
        </div>
        
        <div className="bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/50 flex gap-1 shadow-inner">
          <button
            onClick={() => setViewMode('visual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'visual'
                ? 'bg-white text-blue-600 shadow-sm border-slate-200/30'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Visual Layout
          </button>
          <button
            onClick={() => setViewMode('manage')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'manage'
                ? 'bg-white text-blue-600 shadow-sm border-slate-200/30'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" /> Manage
          </button>
        </div>
      </div>

      {viewMode === 'visual' ? (
        <div className="space-y-6">
          <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl border border-slate-200/50 shadow-sm">
            {['Clinical Departments', 'Diagnostic Departments', 'Critical Care Departments'].map(rootName => (
              <button
                key={rootName}
                onClick={() => setSelectedRootDept(rootName)}
                className={`flex-1 text-center py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                  selectedRootDept === rootName
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {rootName}
              </button>
            ))}
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-center gap-8 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600" />
              Ready / Available
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-rose-500 border border-rose-600" />
              Occupied (Admitted)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-slate-400 border border-slate-500" />
              Occupied (Observation)
            </span>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12 text-slate-500 font-semibold">Loading department layout...</div>
            ) : activeRootNode && activeRootNode.subDepartments && activeRootNode.subDepartments.length > 0 ? (
              activeRootNode.subDepartments.map(leafDept => (
                <div key={leafDept.id} className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      {leafDept.name}
                    </h3>
                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {leafDept.beds ? leafDept.beds.length : 0} Beds Total
                    </span>
                  </div>

                  {leafDept.beds && leafDept.beds.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {leafDept.beds.map(renderBedCard)}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm font-medium py-3">No beds assigned to this department unit.</p>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-slate-200/60 shadow-sm text-center">
                <p className="text-slate-400 font-medium">No sub-departments found under {selectedRootDept}.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <button 
              onClick={() => handleOpenModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-blue-600/20 font-semibold text-sm"
            >
              <Plus className="w-4 h-4" /> Add Department
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Department Name</th>
                  <th className="px-6 py-4">Parent Category</th>
                  <th className="px-6 py-4">Total Beds</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDepartments.map(dept => (
                  <tr key={dept.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{dept.name}</td>
                    <td className="px-6 py-4 font-medium text-slate-500">{dept.parentName || '— (Root Category)'}</td>
                    <td className="px-6 py-4 font-bold text-blue-600">{dept.beds ? dept.beds.length : 0} Beds</td>
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
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No departments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                <label className="block text-sm font-semibold text-slate-700 mb-1">Department Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="e.g. Cardiology"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Parent Department / Category</label>
                <select value={formData.parentId} onChange={e => setFormData({...formData, parentId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                  <option value="">— None (Top Level Root Category) —</option>
                  {flatDepartments
                    .filter(d => !editingDept || d.id !== editingDept.id)
                    .map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Total Beds</label>
                <input 
                  required 
                  type="number" 
                  min="0" 
                  value={formData.totalBeds} 
                  onChange={e => setFormData({...formData, totalBeds: parseInt(e.target.value) || 0})} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                  placeholder="e.g. 5"
                />
                {editingDept && (
                  <p className="text-xs text-slate-400 mt-1">
                    Note: Decreasing bed count will only remove unoccupied beds, preserving active patients.
                  </p>
                )}
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-sm shadow-blue-600/20">{editingDept ? 'Save Changes' : 'Add Department'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <p className="text-slate-500 font-medium">{previewDept.parentName || 'Root Category'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Capacity & Layout</span>
                  <span className="text-base font-bold text-slate-800">
                    {previewDept.beds ? previewDept.beds.length : 0} Beds Pre-allocated
                  </span>
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
