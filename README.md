# CodesCastle — Online Code Compiler & Practice Platform

CodesCastle is a full-stack web app where users sign up, write code in
**C, C++, Java, Python, or JavaScript**, compile/run it instantly, and have
every successful run automatically turned into a saved **practice question**
with a **star rating** based on how many attempts it took to get right.

This document explains the entire project: how to run it, every file that
was created, what it does, and how to extend it later.

---

## 1. Tech Stack

| Layer              | Technology                                              |
|---------------------|----------------------------------------------------------|
| Frontend            | React 19 + Vite, React Router, Axios, CodeMirror (editor) |
| Backend             | Node.js + Express                                        |
| Database            | MongoDB Atlas (via Mongoose)                              |
| Authentication      | JWT (JSON Web Tokens) + bcrypt password hashing            |
| Code Execution      | [Piston API](https://github.com/engineer-man/piston) — a free, public, sandboxed code-execution service. **No Docker required on your machine**, since Piston runs the code on its own servers. |

---

## 2. Folder Structure (Top Level)

```
CodesCastle/
├── backend/        → Node.js + Express API server
├── frontend/        → React user interface
└── README.md        → This file
```

---

## 3. Backend — File by File

```
backend/
├── package.json              → Lists dependencies & npm scripts (npm start / npm run dev)
├── .env                       → Your actual secret config (DB url, JWT secret) — already filled with working defaults for local dev
├── .env.example               → Template showing what env variables are needed
├── .gitignore                 → Keeps node_modules and .env out of version control
└── src/
    ├── server.js               → MAIN ENTRY POINT. Starts Express, connects DB, mounts all routes.
    │
    ├── config/
    │   ├── db.js                → Connects to MongoDB Atlas using Mongoose
    │   └── languages.js         → Maps language names (cpp, java, python...) to the exact Piston API identifiers. ADD NEW LANGUAGES HERE.
    │
    ├── models/                  (Mongoose schemas = MongoDB collections)
    │   ├── User.js               → User accounts (name, userId, email, hashed password, refreshCount)
    │   ├── Question.js           → Auto-generated practice questions (with duplicate-prevention signature)
    │   ├── Submission.js         → Every code-run record (used for attempt counting & star rating)
    │   ├── Contact.js            → Messages from the Contact Us form
    │   └── Review.js             → User reviews/star feedback
    │
    ├── controllers/             (Business logic — what happens on each API call)
    │   ├── authController.js     → signup, login, getMe, trackRefresh (refresh-count logic)
    │   ├── executeController.js  → Sends code to Piston API, returns output, triggers question creation
    │   ├── submissionController.js → Creates Questions from successful runs, prevents duplicates, calculates star ratings, lists questions/submissions
    │   └── contactController.js  → Handles Contact Us + Review form submissions
    │
    ├── middleware/
    │   ├── authMiddleware.js     → protect() — BLOCKS the request if no valid JWT (used on protected routes)
    │   ├── optionalAuthMiddleware.js → Tries to read JWT but does NOT block if missing (used on /execute so guests can still run code)
    │   └── errorMiddleware.js    → Catches all errors app-wide, returns clean JSON error responses
    │
    ├── routes/                  (URL endpoint definitions — maps URLs to controller functions)
    │   ├── authRoutes.js          → /api/auth/signup, /login, /me, /track-refresh
    │   ├── executeRoutes.js       → /api/execute  (Run button)
    │   ├── questionRoutes.js      → /api/questions, /api/questions/:id
    │   ├── submissionRoutes.js    → /api/submissions/me
    │   └── contactRoutes.js       → /api/contact, /api/reviews
    │
    └── utils/
        ├── generateToken.js       → Creates a signed JWT for a user
        └── ratingHelper.js        → calculateStarRating() + normalizeCode() (duplicate detection)
```

### How the "auto-generate question + star rating" feature works (backend)
1. User clicks **Run** → frontend calls `POST /api/execute`.
2. `executeController.js` sends the code to the **Piston API**.
3. If the run succeeds (no compile/runtime errors) **and** the user is
   logged in, `submissionController.js → handleSuccessfulRun()` runs:
   - It normalizes the code (strips whitespace/comments, lowercases) into
     a "signature" using `ratingHelper.js → normalizeCode()`.
   - It checks if a `Question` already exists with that exact signature
     for that language — **this is what prevents duplicate questions**.
   - If not found, creates a new `Question` with the next sequential
     `questionNumber`.
   - It counts how many of the user's previous submissions match this
     signature → that's the **attempt number**.
   - `calculateStarRating(attemptNumber)` converts that into a star
     rating: 1st attempt = 5★, 2nd = 4★, 3rd = 3★, 4th = 2★, 5th = 1★,
     6th+ = 0.5★ (minimum).
   - Saves a `Submission` record with that rating.
4. The question list (`GET /api/questions`) is what populates the
   left sidebar on the Practice page.

### The "auto-logout after 3 refreshes" feature (backend half)
- `User.refreshCount` field tracks refreshes for the current login session.
- `POST /api/auth/track-refresh` (protected route) increments it and
  returns `forceLogout: true` once it exceeds 3.
- On every fresh `login`, `refreshCount` is reset to 0.
- See section 5 below for the frontend half of this feature.

---

## 4. Frontend — File by File

```
frontend/
├── package.json            → React, Vite, Router, Axios, CodeMirror dependencies
├── .env                     → VITE_API_BASE_URL (points to your backend)
├── index.html               → HTML shell; loads Google Fonts (serif + Inter + mono)
└── src/
    ├── main.jsx               → Mounts the React app to the page
    ├── App.jsx                → Sets up routing (Home, Login, Signup, Practice, Contact) + route guards
    │
    ├── context/
    │   ├── AuthContextObject.js  → Creates the raw AuthContext (React Context object) — kept separate for Fast Refresh
    │   ├── AuthContext.jsx       → AuthProvider component. Handles login/signup/logout AND the refresh-counter logic (sessionStorage) for auto-logout
    │   ├── useAuth.js            → useAuth() hook — import this in components to read auth state
    │   ├── ThemeContextObject.js → Creates the raw ThemeContext (React Context object) — kept separate for Fast Refresh
    │   ├── ThemeContext.jsx      → ThemeProvider component. Light/Dark mode toggle (the moon icon), persisted in localStorage
    │   └── useTheme.js           → useTheme() hook — import this in components to read/toggle theme
    │
    ├── components/
    │   ├── Navbar.jsx / .css     → Top navigation bar (logo, theme toggle, Home/Practice/Contact links, Login or Username+Logout)
    │   ├── ProtectedRoute.jsx    → Wraps pages that require login (redirects to Home if not logged in; also calls the refresh-tracker)
    │   ├── RatingStars.jsx / .css → Visual 5-star rating display (supports half-stars)
    │
    ├── pages/
    │   ├── Home.jsx / .css        → Landing page (project intro, features, CTA buttons)
    │   ├── Login.jsx              → Sign in form (matches your screenshot exactly)
    │   ├── Signup.jsx             → Sign up form (matches your screenshot exactly)
    │   ├── Auth.css               → Shared styling for Login + Signup cards
    │   ├── Practice.jsx / .css    → THE MAIN PAGE: question sidebar + code editor + Run button + output console
    │   └── Contact.jsx / .css     → Contact Us form + Review/rating form
    │
    ├── constants/
    │   └── languages.js          → Dropdown language list + starter code per language (must match backend/src/config/languages.js keys)
    │
    ├── services/                  (All API calls live here — components never call axios directly)
    │   ├── api.js                  → Configured Axios instance; auto-attaches JWT to every request
    │   ├── authService.js          → signup/login/getMe/trackRefresh calls
    │   ├── codeService.js          → runCode() — calls /api/execute
    │   ├── questionService.js      → fetchQuestions(), fetchQuestionById()
    │   └── contactService.js       → sendContactMessage(), sendReview(), fetchReviews()
    │
    └── styles/
        └── theme.css               → All CSS color variables (light & dark mode), base resets, focus styles
```

### How the "only logged-in users can navigate pages" feature works (frontend half)
- `/practice` is wrapped in `<ProtectedRoute>` in `App.jsx`.
- `ProtectedRoute.jsx` checks `isAuthenticated` from `AuthContext`. If
  false, it immediately `<Navigate to="/" />` — the user is bounced back
  to Home and **cannot** browser-back/forward into it.
- `/`, `/login`, `/signup`, and `/contact` remain public.

### How the "auto-logout after 3 refreshes" feature works (frontend half)
- `AuthContext.jsx` keeps a counter in **`sessionStorage`** (not
  localStorage) called `cd_refresh_count`. sessionStorage clears itself
  when the browser tab closes, matching "same session" refresh counting.
- Every time the app loads (including a page refresh) **while a token
  exists**, the counter increments.
- If it exceeds 3, the user is logged out immediately and shown a banner
  explaining why, then is redirected to Home.
- Logging in again resets the counter to 0.
- `ProtectedRoute.jsx` also calls the backend's `/track-refresh` endpoint
  on every protected-page mount, keeping frontend and backend in sync.

---

## 5. How to Run This Project

### Step 1 — Set up MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Get your connection string (Connect → Drivers → copy the URI).
3. Open `backend/.env` and replace `MONGODB_URI` with your real connection
   string (currently set to a local placeholder).

### Step 2 — Start the Backend
```bash
cd backend
npm install
npm run dev        # uses nodemon, auto-restarts on changes
# OR: npm start     # plain node, for production
```
The server runs on **http://localhost:5000** by default.

### Step 3 — Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The app opens on **http://localhost:5173** by default.

### Step 4 — Use the app
1. Visit `http://localhost:5173`.
2. Click **Get Started Free** → Sign Up → you're logged in automatically.
3. You'll land on the Practice page: pick a language, write code, click
   **Run**.
4. If it runs successfully, it's saved as a practice question in the
   left sidebar with a star rating shown in the output panel.

---

## 6. Adding a New Programming Language Later

Two files need a matching entry — nothing else changes:

1. **`backend/src/config/languages.js`** — add the Piston `language` id
   and `version` (get exact values by calling
   `GET https://emkc.org/api/v2/piston/runtimes`).
2. **`frontend/src/constants/languages.js`** — add the dropdown label and
   starter code. Also add a CodeMirror language import in
   `frontend/src/pages/Practice.jsx` if the new language needs special
   syntax highlighting (otherwise it'll just show plain text, which still
   works fine).

---

## 7. Security Notes

- Passwords are hashed with **bcrypt** before being stored — never stored
  in plain text.
- JWTs expire after 7 days by default (`JWT_EXPIRES_IN` in `.env`).
- API rate limiting is applied globally (300 requests / 15 minutes / IP)
  via `express-rate-limit` in `server.js`.
- CORS is restricted to your configured `FRONTEND_URL`.
- **Before deploying to production:** change `JWT_SECRET` in `.env` to a
  long random string, and never commit your real `.env` file (already
  excluded via `.gitignore`).

---

## 9. What Was Tested

Since this project was built in a sandboxed environment without live
internet access to the Piston API or a running MongoDB instance, here is
exactly what was verified before delivery:

- ✅ Backend: every file passes Node's syntax checker, all modules
  `require()` cleanly, and all Express routes register correctly.
- ✅ Frontend: `npm run build` succeeds with zero errors, and `eslint`
  reports zero errors/warnings across the entire `src/` folder.
- ✅ Core algorithm (duplicate detection, sequential question numbering,
  per-user attempt counting, star-rating ladder) was tested with 6
  scenario-based assertions against an in-memory mock of the database —
  all passed, including cross-user duplicate matching and
  language-scoped uniqueness.
- ✅ Security: password hashing (bcrypt) correctly hashes/verifies and
  rejects wrong passwords; JWT signing/verification correctly decodes
  valid tokens and rejects tampered ones.
- ⚠️ **Not tested live** (requires your own MongoDB Atlas URI and
  internet access to `emkc.org`, both unavailable in this sandbox):
  the actual `POST /api/execute` call to Piston, and a real end-to-end
  signup → login → run → question-saved flow against a live database.
  The logic backing both is verified per above, but you should do one
  real test run after following the setup steps in Section 5.

## 10. Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| Backend crashes on start with a Mongo connection error | `MONGODB_URI` in `backend/.env` is still the local placeholder | Replace it with your real MongoDB Atlas connection string |
| "Run" button shows a network/502 error | No internet access, or Piston API is temporarily down | Check your connection; Piston is a free public service and can occasionally rate-limit — try again after a few seconds |
| Stuck on Home page after Sign Up/Login | Check the browser console — usually a CORS or `VITE_API_BASE_URL` mismatch | Make sure `frontend/.env`'s `VITE_API_BASE_URL` matches where your backend is actually running |
| Logged out unexpectedly while developing | You refreshed a protected page more than 3 times in the same tab session | This is the intended behavior (see Section 4) — just log in again |

## 11. No Duplicate Files / Organized Structure

Every file in this project has exactly one responsibility and exists in
exactly one place:
- Database schemas → `models/`
- Business logic → `controllers/`
- URL → function mapping → `routes/`
- Reusable non-DB logic → `utils/`
- Request gatekeeping → `middleware/`
- Pages → `pages/`, reusable UI pieces → `components/`
- All network calls → `services/`
- Global state → `context/`

If you need to add or change something later, use the tables above to find
the **one** correct file — there is no duplicate logic anywhere else.
