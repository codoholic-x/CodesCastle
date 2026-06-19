// ============================================
// FILE: frontend/src/services/contactService.js
// PURPOSE: Wraps the /api/contact and /api/reviews calls used by the
// Contact Us and Review pages.
// ============================================

import api from "./api";

export const sendContactMessage = async (data) => {
  const res = await api.post("/contact", data);
  return res.data;
};

export const sendReview = async (data) => {
  const res = await api.post("/reviews", data);
  return res.data;
};

export const fetchReviews = async () => {
  const res = await api.get("/reviews");
  return res.data;
};
