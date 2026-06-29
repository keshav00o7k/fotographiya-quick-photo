// middlewares/uploadSelfie.js
import multer from "multer";
import path from "path";

// Set up storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Z:/quick_foto_Testing/Selfie");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter only image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG/PNG allowed."));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
