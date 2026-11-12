const File = require("../models/File");
const fs = require("fs");
const path = require("path");

const getFiles = async (req, res) => {
  try {
    const files = await File.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, files });
  } catch (error) {
    console.error("Get files error:", error.message);
    res.status(500).json({ success: false, message: "Failed to retrieve files" });
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please select a file" });
    }

    const file = await File.create({
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      owner: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file
    });
  } catch (error) {
    console.error("Upload file error:", error.message);
    if (req.file) {
      fs.promises.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ success: false, message: "File upload failed" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    if (file.path) {
      try {
        await fs.promises.unlink(path.resolve(file.path));
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }

    await file.deleteOne();
    res.status(200).json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete file" });
  }
};

module.exports = { getFiles, uploadFile, deleteFile };
