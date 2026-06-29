import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  createGroup,
  joinGroup,
  grantAccess,
  getGroupById,
  getAllGroups,
  getJoinedGroups,
  updateGroupThumbnail,
} from "../controllers/groupController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/joined", authenticateToken, getJoinedGroups);
router.post("/create", authenticateToken, createGroup);
router.get("/all", authenticateToken, getAllGroups);
router.post("/join", authenticateToken, joinGroup);
router.post("/grant-access", authenticateToken, grantAccess);
router.post(
  "/:groupId/thumbnail",
  authenticateToken,
  upload.fields([{ name: "thumbnail" }, { name: "watermarkLogo" }]),
  updateGroupThumbnail
);
router.get("/:id", authenticateToken, getGroupById);

export default router;
