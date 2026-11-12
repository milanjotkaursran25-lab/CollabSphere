
const express = require("express");

const {
  getNotes,
  createNote,
  deleteNote
} = require("../controllers/notesController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/", authMiddleware, getNotes);


router.post("/", authMiddleware, createNote);


router.delete("/:id", authMiddleware, deleteNote);

module.exports = router;
