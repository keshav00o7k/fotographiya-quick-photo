import React from "react";

const PopupHighRes = ({ onConfirm, onCancel }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>High-res photos use more storage!</h3>
        <p className="popup-warning">
          ⚠️ 1 High Resolution Upload = 2.5 Photos
        </p>
        <p>
          Note: Switch it on only while uploading un-compressed original photos.
        </p>
        <p>
          <strong>
            Are you sure you want to enable Upload in Higher Resolution?
          </strong>
        </p>
        <div className="popup-buttons">
          <button onClick={onConfirm} className="secondarySmallButton">
            Yes
          </button>
          <button onClick={onCancel} className="cancelButton">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupHighRes;
