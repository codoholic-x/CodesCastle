// ============================================
// FILE: backend/src/controllers/executeController.js
// PURPOSE: Handles the "Run" button action.
// Sends the user's code + input to the JDoodle Compiler API
// (https://www.jdoodle.com/compiler-api/, no Docker needed on our
// own server) for compilation/execution of C, C++, Java, Python,
// and JavaScript (Node.js).
//
// NOTE: Uses Node.js's built-in global `fetch` (available natively
// since Node 18) instead of the "node-fetch" package. This avoids a
// "Premature close" connection error that can occur with node-fetch
// v2 on some hosting platforms (e.g. Render) when making outbound
// HTTPS calls to third-party APIs.
//
// On a SUCCESSFUL run (no compile/runtime errors), this also calls
// the submission controller logic to:
//   1. Auto-create a practice Question from the code (if not a dup)
//   2. Calculate and save a star rating based on attempt count
// ============================================

const SUPPORTED_LANGUAGES = require("../config/languages");
const { handleSuccessfulRun } = require("./submissionController");

// @route POST /api/execute
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

    const jdoodleResponse = await fetch(process.env.JDOODLE_API_URL, {
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
      const errText = await jdoodleResponse.text();
      console.error("[JDoodle] Request failed:", jdoodleResponse.status, errText);
      return res.status(502).json({ message: "Code execution service is unavailable" });
    }

    const result = await jdoodleResponse.json();

    // JDoodle response shape: { output, statusCode, memory, cpuTime,
    // isCompiled, isExecutionSuccess }. statusCode stays 200 even on
    // a compile error or timeout -- JDoodle just puts the error text
    // into "output" in that case. When present, isCompiled/
    // isExecutionSuccess are the more reliable signals (0 = failed).
    // We fall back to statusCode === 200 alone when those fields
    // aren't present in the response (depends on JDoodle's plan).
    const rawOutput = result.output || "";
    let success = result.statusCode === 200;

    if (success && typeof result.isCompiled !== "undefined") {
      success = result.isCompiled !== 0;
    }
    if (success && typeof result.isExecutionSuccess !== "undefined") {
      success = success && result.isExecutionSuccess !== 0;
    }

    let questionInfo = null;
    if (success && req.user) {
      questionInfo = await handleSuccessfulRun({
        userId: req.user._id,
        language,
        code,
        input: input || "",
        output: rawOutput,
      });
    }

    res.status(200).json({
      success,
      stdout: success ? rawOutput : "",
      stderr: success ? "" : rawOutput,
      questionInfo, // { question, starRating, isNew } or null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { executeCode };