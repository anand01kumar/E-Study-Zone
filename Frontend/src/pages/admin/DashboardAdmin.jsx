import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token'); // अगर आप token use कर रहे हैं तो
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        
        // अगर बिना auth के है तो सिर्फ axios.get लिखें
        const res = await axios.get('http://localhost:5000/api/admin/dashboard-stats', config);
        
        if (res.data.data) {
          setStats(res.data.data);
        } else {
          setError("Failed to load statistics.");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mt-3 text-muted fw-semibold">Fetching Dashboard Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 pb-5">
      
      {/* Header */}
      <div className="card border-0 shadow-sm mb-4 text-white" style={{ background: 'linear-gradient(90deg, #2c3e50 0%, #4ca1af 100%)' }}>
        <div className="card-body py-4">
          <h2 className="fw-bold mb-1">📊 Admin Dashboard</h2>
          <p className="mb-0 opacity-75 small">Platform overview and statistics</p>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats Cards Grid */}
      <div className="row g-4">
        
        {/* Total Users Card */}
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                <span className="fs-2">👥</span>
              </div>
              <h3 className="fw-bold mb-1 text-primary">{stats?.totalUsers || 0}</h3>
              <h6 className="text-muted mb-0">Total Users</h6>
            </div>
          </div>
        </div>

        {/* Total Learners Card */}
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                <span className="fs-2">🎓</span>
              </div>
              <h3 className="fw-bold mb-1 text-success">{stats?.totalLearners || 0}</h3>
              <h6 className="text-muted mb-0">Total Learners</h6>
            </div>
          </div>
        </div>

        {/* Total Trainers Card */}
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                <span className="fs-2">👨‍🏫</span>
              </div>
              <h3 className="fw-bold mb-1 text-warning">{stats?.totalTrainers || 0}</h3>
              <h6 className="text-muted mb-0">Total Trainers</h6>
            </div>
          </div>
        </div>

        {/* Total Unique Skills Card */}
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                <span className="fs-2">⚡</span>
              </div>
              <h3 className="fw-bold mb-1 text-info">{stats?.totalSkills || 0}</h3>
              <h6 className="text-muted mb-0">Unique Skills</h6>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  );
};

export default DashboardAdmin;