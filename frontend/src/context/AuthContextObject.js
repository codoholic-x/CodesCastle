// ============================================
// FILE: frontend/src/context/AuthContextObject.js
// PURPOSE: Creates and exports the raw React Context object used for
// authentication. Kept separate from AuthContext.jsx (which exports
// only the AuthProvider component) and useAuth.js (which exports
// only the hook), so React Fast Refresh works cleanly during
// development.
// ============================================

import { createContext } from "react";

export const AuthContext = createContext(null);
