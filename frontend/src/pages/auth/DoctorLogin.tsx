import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, User, Lock, ArrowRight } from 'lucide-react';

const DoctorLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // The backend uses a unified login endpoint for both admins and doctors
      const response = await fetch('http://localhost:8081/hms-admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid username or password');
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('doctorToken', data.token);
        localStorage.setItem('doctorUsername', data.username);
        localStorage.setItem('doctorRole', data.role);
      }

      if (data.role === 'ROLE_DOCTOR' || data.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        throw new Error('Access denied: You are not authorized as a doctor');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // Fallback for UI demonstration purposes if backend is not ready
      if (err.message.includes('Failed to fetch') || err.message.includes('Connection failed')) {
        setError('Connection failed. Please make sure the backend server is running.');
      } else {
        setError(err.message || 'An error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-teal-100/50 blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-xl py-10 px-4 shadow-2xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-white">
          <div className="flex flex-col justify-center items-center mb-8">
            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20 mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
              Doctor Portal
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              Sign in to access your patient assignments and schedules
            </p>
          </div>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-sm text-red-700 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="font-semibold">Login Failed</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                Username
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-slate-50/50 transition-all duration-200 text-slate-900 placeholder-slate-400 sm:text-sm"
                  placeholder="doctor_id"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-slate-50/50 transition-all duration-200 text-slate-900 placeholder-slate-400 sm:text-sm"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded cursor-pointer"
                disabled={loading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 transition-all duration-200 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center">
                  {loading ? 'Signing in...' : 'Sign in'}
                  {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
