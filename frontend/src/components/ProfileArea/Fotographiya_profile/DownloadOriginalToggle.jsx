import React from "react";

const DownloadOriginalToggle = ({
  isExpanded,
  toggleExpanded,
  isChecked,
  handleChange,
}) => {
  return (
    <>
      <p className="more-options" onClick={toggleExpanded}>
        More Options {isExpanded ? "▲" : "▼"}
      </p>

      {isExpanded && (
        <div className="download-original-toggle">
          <div className="download-toggle-row">
            <div className="left">
              <h4>Download in Original Quality (if available)</h4>
              <p className="download-warning">
                🛈 Slow Downloads. Switch it on only for Prints or Backups
              </p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                name="downloadOriginal"
                checked={isChecked}
                onChange={handleChange}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      )}
    </>
  );
};

export default DownloadOriginalToggle;
