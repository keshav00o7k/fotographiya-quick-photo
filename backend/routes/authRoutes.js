// routes/authRoutes.js

import express from "express";
import {
  registerUser,
  loginUser,
  sendResetOTP,
  resetPasswordWithOTP,
  verifyEmailOTP,
} from "../controllers/authController.js";
import { uploadSelfie } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
const router = express.Router();
import upload from "../middlewares/uploadSelfie.js";

// ✅ Register a new user
router.post("/register", registerUser);
router.post("/verify-email-otp", verifyEmailOTP);
router.post(
  "/upload-selfie",
  authenticateToken,
  upload.single("selfie"),
  uploadSelfie
);
// ✅ Login user
router.post("/login", loginUser);

// ✅ Send OTP for password reset
router.post("/send-reset-otp", sendResetOTP);

// ✅ Update password by entering OTP and new password
router.post("/reset-password", resetPasswordWithOTP);

export default router;
