import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    qualification: '',
    role: ''
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://e-study-zone-fw6r.onrender.com/register", data);
      alert(res.data.msg);
      if(res.status === 200 || res.status === 201) {
          navigate('/'); // Redirect to login after successful registration
      }
    } catch (er) {
      console.error(er);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-main-container container-fluid p-0">
      <div className="row g-0 min-vh-100">
        
        {/* Left Side: Visual/Branding */}
        <div className="col-lg-7 d-none d-lg-flex flex-column justify-content-center align-items-center text-white register-left-panel">
          <div className="register-overlay"></div>
          <div className="position-relative text-center p-5">
            <div className="mb-4">
               <i className="bi bi-person-plus-fill display-1"></i>
            </div>
            <h1 className="fw-bold mb-3">Join Our Community</h1>
            <p className="lead">Create an account to unlock exclusive courses, connect with expert trainers, and track your progress.</p>
            
            <ul className="list-unstyled text-start mt-4 d-inline-block">
                <li className="mb-2"><i className="bi bi-check2-circle me-2 text-info"></i> Free access to basic modules</li>
                <li className="mb-2"><i className="bi bi-check2-circle me-2 text-info"></i> Verified Certificates</li>
                <li className="mb-2"><i className="bi bi-check2-circle me-2 text-info"></i> 24/7 Support community</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="col-lg-5 col-12 d-flex align-items-center bg-light">
          <div className="container p-4 p-md-5">
            <div className="register-card bg-white shadow-sm p-4 p-md-5 mx-auto">
              <div className="mb-4">
                <h2 className="fw-bold text-dark">Create Account</h2>
                <p className="text-muted">Fill in the details to get started</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Name */}
                  <div className="col-md-6 mb-3">
                    <div className="form-floating">
                      <input 
                        type="text" 
                        className="form-control" 
                        name="name" 
                        placeholder="John Doe" 
                        onChange={handleChange}
                        required 
                      />
                      <label>Full Name</label>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-md-6 mb-3">
                    <div className="form-floating">
                      <input 
                        type="email" 
                        className="form-control" 
                        name="email" 
                        placeholder="name@example.com" 
                        onChange={handleChange}
                        required 
                      />
                      <label>Email Address</label>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="col-md-12 mb-3">
                    <div className="form-floating">
                      <input 
                        type="password" 
                        className="form-control" 
                        name="password" 
                        placeholder="Password" 
                        onChange={handleChange}
                        required 
                      />
                      <label>Create Password</label>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-md-6 mb-3">
                    <div className="form-floating">
                      <select className="form-select" name="role" onChange={handleChange} required>
                        <option value="">Choose...</option>
                        <option value="Learner">Learner</option>
                        <option value="Trainer">Trainer</option>
                      </select>
                      <label>I am a...</label>
                    </div>
                  </div>

                  {/* Qualification */}
                  <div className="col-md-6 mb-3">
                    <div className="form-floating">
                      <input 
                        type="text" 
                        className="form-control" 
                        name="qualification" 
                        placeholder="B.Tech" 
                        onChange={handleChange}
                        required 
                      />
                      <label>Highest Qualification</label>
                    </div>
                  </div>
                </div>

                <div className="form-check mb-4">
                  <input className="form-check-input" type="checkbox" value="" id="terms" required />
                  <label className="form-check-label small text-muted" htmlFor="terms">
                    I agree to the <a href="#" className="text-decoration-none">Terms of Service</a> and <a href="#" className="text-decoration-none">Privacy Policy</a>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-3 py-3 fw-bold register-btn">
                  Create Account
                </button>

                <div className="text-center mt-4">
                  <p className="text-muted">
                    Already have an account? <Link to="/" className="text-primary fw-bold text-decoration-none">Login Here</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;