// ============================================
// FILE: frontend/src/context/useAuth.js
// PURPOSE: Exports the useAuth() hook separately from AuthContext.jsx
// so that AuthContext.jsx only exports the AuthProvider component.
// This keeps React Fast Refresh (HMR) working correctly during
// development.
// ============================================

import { useContext } from "react";
import { AuthContext } from "./AuthContextObject";

export const useAuth = () => useContext(AuthContext);
