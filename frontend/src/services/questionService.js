// ============================================
// FILE: frontend/src/services/questionService.js
// PURPOSE: Wraps the /api/questions calls used to populate the
// left-sidebar practice question list and fetch a single question's
// details when clicked.
// ============================================

import api from "./api";

export const fetchQuestions = async () => {
  const res = await api.get("/questions");
  return res.data;
};

export const fetchQuestionById = async (id) => {
  const res = await api.get(`/questions/${id}`);
  return res.data;
};
