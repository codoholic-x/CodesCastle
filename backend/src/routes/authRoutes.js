// ============================================
// FILE: backend/src/routes/authRoutes.js
// PURPOSE: Defines all authentication-related URL endpoints and maps
// them to their controller functions.
//   POST /api/auth/signup        -> create account
//   POST /api/auth/login         -> log in, get JWT
//   GET  /api/auth/me            -> get current logged-in user (protected)
//   POST /api/auth/track-refresh -> increment refresh count (protected)
// ============================================

const express = require("express");
const router = express.Router();
const { signup, login, getMe, trackRefresh } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/track-refresh", protect, trackRefresh);

module.exports = router;
