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
  ShieldAlert,
  ChevronDown,
  LayoutDashboard,
  CalendarDays,
  FolderHeart
} from 'lucide-react';

interface DashboardStats {
  totalDoctors: number;
  totalPatients: number;
  activeConsultations: number;
  departmentsCount: number;
}

interface DashboardData {
  status: string;
  role: string;
  welcomeMessage: string;
  stats: DashboardStats;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const username = localStorage.getItem('adminUsername');
    
    if (!token) {
      navigate('/admin');
      return;
    }

    setAdminUsername(username || 'Admin');

    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:8080/hms-admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate('/admin');
            return;
          }
          throw new Error('Failed to fetch dashboard metrics');
        }

        const data: DashboardData = await response.json();
        setStats(data.stats);
      } catch (err: any) {
        console.error('Error fetching dashboard details:', err);
        setError(err.message || 'Could not connect to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminRole');
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading dashboard environment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-3xl" />
        <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-3xl" />
      </div>

      {/* Sidebar Component */}
      <aside className="w-64 bg-slate-950/80 backdrop-blur-md border-r border-slate-800 flex flex-col hidden md:flex shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            HMS Portal
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <button
            onClick={() => setActiveTab('Overview')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'Overview'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('Doctors')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'Doctors'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Manage Doctors
          </button>
          <button
            onClick={() => setActiveTab('Patients')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'Patients'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Patients list
          </button>
          <button
            onClick={() => setActiveTab('Departments')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'Departments'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Departments
          </button>
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-slate-950/40 backdrop-blur-md border-b border-slate-850 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 w-64 shadow-inner">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="bg-transparent text-sm text-slate-200 focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 relative text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl transition-all duration-200">
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
              <Bell className="w-5 h-5" />
            </button>

            <div className="h-8 w-px bg-slate-800"></div>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3 pl-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/10">
                {adminUsername ? adminUsername.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-white leading-tight">
                  {adminUsername}
                </p>
                <span className="text-xs text-blue-400 font-medium tracking-wide uppercase">
                  Administrator
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-450 hidden lg:block cursor-pointer" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 space-y-8">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-950/30 border border-red-800/50 rounded-2xl text-red-200 animate-in fade-in duration-300">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <div className="text-sm">
                <span className="font-semibold">Backend connection failed:</span> {error}. Showing demonstration stats instead.
              </div>
            </div>
          )}

          {/* Welcome Header */}
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Dashboard Overview
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Hello, <span className="font-semibold text-blue-400">{adminUsername}</span>. Welcome to your hospital administration center.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-blue-950/50 text-blue-400 rounded-full border border-blue-900/50 flex items-center gap-1.5 self-start md:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Connection Established
            </span>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card: Total Doctors */}
            <div className="group bg-slate-950/40 hover:bg-slate-950/60 border border-slate-850 hover:border-slate-800 rounded-2xl p-6 transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">Total Doctors</span>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-white tracking-tight">
                  {stats ? stats.totalDoctors : 12}
                </h3>
                <p className="text-xs text-blue-400 font-medium mt-1">
                  Active staff members
                </p>
              </div>
            </div>

            {/* Card: Total Patients */}
            <div className="group bg-slate-950/40 hover:bg-slate-950/60 border border-slate-850 hover:border-slate-800 rounded-2xl p-6 transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">Registered Patients</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-white tracking-tight">
                  {stats ? stats.totalPatients : 148}
                </h3>
                <p className="text-xs text-emerald-400 font-medium mt-1">
                  Admitted & outpatient count
                </p>
              </div>
            </div>

            {/* Card: Active Consultations */}
            <div className="group bg-slate-950/40 hover:bg-slate-950/60 border border-slate-850 hover:border-slate-800 rounded-2xl p-6 transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">Active Consultations</span>
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                  <CalendarDays className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-white tracking-tight">
                  {stats ? stats.activeConsultations : 34}
                </h3>
                <p className="text-xs text-violet-400 font-medium mt-1">
                  Scheduled for today
                </p>
              </div>
            </div>

            {/* Card: Departments */}
            <div className="group bg-slate-950/40 hover:bg-slate-950/60 border border-slate-850 hover:border-slate-800 rounded-2xl p-6 transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">Total Departments</span>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-white tracking-tight">
                  {stats ? stats.departmentsCount : 6}
                </h3>
                <p className="text-xs text-amber-400 font-medium mt-1">
                  Specialty care wings
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions & Placeholder Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions Column */}
            <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-6 lg:col-span-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-blue-500" />
                Administrative Center Activity
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-white">Staff Management</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Add, edit, or adjust duties for medical specialists.</p>
                  </div>
                  <button className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors">
                    Manage Staff
                  </button>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-white">Department Audits</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Check current capacity and equipment allocation status.</p>
                  </div>
                  <button className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors">
                    View Details
                  </button>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-white">System Settings</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Manage authentication protocols, API connection details, and roles.</p>
                  </div>
                  <button className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors">
                    Configure
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Status / Calendar Column */}
            <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <FolderHeart className="w-5 h-5 text-indigo-500" />
                  Service Health
                </h2>
                
                <div className="space-y-3.5 mt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Database connection:</span>
                    <span className="text-emerald-400 font-semibold">Healthy</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Auth Token Verification:</span>
                    <span className="text-emerald-400 font-semibold">Active</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">JWT Sign-Key Rotation:</span>
                    <span className="text-slate-350">Scheduled</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">System Logs Cache:</span>
                    <span className="text-emerald-400 font-semibold">Clean</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-850 mt-6 flex justify-between items-center text-xs text-slate-400">
                <span>System Role: <strong>{stats ? 'ROLE_ADMIN' : 'DEVELOPER'}</strong></span>
                <span className="underline cursor-pointer hover:text-white" onClick={handleLogout}>Logout</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
