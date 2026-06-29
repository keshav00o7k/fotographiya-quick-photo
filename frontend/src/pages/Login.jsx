import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);
      setSuccess(res.data.message);
      localStorage.setItem("token", res.data.token);
      const fullUser = { ...res.data.user, role: res.data.role };
      localStorage.setItem("user", JSON.stringify(fullUser));
      
      setTimeout(() => {
        if (res.data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "There was a problem logging in!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side Banner (Desktop Only) */}
        <div className="a12">
          <div className="form-img">
            <img src="/images/login-banner.jpg" alt="banner" className="c" />
            <div className="logo-wrapper">
              <a href="https://Fotographiya.com" target="_blank" rel="noopener noreferrer">
                <img src="/images/logo_colored_white.png" alt="Fotographiya" />
              </a>
            </div>
            <div className="overlaytext">
              <p>
                “We launched Fotographiya last year, but we've achieved a lot in
                just eight short months. My aim is to bootstrap with passion and
                bring a change in photography industry.”
              </p>
              <h4>Mohit Barthunia</h4>
              <p style={{ fontSize: "12px" }}>Founder of Fotographiya</p>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="b12">
          <div className="login-form">
            <div className="mobile-only-logo">
              <img src="/images/logo_colored_white.png" alt="Fotographiya" />
            </div>

            <div className="loginfrom-top">
              <h2>🔐 Login</h2>
              <span>Enter your email and password</span>

              <form onSubmit={handleSubmit}>
                <input
                  className="input-control"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  className="input-control"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button className="login-btn" type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              {/* Forgot Password Link - Re-added here */}
              <p className="footer-link">
                Forgot password? <a href="/forgot-password">Reset here</a>
              </p>
              
              <p className="footer-link">
                New user? <a href="/register">Register here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;