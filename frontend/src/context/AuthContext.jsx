// ============================================
// FILE: frontend/src/context/AuthContext.jsx
// PURPOSE: Provides global authentication state to the entire app
// via React Context. Responsibilities:
//   1. Store/restore the logged-in user + JWT token (localStorage)
//   2. Expose login(), signup(), logout() functions
//   3. Implement the "auto logout after 3 refreshes" rule:
//      - We use sessionStorage (NOT localStorage) to count refreshes,
//        because sessionStorage is cleared when the tab is closed,
//        matching "refreshing the SAME session 3+ times".
//      - Every time a protected page mounts, ProtectedRoute calls
//        registerPageView(), which increments the counter.
//      - On fresh login, the counter resets to 0.
//      - If the counter exceeds 3, the user is forced to log out
//        and redirected to Home.
// ============================================

import { useState, useEffect } from "react";
import { loginUser, signupUser, getCurrentUser } from "../services/authService";
import { AuthContext } from "./AuthContextObject";

const REFRESH_KEY = "cd_refresh_count";
const MAX_REFRESHES = 3;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("cd_token") || null);
  const [loading, setLoading] = useState(true);
  const [forcedLogoutMessage, setForcedLogoutMessage] = useState(null);

  // On app start, if a token exists, try to restore the session.
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem("cd_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      // Check refresh count BEFORE trusting the stored token.
      const currentCount = parseInt(sessionStorage.getItem(REFRESH_KEY) || "0", 10);
      const newCount = currentCount + 1;
      sessionStorage.setItem(REFRESH_KEY, String(newCount));

      if (newCount > MAX_REFRESHES) {
        // Force logout: too many refreshes in this browser session
        localStorage.removeItem("cd_token");
        sessionStorage.removeItem(REFRESH_KEY);
        setUser(null);
        setToken(null);
        setForcedLogoutMessage(
          "You were logged out automatically after refreshing the page too many times."
        );
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        setUser(data.user);
        setToken(storedToken);
      } catch {
        // Token invalid/expired
        localStorage.removeItem("cd_token");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem("cd_token", data.token);
    sessionStorage.setItem(REFRESH_KEY, "0"); // reset refresh counter on fresh login
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (formData) => {
    const data = await signupUser(formData);
    localStorage.setItem("cd_token", data.token);
    sessionStorage.setItem(REFRESH_KEY, "0");
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("cd_token");
    sessionStorage.removeItem(REFRESH_KEY);
    setToken(null);
    setUser(null);
  };

  const clearForcedLogoutMessage = () => setForcedLogoutMessage(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        signup,
        logout,
        forcedLogoutMessage,
        clearForcedLogoutMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
