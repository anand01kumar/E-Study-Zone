import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css'; // We will create this file below
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
const navigate = useNavigate();
 
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
 

  useEffect(() => {
    if (role !== 'admin' || !token) {
      navigate('/admin-login');
    }
  }, [role, token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/admin-login');
  };
    return (
        <div className="d-flex" id="wrapper">
            {/* Sidebar */}
            <div className={`bg-dark border-right ${isCollapsed ? 'collapsed' : ''}`} id="sidebar-wrapper">
                <div className="sidebar-heading text-white py-4 px-3 fs-4 fw-bold text-uppercase">
                    {isCollapsed ? 'AD' : 'Admin Panel'}
                </div>
                <div className="list-group list-group-flush border-top border-secondary">
                    <Link to='usermanagement' className="list-group-item list-group-item-action bg-dark text-white p-3 border-secondary">
                        <i className="bi bi-people me-2"></i> 
                        {!isCollapsed && "User Management"}
                    </Link>
                    <Link href=""to='contentmanagement' className="list-group-item list-group-item-action bg-dark text-white p-3 border-secondary">
                        <i className="bi bi-file-earmark-text me-2"></i> 
                        {!isCollapsed && "Content Management"}
                    </Link>
                    <Link href="" to='changepasswords' className="list-group-item list-group-item-action bg-dark text-white p-3 border-secondary">
                        <i className="bi bi-key me-2"></i> 
                        {!isCollapsed && "Change Password"}
                    </Link>
                    <button  onClick={handleLogout}
                    className="list-group-item list-group-item-action bg-dark text-white p-3 border-secondary mt-auto">
                        <i className="bi bi-box-arrow-right me-2 text-danger"></i> 
                        {!isCollapsed && <span className="text-danger">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Page Content */}
            <div id="page-content-wrapper" className="w-100">
                <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom px-3 shadow-sm">
                    <button className="btn btn-outline-dark" onClick={toggleSidebar}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="ms-3 fw-bold">Dashboard Overview</div>
                </nav>

                <div className="container-fluid p-4">
                   <Outlet/>
                    
                   
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;