import React, { useState } from "react";
import Profile1page from "../components/ProfileArea/ProfileLeftSide";
import Fotographiya_Profile from "../components/ProfileArea/Fotographiya_Profile";
import Fotographiya_Wallet from "../components/ProfileArea/Fotographiya_wallet";
import Navbar from "../components/Navbar";
import "./Fotographiyamain.css";

const Fotographiya_Main = ({ profileImage, setProfileImage }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <Navbar />

      <div className="maindiv">
        {/* Mobile Sidebar (slides in from left) */}
        <div className={`profile-sidebar ${isSidebarOpen ? "open" : ""}`}>
          <Profile1page
            activeIndex={activeSection}
            onSectionChange={(index) => {
              setActiveSection(index);
              closeSidebar(); // mobile pe select karne ke baad band ho jaye
            }}
          />
        </div>

        {/* Main Content Area */}
        <div className="profile-content">
          {/* Hamburger Button - thoda neeche rakha hai */}
          <button className="mobile-menu-btn" onClick={toggleSidebar}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Content depending on selected section */}
          {activeSection === 0 && (
            <Fotographiya_Profile
              profileImage={profileImage}
              setProfileImage={setProfileImage}
            />
          )}
          {activeSection === 1 && <Fotographiya_Wallet />}
        </div>
      </div>

      {/* Mobile backdrop (sidebar khula ho to background dark) */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebar}></div>
      )}
    </>
  );
};

export default Fotographiya_Main;