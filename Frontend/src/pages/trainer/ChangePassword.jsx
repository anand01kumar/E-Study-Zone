import axios from "axios";
import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const ChangePassword = () => {
  const userId = localStorage.getItem("id");
  
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Eye Toggle States
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    // टाइप करते वक्त पुराने alerts हटाओ
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Frontend Validations
    if (data.newPassword !== data.confirmPassword) {
      return setError("New password and confirm password do not match.");
    }

    if (data.newPassword.length < 6) {
      return setError("New password must be at least 6 characters long.");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/change-password",
        {
          userId,
          ...data,
        }
      );

      setSuccess(res.data.msg);
      // फॉर्म खाली कर दो सफलता के बाद
      setData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Error changing password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 pb-5 d-flex justify-content-center">
      <div style={{ maxWidth: "480px", width: "100%" }}>
        
        {/* Header Card */}
        <div className="card border-0 shadow-sm mb-4 text-white" style={{ background: 'linear-gradient(90deg, #434343 0%, #000000 100%)' }}>
          <div className="card-body py-4 text-center">
            <h2 className="fw-bold mb-1"><i className="bi bi-shield-lock-fill me-2"></i>Change Password</h2>
            <p className="mb-0 opacity-75 small">Keep your account secure by updating your password</p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center" role="alert">
            <i className="bi bi-x-circle-fill me-2"></i>
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
                    type={showOld ? "text" : "password"}
                    name="oldPassword"
                    className="form-control"
                    placeholder="Enter current password"
                    value={data.oldPassword}
                    onChange={handleChange}
                    required
                  />
                  <button className="btn btn-outline-secondary" type="button" onClick={() => setShowOld(!showOld)}>
                    <i className={`bi ${showOld ? 'bi-eye-slash' : 'bi-eye'}`}></i>
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
                    name="newPassword"
                    className="form-control"
                    placeholder="Enter new password"
                    value={data.newPassword}
                    onChange={handleChange}
                    required
                  />
                  <button className="btn btn-outline-secondary" type="button" onClick={() => setShowNew(!showNew)}>
                    <i className={`bi ${showNew ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-muted small">CONFIRM NEW PASSWORD</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><i className="bi bi-lock-fill text-muted"></i></span>
                  <input 
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm new password"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button className="btn btn-outline-secondary" type="button" onClick={() => setShowConfirm(!showConfirm)}>
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

export default ChangePassword;