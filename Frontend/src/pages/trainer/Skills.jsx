import React, { useState, useEffect } from 'react';
import './Skills.css';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit, FaCode, FaBriefcase } from 'react-icons/fa';

const Skills = () => {
  const userId = localStorage.getItem('id');
  const [data, setData] = useState({
    skill: '',
    description: '',
    userId: userId
  });
  const [skills, setSkills] = useState([]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.skill.trim()) {
      window.alert("Please enter a skill name");
      return;
    }
    try {
      const res = await axios.post("https://e-study-zone-fw6r.onrender.com/api/skillss", data);
      window.alert(res.data.msg);
      fetchSkills();
      setData({ skill: '', description: '', userId });
    } catch (err) {
      console.error(err);
      window.alert("Error saving skill");
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await axios.get(`https://e-study-zone-fw6r.onrender.com/api/getskill/${userId}`);
      setSkills(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSkill = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await axios.delete(`https://e-study-zone-fw6r.onrender.com/api/skillss/${id}`);
        fetchSkills();
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="skills-page-wrapper">
      {/* Page Header */}
      <div className="skills-page-header">
        <div className="skills-header-content">
          <div className="skills-header-icon">
            <FaCode size={28} />
          </div>
          <div>
            <h1 className="skills-page-title">Skills & Expertise</h1>
            <p className="skills-page-subtitle">Manage your professional skills and technical expertise</p>
          </div>
        </div>
        <div className="skills-header-badge">
          <FaBriefcase />
          <span>{skills.length} Skills</span>
        </div>
      </div>

      <div className="row">
        {/* Add Skill Form */}
        <div className="col-sm-12 mb-4">
          <div className="skills-form-card">
            <div className="skills-form-header">
              <h3 className="skills-form-title">Add New Skill</h3>
              <div className="skills-form-line"></div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-12 col-md-5 mb-3">
                  <label className="skills-label">Skill Name</label>
                  <div className="skills-input-wrapper">
                    <FaCode className="skills-input-icon" />
                    <input
                      type="text"
                      name="skill"
                      placeholder="e.g. React, Node.js, Python..."
                      className="skills-input"
                      value={data.skill}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-sm-12 col-md-5 mb-3">
                  <label className="skills-label">Description</label>
                  <div className="skills-input-wrapper">
                    <FaEdit className="skills-input-icon" />
                    <input
                      type="text"
                      name="description"
                      placeholder="Brief description of your expertise..."
                      className="skills-input"
                      value={data.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-sm-12 col-md-2 mb-3 d-flex align-items-end">
                  <button type="submit" className="skills-add-btn">
                    <FaPlus className="me-2" />
                    Add Skill
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Skills Table */}
        <div className="col-sm-12">
          <div className="skills-table-card">
            <div className="skills-table-header">
              <h3 className="skills-table-title">Your Skills</h3>
              <div className="skills-table-line"></div>
            </div>

            {skills.length === 0 ? (
              <div className="skills-empty-state">
                <div className="skills-empty-icon">
                  <FaCode size={48} />
                </div>
                <h4>No Skills Added Yet</h4>
                <p>Start adding your professional skills to build your profile</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="skills-table">
                  <thead>
                    <tr>
                      <th className="skills-th-col-no">#</th>
                      <th className="skills-th-col-name">Skill Name</th>
                      <th className="skills-th-col-desc">Description</th>
                      <th className="skills-th-col-action text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((s, i) => (
                      <tr key={s._id} className="skills-table-row">
                        <td className="skills-td-no">
                          <span className="skills-sr-badge">{i + 1}</span>
                        </td>
                        <td>
                          <div className="skills-name-cell">
                            <span className="skills-dot"></span>
                            {s.skill}
                          </div>
                        </td>
                        <td className="skills-desc-cell">{s.description}</td>
                        <td>
                          <div className="skills-action-btns">
                            <button
                              className="skills-btn-edit"
                              title="Edit Skill"
                            >
                              <FaEdit size={13} />
                              <span>Edit</span>
                            </button>
                            <button
                              className="skills-btn-delete"
                              onClick={() => deleteSkill(s._id)}
                              title="Delete Skill"
                            >
                              <FaTrash size={13} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;