// ============================================
// FILE: backend/src/server.js
// PURPOSE: The main entry point of the backend application.
// Responsibilities:
//   1. Load environment variables
//   2. Connect to MongoDB Atlas
//   3. Set up Express app with security/CORS/JSON middleware
//   4. Mount all route modules under their base paths
//   5. Attach error-handling middleware (must be last)
//   6. Start the HTTP server
//
// TO RUN: from the backend/ folder run `npm install` then `npm run dev`
// (requires nodemon) or `npm start` for production.
// ============================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const executeRoutes = require("./routes/executeRoutes");
const questionRoutes = require("./routes/questionRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ---------- Global Middleware ----------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" })); // parses incoming JSON request bodies

// Basic rate limiting to protect against abuse (security requirement)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.send("CodesCastle API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api", contactRoutes); // exposes /api/contact and /api/reviews

// ---------- Error Handling (must be last) ----------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] CodesCastle backend running on port ${PORT}`);
});
