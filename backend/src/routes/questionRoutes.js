// ============================================
// FILE: backend/src/routes/questionRoutes.js
// PURPOSE: Defines endpoints for the auto-generated practice
// question list shown in the sidebar.
//   GET /api/questions       -> all questions (protected, login required)
//   GET /api/questions/:id   -> a single question's full details
// ============================================

const express = require("express");
const router = express.Router();
const { getQuestions, getQuestionById } = require("../controllers/submissionController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getQuestions);
router.get("/:id", protect, getQuestionById);

module.exports = router;
