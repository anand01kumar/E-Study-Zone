import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Mycontent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('id');

  const handlefetch = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://e-study-zone-fw6r.onrender.com/api/content/getcontent/${userId}`);
      setData(res.data.data || []); 
    } catch (err) {
      console.error("Error fetching content:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handlefetch();
  }, []);

  // File extension के आधार पर icon और color दिखाने के लिए helper function
  const getFileDetails = (filename) => {
    if (!filename) return { icon: '📄', color: '#64748b', bg: '#f1f5f9', type: 'File' };
    const ext = filename.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(ext)) return { icon: '📕', color: '#ef4444', bg: '#fef2f2', type: 'PDF Document' };
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return { icon: '🎬', color: '#3b82f6', bg: '#eff6ff', type: 'Video File' };
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return { icon: '🖼️', color: '#10b981', bg: '#ecfdf5', type: 'Image File' };
    if (['doc', 'docx'].includes(ext)) return { icon: '📝', color: '#2563eb', bg: '#dbeafe', type: 'Word Document' };
    if (['ppt', 'pptx'].includes(ext)) return { icon: '📊', color: '#f97316', bg: '#fff7ed', type: 'Presentation' };
    if (['zip', 'rar'].includes(ext)) return { icon: '🗜️', color: '#8b5cf6', bg: '#f5f3ff', type: 'Zip Archive' };
    
    return { icon: '📎', color: '#64748b', bg: '#f8fafc', type: ext.toUpperCase() + ' File' };
  };

  return (
    <div className="container mt-4 pb-5">
      
      {/* Header */}
      <div className="card border-0 shadow-sm mb-4 text-white" style={{ background: 'linear-gradient(90deg, #2d2d44 0%, #4361ee 100%)' }}>
        <div className="card-body py-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold mb-1">📂 My Learning Content</h2>
            <p className="mb-0 opacity-75 small">Files and resources shared by your trainers</p>
          </div>
          <span className="badge bg-white bg-opacity-25 fs-6 py-2 px-3">
            {data.length} Items
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mt-3 text-muted fw-semibold">Loading your content...</p>
        </div>
      ) : 
      
      /* Empty State */
      data.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <div className="mb-3" style={{ fontSize: '4rem' }}>📭</div>
          <h5>No Content Available Yet</h5>
          <p className="small">Once your connected trainers share resources, they will appear here.</p>
        </div>
      ) : 
      
      /* Content Grid */
      (
        <div className="row g-4">
          {data.map((item, i) => {
            const fileDetails = getFileDetails(item.file);
            const fileName = item.file ? item.file.split('/').pop() : "Unknown File";

            return (
              <div className="col-12 col-sm-6 col-lg-4" key={item._id}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex flex-column p-4">
                    
                    {/* Top: Skill Badge */}
                    <div className="mb-3">
                      <span className="badge bg-light text-dark border px-3 py-2">
                        <span className="me-1">⭐</span> {item.skillId?.skill || "Unknown Skill"}
                      </span>
                    </div>

                    {/* Middle: File Info Box */}
                    <div className="flex-grow-1 mb-4">
                      <div className="d-flex align-items-start p-3 rounded-3 mb-3" style={{ backgroundColor: fileDetails.bg }}>
                        <div className="fs-2 me-3">{fileDetails.icon}</div>
                        <div className="overflow-hidden">
                          <h6 className="mb-0 text-truncate fw-bold" style={{ color: fileDetails.color, maxWidth: '180px' }} title={fileName}>
                            {fileName}
                          </h6>
                          <small className="text-muted">{fileDetails.type}</small>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center text-muted small">
                        <div className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex align-items-center justify-content-center me-2 fw-bold" style={{ width: '30px', height: '30px', fontSize: '12px' }}>
                          {item.userId?.name ? item.userId.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        Uploaded by: <span className="fw-semibold text-dark ms-1">{item.userId?.name || "Unknown"}</span>
                      </div>
                    </div>

                    {/* Bottom: Action Button */}
                    <Link
                      to={`http://localhost:5000/api/${item.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn w-100 fw-semibold mt-auto"
                      style={{ backgroundColor: fileDetails.color, color: '#fff', border: 'none' }}
                      onMouseEnter={(e) => e.target.style.filter = 'brightness(1.1)'}
                      onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-up-right me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                        <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                      </svg>
                      View Content
                    </Link>

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

export default Mycontent;