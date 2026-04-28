import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://e-study-zone-fw6r.onrender.com/register/login", data);
      alert(res.data.msg);
      
      if (res.data.msg === "Login Successfully") {
        localStorage.setItem('name', res.data.data.name);
        localStorage.setItem('email', res.data.data.email);
        localStorage.setItem('id', res.data.data.id);
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('role', res.data.data.role);
        
        if (res.data.data.role === "Trainer") {
          navigate('/TrainerDasbord');
        } else if (res.data.data.role === "Learner") {
          navigate('/LearnerDasbord/Profile');
        }
      }
    } catch (er) {
      console.error(er);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container container-fluid p-0 overflow-hidden">
      <div className="row g-0 min-vh-100">
        
        {/* Left Side: Branding/Image */}
        <div className="col-lg-7 d-none d-lg-flex flex-column justify-content-center align-items-center text-white left-panel">
          <div className="overlay"></div>
          <div className="content position-relative text-center p-5">
            <h1 className="display-3 fw-bold mb-4">E Study Zone</h1>
            <p className="lead mb-4">Join thousands of learners and trainers today. Your journey to excellence starts with a single click.</p>
            <div className="features d-flex gap-4 justify-content-center">
                <div className="feat"><i className="bi bi-check-circle"></i> Interactive Learning</div>
                <div className="feat"><i className="bi bi-check-circle"></i> Expert Trainers</div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="col-lg-5 col-12 d-flex align-items-center bg-white shadow-lg">
          <div className="w-100 p-4 p-md-5">
            <div className="text-center mb-5">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQulYBd04zip5tPKtFqgLX0AimyysyCgTBFg&s"
                alt="logo"
                className="rounded-circle mb-3 shadow-sm border border-3 border-light"
                style={{ height: "80px", width: "80px", objectFit: "cover" }}
              />
              <h2 className="fw-bold text-dark">Welcome Back</h2>
              <p className="text-muted">Please enter your details to sign in</p>
            </div>

            <form onSubmit={handleSubmit} className="px-lg-4">
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">EMAIL ADDRESS</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    className="form-control border-start-0 ps-0 shadow-none"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">PASSWORD</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0">
                    <i className="bi bi-lock text-muted"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="form-control border-start-0 ps-0 shadow-none"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between mb-4">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="remember" />
                  <label className="form-check-label small" htmlFor="remember">Remember me</label>
                </div>
                <Link to="/" className="small text-decoration-none text-primary fw-bold">Forgot Password?</Link>
              </div>

              <div className="d-grid mb-4">
                <button className="btn btn-primary btn-lg rounded-3 fw-bold py-3 login-btn">
                  Sign In
                </button>
              </div>

              <div className="text-center">
                <p className="text-muted mb-0">
                  Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Create Account</Link>
                </p>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;