import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TrainerDashboard.css';
import { 
  FaBars, FaCode, FaCloudUploadAlt, 
  FaHandshake, FaLock, FaSignOutAlt, FaUserTie, 
  FaUserCircle
} from 'react-icons/fa';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

const TrainerDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const trainerName = localStorage.getItem('name') || 'Trainer';

  useEffect(() => {
    if (role !== 'Trainer' || !token) {
      navigate('/');
    }
  }, [role, token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/');
  };

  const navItems = [
    { path: 'Profile', icon: <FaUserCircle />, label: 'Profile' },
    { path: 'Skills', icon: <FaCode />, label: 'Skills' },
    { path: 'UploadContent', icon: <FaCloudUploadAlt />, label: 'Upload Content' },
    { path: 'Handshake', icon: <FaHandshake />, label: 'Handshake' },
    { path: 'ChangePassword', icon: <FaLock />, label: 'Change Password' },
  ];

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className={`bg-dark text-white d-flex flex-column shadow ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        
        {/* Sidebar Header */}
        <div className="p-3 d-flex align-items-center justify-content-center border-bottom border-secondary">
          <FaUserTie className="text-primary fs-4" />
          {!isCollapsed && <span className="ms-2 fw-bold fs-5 text-uppercase">E-Study-Zone</span>}
        </div>

        {/* Navigation */}
        <div className="flex-grow-1 py-3 d-flex flex-column">
          <nav className="nav flex-column gap-1 px-2">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-link d-flex align-items-center rounded ${isActive(item.path) ? 'bg-primary text-white' : 'text-white-50'}`}
              >
                <span className="icon-width d-flex justify-content-center">{item.icon}</span>
                {!isCollapsed && <span className="ms-3">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Logout pushed to bottom */}
          <div className="mt-auto px-2">
            <button 
              onClick={handleLogout} 
              className="nav-link text-danger d-flex align-items-center rounded border-0 bg-transparent w-100"
            >
              <span className="icon-width d-flex justify-content-center"><FaSignOutAlt /></span>
              {!isCollapsed && <span className="ms-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column bg-light">
        
        {/* Top Navbar */}
        <nav className="navbar navbar-light bg-white shadow-sm px-4 border-bottom">
          <div className="d-flex align-items-center">
            <button className="btn btn-link text-dark text-decoration-none p-0 me-3" onClick={() => setIsCollapsed(!isCollapsed)}>
              <FaBars className="fs-4" />
            </button>
            <span className="navbar-brand fw-bold mb-0 h1">Trainer Dashboard</span>
          </div>
          <div className="d-none d-md-flex align-items-center gap-3">
            <span className="text-muted fw-medium">Welcome, {trainerName}</span>
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '38px', height: '38px'}}>
              {trainerName.charAt(0).toUpperCase()}
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;