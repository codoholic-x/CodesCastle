// ============================================
// FILE: backend/src/routes/contactRoutes.js
// PURPOSE: Defines endpoints for the Contact Us and Review pages.
//   POST /api/contact         -> submit a contact message (public)
//   POST /api/reviews         -> submit a review (optional auth, name shown if logged in)
//   GET  /api/reviews         -> fetch recent reviews (public)
// ============================================

const express = require("express");
const router = express.Router();
const { submitContact, submitReview, getReviews } = require("../controllers/contactController");
const { optionalAuth } = require("../middleware/optionalAuthMiddleware");

router.post("/contact", submitContact);
router.post("/reviews", optionalAuth, submitReview);
router.get("/reviews", getReviews);

module.exports = router;
