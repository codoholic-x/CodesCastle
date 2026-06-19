// ============================================
// FILE: backend/src/routes/executeRoutes.js
// PURPOSE: Defines the code-execution endpoint.
//   POST /api/execute -> compiles/runs code via Piston API.
// Uses optionalAuth so guests can run code too, but logged-in users
// additionally get the run tracked for question generation/rating.
// ============================================

const express = require("express");
const router = express.Router();
const { executeCode } = require("../controllers/executeController");
const { optionalAuth } = require("../middleware/optionalAuthMiddleware");

router.post("/", optionalAuth, executeCode);

module.exports = router;
