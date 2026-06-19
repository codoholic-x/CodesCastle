// ============================================
// FILE: backend/src/controllers/authController.js
// PURPOSE: Business logic for authentication routes:
//   - signup: create a new user account
//   - login: verify credentials and issue a JWT
//   - getMe: return the currently logged-in user's profile
//   - trackRefresh: increments refreshCount; if it exceeds 3,
//     responds with a flag telling the frontend to force logout.
//   - resetRefreshCount: called on fresh login to reset the counter
// ============================================

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @route POST /api/auth/signup
const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, userId, email, password } = req.body;

    if (!firstName || !lastName || !userId || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const existingUserId = await User.findOne({ userId });
    if (existingUserId) {
      return res.status(400).json({ message: "User ID is already taken" });
    }

    const user = await User.create({
      firstName,
      lastName,
      userId,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.userId,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Reset refresh count on every fresh login
    user.refreshCount = 0;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.userId,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/auth/track-refresh
// Called by the frontend every time a protected page reloads.
// If refreshCount exceeds 3, tell the frontend to force a logout.
const trackRefresh = async (req, res, next) => {
  try {
    const user = req.user;
    user.refreshCount += 1;
    await user.save();

    const shouldLogout = user.refreshCount > 3;

    res.status(200).json({
      refreshCount: user.refreshCount,
      forceLogout: shouldLogout,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getMe, trackRefresh };
