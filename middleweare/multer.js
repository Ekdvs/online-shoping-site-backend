// middleware/upload.js
import multer from "multer";

// Memory storage for buffer
const storage = multer.memoryStorage();

// File filter to allow only jpg, jpeg, png
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, and PNG files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // optional: max 5MB
});

export default upload;
