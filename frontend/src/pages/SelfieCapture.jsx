import React, { useEffect, useRef, useState } from "react";
import "./SelfieCapture.css";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../config";

const SelfieCapture = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      } catch (err) {
        toast.error("Camera access denied or not available");
        console.error(err);
      }
    };

    startWebcam();
  }, []);

  const capture = () => {
    const video = webcamRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    
    // 🪞 Mirror captured canvas image horizontally
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/jpeg");
    setImageSrc(dataURL);
  };

  const retake = () => {
    setImageSrc(null);
  };

  const continueToNext = async () => {
    try {
      // Convert base64 to file
      const blob = await (await fetch(imageSrc)).blob();
      const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });

      // Prepare FormData
      const formData = new FormData();
      formData.append("selfie", file); // 👈 "selfie" must match multer field

      const response = await fetch(
        `${BACKEND_URL}/api/auth/upload-selfie`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Only auth header
          },
          body: formData, // ✅ Send as FormData
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Selfie uploaded successfully");
        const existingUser = JSON.parse(localStorage.getItem("user")); // 👈 Get existing user from localStorage
        const updatedUserWithRole = { ...data.user, role: existingUser.role }; // 👈 Add role from existing user

        localStorage.setItem("user", JSON.stringify(updatedUserWithRole));
        window.location.href = "/user-dashboard";
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload selfie");
    }
  };

  return (
    <>
      <div className="selfie-page">
        <div>
          <div className="selfie-navbar">
            <div className="logo">
              <img src="\images\logo_colored_white.png" alt="Fotographiya" />
            </div>
          </div>

          <div className="selfie-container">
            <h2 className="title">Click a Selfie</h2>
            <p className="subtitle">
              Please take a clear selfie for best results
            </p>

            <div className="main-section">
              <div className="side-instructions">
                <div className="instruction">
                  <img src="images/face.png" alt="Only 1 face" />
                  <span>Only 1 face</span>
                </div>
                <div className="instruction">
                  <img src="images/blur.png" alt="No blur" />
                  <span>No blur</span>
                </div>
              </div>

              <div className="webcam-box">
                {!imageSrc ? (
                  <video
                    ref={webcamRef}
                    autoPlay
                    playsInline
                    className="webcam"
                  />
                ) : (
                  <img
                    src={imageSrc}
                    alt="Captured"
                    className="captured-image"
                  />
                )}

                {!imageSrc ? (
                  <button className="click-btn" onClick={capture}>
                    Click
                  </button>
                ) : (
                  <div className="action-buttons">
                    <button onClick={retake}>Retake</button>
                    <button onClick={continueToNext}>Continue</button>
                  </div>
                )}
              </div>

              <div className="side-instructions">
                <div className="instruction">
                  <img src="images/mask.png" alt="No Mask" />
                  <span>No Mask</span>
                </div>
                <div className="instruction">
                  <img src="images/spect.png" alt="No spectacles" />
                  <span>No spectacles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelfieCapture;
