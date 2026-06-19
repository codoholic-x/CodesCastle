// ============================================
// FILE: frontend/src/pages/Contact.jsx
// PURPOSE: The Contact Us + Review page mentioned in the spec
// ("last me ek contact aur review aur page rakho jo proper work
// kare"). Contains two working forms: one for general contact
// messages, one for star-rated reviews. Both persist to MongoDB via
// the backend.
// ============================================

import { useState } from "react";
import { sendContactMessage, sendReview } from "../services/contactService";
import "./Contact.css";

const Contact = () => {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState("");
  const [contactLoading, setContactLoading] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactStatus("");
    try {
      await sendContactMessage(contactForm);
      setContactStatus("success");
      setContactForm({ name: "", email: "", message: "" });
    } catch (err) {
      setContactStatus(err.response?.data?.message || "Failed to send message.");
    } finally {
      setContactLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      setReviewStatus("Please select a star rating.");
      return;
    }
    setReviewLoading(true);
    setReviewStatus("");
    try {
      await sendReview({ rating: reviewRating, comment: reviewComment });
      setReviewStatus("success");
      setReviewRating(0);
      setReviewComment("");
    } catch (err) {
      setReviewStatus(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <h1 className="contact-heading">Get in touch</h1>
      <p className="contact-subtitle">
        Have a question, found a bug, or just want to share feedback? We'd love to hear from you.
      </p>

      <div className="contact-grid">
        <div className="contact-card">
          <h2>Contact Us</h2>

          {contactStatus === "success" && (
            <div className="contact-success">Your message has been sent successfully!</div>
          )}

          <form onSubmit={handleContactSubmit}>
            <div className="contact-field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
              />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
              />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="contact-submit" disabled={contactLoading}>
              {contactLoading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className="contact-card">
          <h2>Leave a Review</h2>

          {reviewStatus === "success" && (
            <div className="contact-success">Thank you for your review!</div>
          )}

          <form onSubmit={handleReviewSubmit}>
            <div className="star-picker">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`pick ${n <= reviewRating ? "active" : ""}`}
                  onClick={() => setReviewRating(n)}
                  role="button"
                  aria-label={`Rate ${n} stars`}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="contact-field">
              <label htmlFor="review-comment">Comment (optional)</label>
              <textarea
                id="review-comment"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Tell us what you think..."
              />
            </div>
            <button type="submit" className="contact-submit" disabled={reviewLoading}>
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
