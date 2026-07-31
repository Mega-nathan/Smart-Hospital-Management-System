import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/AdminLogin';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Login />} />
      <Route path="/admin/dashboard/*" element={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500 mt-2">Work in progress...</p>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;
