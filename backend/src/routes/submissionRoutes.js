// ============================================
// FILE: backend/src/routes/submissionRoutes.js
// PURPOSE: Defines endpoints related to a user's own submission
// history.
//   GET /api/submissions/me    -> logged-in user's past submissions
//   GET /api/submissions/stats -> aggregate stats for profile popup
// ============================================

const express = require("express");
const router = express.Router();
const { getMySubmissions, getMyStats } = require("../controllers/submissionController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMySubmissions);
router.get("/stats", protect, getMyStats);

module.exports = router;