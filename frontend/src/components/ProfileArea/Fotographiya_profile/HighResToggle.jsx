import React from "react";

const HighResToggle = ({ isChecked, handleChange }) => {
  return (
    <div className="upload-toggle-row">
      <div className="left">
        <h4 className="upload-label">Upload in Higher Resolution</h4>
        <p className="upload-warning">
          ⚠️ 1 High Resolution Upload = 2.5 Photos
        </p>
      </div>
      <label className="switch">
        <input
          type="checkbox"
          name="highResUpload"
          checked={isChecked}
          onChange={handleChange}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default HighResToggle;
