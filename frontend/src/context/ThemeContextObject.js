// ============================================
// FILE: frontend/src/context/ThemeContextObject.js
// PURPOSE: Creates and exports the raw React Context object used for
// light/dark theme state. Kept separate from ThemeContext.jsx (which
// exports only the ThemeProvider component) and useTheme.js (which
// exports only the hook), so React Fast Refresh works cleanly during
// development.
// ============================================

import { createContext } from "react";

export const ThemeContext = createContext(null);
