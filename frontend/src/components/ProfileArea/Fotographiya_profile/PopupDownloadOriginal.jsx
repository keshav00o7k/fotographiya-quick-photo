import React from "react";

const PopupDownloadOriginal = ({ onConfirm, onCancel }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box" style={{ maxWidth: "600px", padding: "30px" }}>
        <h2 style={{ color: "#1e5a8a", marginBottom: "20px" }}>
          Slow Download Alert!
        </h2>
        <p style={{ color: "red", fontWeight: "600", fontSize: "16px" }}>
          ⚠ Original file sizes can be 20x bigger with just 5–10% improvement in
          quality
        </p>
        <p style={{ marginTop: "12px", fontSize: "15px" }}>
          Switch it on only for{" "}
          <strong style={{ color: "#1e5a8a" }}>Prints or Backup</strong>
        </p>
        <p style={{ marginTop: "10px", fontSize: "14px", color: "#333" }}>
          Note: 2160p images will be downloaded if original photos are not
          available
        </p>
        <p style={{ marginTop: "20px", fontWeight: "500", fontSize: "15px" }}>
          Are you sure you want to set Download preference to Original Quality?
        </p>

        <div
          className="popup-buttons"
          style={{
            marginTop: "24px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <button
            onClick={onCancel}
            className="cancelButton"
            style={{
              padding: "10px 28px",
              backgroundColor: "#e0e0e0",
              border: "none",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: "500",
              color: "#333",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="secondarySmallButton"
            style={{
              padding: "10px 28px",
              backgroundColor: "#1e5a8a",
              border: "none",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#fff",
              cursor: "pointer",
              boxShadow: "inset 0px -4px 0px rgba(0, 0, 0, 0.2)",
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupDownloadOriginal;
