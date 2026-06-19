// ============================================
// FILE: frontend/src/components/ProtectedRoute.jsx
// PURPOSE: Wraps any route that should only be accessible to logged
// -in users (Practice page, Profile, etc). If the user is not
// authenticated, they are redirected straight back to Home — this
// is what satisfies "agar login nahi hai to home page pe hi rahna
// chahiye, aage na jaye na piche jaye."
//
// It also calls trackPageRefresh() on mount, which the backend uses
// to count refreshes; if the backend says forceLogout, we log the
// user out and send them home immediately.
// ============================================

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { trackPageRefresh } from "../services/authService";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, logout } = useAuth();
  const [checking, setChecking] = useState(true);
  const [forceHome, setForceHome] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!isAuthenticated) {
        setChecking(false);
        return;
      }
      try {
        const result = await trackPageRefresh();
        if (result.forceLogout) {
          logout();
          setForceHome(true);
        }
      } catch {
        // If tracking fails (e.g. token expired), let normal auth flow handle it
      } finally {
        setChecking(false);
      }
    };
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (loading || checking) return null; // could render a spinner here

  if (!isAuthenticated || forceHome) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
