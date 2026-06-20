// ============================================
// FILE: backend/src/config/languages.js
// PURPOSE: Central mapping of supported programming languages to the
// exact "language" code and "versionIndex" required by the JDoodle
// Compiler API (https://www.jdoodle.com/compiler-api/) -- no Docker
// needed, just clientId/clientSecret credentials.
//
// HOW TO ADD A NEW LANGUAGE LATER:
//   1. Check the language code + versionIndex at
//      https://docs.jdoodle.com/compiler-api/compiler-api#what-languages-and-versions-supported
//   2. Add a new entry below following the same pattern.
//   3. Add the matching option in frontend/src/constants/languages.js
// No other file needs to change.
// ============================================

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
    label: "JavaScript",
    jdoodle_language: "nodejs",
    versionIndex: "4",
  },
};

module.exports = SUPPORTED_LANGUAGES;