// ============================================
// FILE: backend/src/config/languages.js
// PURPOSE: Central mapping of supported programming languages to the
// exact "language" and "version" identifiers required by the Piston
// execution API (https://github.com/engineer-man/piston).
//
// HOW TO ADD A NEW LANGUAGE LATER:
//   1. Find the language's id and version by calling GET {PISTON_API_URL}/runtimes
//   2. Add a new entry below following the same pattern.
//   3. Add the matching option in frontend/src/constants/languages.js
// No other file needs to change.
// ============================================

// backend/src/config/languages.js
const SUPPORTED_LANGUAGES = {
  cpp: {
    label: "C++",
    jdoodle_language: "cpp17",
    versionIndex: "0",
  },
  c: {
    label: "C",
    jdoodle_language: "c",
    versionIndex: "5",
  },
  java: {
    label: "Java",
    jdoodle_language: "java",
    versionIndex: "4",
  },
  python: {
    label: "Python",
    jdoodle_language: "python3",
    versionIndex: "4",
  },
  javascript: {
    label: "JavaScript (Node.js)",
    jdoodle_language: "nodejs",
    versionIndex: "4",
  },
};

module.exports = SUPPORTED_LANGUAGES;
