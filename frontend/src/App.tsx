import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/AdminLogin';
import Home from './pages/Home';
import Dashboard from './pages/admin/dashboard';
import './App.css';

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Login />} />
      <Route path="/admin/dashboard/*" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
