import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./GroupDetail.css";
import { toast } from "react-toastify";
import api from "../../utils/axiosConfig";
import { BACKEND_URL } from "../../config";
import Navbar from "../../components/Navbar";
import GroupSettingModal from "./GroupSettingModal";

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [groupData, setGroupData] = useState(null);
  const [media, setMedia] = useState([]);
  const [myFacePhotos, setMyFacePhotos] = useState([]);
  const [currentTab, setCurrentTab] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Selection states
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");

  // Face matching UI states
  const [isMatching, setIsMatching] = useState(false);
  const [matchStartTime, setMatchStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Sort state
  const [sortBy, setSortBy] = useState("latest"); // latest, oldest, name

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";
  const cacheKey = `faceMatch_${user?._id}_${id}`;

  // Timer for face matching
  useEffect(() => {
    let timer;
    if (isMatching && matchStartTime) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - matchStartTime) / 1000));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isMatching, matchStartTime]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const estimateTimeLeft = () => {
    if (!elapsedTime) return "calculating...";
    return `~${Math.ceil(elapsedTime * 1.3)} sec`;
  };

  // Fetch group data
  useEffect(() => {
    const fetchGroup = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/groups/${id}`);
        setGroupData(res.data);
        setMedia(res.data.media || []);
      } catch (error) {
        console.error("Error fetching group:", error);
        toast.error("Failed to load group details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  // Set default tab
  useEffect(() => {
    if (!groupData) return;
    setCurrentTab(isAdmin ? "all" : "my");
  }, [groupData, isAdmin]);

  // Face matching
  // useEffect(() => {
  //   if (!media.length || !user?._id) return;

  //   const cached = localStorage.getItem(cacheKey);
  //   if (cached) {
  //     try {
  //       setMyFacePhotos(JSON.parse(cached));
  //       return;
  //     } catch (error) {
  //       console.error("Error parsing cached data:", error);
  //       localStorage.removeItem(cacheKey);
  //     }
  //   }

  //   const runMatcher = async () => {
  //     toast.info("🔍 Finding your photos...");
  //     setIsMatching(true);
  //     setMatchStartTime(Date.now());
  //     setElapsedTime(0);

  //     try {
  //       const res = await api.post("/facematch/run", { groupId: id });

  //       const matchedUrls = new Set(res.data.matchedPhotoUrls);
  //       const matched = media.filter((m) => matchedUrls.has(m.filePath));

  //       setMyFacePhotos(matched);
  //       localStorage.setItem(cacheKey, JSON.stringify(matched));

  //       toast.success(
  //         `✨ Found ${matched.length} photo${matched.length !== 1 ? "s" : ""}!`
  //       );
  //     } catch (error) {
  //       console.error("Face matching error:", error);
  //       toast.error("Face matching failed");
  //     } finally {
  //       setIsMatching(false);
  //     }
  //   };

  //   runMatcher();
  // }, [media, id, cacheKey, user?._id]);
  useEffect(() => {
  if (!media.length || !user?._id) return;

  const runMatcher = async () => {
    toast.info("🔍 Finding your photos...");
    setIsMatching(true);
    setMatchStartTime(Date.now());
    setElapsedTime(0);

    try {
      const res = await api.post("/facematch/run", { groupId: id });

      const matchedUrls = new Set(res.data.matchedPhotoUrls);
      const matched = media.filter((m) => matchedUrls.has(m.filePath));

      setMyFacePhotos(matched);

      toast.success(
        `✨ Found ${matched.length} photo${matched.length !== 1 ? "s" : ""}!`
      );
    } catch (error) {
      console.error("Face matching error:", error);
      toast.error("Face matching failed");
    } finally {
      setIsMatching(false);
    }
  };

  runMatcher();
}, [media, id, user?._id]);

  // Upload handler with drag & drop support
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setUploadedCount(0);
    setTotalFiles(files.length);

    const startTime = Date.now();
    const newUploads = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);

      try {
        const res = await api.post(`/media/upload/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);

            const elapsed = (Date.now() - startTime) / 1000;
            const avg = elapsed / (i + 1);
            const remaining = avg * (files.length - (i + 1));
            setTimeLeft(`${Math.ceil(remaining)}s remaining`);
          },
        });

        if (res.data.media) {
          newUploads.push(res.data.media);
          setUploadedCount((prev) => prev + 1);
        }
      } catch (error) {
        console.error(`Upload failed for ${files[i].name}:`, error);
        toast.error(`❌ ${files[i].name} upload failed`);
      }
    }

    setMedia((prev) => [...prev, ...newUploads]);

    // Clear cache after new uploads
    localStorage.removeItem(cacheKey);
    setMyFacePhotos([]);

    setUploading(false);
    setUploadProgress(0);
    setTimeLeft("");

    toast.success(
      `✅ ${newUploads.length} photo${
        newUploads.length !== 1 ? "s" : ""
      } uploaded!`
    );

    // Reset file input
    e.target.value = "";
  };

  const getDisplayedPhotos = useCallback(() => {
    let photos = !isAdmin || currentTab === "my" ? myFacePhotos : media;

    // Sort
    if (sortBy === "latest") {
      photos = [...photos].reverse();
    } else if (sortBy === "name") {
      photos = [...photos].sort((a, b) =>
        (a.fileName || "").localeCompare(b.fileName || "")
      );
    }

    return photos;
  }, [isAdmin, currentTab, myFacePhotos, media, sortBy]);

  const handleShowCode = () => {
    if (!groupData?.code) {
      toast.error("Group code not available");
      return;
    }
    navigator.clipboard.writeText(groupData.code);
    toast.success(`📋 Code copied: ${groupData.code}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedPhotos(new Set());
  };

  // Select/deselect single photo
  const togglePhotoSelection = (photoId) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  // Select all photos
  const selectAllPhotos = () => {
    const displayedPhotos = getDisplayedPhotos();
    const allIds = new Set(displayedPhotos.map((p) => p._id || p.filePath));
    setSelectedPhotos(allIds);
    toast.success(`✨ Selected all ${allIds.size} photos`);
  };

  // Deselect all photos
  const deselectAllPhotos = () => {
    setSelectedPhotos(new Set());
    toast.info("Deselected all photos");
  };

  // Helper to apply watermark to downloaded images
  const getWatermarkedBlob = async (filePath) => {
    if (!groupData || !groupData.watermarkType || groupData.watermarkType === "none") {
      const res = await fetch(filePath);
      return await res.blob();
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");

          ctx.drawImage(img, 0, 0);

          const posX = ((groupData.watermarkX !== undefined ? groupData.watermarkX : 80) / 100) * canvas.width;
          const posY = ((groupData.watermarkY !== undefined ? groupData.watermarkY : 80) / 100) * canvas.height;

          const userSize = groupData.watermarkSize || 50;
          const photoScale = canvas.width / 500;

          if (groupData.watermarkType === "text" && groupData.watermarkText) {
            const fontSize = Math.max(32, Math.round(userSize * photoScale * 0.7));
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";

            ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
            ctx.fillText(groupData.watermarkText, posX + 3, posY + 3);
            ctx.fillStyle = "#ffffff";
            ctx.fillText(groupData.watermarkText, posX, posY);

            canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95);
          } else if (groupData.watermarkType === "logo" && groupData.watermarkLogo) {
            const logoImg = new Image();
            logoImg.crossOrigin = "anonymous";
            const logoUrl = groupData.watermarkLogo.startsWith("http")
              ? groupData.watermarkLogo
              : `${BACKEND_URL}${groupData.watermarkLogo}`;
            logoImg.onload = () => {
              const logoWidth = Math.max(100, Math.round(userSize * photoScale * 3.5));
              const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
              ctx.drawImage(logoImg, posX - logoWidth / 2, posY - logoHeight / 2, logoWidth, logoHeight);
              canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95);
            };
            logoImg.onerror = () => {
              canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95);
            };
            logoImg.src = logoUrl;
          } else {
            canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95);
          }
        } catch (err) {
          console.error("Watermark canvas error:", err);
          fetch(filePath).then((res) => res.blob()).then(resolve);
        }
      };
      img.onerror = () => {
        fetch(filePath).then((res) => res.blob()).then(resolve);
      };
      img.src = filePath;
    });
  };

  // Download selected photos
  const downloadSelectedPhotos = async () => {
    if (selectedPhotos.size === 0) {
      toast.error("No photos selected");
      return;
    }

    const displayedPhotos = getDisplayedPhotos();
    const photosToDownload = displayedPhotos.filter((p) =>
      selectedPhotos.has(p._id || p.filePath)
    );

    toast.info(
      `⬇️ Downloading ${photosToDownload.length} photo${
        photosToDownload.length !== 1 ? "s" : ""
      }...`
    );

    for (let i = 0; i < photosToDownload.length; i++) {
      try {
        const blob = await getWatermarkedBlob(photosToDownload[i].filePath);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = photosToDownload[i].fileName || `photo_${i + 1}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`Download failed for photo ${i + 1}:`, error);
      }
    }

    toast.success("✅ Download complete!");
    setSelectionMode(false);
    setSelectedPhotos(new Set());
  };

  // Download all photos
  const handleDownloadAll = async () => {
    const photos = getDisplayedPhotos();
    if (!photos.length) {
      toast.error("No photos to download");
      return;
    }

    toast.info(
      `⬇️ Downloading ${photos.length} photo${
        photos.length !== 1 ? "s" : ""
      }...`
    );

    for (let i = 0; i < photos.length; i++) {
      try {
        const blob = await getWatermarkedBlob(photos[i].filePath);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = photos[i].fileName || `photo_${i + 1}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`Download failed for photo ${i + 1}:`, error);
      }
    }
    toast.success("✅ Download complete!");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPreviewPhoto(null);
  };

  const handleImageClick = (index) => {
    if (selectionMode) return;
    const photos = getDisplayedPhotos();
    setPreviewPhoto(photos[index]);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleNextImage = () => {
    const photos = getDisplayedPhotos();
    const nextIndex = (currentImageIndex + 1) % photos.length;
    setCurrentImageIndex(nextIndex);
    setPreviewPhoto(photos[nextIndex]);
  };

  const handlePrevImage = () => {
    const photos = getDisplayedPhotos();
    const prevIndex = (currentImageIndex - 1 + photos.length) % photos.length;
    setCurrentImageIndex(prevIndex);
    setPreviewPhoto(photos[prevIndex]);
  };

  const handleThumbnailClick = (index) => {
    const photos = getDisplayedPhotos();
    setCurrentImageIndex(index);
    setPreviewPhoto(photos[index]);
  };

  const handleDownloadCurrentImage = async () => {
    if (!previewPhoto) return;
    try {
      const blob = await getWatermarkedBlob(previewPhoto.filePath);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        previewPhoto.fileName || `photo_${currentImageIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("✅ Image downloaded!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed");
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyPress = (e) => {
      if (e.key === "Escape") handleModalClose();
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "ArrowLeft") handlePrevImage();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isModalOpen, currentImageIndex]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading group details...</p>
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="loading-container">
        <p>Group not found</p>
      </div>
    );
  }

  const displayedPhotos = getDisplayedPhotos();

  return (
    <>
      <Navbar />

      <div className="group-container">
        {/* Enhanced Header */}
        <header className="group-header">
          <div className="header-left">
            <button className="back-btn" onClick={handleBack}>
              ←
            </button>
            <h1 className="group-name">{groupData.name}</h1>
            <span className="photo-count">{media.length} Photos</span>
          </div>

          <div className="header-actions">
            {isAdmin && (
              <>
                <label className="action-btn">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={handleUpload}
                    disabled={uploading}
                  />
                  <span className="btn-icon">⬆️</span>
                  <span className="btn-text">Upload</span>
                </label>
                <button className="action-btn" onClick={() => setShowSettingModal(true)}>
                  <span className="btn-icon">⚙️</span>
                  <span className="btn-text">Settings</span>
                </button>
              </>
            )}
            <button className="action-btn" onClick={handleShowCode}>
              <span className="btn-icon">🔗</span>
              <span className="btn-text">Code</span>
            </button>
            <button
              className="action-btn"
              onClick={handleDownloadAll}
              disabled={!displayedPhotos.length}
            >
              <span className="btn-icon">⬇️</span>
              <span className="btn-text">Download</span>
            </button>
            <button
              className={`action-btn ${selectionMode ? "danger-btn" : ""}`}
              onClick={toggleSelectionMode}
              disabled={!displayedPhotos.length}
            >
              <span className="btn-icon">{selectionMode ? "✖️" : "☑️"}</span>
              <span className="btn-text">
                {selectionMode ? "Cancel" : "Select"}
              </span>
            </button>
          </div>
        </header>

        {/* Upload Progress */}
        {uploading && (
          <div className="upload-progress-card">
            <div className="progress-header">
              <span className="progress-title">📤 Uploading Photos</span>
              <span className="progress-count">
                {uploadedCount} / {totalFiles}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="progress-footer">
              <span>{uploadProgress}%</span>
              <span>{timeLeft}</span>
            </div>
          </div>
        )}

        {/* Selection Toolbar */}
        {selectionMode && (
          <div className="selection-toolbar">
            <div className="selection-left">
              <span className="selection-badge">
                {selectedPhotos.size} selected
              </span>
            </div>
            <div className="selection-right">
              <button
                className="toolbar-btn"
                onClick={selectAllPhotos}
                disabled={selectedPhotos.size === displayedPhotos.length}
              >
                Select All
              </button>
              <button
                className="toolbar-btn"
                onClick={deselectAllPhotos}
                disabled={selectedPhotos.size === 0}
              >
                Clear
              </button>
              <button
                className="toolbar-btn download-btn"
                onClick={downloadSelectedPhotos}
                disabled={selectedPhotos.size === 0}
              >
                Download ({selectedPhotos.size})
              </button>
            </div>
          </div>
        )}

        {/* Tabs + Controls */}
        <div className="controls-section">
          <nav className="tabs-nav">
            <button
              className={`tab ${currentTab === "my" ? "active" : ""}`}
              onClick={() => setCurrentTab("my")}
            >
              My Photos ({myFacePhotos.length})
            </button>
            {isAdmin && (
              <button
                className={`tab ${currentTab === "all" ? "active" : ""}`}
                onClick={() => setCurrentTab("all")}
              >
                All Photos ({media.length})
              </button>
            )}
          </nav>

          <div className="controls-right">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Photos Display */}
        {currentTab === "my" && isMatching ? (
          <div className="face-match-loader">
            <div className="spinner"></div>
            <h3>🔍 Finding Your Photos</h3>
            <p>⏱ Time elapsed: {formatTime(elapsedTime)}</p>
            <p>⏳ Estimated time: {estimateTimeLeft()}</p>
            <small>Using AI to detect your face in photos...</small>
          </div>
        ) : displayedPhotos.length > 0 ? (
          <div className="photos-container grid-view">
            {displayedPhotos.map((photo, i) => {
              const photoId = photo._id || photo.filePath;
              const isSelected = selectedPhotos.has(photoId);

              return (
                <div
                  key={photoId}
                  className={`photo-card ${
                    selectionMode ? "selection-mode" : ""
                  } ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    if (selectionMode) {
                      togglePhotoSelection(photoId);
                    } else {
                      handleImageClick(i);
                    }
                  }}
                >
                  {selectionMode && (
                    <div className="selection-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => togglePhotoSelection(photoId)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}

                  <img
                    src={photo.filePath}
                    alt={photo.fileName || `Photo ${i + 1}`}
                    className="photo-img"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📷</div>
            <h3>No Photos Found</h3>
            <p>Upload some photos to get started</p>
          </div>
        )}

        {/* Advanced Modal */}
        {isModalOpen && previewPhoto && (
          <div className="modal-overlay1" onClick={handleModalClose}>
            <div className="modal-header">
              <div className="modal-info">
                <span className="image-counter">
                  {currentImageIndex + 1} / {getDisplayedPhotos().length}
                </span>
                <span className="image-name">
                  {previewPhoto.fileName || `Photo ${currentImageIndex + 1}`}
                </span>
              </div>
              <div className="modal-actions">
                <button
                  className="modal-btn download"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadCurrentImage();
                  }}
                  title="Download"
                >
                  ⬇️
                </button>
                <button
                  className="modal-btn close"
                  onClick={handleModalClose}
                  title="Close (Esc)"
                >
                  ✖️
                </button>
              </div>
            </div>

            <button
              className="nav-btn prev"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              title="Previous (←)"
            >
              ‹
            </button>

            <div
              className="modal-content1"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewPhoto.filePath}
                alt={previewPhoto.fileName || "Preview"}
                className="modal-img"
              />
            </div>

            <button
              className="nav-btn next"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              title="Next (→)"
            >
              ›
            </button>

            <div className="modal-footer">
              <div className="thumbnails">
                {getDisplayedPhotos()
                  .slice(
                    Math.max(0, currentImageIndex - 2),
                    Math.min(getDisplayedPhotos().length, currentImageIndex + 3)
                  )
                  .map((photo, idx) => {
                    const actualIndex =
                      Math.max(0, currentImageIndex - 2) + idx;
                    return (
                      <img
                        key={photo._id || photo.filePath}
                        src={photo.filePath}
                        alt={`Thumbnail ${actualIndex + 1}`}
                        className={`thumbnail ${
                          actualIndex === currentImageIndex ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleThumbnailClick(actualIndex);
                        }}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        <GroupSettingModal
          showModal={showSettingModal}
          onClose={() => setShowSettingModal(false)}
          groupId={id}
          currentName={groupData?.name}
          currentThumbnail={groupData?.thumbnail}
          groupData={groupData}
          onSettingsUpdated={(updatedGroup) => {
            if (updatedGroup) {
              setGroupData((prev) => ({
                ...prev,
                ...updatedGroup,
              }));
            }
          }}
        />
      </div>
    </>
  );
};

export default GroupDetail;