// src/components/Navbar.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("User");
  const [selfie, setSelfie] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    api
      .get("/profile")
      .then((res) => {
        setName(res.data?.name || "User");
        setSelfie(res.data?.selfie || "");
      })
      .catch(() => setName("User"));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
        setIsSubDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const homepage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    navigate(user?.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar-foto">
      <div className="navbar-left-foto" onClick={homepage}>
        <img
          src="/images/logo_colored_white.png"
          alt="Fotographiya"
          className="logo-foto"
        />
      </div>

      <div className="navbar-right-foto">
        <div 
          className="user-profile-foto" 
          ref={dropdownRef}
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => {
            setIsDropdownOpen(false);
            setIsSubDropdownOpen(false);
          }}
        >
          <img
            src={`http://localhost:5000${selfie}`}
            alt="Profile"
            className="profile-img-foto"
          />

          <ul className="nav-links-foto">
            <li className="dropdown-foto">
              <span className="dropdown-name-foto">{name}</span>
              <span className={`dropdown-arrow-foto ${isDropdownOpen ? "rotate-arrow" : ""}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </span>

              <ul className={`dropdown-menu-foto ${isDropdownOpen ? "open-foto" : ""}`}>
                <li className="dropdown-item-foto" onClick={() => navigate("/profile-setting")}>
                  <span>Profile Setting</span>
                  <svg className="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </li>

                <li className="dropdown-item-foto" onClick={() => navigate("/analytics")}>
                  <span>Analytics</span>
                  <svg className="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </li>

                <li 
                  className="dropdown-item-foto has-sub"
                  onMouseEnter={() => setIsSubDropdownOpen(true)}
                  onMouseLeave={() => setIsSubDropdownOpen(false)}
                >
                  <div className="item-main-content">
                    <span>Solutions & Use-cases</span>
                    <svg className="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                      <path d="M9 18h6"/>
                      <path d="M10 22h4"/>
                    </svg>
                  </div>
                  <svg className={`sub-arrow-icon ${isSubDropdownOpen ? "open-sub-arrow" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>

                  <ul className={`sub-dropdown-foto ${isSubDropdownOpen ? "open-sub-foto" : ""}`}>
                    <li className="sub-dropdown-item-foto">Use Case 1</li>
                    <li className="sub-dropdown-item-foto">Use Case 2</li>
                    <li className="sub-dropdown-item-foto">Solution Example</li>
                  </ul>
                </li>

                <li className="dropdown-item-foto" onClick={() => window.open("https://www.fotographiya.com/aboutUs", "_blank")}>
                  <span>Help & Support</span>
                  <svg className="menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </li>

                <li className="dropdown-divider-foto"></li>

                <li className="dropdown-item-foto logout-item-foto" onClick={handleLogout}>
                  <span>Logout</span>
                  <svg className="menu-icon logout-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;