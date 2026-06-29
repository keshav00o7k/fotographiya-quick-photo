// backend/routes/faceMatchRoutes.js
import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { runFaceMatch } from "../controllers/FaceMatchController.js";

const router = express.Router();

router.post("/run", authenticateToken, runFaceMatch);

export default router;
