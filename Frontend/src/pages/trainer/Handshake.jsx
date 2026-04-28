import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Handshake = () => {
  const userid = localStorage.getItem('id');
  const [data, setData] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleFetch = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://e-study-zone-fw6r.onrender.com/api/handshake/${userid}`);
      setData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching handshake requests:", err);
      showToast("Failed to load requests.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const updateRequest = async (item) => {
    try {
      await axios.patch(`https://e-study-zone-fw6r.onrender.com/api/handshake/accept/${item._id}`);
      showToast("Request accepted successfully!", "success");
      handleFetch();
    } catch {
      showToast("Failed to accept request.", "error");
    }
  };

  const rejectRequest = async (item) => {
    try {
      await axios.patch(`https://e-study-zone-fw6r.onrender.com/api/handshake/reject/${item._id}`);
      showToast("Request rejected.", "warning");
      handleFetch();
    } catch {
      showToast("Failed to reject request.", "error");
    }
  };

  const getInitials = (name) => {
    if (!name || name === "Unknown") return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Stats Calculate
  const pendingCount = data.filter(d => d.status === 'pending').length;
  const acceptedCount = data.filter(d => d.status === 'accepted').length;
  const rejectedCount = data.filter(d => d.status === 'rejected').length;

  return (
    <div className="container mt-4 pb-5">
      
      {/* Toast Notification */}
      <div 
        className={`alert alert-dismissible fade position-fixed ${toast.show ? 'show d-flex align-items-center' : 'd-none'}`} 
        style={{ top: '20px', right: '20px', zIndex: 9999, minWidth: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        role="alert"
        variant={toast.type}
        className={`alert alert-${toast.type === 'error' ? 'danger' : toast.type === 'warning' ? 'warning' : 'success'} alert-dismissible fade position-fixed ${toast.show ? 'show d-flex align-items-center' : 'd-none'}`}
      >
        <i className={`bi ${toast.type === 'error' ? 'bi-x-circle-fill' : toast.type === 'warning' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} me-2`}></i>
        <div>{toast.message}</div>
        <button type="button" className="btn-close" onClick={() => setToast({ show: false, message: '', type: '' })}></button>
      </div>

      {/* Header */}
      <div className="card border-0 shadow-sm mb-4 text-white" style={{ background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)' }}>
        <div className="card-body py-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1">👨‍🏫 Trainer Handshake</h2>
              <p className="mb-0 opacity-75 small">Manage learner connection requests</p>
            </div>
            <div className="d-flex gap-3">
              <div className="text-center bg-white bg-opacity-25 rounded-3 px-4 py-2">
                <h4 className="mb-0 fw-bold">{data.length}</h4>
                <small className="opacity-75">Total</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-start border-warning border-4">
            <div className="card-body d-flex align-items-center py-3">
              <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px' }}>
                <i className="bi bi-hourglass-split text-warning fs-5"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-bold text-dark">{pendingCount}</h4>
                <small className="text-muted">Pending Requests</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-start border-success border-4">
            <div className="card-body d-flex align-items-center py-3">
              <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px' }}>
                <i className="bi bi-person-check-fill text-success fs-5"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-bold text-dark">{acceptedCount}</h4>
                <small className="text-muted">Accepted</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-start border-danger border-4">
            <div className="card-body d-flex align-items-center py-3">
              <div className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px' }}>
                <i className="bi bi-person-x-fill text-danger fs-5"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-bold text-dark">{rejectedCount}</h4>
                <small className="text-muted">Rejected</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mt-3 text-muted fw-semibold">Loading requests...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <div className="text-center py-5 text-muted">
          <div className="mb-3" style={{ fontSize: '4rem' }}>🤝</div>
          <h5>No Requests Yet</h5>
          <p className="small">When learners send you handshake requests, they will appear here.</p>
        </div>
      )}

      {/* Request Cards List */}
      {!loading && data.length > 0 && (
        <div className="row g-3">
          {data.map((item, i) => {
            const isPending = item.status === 'pending';
            const name = item.learnerId?.name || "Unknown";

            return (
              <div className="col-12" key={item._id}>
                <div className={`card border-0 shadow-sm h-100 ${!isPending ? 'opacity-75' : ''}`} style={{ borderLeft: isPending ? '5px solid #f59e0b' : item.status === 'accepted' ? '5px solid #10b981' : '5px solid #ef4444' }}>
                  <div className="card-body">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                      
                      {/* Left: User Info */}
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold" style={{ width: '50px', height: '50px', flexShrink: '0' }}>
                          {getInitials(name)}
                        </div>
                        <div>
                          <h5 className="mb-0 fw-bold">{name}</h5>
                          <small className="text-muted">Request #{i + 1}</small>
                        </div>
                      </div>

                      {/* Middle: Status Badge */}
                      <div>
                        {isPending && (
                          <span className="badge bg-warning bg-opacity-10 text-warning py-2 px-3" style={{ fontSize: '14px' }}>
                            <i className="bi bi-hourglass-split me-1"></i> Pending
                          </span>
                        )}
                        {item.status === 'accepted' && (
                          <span className="badge bg-success bg-opacity-10 text-success py-2 px-3" style={{ fontSize: '14px' }}>
                            <i className="bi bi-check-circle-fill me-1"></i> Accepted
                          </span>
                        )}
                        {item.status === 'rejected' && (
                          <span className="badge bg-danger bg-opacity-10 text-danger py-2 px-3" style={{ fontSize: '14px' }}>
                            <i className="bi bi-x-circle-fill me-1"></i> Rejected
                          </span>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="d-flex gap-2">
                        {isPending ? (
                          <>
                            <button className="btn btn-success" onClick={() => updateRequest(item)}>
                              <i className="bi bi-check-lg me-1"></i> Accept
                            </button>
                            <button className="btn btn-outline-danger" onClick={() => rejectRequest(item)}>
                              <i className="bi bi-x-lg me-1"></i> Reject
                            </button>
                          </>
                        ) : (
                          <div className="text-muted fst-italic small">
                            {item.status === 'accepted' 
                              ? <><i className="bi bi-check-circle me-1 text-success"></i>Connected</>
                              : <><i className="bi bi-x-circle me-1 text-danger"></i>Declined</>
                            }
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Handshake;