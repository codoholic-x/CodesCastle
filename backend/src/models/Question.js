// ============================================
// FILE: backend/src/models/Question.js
// PURPOSE: Defines the MongoDB schema for auto-generated practice
// questions. Whenever a user successfully runs a piece of code, a
// Question document is created from it (see submissionController.js).
//
// DUPLICATE PREVENTION: We store a "codeSignature" — a normalized
// version of the code (whitespace/comments stripped, lowercased) —
// and check for an existing question with the same signature before
// creating a new one. This satisfies the "no duplicate/similar
// question" requirement.
// ============================================

const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      required: true,
    },
    originalCode: {
      type: String,
      required: true,
    },
    // Normalized signature used purely for duplicate detection
    codeSignature: {
      type: String,
      required: true,
      index: true,
    },
    expectedOutput: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index: signature must be unique per language
questionSchema.index({ codeSignature: 1, language: 1 }, { unique: true });

module.exports = mongoose.model("Question", questionSchema);
