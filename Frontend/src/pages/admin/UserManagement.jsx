import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Delete Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch Users Function
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (roleFilter) params.role = roleFilter;

      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.get('http://localhost:5000/api/admin/users', { params, ...config });
      setUsers(res.data.data || []);
      setError('');
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  // Load users on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [roleFilter]); 

  // Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Handle Actual Delete
  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`http://localhost:5000/api/admin/users/${selectedUser._id}`, config);
      setSuccess(`"${selectedUser.name}" has been deleted successfully.`);
      setShowModal(false);
      fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete user.");
      setShowModal(false);
    }
  };

  return (
    <div className="container mt-4 pb-5">
      
      {/* Header */}
      <div className="card border-0 shadow-sm mb-4 text-white" style={{ background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)' }}>
        <div className="card-body py-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-1">👥 User Management</h2>
              <p className="mb-0 opacity-75 small">View, search, and manage all registered users</p>
            </div>
            <h2 className="mb-0 opacity-50"><i className="bi bi-people-fill"></i></h2>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger alert-dismissible fade show" onClick={() => setError('')}>{error}<button type="button" className="btn-close"></button></div>}
      {success && <div className="alert alert-success alert-dismissible fade show" onClick={() => setSuccess('')}>{success}<button type="button" className="btn-close"></button></div>}

      {/* Filters Card */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <form className="row g-3 align-items-end" onSubmit={handleSearch}>
            <div className="col-md-5">
              <label className="form-label fw-semibold small text-muted">Search by Name or Email</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Type to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold small text-muted">Filter by Role</label>
              <select 
                className="form-select" 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="Learner">Learner</option>
                <option value="Trainer">Trainer</option>
              </select>
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-funnel me-1"></i> Apply
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Table Card */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
          <h5 className="mb-0 fw-bold text-dark">All Users <span className="badge bg-secondary ms-2">{users.length}</span></h5>
        </div>
        <div className="card-body p-0">
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-2 opacity-50"></i>
              <h6>No Users Found</h6>
              <p className="small">Try changing your search or filter criteria.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined Date</th>
                    <th className="text-center pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td className="ps-4 fw-semibold text-muted">{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold" style={{ width: '40px', height: '40px', flexShrink: '0' }}>
                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <span className="fw-semibold">{user.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="text-muted">{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'Trainer' ? 'bg-warning text-dark' : 'bg-success'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="text-center pe-4">
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => openDeleteModal(user)}
                          title="Delete User"
                        >
                          <i className="bi bi-trash3-fill me-1"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal (Pure Bootstrap) */}
      <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-border-0">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-danger text-white border-0">
                <h5 className="modal-title fw-bold"><i className="bi bi-exclamation-triangle-fill me-2"></i>Confirm Delete</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                <p className="mb-0">Are you sure you want to delete <strong>"{selectedUser?.name}"</strong>?</p>
                <small className="text-muted">This action cannot be undone.</small>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  <i className="bi bi-trash3 me-1"></i> Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default UserManagement;