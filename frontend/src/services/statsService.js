// ============================================
// FILE: frontend/src/services/statsService.js
// PURPOSE: Wraps the /api/submissions/stats call used by the
// Profile popup to show total questions solved and average rating.
// ============================================

import api from "./api";

export const fetchMyStats = async () => {
  const res = await api.get("/submissions/stats");
  return res.data;
};