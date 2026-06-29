import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
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
      await api.post("/auth/reset-password", form);
      setMsg("Password changed! You can now log in.");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Problem resetting password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp_page_92831">

      {/* 🔒 GLOBAL LOGO — ALWAYS VISIBLE */}
      <div className="rp_globalLogo_92831">
        <a href="https://Fotographiya.com" target="_blank" rel="noreferrer">
          <img src="/images/logo_colored_white.png" alt="Fotographiya" />
        </a>
      </div>

      <div className="rp_container_92831">

        {/* LEFT IMAGE (DESKTOP ONLY) */}
        <div className="rp_left_92831">
          <div className="rp_imageWrap_92831">
            <img
              src="/images/login-banner.jpg"
              alt="banner"
              className="rp_bannerImg_92831"
            />

            <div className="rp_overlayText_92831">
              <p>"A new password brings new confidence — return with security."</p>
              <h4>Team Fotographiya</h4>
              <p style={{ fontSize: "12px" }}>Technical Support</p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="rp_right_92831">
          <div className="rp_formWrap_92831">
            <div className="rp_formTop_92831">
              <h2>🔒 Reset Password</h2>
              <span>Enter OTP and new password</span>

              <form onSubmit={handleSubmit}>
                <input
                  className="rp_input_92831"
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <input
                  className="rp_input_92831"
                  type="text"
                  name="otp"
                  placeholder="6-digit OTP"
                  value={form.otp}
                  onChange={handleChange}
                  required
                />

                <input
                  className="rp_input_92831"
                  type="password"
                  name="newPassword"
                  placeholder="New password"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  className="rp_button_92831"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              {msg && <p className="rp_success_92831">{msg}</p>}
              {error && <p className="rp_error_92831">{error}</p>}

              <p className="rp_footer_92831">
                Back to <a href="/login">Login</a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
