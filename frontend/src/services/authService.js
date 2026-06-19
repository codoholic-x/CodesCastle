// ============================================
// FILE: frontend/src/services/authService.js
// PURPOSE: Wraps all authentication-related API calls (signup,
// login, getMe, trackRefresh) into simple functions that components
// can import and call directly.
// ============================================

import api from "./api";

export const signupUser = async (data) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const trackPageRefresh = async () => {
  const res = await api.post("/auth/track-refresh");
  return res.data;
};
