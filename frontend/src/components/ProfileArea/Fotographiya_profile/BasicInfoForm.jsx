import React from "react";

const BasicInfoForm = ({ formData, handleChange }) => {
  return (
    <div className="basic-info-form">
      <div className="profile-field-group">
        <label className="field-label">Name</label>
        <input
          name="name"
          type="text"
          className="profile-input"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
        />
      </div>

      <div className="profile-field-group">
        <label className="field-label">Email ID</label>
        <input
          name="email"
          type="email"
          className="profile-input"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
      </div>

      <div className="profile-field-group">
        <label className="field-label">Phone Number</label>
        <input
          name="phone"
          type="text"
          className="profile-input"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
