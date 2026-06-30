// server.js - main server entry point for Quick Pick
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Load config from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Root Health Check Route
app.get("/", (req, res) => {
  res.json({ message: "Quick Pick API is running successfully! 🚀", status: "Active" });
});

// Routes Import & Use
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import faceMatchRoutes from "./routes/FaceMatchRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/facematch", faceMatchRoutes);
// app.use("/uploads", express.static("Z:/quick_foto_Testing")); // static serve for image
app.use("/groups", express.static("Z:/quick_foto_Testing/groups"));
app.use("/selfie", express.static("Z:/quick_foto_Testing/Selfie"));

const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
});
