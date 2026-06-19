// ============================================
// FILE: backend/src/utils/generateToken.js
// PURPOSE: Generates a signed JWT for a given user ID. Used right
// after successful signup/login in authController.js.
// ============================================

const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
