// ============================================
// FILE: backend/src/middleware/authMiddleware.js
// PURPOSE: Protects routes that require a logged-in user.
// Reads the JWT from the "Authorization: Bearer <token>" header,
// verifies it, fetches the user from DB (without password), and
// attaches it to req.user. If anything fails, returns 401 Unauthorized.
// This is what enforces "only logged-in users can access pages
// other than Home" on the backend/API side.
// ============================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found, authorization denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
};

module.exports = { protect };
