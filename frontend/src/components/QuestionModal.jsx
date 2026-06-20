// ============================================
// FILE: frontend/src/components/QuestionModal.jsx
// PURPOSE: A popup (modal) that opens when the user clicks a
// question in the Practice page sidebar. Shows:
//   - the question's saved code (read-only, syntax highlighted)
//   - the user's BEST star rating ever earned on this question
//   - the user's MOST RECENT star rating on this question
//   - a "Try This Question" button that loads the code into the
//     main editor (closing the popup) so the user can re-attempt it
// Closes via the X button, clicking the dark overlay, or Escape key.
// ============================================

import { useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import RatingStars from "./RatingStars";
import "./QuestionModal.css";

const getLanguageExtension = (value) => {
  switch (value) {
    case "cpp":
    case "c":
      return cpp();
    case "java":
      return java();
    case "python":
      return python();
    case "javascript":
      return javascript();
    default:
      return cpp();
  }
};

const LANGUAGE_LABELS = {
  cpp: "C++",
  c: "C",
  java: "Java",
  python: "Python",
  javascript: "JavaScript",
};

const QuestionModal = ({ question, userRating, loading, displayNumber, onClose, onTryThisQuestion }) => {
  // Allow closing the modal with the Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box question-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>

        {loading || !question ? (
          <div className="modal-loading">Loading question...</div>
        ) : (
          <>
            <div className="modal-header">
              <h2>
                Problem {displayNumber ?? question.questionNumber}
                <span className="modal-language-tag">
                  {LANGUAGE_LABELS[question.language] || question.language}
                </span>
              </h2>
            </div>

            <div className="modal-rating-row">
              <div className="modal-rating-item">
                <span className="modal-rating-label">Best Rating</span>
                <RatingStars rating={userRating ? userRating.best : 0} />
              </div>
              <div className="modal-rating-item">
                <span className="modal-rating-label">Most Recent</span>
                <RatingStars rating={userRating ? userRating.recent : 0} />
              </div>
              {userRating && (
                <div className="modal-rating-item">
                  <span className="modal-rating-label">Total Attempts</span>
                  <span className="modal-attempts-count">{userRating.totalAttempts}</span>
                </div>
              )}
            </div>

            <div className="modal-code-shell">
              <CodeMirror
                value={question.originalCode}
                height="320px"
                theme="dark"
                editable={false}
                extensions={[getLanguageExtension(question.language)]}
                basicSetup={{ lineNumbers: true, foldGutter: true }}
              />
            </div>

            <div className="modal-actions">
              <button className="modal-primary-btn" onClick={() => onTryThisQuestion(question)}>
                Try This Question
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionModal;