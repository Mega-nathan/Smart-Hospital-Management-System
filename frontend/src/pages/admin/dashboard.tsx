import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Users, 
  UserCheck, 
  Building2, 
  LogOut, 
  Bell, 
  Search, 
  Menu,
  ChevronDown,
  UserCog
} from 'lucide-react';
import { DoctorsManagement } from './components/DoctorsManagement';
import { PatientsManagement } from './components/PatientsManagement';
import { StaffManagement } from './components/StaffManagement';
import { DepartmentManagement } from './components/DepartmentManagement';

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Doctors');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const username = localStorage.getItem('adminUsername');
    
    if (!token) {
      navigate('/admin');
      return;
    }

    setAdminUsername(username || 'Admin');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminRole');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden relative">
      {/* Background patterns from login page */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      {/* Sidebar Component */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col hidden md:flex shrink-0 shadow-lg shadow-slate-200/50 z-20">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent">
            HMS Portal
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <button
            onClick={() => setActiveTab('Doctors')}
            className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'Doctors'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <Users className="w-4 h-4" />
            Manage Doctors
          </button>
          <button
            onClick={() => setActiveTab('Patients')}
            className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'Patients'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Manage Patients
          </button>
          <button
            onClick={() => setActiveTab('Staff')}
            className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'Staff'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <UserCog className="w-4 h-4" />
            Staff Management
          </button>
          <button
            onClick={() => setActiveTab('Departments')}
            className={`w-full flex items-center justify-start text-left gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'Departments'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Department & Bed Management
          </button>
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto z-10">
        {/* Top Header */}
        <header className="h-16 bg-white/60 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-50">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 relative text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
              <Bell className="w-5 h-5" />
            </button>

            <div className="h-8 w-px bg-slate-200"></div>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3 pl-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                {adminUsername ? adminUsername.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  {adminUsername}
                </p>
                <span className="text-xs text-blue-600 font-medium tracking-wide uppercase">
                  Administrator
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:block cursor-pointer" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 z-0">
          {activeTab === 'Doctors' && <DoctorsManagement />}
          {activeTab === 'Patients' && <PatientsManagement />}
          {activeTab === 'Staff' && <StaffManagement />}
          {activeTab === 'Departments' && <DepartmentManagement />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
