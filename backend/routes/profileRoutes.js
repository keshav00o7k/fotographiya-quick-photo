import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

// Get profile (only logged-in user can view)
router.get("/", authenticateToken, getProfile);

// Update profile (only logged-in user)
router.put("/", authenticateToken, updateProfile);

export default router;
