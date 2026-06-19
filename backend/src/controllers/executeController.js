// ============================================
// FILE: backend/src/controllers/executeController.js
// PURPOSE: Handles the "Run" button action.
// Sends the user's code + input to the public Piston API
// (https://github.com/engineer-man/piston) for compilation/execution
// of C, C++, Java, Python, and JavaScript — without needing Docker
// on our own server, since Piston hosts the sandboxed runtimes.
//
// On a SUCCESSFUL run (no compile/runtime errors), this also calls
// the submission controller logic to:
//   1. Auto-create a practice Question from the code (if not a dup)
//   2. Calculate and save a star rating based on attempt count
// ============================================

// backend/src/controllers/executeController.js
const fetch = require("node-fetch");
const SUPPORTED_LANGUAGES = require("../config/languages");
const { handleSuccessfulRun } = require("./submissionController");

const executeCode = async (req, res, next) => {
  try {
    const { language, code, input } = req.body;

    if (!language || !code) {
      return res.status(400).json({ message: "Language and code are required" });
    }

    const langConfig = SUPPORTED_LANGUAGES[language];
    if (!langConfig) {
      return res.status(400).json({ message: `Unsupported language: ${language}` });
    }

    const jdoodleResponse = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        script: code,
        language: langConfig.jdoodle_language,
        versionIndex: langConfig.versionIndex,
        stdin: input || "",
      }),
    });

    if (!jdoodleResponse.ok) {
      return res.status(502).json({ message: "Code execution service unavailable" });
    }

    const result = await jdoodleResponse.json();

    // JDoodle response: { output, statusCode, memory, cpuTime }
    // statusCode 200 = success, 400/500 = error
    const stdout = result.output || "";
    const success = result.statusCode === 200 && !stdout.includes("error");

    let questionInfo = null;
    if (success && req.user) {
      questionInfo = await handleSuccessfulRun({
        userId: req.user._id,
        language,
        code,
        input: input || "",
        output: stdout,
      });
    }

    res.status(200).json({
      success,
      stdout,
      stderr: success ? "" : stdout,
      questionInfo,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { executeCode };
