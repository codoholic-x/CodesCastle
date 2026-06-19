// ============================================
// FILE: frontend/src/App.jsx
// PURPOSE: Root application component. Sets up:
//   1. AuthProvider + ThemeProvider context wrappers
//   2. React Router with all page routes
//   3. ProtectedRoute guards on pages that require login
//      (Practice and Contact), per the spec: "agar login nahi hai
//      to home page pe hi rahna chahiye"
//   4. The persistent Navbar shown on every page
// ============================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Practice from "./pages/Practice";
import Contact from "./pages/Contact";
import "./styles/theme.css";

// Small banner shown when the user was force-logged-out due to the
// "3 refresh" rule, so they understand why they landed back on Home.
const ForcedLogoutBanner = () => {
  const { forcedLogoutMessage, clearForcedLogoutMessage } = useAuth();
  if (!forcedLogoutMessage) return null;

  return (
    <div
      style={{
        background: "#fff3cd",
        color: "#7a5b00",
        textAlign: "center",
        padding: "10px 16px",
        fontSize: "0.9rem",
        fontWeight: 500,
      }}
    >
      {forcedLogoutMessage}{" "}
      <button
        onClick={clearForcedLogoutMessage}
        style={{
          background: "none",
          border: "none",
          textDecoration: "underline",
          cursor: "pointer",
          color: "#7a5b00",
          fontWeight: 600,
        }}
      >
        Dismiss
      </button>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ForcedLogoutBanner />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/practice"
              element={
                <ProtectedRoute>
                  <Practice />
                </ProtectedRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
            {/* Any unknown route falls back to Home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
