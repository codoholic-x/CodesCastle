// ============================================
// FILE: backend/src/models/User.js
// PURPOSE: Defines the MongoDB schema for a registered user.
// Stores profile info, hashed password, and tracks the per-session
// page-refresh count (used to auto-logout after 3 refreshes).
// Passwords are hashed with bcrypt before being saved (see pre-save hook).
// ============================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    // Tracks how many times the current browser session has refreshed
    // a protected page. Reset to 0 on every fresh login.
    refreshCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Hash the password before saving, only if it was modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to verify a plaintext password against the stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
