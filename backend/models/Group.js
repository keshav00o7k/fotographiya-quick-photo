// models/Group.js
import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, unique: true, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    permittedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    folderName: { type: String }, // 👈 yeh naya field
    thumbnail: { type: String, default: "" }, // 👈 group cover / banner photo
    coverPosition: { type: String, default: "50% 50%" }, // 👈 vertical/horizontal alignment of cover
    watermarkType: { type: String, enum: ["text", "logo", "none"], default: "none" },
    watermarkText: { type: String, default: "" },
    watermarkLogo: { type: String, default: "" },
    watermarkX: { type: Number, default: 80 },
    watermarkY: { type: Number, default: 80 },
    watermarkSize: { type: Number, default: 40 },
  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);
