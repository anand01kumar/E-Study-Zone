import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UploadContent = () => {
  const [data, setData] = useState([]);
  const [contents, setContents] = useState([]);
  const userId = localStorage.getItem('id');
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const [form, setForm] = useState({
    skillId: '',
    content: '',
    userId: userId
  });

  const fileInputRef = useRef(null); // File input को रीसेट करने के लिए

  // Fetch skills
  const handleFetchSkills = async () => {
    try {
      const res = await axios.get(`https://e-study-zone-fw6r.onrender.com/api/getskill/${userId}`);
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch uploaded content
  const handleFetchContents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://e-study-zone-fw6r.onrender.com/api/content/get/${userId}`);
      setContents(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchSkills();
    handleFetchContents();
  }, []);

  const handleChange = (e) => {
    setError(''); setSuccess('');
    if (e.target.type === "file") {
      setForm({ ...form, [e.target.name]: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (!form.skillId || !form.content) {
      return setError("Please select a skill and choose a file.");
    }

    setUploading(true);
    try {
      const res = await axios.post('https://e-study-zone-fw6r.onrender.com/api/content/upload', form, {
        headers: { 'Content-type': 'multipart/form-data' }
      });
      setSuccess(res.data.msg);
      
      // फॉर्म और फाइल इनपुट को खाली करो
      setForm({ skillId: '', content: '', userId: userId });
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      handleFetchContents(); // refresh list
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to upload content.");
    } finally {
      setUploading(false);
    }
  };

  const openDeleteModal = (item) => {
    setSelectedContent(item);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedContent) return;
    try {
      const res = await axios.delete(`https://e-study-zone-fw6r.onrender.com/api/content/delete/${selectedContent._id}`);
      setSuccess(res.data.msg);
      setShowModal(false);
      handleFetchContents(); // refresh list
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete.");
      setShowModal(false);
    }
  };

  // File icon logic
  const getFileDetails = (filename) => {
    if (!filename) return { icon: 'bi-file-earmark', color: '#6c757d' };
    const ext = filename.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return { icon: 'bi-file-earmark-pdf-fill', color: '#dc3545' };
    if (['mp4', 'mov', 'avi'].includes(ext)) return { icon: 'bi-camera-reels-fill', color: '#0d6efd' };
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return { icon: 'bi-image-fill', color: '#198754' };
    if (['doc', 'docx'].includes(ext)) return { icon: 'bi-file-earmark-word-fill', color: '#0d6efd' };
    return { icon: 'bi-file-earmark-fill', color: '#6c757d' };
  };

  return (
    <div className="container mt-4 pb-5">
      
      {/* Header */}
      <div className="card border-0 shadow-sm mb-4 text-white" style={{ background: 'linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)' }}>
        <div className="card-body py-4">
          <h2 className="fw-bold mb-1"><i className="bi bi-cloud-arrow-up-fill me-2"></i>Upload Content</h2>
          <p className="mb-0 opacity-75 small">Share your resources with your connected learners</p>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center" onClick={() => setError('')}><i className="bi bi-x-circle-fill me-2"></i>{error}<button type="button" className="btn-close"></button></div>}
      {success && <div className="alert alert-success alert-dismissible fade show d-flex align-items-center" onClick={() => setSuccess('')}><i className="bi bi-check-circle-fill me-2"></i>{success}<button type="button" className="btn-close"></button></div>}

      <div className="row g-4">
        
        {/* Left / Top: Upload Form */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="mb-0 fw-bold text-dark">Add New Resource</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                
                {/* Skill select */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted small">SELECT SKILL</label>
                  <select name="skillId" onChange={handleChange} className='form-select py-2' value={form.skillId}>
                    <option value="">-- Choose a Skill --</option>
                    {data.map((item, i) => (
                      <option key={item._id} value={item._id}>{item.skill}</option>
                    ))}
                  </select>
                </div>

                {/* Custom Styled File Input */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted small">CHOOSE FILE</label>
                  <label className="d-block border border-dashed rounded-3 p-4 text-center bg-light cursor-pointer" style={{ borderColor: '#dee2e6', cursor: 'pointer' }}>
                    <i className="bi bi-cloud-arrow-up fs-1 text-secondary d-block mb-2"></i>
                    <span className="text-secondary fw-semibold">
                      {form.content ? form.content.name : "Click to browse files"}
                    </span>
                    <input
                      type="file"
                      className="d-none"
                      id="profilePic"
                      name="content"
                      onChange={handleChange}
                      ref={fileInputRef}
                    />
                  </label>
                </div>

                {/* Submit button */}
                <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={uploading}>
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-upload me-2"></i>Upload Content
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right / Bottom: Uploaded Content List */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-dark">My Resources <span className="badge bg-secondary">{contents.length}</span></h5>
            </div>
            <div className="card-body p-3">
              
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-2 text-muted small">Loading resources...</p>
                </div>
              ) : contents.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-folder2-open fs-1 d-block mb-2 opacity-50"></i>
                  <h6>No Resources Uploaded Yet</h6>
                  <p className="small mb-0">Upload your first file using the form.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {contents.map((item) => {
                    const fileDetails = getFileDetails(item.file);
                    const fileName = item.file ? item.file.split('/').pop() : "Unknown File";

                    return (
                      <div key={item._id} className="card border bg-light shadow-sm">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                            
                            {/* File Info */}
                            <div className="d-flex align-items-center overflow-hidden">
                              <div className="rounded-2 bg-white shadow-sm d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', flexShrink: '0' }}>
                                <i className={`bi ${fileDetails.icon} fs-4`} style={{ color: fileDetails.color }}></i>
                              </div>
                              <div className="overflow-hidden">
                                <h6 className="mb-0 text-truncate fw-bold" style={{ maxWidth: '250px' }} title={fileName}>{fileName}</h6>
                                <span className="badge bg-light text-dark border">{item.skillId?.skill || "N/A"}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="d-flex gap-2">
                              <a 
                                href={`http://localhost:5000/api/${item.file}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="bi bi-eye me-1"></i>View
                              </a>
                              <button 
                                className="btn btn-sm btn-outline-danger" 
                                onClick={() => openDeleteModal(item)}
                              >
                                <i className="bi bi-trash3">Delete</i>
                              </button>
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header bg-danger text-white border-0">
              <h5 className="modal-title fw-bold"><i className="bi bi-exclamation-triangle-fill me-2"></i>Delete Resource</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body py-4">
              <p className="mb-0">Are you sure you want to delete this file?</p>
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
  );
};

export default UploadContent;