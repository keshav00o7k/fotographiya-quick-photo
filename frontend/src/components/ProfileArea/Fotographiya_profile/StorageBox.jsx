import React from "react";

const StorageBox = ({ onAdditionalInfoClick }) => {
  return (
    <>
      <div className="Utilization">
        <h4>Storage Utilization</h4>
        <small>
          🛈 Deleted images will be reduced from upload count
          <br />
          post 24 hours.
        </small>
      </div>

      <div className="storage-box">
        <div className="storage-counts">
          <p>📷 190 of 1000 Photos</p>
          <p>🎥 0 of 10 Videos</p>
        </div>
        <button
          style={{ marginTop: "10px" }}
          className="secondarySmallButton"
          type="button"
          onClick={onAdditionalInfoClick}
        >
          Additional Info
        </button>
      </div>
    </>
  );
};

export default StorageBox;
