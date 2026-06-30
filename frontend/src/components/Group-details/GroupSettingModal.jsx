import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axiosConfig";
import { BACKEND_URL } from "../../config";
import "./GroupDetail.css";

const GroupSettingModal = ({
  showModal,
  onClose,
  groupId,
  currentName,
  currentThumbnail,
  groupData,
  onSettingsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState("cover"); // "cover" | "watermark"

  // General & Cover states
  const [name, setName] = useState(currentName || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Cropper interactive states
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Watermark interactive states
  const [watermarkType, setWatermarkType] = useState("none");
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkLogoFile, setWatermarkLogoFile] = useState(null);
  const [watermarkLogoPreview, setWatermarkLogoPreview] = useState("");
  const [wmPos, setWmPos] = useState({ x: 80, y: 80 }); // Percentage 0 - 100
  const [watermarkSize, setWatermarkSize] = useState(40); // 15 to 100
  const [isDraggingWm, setIsDraggingWm] = useState(false);

  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const wmViewportRef = useRef(null);

  useEffect(() => {
    if (groupData) {
      setName(groupData.name || currentName || "");
      setWatermarkType(groupData.watermarkType || "none");
      setWatermarkText(groupData.watermarkText || "");
      setWatermarkSize(groupData.watermarkSize !== undefined ? groupData.watermarkSize : 40);
      setWmPos({
        x: groupData.watermarkX !== undefined ? groupData.watermarkX : 80,
        y: groupData.watermarkY !== undefined ? groupData.watermarkY : 80,
      });
      if (groupData.watermarkLogo) {
        setWatermarkLogoPreview(
          groupData.watermarkLogo.startsWith("http")
            ? groupData.watermarkLogo
            : `${BACKEND_URL}${groupData.watermarkLogo}`
        );
      }
    }
    setPreviewUrl(
      currentThumbnail
        ? currentThumbnail.startsWith("http")
          ? currentThumbnail
          : `${BACKEND_URL}${currentThumbnail}`
        : ""
    );
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [groupData, currentName, currentThumbnail, showModal]);

  if (!showModal) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setWatermarkLogoFile(file);
      setWatermarkLogoPreview(URL.createObjectURL(file));
      setWatermarkType("logo");
    }
  };

  // Mouse / Touch Dragging handlers for Cover Photo
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Dragging handlers for Watermark Position (Free Drag & Drop)
  const handleWmMouseDown = (e) => {
    e.stopPropagation();
    setIsDraggingWm(true);
  };

  const handleWmMouseMove = (e) => {
    if (!isDraggingWm || !wmViewportRef.current) return;
    const rect = wmViewportRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let xPercent = ((clientX - rect.left) / rect.width) * 100;
    let yPercent = ((clientY - rect.top) / rect.height) * 100;

    // Constrain within 5% - 95%
    xPercent = Math.max(5, Math.min(95, xPercent));
    yPercent = Math.max(5, Math.min(95, yPercent));

    setWmPos({ x: Math.round(xPercent), y: Math.round(yPercent) });
  };

  const handleWmMouseUp = () => {
    setIsDraggingWm(false);
  };

  // Generate cropped Cover Blob from Canvas
  const getCroppedImageBlob = () => {
    return new Promise((resolve) => {
      try {
        if (!imageRef.current || !containerRef.current) return resolve(null);

        const canvas = document.createElement("canvas");
        const targetWidth = 800;
        const targetHeight = 400;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        const img = imageRef.current;
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        if (!rect.width) return resolve(null);

        const scaleFactor = targetWidth / rect.width;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        const drawWidth = (img.clientWidth || rect.width) * zoom * scaleFactor;
        const drawHeight = (img.clientHeight || rect.height) * zoom * scaleFactor;
        
        const containerCenterX = targetWidth / 2;
        const containerCenterY = targetHeight / 2;
        
        const drawX = containerCenterX - drawWidth / 2 + offset.x * scaleFactor;
        const drawY = containerCenterY - drawHeight / 2 + offset.y * scaleFactor;

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
      } catch (err) {
        console.error("Canvas export error:", err);
        resolve(null);
      }
    });
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.warn("Group Name cannot be empty!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("watermarkType", watermarkType);
    formData.append("watermarkText", watermarkText);
    formData.append("watermarkX", wmPos.x);
    formData.append("watermarkY", wmPos.y);
    formData.append("watermarkSize", watermarkSize);

    try {
      if (selectedFile || (previewUrl && (offset.x !== 0 || offset.y !== 0 || zoom !== 1))) {
        const croppedBlob = await getCroppedImageBlob();
        if (croppedBlob) {
          formData.append("thumbnail", croppedBlob, "group_cover.jpg");
        } else if (selectedFile) {
          formData.append("thumbnail", selectedFile);
        }
      }

      if (watermarkLogoFile) {
        formData.append("watermarkLogo", watermarkLogoFile);
      }

      const res = await api.post(`/groups/${groupId}/thumbnail`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Group settings updated successfully!");
      if (onSettingsUpdated) {
        onSettingsUpdated(res.data.group);
      }
      onClose();
    } catch (err) {
      console.error("Group setting update error:", err);
      toast.error(err.response?.data?.message || "Failed to update group settings");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="setting-modal-overlay">
      <div className="setting-modal-content">
        <div className="setting-modal-header">
          <h3 style={{ margin: 0, color: "#1e293b", fontSize: "20px", fontWeight: 700 }}>⚙️ Group Settings</h3>
          <span style={modalStyles.closeBtn} onClick={onClose}>
            &times;
          </span>
        </div>

        {/* Tab Switcher */}
        <div style={modalStyles.tabContainer}>
          <button
            type="button"
            style={{
              ...modalStyles.tabBtn,
              ...(activeTab === "cover" ? modalStyles.activeTabBtn : {}),
            }}
            onClick={() => setActiveTab("cover")}
          >
            🖼️ Group & Cover
          </button>
          <button
            type="button"
            style={{
              ...modalStyles.tabBtn,
              ...(activeTab === "watermark" ? modalStyles.activeTabBtn : {}),
            }}
            onClick={() => setActiveTab("watermark")}
          >
            💧 Add Watermark
          </button>
        </div>

        <div style={{ marginTop: "16px", textAlign: "left" }}>
          {activeTab === "cover" ? (
            <>
              {/* Group Name Input */}
              <div style={{ marginBottom: "20px" }}>
                <label style={modalStyles.label}>Group Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter group name"
                  style={modalStyles.textInput}
                />
              </div>

              {/* Smartphone Style Interactive Image Cropper */}
              <div>
                <label style={modalStyles.label}>
                  Group Cover Photo (Drag to Position & Scale)
                </label>

                <div
                  ref={containerRef}
                  className="setting-crop-viewport"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleMouseDown}
                  onTouchMove={handleMouseMove}
                  onTouchEnd={handleMouseUp}
                >
                  {previewUrl ? (
                    <>
                      <img
                        ref={imageRef}
                        src={previewUrl}
                        crossOrigin="anonymous"
                        alt="Crop Target"
                        draggable={false}
                        style={{
                          ...modalStyles.cropImage,
                          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                        }}
                      />
                      <div style={modalStyles.cropGridOverlay}>
                        <div style={modalStyles.gridLineV1}></div>
                        <div style={modalStyles.gridLineV2}></div>
                        <div style={modalStyles.gridLineH1}></div>
                        <div style={modalStyles.gridLineH2}></div>
                      </div>
                    </>
                  ) : (
                    <div style={modalStyles.noImage}>📷 No Cover Image Selected</div>
                  )}
                </div>

                {previewUrl && (
                  <div style={modalStyles.controlsBar}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }}>
                      🔍 Zoom
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      style={{ flex: 1, accentColor: "#6d28d9", cursor: "pointer" }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setZoom(1);
                        setOffset({ x: 0, y: 0 });
                      }}
                      style={modalStyles.resetBtn}
                    >
                      Reset
                    </button>
                  </div>
                )}

                <label style={modalStyles.fileUploadBtn}>
                  <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                  📁 Choose Cover Photo
                </label>
              </div>
            </>
          ) : (
            <>
              {/* Watermark Configuration */}
              <div style={{ marginBottom: "16px" }}>
                <label style={modalStyles.label}>Watermark Type</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {["none", "text", "logo"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      style={{
                        ...modalStyles.typeSelectBtn,
                        ...(watermarkType === type ? modalStyles.activeTypeBtn : {}),
                      }}
                      onClick={() => setWatermarkType(type)}
                    >
                      {type === "none" && "🚫 Off"}
                      {type === "text" && "✏️ Custom Text"}
                      {type === "logo" && "🖼️ Brand Logo"}
                    </button>
                  ))}
                </div>
              </div>

              {watermarkType === "text" && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={modalStyles.label}>Watermark Text</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="e.g. © Fotographiya / Keshav Studio"
                    style={modalStyles.textInput}
                  />
                </div>
              )}

              {watermarkType === "logo" && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={modalStyles.label}>Upload Brand Logo</label>
                  <label style={modalStyles.fileUploadBtn}>
                    <input type="file" accept="image/*" onChange={handleLogoFileChange} hidden />
                    {watermarkLogoPreview ? "🔄 Change Logo Image" : "📁 Upload Logo Image"}
                  </label>
                </div>
              )}

              {/* Interactive Free Drag & Drop Watermark Preview */}
              {watermarkType !== "none" && (
                <div>
                  {/* Watermark Size Slider */}
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>
                      <span>📏 Watermark Size</span>
                      <span>{watermarkSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="150"
                      value={watermarkSize}
                      onChange={(e) => setWatermarkSize(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#6d28d9", cursor: "pointer" }}
                    />
                  </div>

                  <label style={modalStyles.label}>
                    🎯 Drag Watermark to Position (X: {wmPos.x}%, Y: {wmPos.y}%)
                  </label>
                  <div
                    ref={wmViewportRef}
                    style={modalStyles.wmPreviewViewport}
                    onMouseMove={handleWmMouseMove}
                    onMouseUp={handleWmMouseUp}
                    onMouseLeave={handleWmMouseUp}
                    onTouchMove={handleWmMouseMove}
                    onTouchEnd={handleWmMouseUp}
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="Sample" style={modalStyles.wmSampleImg} />
                    ) : (
                      <div style={{ color: "#94a3b8", fontSize: "13px" }}>Sample Photo Preview</div>
                    )}

                    {/* Draggable Watermark Element */}
                    <div
                      onMouseDown={handleWmMouseDown}
                      onTouchStart={handleWmMouseDown}
                      style={{
                        ...modalStyles.draggableWm,
                        left: `${wmPos.x}%`,
                        top: `${wmPos.y}%`,
                        fontSize: `${Math.max(12, Math.round(watermarkSize * 0.45))}px`,
                      }}
                    >
                      {watermarkType === "text" && (
                        <span>{watermarkText || "© Custom Watermark"}</span>
                      )}
                      {watermarkType === "logo" && (
                        watermarkLogoPreview ? (
                          <img
                            src={watermarkLogoPreview}
                            alt="Wm Logo"
                            style={{
                              maxHeight: `${Math.max(20, watermarkSize)}px`,
                              maxWidth: `${Math.max(40, watermarkSize * 2.5)}px`,
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <span>🖼️ Logo Watermark</span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div style={modalStyles.footer}>
          <button style={modalStyles.cancelBtn} onClick={onClose} disabled={uploading}>
            Cancel
          </button>
          <button style={modalStyles.saveBtn} onClick={handleSave} disabled={uploading}>
            {uploading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

const modalStyles = {
  closeBtn: {
    fontSize: "24px",
    cursor: "pointer",
    color: "#64748b",
    fontWeight: "bold",
  },
  tabContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "14px",
    borderBottom: "2px solid #f1f5f9",
    paddingBottom: "10px",
  },
  tabBtn: {
    flex: 1,
    padding: "9px 14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    color: "#64748b",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  activeTabBtn: {
    background: "#f5f3ff",
    color: "#6d28d9",
    borderColor: "#8b5cf6",
    boxShadow: "0 4px 12px rgba(109, 40, 217, 0.1)",
  },
  label: {
    fontWeight: 700,
    color: "#1e293b",
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
  },
  textInput: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    color: "#0f172a",
    backgroundColor: "#f8fafc",
  },
  cropImage: {
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
    transition: "transform 0.05s ease-out",
    pointerEvents: "none",
  },
  cropGridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    boxShadow: "inset 0 0 0 2px rgba(255, 255, 255, 0.4)",
    borderRadius: "14px",
  },
  gridLineV1: {
    position: "absolute",
    left: "33.33%",
    top: 0,
    bottom: 0,
    width: "1px",
    borderLeft: "1px dashed rgba(255, 255, 255, 0.4)",
  },
  gridLineV2: {
    position: "absolute",
    left: "66.66%",
    top: 0,
    bottom: 0,
    width: "1px",
    borderLeft: "1px dashed rgba(255, 255, 255, 0.4)",
  },
  gridLineH1: {
    position: "absolute",
    top: "33.33%",
    left: 0,
    right: 0,
    height: "1px",
    borderTop: "1px dashed rgba(255, 255, 255, 0.4)",
  },
  gridLineH2: {
    position: "absolute",
    top: "66.66%",
    left: 0,
    right: 0,
    height: "1px",
    borderTop: "1px dashed rgba(255, 255, 255, 0.4)",
  },
  controlsBar: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "14px",
    background: "#f8fafc",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  },
  resetBtn: {
    padding: "5px 12px",
    fontSize: "12px",
    fontWeight: 700,
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#475569",
  },
  typeSelectBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "1.5px solid #cbd5e1",
    background: "#ffffff",
    color: "#475569",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
  },
  activeTypeBtn: {
    borderColor: "#6d28d9",
    background: "#f5f3ff",
    color: "#6d28d9",
    fontWeight: 700,
  },
  wmPreviewViewport: {
    position: "relative",
    width: "100%",
    height: "200px",
    borderRadius: "14px",
    overflow: "hidden",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    border: "2px solid #cbd5e1",
  },
  wmSampleImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.85,
  },
  draggableWm: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    cursor: "grab",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 800,
    whiteSpace: "nowrap",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.9), 0 0 2px rgba(0, 0, 0, 0.9)",
    userSelect: "none",
  },
  noImage: {
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: 500,
  },
  fileUploadBtn: {
    display: "block",
    textAlign: "center",
    padding: "11px 16px",
    background: "#f1f5f9",
    color: "#475569",
    borderRadius: "10px",
    fontWeight: 700,
    cursor: "pointer",
    border: "1px solid #cbd5e1",
    transition: "all 0.2s ease",
  },
  footer: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "16px",
  },
  cancelBtn: {
    padding: "10px 20px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#475569",
    fontWeight: 700,
    cursor: "pointer",
  },
  saveBtn: {
    padding: "10px 22px",
    borderRadius: "10px",
    border: "none",
    background: "#6d28d9",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default GroupSettingModal;
