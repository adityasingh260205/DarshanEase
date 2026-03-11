import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import all your components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TempleDetails from './pages/TempleDetails';
import Dashboard from './pages/Dashboard';
import Transport from './pages/Transport';
import AdminDashboard from './pages/AdminDashboard';
import Donation from './pages/Donation'; // 1. Import the Donation page

function App() {
  return (
    <Router>
      <Navbar /> 
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/temples/:id" element={<TempleDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* 2. Add the route right here */}
          <Route path="/donate" element={<Donation />} /> 
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;