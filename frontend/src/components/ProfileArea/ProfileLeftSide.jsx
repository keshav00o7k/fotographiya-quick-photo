import React from "react";
import "./ProfileLeftSide.css";

function ProfileLeftSide({ activeIndex, onSectionChange }) {
  return (
    <div className="ProfileLeftSide d">
      <div className="sidebar">
        <div className="sidebarMenu">
          <ul className="nk-menu">
            <li className="PRofile-heading">
              <h6>Profile Settings</h6>
            </li>

            <li
              className={`PRofile-item ${activeIndex === 0 ? "active" : ""}`}
              onClick={() => onSectionChange(0)}
            >
              <div className="item-content">
                <span>Your Profile</span>
              </div>
            </li>

            <li
              className={`PRofile-item ${activeIndex === 1 ? "active" : ""}`}
              onClick={() => onSectionChange(1)}
            >
              <div className="item-content">
                <span>Fotographiya Wallet</span>
                <img src="./images/new-2.png" width="40px" alt="icon" />
              </div>
            </li>

            <li
              className={`PRofile-item ${activeIndex === 2 ? "active" : ""}`}
              onClick={() => onSectionChange(2)}
            >
              <div className="item-content">
                <span>Transactions</span>
                <img src="./images/new-2.png" width="40px" alt="icon" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProfileLeftSide;
