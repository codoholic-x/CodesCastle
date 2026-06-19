// ============================================
// FILE: frontend/src/main.jsx
// PURPOSE: The application's entry point — mounts <App /> into the
// #root DOM element defined in index.html.
//
// NOTE: React's <StrictMode> is intentionally NOT used here. In
// development, StrictMode double-invokes effects, which would
// double-count the refresh-tracking logic in AuthContext/
// ProtectedRoute (our "auto logout after 3 refreshes" feature).
// Skipping it keeps that count accurate in both dev and production.
// ============================================

import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
