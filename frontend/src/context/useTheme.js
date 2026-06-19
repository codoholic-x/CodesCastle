// ============================================
// FILE: frontend/src/context/useTheme.js
// PURPOSE: Exports the useTheme() hook separately from
// ThemeContext.jsx so that ThemeContext.jsx only exports the
// ThemeProvider component, keeping React Fast Refresh (HMR) working
// correctly during development.
// ============================================

import { useContext } from "react";
import { ThemeContext } from "./ThemeContextObject";

export const useTheme = () => useContext(ThemeContext);
