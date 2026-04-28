import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChangePasswords = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Eye Toggle States (पासवर्ड दिखाने/छुपाने के लिए)
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // टाइप करते समय एरर/सक्सेस हटा दो
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { currentPassword, newPassword, confirmPassword } = formData;

    // Frontend Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError("Please fill in all fields.");
    }

    if (newPassword !== confirmPassword) {
      return setError("New password and confirm password do not match.");
    }

    if (newPassword.length < 6) {
      return setError("New password must be at least 6 characters long.");
    }

    setLoading(true);
    try {
      const adminId = localStorage.getItem('id'); // Login टाइम जो id save हुई थी
      const token = localStorage.getItem('token');
      
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.patch('https://e-study-zone-fw6r.onrender.com/api/admin/change-password', {
        id: adminId,
        currentPassword,
        newPassword
      }, config);

      setSuccess(res.data.msg);
      // फॉर्म खाली कर दो
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 pb-5 d-flex justify-content-center">
      <div style={{ maxWidth: '500px', width: '100%' }}>
        
        {/* Header Card */}
        <div className="card border-0 shadow-sm mb-4 text-white" style={{ background: 'linear-gradient(90deg, #434343 0%, #000000 100%)' }}>
          <div className="card-body py-4 text-center">
            <h2 className="fw-bold mb-1"><i className="bi bi-shield-lock-fill me-2"></i>Change Password</h2>
            <p className="mb-0 opacity-75 small">Keep your account secure by updating your password</p>
          </div>
        </div>

        {/* Alerts */}
        {error && <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center" onClick={() => setError('')}><i className="bi bi-x-circle-fill me-2"></i>{error}<button type="button" className="btn-close"></button></div>}
        {success && <div className="alert alert-success alert-dismissible fade show d-flex align-items-center" onClick={() => setSuccess('')}><i className="bi bi-check-circle-fill me-2"></i>{success}<button type="button" className="btn-close"></button></div>}

        {/* Form Card */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleSubmit}>
              
              {/* Current Password */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-muted small">CURRENT PASSWORD</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><i className="bi bi-key text-muted"></i></span>
                  <input 
                    type={showCurrent ? "text" : "password"}
                    className="form-control"
                    name="currentPassword"
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                  >
                    <i className={`bi ${showCurrent ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-muted small">NEW PASSWORD</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><i className="bi bi-lock-fill text-muted"></i></span>
                  <input 
                    type={showNew ? "text" : "password"}
                    className="form-control"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                  >
                    <i className={`bi ${showNew ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-muted small">CONFIRM NEW PASSWORD</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><i className="bi bi-lock-fill text-muted"></i></span>
                  <input 
                    type={showConfirm ? "text" : "password"}
                    className="form-control"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-dark w-100 py-2 fw-semibold mt-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2"></i>
                    Update Password
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswords;