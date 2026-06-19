// ============================================
// FILE: frontend/src/components/Navbar.jsx
// PURPOSE: The persistent top navigation bar shown on every page.
// Mirrors the screenshots: logo + "CodesCastle" wordmark on the
// left, theme toggle (moon icon) + Home + Log In button on the
// right when logged out. When logged in, shows the username and a
// Log Out button instead of Log In.
// ============================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import ProfileModal from "./ProfileModal";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-logo-badge">{"</>"}</span>
        <span className="navbar-title">CodesCastle</span>
      </Link>

      <div className="navbar-actions">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <Link to="/" className="nav-link">
          Home
        </Link>

        {isAuthenticated && (
          <Link to="/practice" className="nav-link">
            Practice
          </Link>
        )}

        <Link to="/contact" className="nav-link">
          Contact
        </Link>

        {isAuthenticated ? (
          <>
            <button
              className="navbar-username navbar-username-btn"
              onClick={() => setProfileModalOpen(true)}
            >
              Hi, {user?.firstName}
            </button>
            <button className="btn-pill btn-pill-ghost" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-pill btn-pill-dark">
            Log In
          </Link>
        )}
      </div>

      {profileModalOpen && (
        <ProfileModal user={user} onClose={() => setProfileModalOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;