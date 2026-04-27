import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserDashboard.css';
import { 
  FaBars, FaCode, FaCloudUploadAlt, 
  FaHandshake, FaLock, FaSignOutAlt, FaUserTie, 
  FaUserCircle
} from 'react-icons/fa';
import { Link, Outlet,useNavigate } from 'react-router-dom';
 
const UserDasbord = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const role= localStorage.getItem('role');
  const token = localStorage.getItem('token');
    const usererName = localStorage.getItem('name') || 'Learner';
  
    useEffect(() => {
      if (role !== 'Learner' || !token) {
        navigate('/');
      }
    }, [role, token, navigate]);

 
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

   const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('id');
    localStorage.removeItem('token'); // if you store auth token
    // Redirect to login page
    navigate('/');
  };
 

  return (
    <div className="d-flex" id="wrapper">
      {/* Sidebar */}
      <div className={`bg-dark text-white ${isCollapsed ? 'collapsed' : 'expanded'}`} id="sidebar-wrapper">
        <div className="sidebar-heading text-center py-4 primary-text fs-4 fw-bold text-uppercase border-bottom">
          {isCollapsed ? <FaUserTie /> : 'E-Study-Zone'}
        </div>
        <div className="list-group list-group-flush my-3">
          
            <Link key='' to='Profile' href='' className="list-group-item list-group-item-action bg-transparent text-white fw-bold custom-link">
              <span className="icon-box"><FaUserCircle /></span>
              {!isCollapsed && <span className="ms-2">Profile</span>}
            </Link>
           
            
            <Link key='' to='HandshakeRequest' href='' className="list-group-item list-group-item-action bg-transparent text-white fw-bold custom-link">
              <span className="icon-box"><FaHandshake /></span>
              {!isCollapsed && <span className="ms-2">Handshake Request</span>}
            </Link>
            <Link key='' to='mycontent' href='' className="list-group-item list-group-item-action bg-transparent text-white fw-bold custom-link">
              <span className="icon-box"><FaHandshake /></span>
              {!isCollapsed && <span className="ms-2">My Content</span>}
            </Link>
            <Link key='' to='ChangePassword' href='' className="list-group-item list-group-item-action bg-transparent text-white fw-bold custom-link">
              <span className="icon-box"><FaLock /></span>
              {!isCollapsed && <span className="ms-2">Change Password</span>}
            </Link>
        
          {/* Logout */}
                   <button 
                     onClick={handleLogout} 
                     className="list-group-item list-group-item-action bg-transparent text-danger fw-bold mt-5 custom-link"
                   >
                     <span className="icon-box"><FaSignOutAlt /></span>
                     {!isCollapsed && <span className="ms-2">Logout</span>}
                   </button>
        </div>
      </div>

      {/* Page Content */}
      <div id="page-content-wrapper">
        <nav className="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4 border-bottom">
          <div className="d-flex align-items-center">
            <FaBars className="primary-text fs-4 me-3 cursor-pointer" onClick={toggleSidebar} style={{cursor: 'pointer'}} />
            <h2 className="fs-2 m-0">UserDashboard</h2>
          </div>
        </nav>

        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default UserDasbord;