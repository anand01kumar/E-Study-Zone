import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { FaUsers, FaUserGraduate, FaCloudUploadAlt, FaFilePdf, FaFileVideo, FaFileAlt } from 'react-icons/fa';

const DasbordTrainer = () => {
  const [data, setData] = useState({});
  const [content, setContent] = useState(0);
  const userId = localStorage.getItem('id'); 
  const role = 'Learner';

  const handleFetch = async () => {
    try {
      const res = await axios.get(`https://e-study-zone-fw6r.onrender.com/api/user/count`);
      const result = await axios.get(`https://e-study-zone-fw6r.onrender.com/api/user/count/${role}`);
      setData({
        ...res.data,
        [`${role}Count`]: result.data.count
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const fetchContent = async () => {
    try {
      const res = await axios.get(`https://e-study-zone-fw6r.onrender.com/api/content/count/${userId}`);
      setContent(res.data.count);
    } catch (err) {
      console.error("Error fetching content data:", err);
    }
  };

  useEffect(() => {
    handleFetch();
    fetchContent();
  }, []);

  return (
    <div className="container-fluid p-4 p-md-5">
      
      {/* Header Section */}
      <div className="d-sm-flex align-items-center justify-content-between mb-5">
        <div>
          <h1 className="h3 mb-0 fw-bold text-dark">Dashboard</h1>
          <p className="text-muted mb-0">Welcome back! Here's your overview.</p>
        </div>
    
      </div>

      {/* Stats Cards Row */}
      <div className="row g-4 mb-5">
        {/* Total Users Card */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex align-items-center p-4">
              <div className="flex-shrink-0 p-3 rounded-3 bg-primary bg-opacity-10 text-primary">
                <FaUsers size={28} />
              </div>
              <div className="flex-grow-1 ms-4">
                <h6 className="text-muted text-uppercase mb-1 fw-bold" style={{fontSize: '0.75rem'}}>Total Users</h6>
                <h2 className="mb-0 fw-bold text-dark">{data.totalUsers || 0}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Total Learners Card */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex align-items-center p-4">
              <div className="flex-shrink-0 p-3 rounded-3 bg-success bg-opacity-10 text-success">
                <FaUserGraduate size={28} />
              </div>
              <div className="flex-grow-1 ms-4">
                <h6 className="text-muted text-uppercase mb-1 fw-bold" style={{fontSize: '0.75rem'}}>Total Learners</h6>
                <h2 className="mb-0 fw-bold text-dark">{data.totalLearners || data.LearnerCount || 0}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Content Card */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex align-items-center p-4">
              <div className="flex-shrink-0 p-3 rounded-3 bg-warning bg-opacity-10 text-warning">
                <FaCloudUploadAlt size={28} />
              </div>
              <div className="flex-grow-1 ms-4">
                <h6 className="text-muted text-uppercase mb-1 fw-bold" style={{fontSize: '0.75rem'}}>Uploaded Content</h6>
                <h2 className="mb-0 fw-bold text-dark">{content || 0}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Handshake Requests Table */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
              <h5 className="fw-bold mb-0">Handshake Requests</h5>
            </div>
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr className="text-muted" style={{fontSize: '0.8rem'}}>
                      <th className="border-0 pb-3 text-uppercase fw-bold">#</th>
                      <th className="border-0 pb-3 text-uppercase fw-bold">Learner Name</th>
                      <th className="border-0 pb-3 text-uppercase fw-bold">Status</th>
                      <th className="border-0 pb-3 text-uppercase fw-bold text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-0 py-3">1</td>
                      <td className="border-0 py-3 fw-semibold text-dark">Rahul Sharma</td>
                      <td className="border-0 py-3">
                        <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill fw-semibold">Pending</span>
                      </td>
                      <td className="border-0 py-3 text-end">
                        <button className="btn btn-sm btn-outline-success rounded-pill px-3 me-2">Accept</button>
                        <button className="btn btn-sm btn-outline-danger rounded-pill px-3">Reject</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="border-0 py-3">2</td>
                      <td className="border-0 py-3 fw-semibold text-dark">Priya Verma</td>
                      <td className="border-0 py-3">
                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-semibold">Accepted</span>
                      </td>
                      <td className="border-0 py-3 text-end">
                        <button className="btn btn-sm btn-primary rounded-pill px-3">View Content</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Content List */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
              <h5 className="fw-bold mb-0">Recent Content</h5>
            </div>
            <div className="card-body p-4">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex align-items-center px-0 border-0 pb-3 mb-3 border-bottom">
                  <div className="flex-shrink-0 p-2 rounded-3 bg-danger bg-opacity-10 text-danger me-3">
                    <FaFilePdf size={20} />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0 fw-semibold text-dark">React Basics</h6>
                    <small className="text-muted">PDF Document</small>
                  </div>
                </li>
                <li className="list-group-item d-flex align-items-center px-0 border-0 pb-3 mb-3 border-bottom">
                  <div className="flex-shrink-0 p-2 rounded-3 bg-info bg-opacity-10 text-info me-3">
                    <FaFileVideo size={20} />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0 fw-semibold text-dark">Advanced JavaScript</h6>
                    <small className="text-muted">Video Lecture</small>
                  </div>
                </li>
                <li className="list-group-item d-flex align-items-center px-0 border-0">
                  <div className="flex-shrink-0 p-2 rounded-3 bg-secondary bg-opacity-10 text-secondary me-3">
                    <FaFileAlt size={20} />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0 fw-semibold text-dark">MongoDB Guide</h6>
                    <small className="text-muted">Text Doc</small>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DasbordTrainer;