import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import { FaUser, FaEnvelope, FaGraduationCap, FaShieldAlt, FaEdit, FaTimes, FaSave, FaUserCircle } from 'react-icons/fa';

const Profile = () => {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    email: "",
    role: ""
  });
  const [showModal, setShowModal] = useState(false);
  const userId = localStorage.getItem('id');

  const handleFetch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/getuser/${userId}`);
      setData(res.data.data);
      setFormData(res.data.data);
    } catch (er) {
      console.error("Error fetching user:", er);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/api/user/update/${userId}`, formData);
      setData(res.data.data);
      setShowModal(false);
    } catch (er) {
      console.error("Error updating user:", er);
    }
  };

  const openModal = () => {
    setFormData(data);
    setShowModal(true);
  };

  return (
    <div className="profile-page-wrapper">
      {/* Page Header */}
      <div className="profile-page-header">
        <div className="profile-header-content">
          <div className="profile-header-icon">
            <FaUser size={28} />
          </div>
          <div>
            <h1 className="profile-page-title">My Profile</h1>
            <p className="profile-page-subtitle">View and manage your personal information</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          {/* Profile Card */}
          <div className="profile-main-card">
            {/* Banner */}
            <div className="profile-card-banner"></div>

            {/* Profile Info Section */}
            <div className="profile-card-body">
              <div className="profile-top-row">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-ring">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi9PoZuiGF_Jz8E3t6u38Fzs0aL8fV2-QMhg&s"
                      alt="Profile"
                      className="profile-avatar-img"
                    />
                    <div className="profile-avatar-status"></div>
                  </div>
                  <div className="profile-identity">
                    <h2 className="profile-display-name">
                      {data?.name || "Loading..."}
                    </h2>
                    <span className="profile-role-badge">
                      <FaShieldAlt size={11} />
                      {data?.role || "---"}
                    </span>
                  </div>
                </div>
                <button className="profile-edit-btn" onClick={openModal}>
                  <FaEdit size={14} />
                  Edit Profile
                </button>
              </div>

              {/* Info Cards */}
              <div className="row mt-4">
                <div className="col-sm-12 col-md-4 mb-3">
                  <div className="profile-info-card">
                    <div className="profile-info-icon">
                      <FaEnvelope />
                    </div>
                    <div className="profile-info-text">
                      <span className="profile-info-label">Email Address</span>
                      <p className="profile-info-value">{data?.email || "---"}</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-4 mb-3">
                  <div className="profile-info-card">
                    <div className="profile-info-icon profile-info-icon--green">
                      <FaGraduationCap />
                    </div>
                    <div className="profile-info-text">
                      <span className="profile-info-label">Qualification</span>
                      <p className="profile-info-value">{data?.qualification || "---"}</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-4 mb-3">
                  <div className="profile-info-card">
                    <div className="profile-info-icon profile-info-icon--purple">
                      <FaShieldAlt />
                    </div>
                    <div className="profile-info-text">
                      <span className="profile-info-label">Role</span>
                      <p className="profile-info-value">{data?.role || "---"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="profile-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="profile-modal-box" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="profile-modal-header">
              <div className="profile-modal-header-left">
                <div className="profile-modal-icon">
                  <FaUserCircle size={20} />
                </div>
                <div>
                  <h3 className="profile-modal-title">Edit Profile</h3>
                  <p className="profile-modal-subtitle">Update your personal details</p>
                </div>
              </div>
              <button className="profile-modal-close" onClick={() => setShowModal(false)}>
                <FaTimes size={16} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              {/* Modal Body */}
              <div className="profile-modal-body">
                <div className="row">
                  <div className="col-sm-12 mb-3">
                    <label className="profile-modal-label">Full Name</label>
                    <div className="profile-modal-input-wrap">
                      <FaUser className="profile-modal-input-icon" />
                      <input
                        type="text"
                        className="profile-modal-input"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 mb-3">
                    <label className="profile-modal-label">Email Address</label>
                    <div className="profile-modal-input-wrap profile-modal-input--disabled">
                      <FaEnvelope className="profile-modal-input-icon" />
                      <input
                        type="email"
                        className="profile-modal-input"
                        name="email"
                        value={formData.email}
                        disabled
                      />
                      <span className="profile-modal-disabled-tag">Read Only</span>
                    </div>
                  </div>
                  <div className="col-sm-12 mb-3">
                    <label className="profile-modal-label">Qualification</label>
                    <div className="profile-modal-input-wrap">
                      <FaGraduationCap className="profile-modal-input-icon" />
                      <input
                        type="text"
                        className="profile-modal-input"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        placeholder="Enter your qualification"
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 mb-3">
                    <label className="profile-modal-label">Role</label>
                    <div className="profile-modal-input-wrap profile-modal-input--disabled">
                      <FaShieldAlt className="profile-modal-input-icon" />
                      <input
                        type="text"
                        className="profile-modal-input"
                        name="role"
                        value={formData.role}
                        disabled
                      />
                      <span className="profile-modal-disabled-tag">Read Only</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="profile-modal-footer">
                <button
                  type="button"
                  className="profile-modal-btn profile-modal-btn--cancel"
                  onClick={() => setShowModal(false)}
                >
                  <FaTimes size={13} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="profile-modal-btn profile-modal-btn--save"
                >
                  <FaSave size={13} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;