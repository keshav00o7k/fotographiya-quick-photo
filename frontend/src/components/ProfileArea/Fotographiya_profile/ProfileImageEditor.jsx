import React, { useEffect, useState } from "react";
import api from "../../../utils/axiosConfig";
import { BACKEND_URL } from "../../../config";

const ProfileImageEditor = () => {
  const [selfie, setSelfie] = useState("");

  useEffect(() => {
    api
      .get("/profile")
      .then((res) => {
        setSelfie(res.data?.selfie || "");
      })
      .catch(() => setSelfie(""));
  }, []);

  return (
    <div className="profile-header-card">
      <div className="avatar-wrapper">
        <img 
          src={selfie ? `${BACKEND_URL}${selfie}` : "/images/user.png"} 
          alt="avatar" 
          className="profile-avatar-img"
          onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}
        />
      </div>
      <div className="profile-header-text">
        <h3>User Profile</h3>
        <p className="profile-subtext">Manage your personal information and settings</p>
      </div>
    </div>
  );
};

export default ProfileImageEditor;
