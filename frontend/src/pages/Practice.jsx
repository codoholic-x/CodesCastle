// ============================================
// FILE: frontend/src/pages/Practice.jsx
// PURPOSE: The main code editor/compiler page (the heart of the
// app), matching the screenshots: a left sidebar of numbered
// practice questions and a right-hand dark code editor with a
// language dropdown, input box, and Run button. Below the editor,
// an output console shows stdout/stderr. On a successful run, it
// also shows the star rating earned and whether a new practice
// question was generated from this code.
// ============================================

import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { LANGUAGES, getLanguageByValue } from "../constants/languages";
import { runCode } from "../services/codeService";
import { fetchQuestions, fetchQuestionById } from "../services/questionService";
import RatingStars from "../components/RatingStars";
import QuestionModal from "../components/QuestionModal";
import "./Practice.css";

// Maps our language `value` strings to CodeMirror language extensions.
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

const Practice = () => {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(getLanguageByValue("cpp").starterCode);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null); // { success, stdout, stderr, questionInfo }
  const [running, setRunning] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  // Question detail popup (modal) state
  const [modalQuestion, setModalQuestion] = useState(null);
  const [modalUserRating, setModalUserRating] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDisplayNumber, setModalDisplayNumber] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestions();
        setQuestions(data.questions || []);
      } catch {
        // If not logged in or request fails, just show empty sidebar
        setQuestions([]);
      } finally {
        setQuestionsLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(getLanguageByValue(newLang).starterCode);
    setOutput(null);
  };

  const refreshQuestions = async () => {
    try {
      const data = await fetchQuestions();
      const list = data.questions || [];
      setQuestions(list);
      return list;
    } catch {
      // ignore silently; sidebar simply won't update
      return questions;
    }
  };

  const handleQuestionClick = async (questionId) => {
    setActiveQuestionId(questionId);
    setModalOpen(true);
    setModalLoading(true);
    setModalQuestion(null);
    setModalUserRating(null);

    // Find this question's position in the user's own list (1-based)
    // so the popup shows "Problem 1/2/3..." consistent with the
    // sidebar, instead of the question's global database number.
    const indexInUserList = questions.findIndex((q) => q._id === questionId);
    setModalDisplayNumber(indexInUserList >= 0 ? indexInUserList + 1 : null);

    try {
      const data = await fetchQuestionById(questionId);
      setModalQuestion(data.question);
      setModalUserRating(data.userRating);
    } catch {
      setModalQuestion(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setActiveQuestionId(null);
  };

  // Called from inside the modal's "Try This Question" button. Loads
  // the question's saved code into the main editor and closes the popup.
  const handleTryThisQuestion = (question) => {
    setLanguage(question.language);
    setCode(question.originalCode);
    setOutput(null);
    setModalOpen(false);
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const result = await runCode({ language, code, input });

      if (result.success && result.questionInfo) {
        const updatedList = await refreshQuestions();
        const qId = result.questionInfo.question?._id;
        setActiveQuestionId(qId || null);

        const indexInUserList = updatedList.findIndex((q) => q._id === qId);
        result.questionInfo.displayNumber =
          indexInUserList >= 0 ? indexInUserList + 1 : result.questionInfo.question?.questionNumber;
      }

      setOutput(result);
    } catch (err) {
      setOutput({
        success: false,
        stdout: "",
        stderr: err.response?.data?.message || "Something went wrong while running your code.",
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="practice-page">
      <aside className="question-sidebar">
        {questionsLoading ? (
          <div className="question-sidebar-empty">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="question-sidebar-empty">
            No practice questions yet. Run some code successfully to generate your first one!
          </div>
        ) : (
          questions.map((q, index) => (
            <div
              key={q._id}
              className={`question-card ${activeQuestionId === q._id ? "active" : ""}`}
              onClick={() => handleQuestionClick(q._id)}
            >
              <span className="question-number">{index + 1}.</span>
              <span className="question-title">{q.title}</span>
            </div>
          ))
        )}
      </aside>

      <section className="editor-panel">
        <div className="editor-shell">
          <CodeMirror
            value={code}
            height="500px"
            theme="dark"
            extensions={[getLanguageExtension(language)]}
            onChange={(value) => setCode(value)}
            basicSetup={{ lineNumbers: true, foldGutter: true }}
          />
        </div>

        <div className="editor-controls-bar">
          <div className="control-group">
            <label htmlFor="language-select">Select Language</label>
            <select
              id="language-select"
              className="language-select"
              value={language}
              onChange={handleLanguageChange}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group" style={{ flex: 1 }}>
            <label htmlFor="input-box">Input (stdin)</label>
            <textarea
              id="input-box"
              className="input-box"
              placeholder="Enter your input here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <button className="run-btn" onClick={handleRun} disabled={running}>
            {running ? "Running..." : "Run"}
          </button>
        </div>

        {output && (
          <div className={`output-console ${output.success ? "success" : "error"}`}>
            <div className="output-header">
              <span className={`output-status ${output.success ? "success" : "error"}`}>
                {output.success ? "Success" : "Error"}
              </span>
            </div>
            {output.success ? output.stdout || "(no output)" : output.stderr}

            {output.success && output.questionInfo && (
              <div className="question-feedback">
                <RatingStars rating={output.questionInfo.starRating} />
                <span>
                  {output.questionInfo.isNew
                    ? `Added as Question #${output.questionInfo.displayNumber} in your practice list.`
                    : `Matched Question #${output.questionInfo.displayNumber}. Attempt #${output.questionInfo.attemptNumber}.`}
                </span>
              </div>
            )}
          </div>
        )}
      </section>

      {modalOpen && (
        <QuestionModal
          question={modalQuestion}
          userRating={modalUserRating}
          loading={modalLoading}
          displayNumber={modalDisplayNumber}
          onClose={handleCloseModal}
          onTryThisQuestion={handleTryThisQuestion}
        />
      )}
    </div>
  );
};

export default Practice;