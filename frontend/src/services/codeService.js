// ============================================
// FILE: frontend/src/services/codeService.js
// PURPOSE: Wraps the /api/execute call used by the "Run" button on
// the code editor page.
// ============================================

import api from "./api";

export const runCode = async ({ language, code, input }) => {
  const res = await api.post("/execute", { language, code, input });
  return res.data;
};
