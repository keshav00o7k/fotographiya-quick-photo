// middlewares/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";
import Group from "../models/Group.js"; // 👈 import karo

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const { groupId } = req.params; // /upload/:groupId se
      const group = await Group.findById(groupId).select("folderName name");

      if (!group) {
        return cb(new Error("Group not found"), null);
      }

      // agar kisi purane group me folderName nahi hai (old data), fallback name slugify jaise
      const folderName = group.folderName || group._id.toString();

      const baseDir = process.env.UPLOAD_PATH || "Z:/quick_foto_Testing/groups";
      const dir = path.join(baseDir, folderName);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      cb(null, dir);
    } catch (err) {
      cb(err, null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
export default upload;
