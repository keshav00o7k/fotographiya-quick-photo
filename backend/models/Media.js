import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    filePath: { type: String, required: true }, // Cloudinary URL
    fileSize: { type: Number, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);
