// ============================================
// FILE: frontend/src/components/ProfileModal.jsx
// PURPOSE: A popup (modal) that opens when the user clicks their
// "Hi, <name>" greeting in the Navbar. Shows:
//   - basic profile info (name, userId, email)
//   - aggregate stats: total questions solved, average star rating
// Fetches stats from /api/submissions/stats on open.
// Closes via the X button, clicking the dark overlay, or Escape key.
// ============================================

import { useState, useEffect } from "react";
import { fetchMyStats } from "../services/statsService";
import "./QuestionModal.css";
import "./ProfileModal.css";

const ProfileModal = ({ user, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchMyStats();
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box profile-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div className="profile-avatar-circle">
          {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
        </div>

        <h2 className="profile-name">
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="profile-userid">@{user?.userId}</p>
        <p className="profile-email">{user?.email}</p>

        <div className="profile-stats-row">
          <div className="profile-stat-card">
            <span className="profile-stat-value">
              {loading ? "..." : stats?.totalQuestionsSolved ?? 0}
            </span>
            <span className="profile-stat-label">Questions Solved</span>
          </div>
          <div className="profile-stat-card">
            <span className="profile-stat-value">
              {loading ? "..." : stats?.averageRating ?? 0}★
            </span>
            <span className="profile-stat-label">Average Rating</span>
          </div>
          <div className="profile-stat-card">
            <span className="profile-stat-value">
              {loading ? "..." : stats?.totalRuns ?? 0}
            </span>
            <span className="profile-stat-label">Total Runs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;