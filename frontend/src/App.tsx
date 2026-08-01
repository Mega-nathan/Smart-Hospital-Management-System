import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/AdminLogin';
import DoctorLogin from './pages/auth/DoctorLogin';
import Home from './pages/home/Home';
import Dashboard from './pages/admin/dashboard';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Login />} />
      <Route path="/doctor" element={<DoctorLogin />} />
      <Route path="/admin/dashboard/*" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
