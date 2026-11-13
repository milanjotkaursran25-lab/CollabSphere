
const express = require("express");
const {
  getFiles,
  uploadFile,
  deleteFile
} = require("../controllers/fileController");

const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Use temporary writable storage on Vercel.
// Keep the normal uploads folder for local development.
const uploadDir = process.env.VERCEL
  ? "/tmp/collabsphere-uploads"
  : path.join(__dirname, "../uploads");

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});

// Routes
router.get("/", authMiddleware, getFiles);

router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  uploadFile
);

router.delete("/:id", authMiddleware, deleteFile);

module.exports = router;
