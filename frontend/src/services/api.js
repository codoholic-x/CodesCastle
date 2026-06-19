// ============================================
// FILE: frontend/src/services/api.js
// PURPOSE: Creates a single configured Axios instance used by every
// API call in the app. Automatically attaches the JWT token (from
// localStorage) to the Authorization header of every outgoing
// request, so individual service functions don't need to repeat
// that logic.
// ============================================

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cd_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
