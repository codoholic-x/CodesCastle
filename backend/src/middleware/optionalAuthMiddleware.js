// ============================================
// FILE: backend/src/middleware/optionalAuthMiddleware.js
// PURPOSE: Similar to authMiddleware.protect, but does NOT block the
// request if no/invalid token is present — it simply leaves req.user
// undefined. Used on routes like /api/execute where guests should
// still be able to run code, but logged-in users additionally get
// their run tracked into the Question/Submission/rating system.
// ============================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (user) req.user = user;

    next();
  } catch (error) {
    // Invalid token for an optional-auth route just means "treat as guest"
    next();
  }
};

module.exports = { optionalAuth };
