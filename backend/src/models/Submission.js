// ============================================
// FILE: backend/src/models/Submission.js
// PURPOSE: Defines the MongoDB schema for a single code-run attempt
// made by a user. Used to:
//   1. Count how many attempts a user took on a question (for rating)
//   2. Store star rating earned (0.5 to 5 stars)
//   3. Keep a history of all runs for the user's profile/stats
// ============================================

const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      default: null, // null when it's a fresh run not yet tied to a question
    },
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    input: {
      type: String,
      default: "",
    },
    output: {
      type: String,
      default: "",
    },
    success: {
      type: Boolean,
      required: true,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
    starRating: {
      type: Number,
      default: 0, // 0 until the question is solved correctly
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
