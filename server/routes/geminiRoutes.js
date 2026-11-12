
const express = require("express");
const router = express.Router();

const { generateAIResponse } = require("../controllers/geminiController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, generateAIResponse);

module.exports = router;
