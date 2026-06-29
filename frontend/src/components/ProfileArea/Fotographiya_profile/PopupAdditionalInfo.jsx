import React from "react";

const PopupAdditionalInfo = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div
        className="popup-box"
        style={{
          backgroundColor: "#f7fafd",
          borderRadius: "10px",
          padding: "30px 40px",
          width: "700px",
          maxWidth: "90%",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        <div style={{ textAlign: "right" }}>
          <span
            onClick={onClose}
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#888",
              cursor: "pointer",
            }}
          >
            ✖
          </span>
        </div>

        <h2
          style={{
            color: "#1e3e6d",
            fontSize: "22px",
            fontWeight: "600",
            marginBottom: "20px",
          }}
        >
          Storage Utilization
        </h2>

        {/* Photo Bar */}
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <img
            src="./images/photos.png"
            alt="Photos"
            style={{ marginRight: "10px", width: "22px" }}
          />
          <span
            style={{ fontSize: "18px", color: "#1e3e6d", fontWeight: "600" }}
          >
            190
          </span>
          <span style={{ fontSize: "16px", color: "#555" }}>
            &nbsp;of 1000 Photos
          </span>
        </div>
        <div
          style={{
            background: "#ccc",
            height: "6px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "19%",
              height: "100%",
              background: "#1e5a8a",
              borderRadius: "10px",
            }}
          />
        </div>

        {/* Photo Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
            flexWrap: "wrap",
          }}
        >
          <div>
            📷 Standard Uploads: <strong>190</strong>
          </div>
          <div style={{ color: "#10ac84" }}>
            ⬆️ High Res Uploads: <strong>0</strong>
          </div>
          <div style={{ color: "#666" }}>
            💾 Storage Used: <strong>0.37 GB</strong>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >
          <div>
            🗑️ Standard Deletes: <strong>0</strong>
          </div>
          <div style={{ color: "#10ac84" }}>
            🗑️ High Res Deletes: <strong>0</strong>
          </div>
          <div style={{ color: "#666" }}>
            👥 Total Groups: <strong>2</strong>
          </div>
        </div>

        {/* Video Bar */}
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <img
            src="./images/video-camera.png"
            alt="Videos"
            style={{ marginRight: "10px", width: "22px" }}
          />
          <span
            style={{ fontSize: "18px", color: "#1e3e6d", fontWeight: "600" }}
          >
            0
          </span>
          <span style={{ fontSize: "16px", color: "#555" }}>
            &nbsp;of 10 Videos
          </span>
        </div>
        <div
          style={{
            background: "#ccc",
            height: "6px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "0%",
              height: "100%",
              background: "#1e5a8a",
              borderRadius: "10px",
            }}
          />
        </div>

        {/* Video Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ color: "#b455b6" }}>
            ⬆️ Video Uploads: <strong>0</strong>
          </div>
          <div style={{ color: "#b455b6" }}>
            🗑️ Video Deletes: <strong>0</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupAdditionalInfo;
