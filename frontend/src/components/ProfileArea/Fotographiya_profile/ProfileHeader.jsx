import React from "react";

const ProfileHeader = ({ onSave }) => {
  return (
    <div className="profile-Headig d">
      <h2 className="d">Profile Setting</h2>
      <button className="secondarySmallButton bokd-font" onClick={onSave}>
        Save
      </button>
    </div>
  );
};

export default ProfileHeader;
