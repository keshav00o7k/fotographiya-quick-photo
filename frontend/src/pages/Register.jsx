import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import "./Login.css"; // Using same CSS

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      navigate("/verify-email-otp");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="a12">
          <div className="form-img">
            <img src="/images/login-banner.jpg" alt="banner" className="c" />
            <div className="logo-wrapper"><img src="/images/logo_colored_white.png" alt="Logo" /></div>
            <div className="overlaytext">
              <p>“We launched Fotographiya last year, but we've achieved a lot in
                just eight short months. My aim is to bootstrap with passion and
                bring a change in photography industry.”</p>
              <h4>Mohit Barthunia</h4>
              <p style={{ fontSize: "12px" }}>Founder of Fotographiya</p>
            </div>
          </div>
        </div>
        <div className="b12">
          <div className="login-form">
            <div className="mobile-only-logo"><img src="/images/logo_colored_white.png" alt="Logo" /></div>
            <div className="loginfrom-top">
              <h2>🔰 Registration</h2>
              <span>Enter your details</span>
              <form onSubmit={handleSubmit}>
                <input className="input-control" type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input className="input-control" type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input className="input-control" type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button className="login-btn" type="submit" disabled={loading}>Register</button>
              </form>
              <p className="footer-link">Already a user? <a href="/login">Login here</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;