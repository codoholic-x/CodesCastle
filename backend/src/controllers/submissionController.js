// ============================================
// FILE: backend/src/controllers/submissionController.js
// PURPOSE:
//   1. handleSuccessfulRun() - called internally by executeController
//      after a successful code run. It:
//        a) Counts the user's previous attempts for this exact code
//           signature to determine attemptNumber -> star rating
//        b) Checks if a Question with the same normalized code
//           signature already exists (duplicate prevention)
//        c) If not, creates a new Question with the next sequential
//           questionNumber
//        d) Saves a Submission record with the star rating
//   2. getQuestions() - route handler returning the full practice
//      question list (for the logged-in user's sidebar)
//   3. getMySubmissions() - route handler returning a user's
//      submission history/stats
// ============================================

const Question = require("../models/Question");
const Submission = require("../models/Submission");
const { calculateStarRating, normalizeCode } = require("../utils/ratingHelper");

/**
 * Internal helper (not an HTTP route) called right after a code run
 * succeeds. Handles duplicate detection, question creation, attempt
 * counting, and star rating.
 */
const handleSuccessfulRun = async ({ userId, language, code, input, output }) => {
  const signature = normalizeCode(code);

  const allUserSubmissions = await Submission.find({ user: userId, language }).select("code");
  const matchingAttempts = allUserSubmissions.filter(
    (s) => normalizeCode(s.code) === signature
  ).length;

  const attemptNumber = matchingAttempts + 1;
  const starRating = calculateStarRating(attemptNumber);

  let question = await Question.findOne({ codeSignature: signature, language });
  let isNew = false;

  if (!question) {
    const lastQuestion = await Question.findOne().sort({ questionNumber: -1 });
    const nextNumber = lastQuestion ? lastQuestion.questionNumber + 1 : 1;

    question = await Question.create({
      questionNumber: nextNumber,
      title: `Problem ${nextNumber}`,
      description: "Auto-generated from a successful code submission.",
      language,
      originalCode: code,
      codeSignature: signature,
      expectedOutput: output,
      createdBy: userId,
    });
    isNew = true;
  }

  await Submission.create({
    user: userId,
    question: question._id,
    language,
    code,
    input,
    output,
    success: true,
    attemptNumber,
    starRating,
  });

  return { question, starRating, isNew, attemptNumber };
};

// @route GET /api/questions
const getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find()
      .sort({ questionNumber: 1 })
      .select("questionNumber title language createdAt");

    res.status(200).json({ questions });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/questions/:id
// Returns the full question details, PLUS (if the requester is
// logged in) their own best-ever and most-recent star rating for
// this specific question -- used by the question detail popup.
const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    let userRating = null;

    if (req.user) {
      const userSubmissions = await Submission.find({
        user: req.user._id,
        question: question._id,
      }).sort({ createdAt: -1 });

      if (userSubmissions.length > 0) {
        const bestRating = Math.max(...userSubmissions.map((s) => s.starRating));
        const mostRecent = userSubmissions[0];

        userRating = {
          best: bestRating,
          recent: mostRecent.starRating,
          totalAttempts: userSubmissions.length,
        };
      }
    }

    res.status(200).json({ question, userRating });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/submissions/me
const getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("question", "questionNumber title");

    res.status(200).json({ submissions });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/submissions/stats
// Returns aggregate stats for the logged-in user's profile popup:
// how many distinct questions they've solved, and their average
// star rating across all successful submissions.
const getMyStats = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ user: req.user._id, success: true });

    const uniqueQuestionIds = new Set(
      submissions.filter((s) => s.question).map((s) => s.question.toString())
    );
    const totalQuestionsSolved = uniqueQuestionIds.size;

    const totalRatingSum = submissions.reduce((sum, s) => sum + (s.starRating || 0), 0);
    const averageRating =
      submissions.length > 0
        ? Math.round((totalRatingSum / submissions.length) * 10) / 10
        : 0;

    res.status(200).json({
      totalQuestionsSolved,
      totalRuns: submissions.length,
      averageRating,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleSuccessfulRun,
  getQuestions,
  getQuestionById,
  getMySubmissions,
  getMyStats,
};