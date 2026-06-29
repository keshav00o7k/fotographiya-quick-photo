import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLoginClick = () => {
    navigate("/register");
  };

  return (
    <nav className="nav-navbar">
      <div className="nav-left">
        <img src="/image/logo.png" alt="Fotographiya" className="nav-logo" />
      </div>

      <button
        className="nav-mobile-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`nav-links ${mobileMenuOpen ? "nav-active" : ""}`}>
        <li className="dropdown">
          Solutions & Use-cases 
          {/* <span className="dropdown-arrow">▴</span> */}
          {/* <ul className="dropdown-menu">
            <li>For Photographers</li>
            <li>For Weddings</li>
            <li>For Parties & Celebrations</li>
            <li>For Corporates</li>
            <li>For Colleges</li>
            <li>For Events</li>
          </ul> */}
        </li>

        <li>
          <a href="https://www.fotographiya.com/aboutUs" target="_blank">
            About Us
          </a>
        </li>
        <li>
          <a href="https://www.fotographiya.com/contactUs" target="_blank">
            Contact Us
          </a>
        </li>
        <li>
          <a href="https://www.fotographiya.com/blog" target="_blank">
            Blog
          </a>
        </li>

        {/* Mobile Login Button */}
        <li className="mobile-login-wrapper">
          <button
            className="nav-login-btn nav-login-mobile"
            onClick={handleLoginClick}
          >
            Sign Up / Login
          </button>
        </li>
      </ul>

      {/* <div className="nav-actions">
        <button className="nav-login-btn" onClick={handleLoginClick}>
          Sign Up / Login
        </button>
      </div> */}
    </nav>
  );
};

export default Navbar;
