// ============================================
// FILE: backend/src/utils/ratingHelper.js
// PURPOSE: Pure helper functions (no DB/network calls) used by the
// submission controller:
//   1. calculateStarRating() - maps "number of attempts taken to get
//      it correct" to a star rating between 0.5 and 5.
//   2. normalizeCode() - strips whitespace/comments and lowercases
//      code so that trivially different (but functionally similar)
//      submissions map to the same "signature", preventing duplicate
//      practice questions from being created.
// ============================================

/**
 * Calculates star rating based on how many attempts it took the user
 * to get a correct/successful run.
 * Rule (from spec): first-attempt success = 5 stars.
 * The more attempts it takes, the lower the rating, minimum 0.5 stars.
 * @param {number} attemptNumber - 1-based attempt count
 * @returns {number} star rating between 0.5 and 5
 */
function calculateStarRating(attemptNumber) {
  if (attemptNumber <= 1) return 5;
  if (attemptNumber === 2) return 4;
  if (attemptNumber === 3) return 3;
  if (attemptNumber === 4) return 2;
  if (attemptNumber === 5) return 1;
  return 0.5; // 6th attempt or more
}

/**
 * Normalizes source code into a signature string so that
 * functionally-identical or near-identical submissions can be
 * detected as duplicates before creating a new practice Question.
 * Steps: remove single/multi-line comments, remove all whitespace,
 * lowercase everything.
 * @param {string} code
 * @returns {string} normalized signature
 */
function normalizeCode(code) {
  if (!code) return "";
  return code
    .replace(/\/\/.*$/gm, "") // remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // remove multi-line comments
    .replace(/#.*$/gm, "") // remove python/shell-style comments
    .replace(/\s+/g, "") // remove all whitespace
    .toLowerCase();
}

module.exports = { calculateStarRating, normalizeCode };
