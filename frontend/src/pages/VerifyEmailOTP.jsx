import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import "./Login.css"; // ✅ Same CSS used for uniform layout

const VerifyEmailOTP = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", otp: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-email-otp", form);

      setMsg(res.data.message || "OTP is correct!");

      // ✅ Save token and user in localStorage
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("role", res.data.role); // ✅
      }

      // ✅ Redirect to selfie page
      setTimeout(() => navigate("/selfie-capture"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Problem verifying OTP!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Image + Quote */}
        <div className="a12">
          <div className="form-img">
            <img src="/images/login-banner.jpg" alt="banner" className="c" />
            <div className="logo-wrapper">
              <a
                href="https://Fotographiya.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/logo_colored_white.png"
                  alt="Fotographiya"
                  width="157"
                />
              </a>
            </div>
            <div className="overlaytext" style={{ width: "520px" }}>
              <p>
                “Email verification is not just security, it's a beginning of
                trust.”
              </p>
              <h4 style={{ marginBottom: "5px" }}>Team Fotographiya</h4>
              <p style={{ fontSize: "12px", marginBottom: 0 }}>
                Community Support
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - OTP Verification Form */}
        <div className="b12">
          <div className="login-form">
            <div className="headerlogin"></div>

            <div className="loginfrom-top">
              <h2>📧 Verify Email</h2>
              <span>Verify by entering OTP and email below</span>

              <form onSubmit={handleSubmit}>
                <label style={{ width: "100%" }}>
                  <input
                    className="input-control"
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label style={{ width: "100%" }}>
                  <input
                    className="input-control"
                    type="text"
                    name="otp"
                    placeholder="OTP"
                    value={form.otp}
                    onChange={handleChange}
                    required
                  />
                </label>

                <button className="login-btn" type="submit" disabled={loading}>
                  {loading ? "Checking OTP..." : "Verify OTP"}
                </button>
              </form>

              {/* Messages */}
              {msg && <p className="success-message">{msg}</p>}
              {error && <p className="error-message">{error}</p>}
            </div>

            <div className="footerlogin"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailOTP;
