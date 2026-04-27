import axios from 'axios';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const HandshakeRequest = () => {
  const userId = localStorage.getItem('id');
  const [form, setForm] = useState({ query: '' });
  const [data, setData] = useState([]);
  const [handshakes, setHandshakes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchHandshakes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/handshake/learner/${userId}`);
      setHandshakes(res.data.data || []);
    } catch (err) {
      console.error("Error fetching handshakes:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.query.trim()) {
      setError("Please enter a skill to search.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/content/search', form);
      if (res.data.data?.length) {
        setData(res.data.data);
        setSuccess("Search completed successfully!");
      } else {
        setError("No content found for this skill.");
        setData([]);
      }
    } catch (err) {
      setError("Skill not Found");
      setData([]);
    }
  };

  const sendRequest = async (item) => {
    try {
      await axios.post(`http://localhost:5000/api/handshake/request/${item.userId._id}`, {
        learnerId: userId,
        status: 'pending'
      });
      setSuccess("Handshake request sent!");
      setError('');
      fetchHandshakes(); // refresh status
    } catch (err) {
      // अगर बैकएंड से कोई specific error आए तो वो दिखाओ वरना generic error
      setError(err.response?.data?.msg || "Failed to send request.");
      setSuccess('');
    }
  };

  useEffect(() => {
    fetchHandshakes();
  }, []);

  const getStatusForTrainer = (trainerId) => {
    const hs = handshakes.find(h => h.trainerId._id === trainerId);
    return hs ? hs.status : null;
  };

  return (
    <div className="container mt-4 pb-5">
      
      {/* Header Card */}
      <div className="card border-0 shadow-sm mb-4 text-white" style={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="card-body py-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="mb-1 fw-bold">🤝 Handshake Request</h2>
              <p className="mb-0 opacity-75 small">Find trainers by skill and send a connection request</p>
            </div>
            <div className="d-flex gap-4">
              <div className="text-center bg-white bg-opacity-25 rounded-3 px-4 py-2">
                <h4 className="mb-0 fw-bold">{handshakes.filter(h => h.status === 'pending').length}</h4>
                <small className="opacity-75">Pending</small>
              </div>
              <div className="text-center bg-white bg-opacity-25 rounded-3 px-4 py-2">
                <h4 className="mb-0 fw-bold">{handshakes.filter(h => h.status === 'accepted').length}</h4>
                <small className="opacity-75">Accepted</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          <div>{success}</div>
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {/* Search Bar */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="input-group input-group-lg shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                onChange={handleChange}
                name="query"
                type="search"
                className="form-control border-start-0 ps-0"
                placeholder="Search for a skill (e.g., React, Python, Design...)"
                value={form.query}
              />
              <button className="btn btn-primary px-4" type="submit">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Grid */}
      <div className="row g-4">
        {data.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5 text-muted">
              <i className="bi bi-people fs-1 d-block mb-3 opacity-50"></i>
              <h5>No Trainers Found</h5>
              <p className="mb-0">Search for a skill above to discover available trainers.</p>
            </div>
          </div>
        ) : (
          data.map((item, i) => {
            const status = getStatusForTrainer(item.userId._id);
            const initials = item.userId?.name 
              ? item.userId.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) 
              : '?';

            return (
              <div className="col-md-6 col-lg-4" key={item._id}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    
                    {/* Trainer Info */}
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3 fs-5 fw-bold" style={{ minWidth: '50px', minHeight: '50px', width: '50px', height: '50px' }}>
                        {initials}
                      </div>
                      <div className="overflow-hidden">
                        <h6 className="mb-0 text-truncate fw-bold">{item.userId?.name || "Unknown"}</h6>
                        <small className="text-muted">Trainer</small>
                      </div>
                    </div>
                    
                    {/* Skill & Description */}
                    <div className="mb-3">
                      <span className="badge bg-light text-dark border mb-2">
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        {item.skillId?.skill}
                      </span>
                      <p className="card-text text-muted small mb-0" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.skillId?.description}
                      </p>
                    </div>

                    {/* Action Area */}
                    <div className="mt-auto pt-3 border-top">
                      {status === "pending" ? (
                        <div className="d-flex align-items-center justify-content-center text-warning bg-warning bg-opacity-10 rounded-3 py-2">
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          <span className="fw-semibold text-dark">Pending</span>
                        </div>
                      ) : status === "accepted" ? (
                        <div className="d-flex align-items-center justify-content-center text-success bg-success bg-opacity-10 rounded-3 py-2 fw-semibold">
                          <i className="bi bi-check-circle-fill me-2"></i>Connected
                        </div>
                      ) : status === "rejected" ? (
                        <div className="d-flex align-items-center justify-content-center text-danger bg-danger bg-opacity-10 rounded-3 py-2 fw-semibold">
                          <i className="bi bi-x-circle-fill me-2"></i>Rejected
                        </div>
                      ) : (
                        <button
                          className="btn btn-primary w-100 fw-semibold"
                          onClick={() => sendRequest(item)}
                        >
                          <i className="bi bi-send-fill me-2"></i>Send Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HandshakeRequest;