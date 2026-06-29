// routes/mediaRoutes.js
import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { uploadMedia, getGroupMedia } from "../controllers/mediaController.js";
import upload from "../middlewares/upload.js"; // 👈 Add this

const router = express.Router();

router.post(
  "/upload/:groupId",
  authenticateToken,
  upload.single("file"), // 👈 This is needed
  uploadMedia
);

router.get("/group/:groupId", authenticateToken, getGroupMedia);

export default router;
