// ============================================
// FILE: backend/src/controllers/contactController.js
// PURPOSE: Handles the Contact Us form and the Review/Feedback form.
// Both are saved to the database (via the Contact and Review models)
// so the data persists, as required.
// ============================================

const Contact = require("../models/Contact");
const Review = require("../models/Review");

// @route POST /api/contact
const submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    const contact = await Contact.create({ name, email, message });
    res.status(201).json({ message: "Your message has been sent successfully", contact });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/reviews
const submitReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const review = await Review.create({
      user: req.user ? req.user._id : null,
      name: req.user ? `${req.user.firstName} ${req.user.lastName}` : "Anonymous",
      rating,
      comment: comment || "",
    });

    res.status(201).json({ message: "Thank you for your review!", review });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/reviews
const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact, submitReview, getReviews };
