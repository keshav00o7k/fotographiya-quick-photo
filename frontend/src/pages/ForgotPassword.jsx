import React, { useState } from "react";
// import { Link } from "react-router-dom";
import api from "../utils/axiosConfig";
import "./Login.css"; // 💡 Reusing the same CSS
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      await api.post("/auth/send-reset-otp", { email });
      setMsg("OTP has been sent to your email.");
      setTimeout(() => navigate("/reset-password"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "There was a problem sending OTP!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* LEFT SIDE */}
        <div className="a12">
          <div className="form-img">
            <img
              src="/images/login-banner.jpg"
              alt="Forgot Password banner"
              className="c"
            />
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
              <p>“We launched Fotographiya last year, but we've achieved a lot in
                just eight short months. My aim is to bootstrap with passion and
                bring a change in photography industry.”
              </p>
              <h4 style={{ marginBottom: "5px" }}>Team Fotographiya</h4>
              <p style={{ fontSize: "12px", marginBottom: "0px" }}>
                Support Department
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM SECTION */}
        <div className="b12">
          <div className="login-form">
            <div className="headerlogin"></div>

            <div className="loginfrom-top">
              <h2>🔑 Password Reset (Forgot Password)</h2>
              <span>Enter your registered email and get the OTP</span>

              <form onSubmit={handleSubmit}>
                <label style={{ width: "100%" }}>
                  <input
                    className="input-control"
                    type="email"
                    placeholder="Your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>

                <button className="login-btn" type="submit" disabled={loading}>
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>

              {msg && <p className="success-message">{msg}</p>}
              {error && <p className="error-message">{error}</p>}

              {/* <p style={{ marginTop: "1rem" }}>
                Got the OTP?{" "}
                <Link to="/reset-password" style={{ color: "#2887af" }}>
                  Reset here
                </Link>
              </p> */}
            </div>

            <div className="footerlogin"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
