// ============================================
// FILE: frontend/src/pages/Home.jsx
// PURPOSE: The landing page of the site. Shows the big project name
// and tagline, feature highlights, and call-to-action buttons.
// Per the spec, non-logged-in users should land here and stay here
// (can't navigate forward/back into protected pages); logged-in
// users get a CTA straight into the Practice/editor page instead.
// ============================================

import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Home.css";

const FEATURES = [
  {
    icon: "🖥️",
    title: "Multi-language compiler",
    desc: "Write and run Java, JavaScript, C, C++, and Python code instantly, right in your browser.",
  },
  {
    icon: "🧩",
    title: "Auto-generated practice",
    desc: "Every successful run you write becomes a new practice question, saved and organized for you.",
  },
  {
    icon: "⭐",
    title: "Star ratings",
    desc: "Solve on your first try for 5 stars. The more attempts it takes, the lower your rating.",
  },
  {
    icon: "🔒",
    title: "Secure by design",
    desc: "Your code, questions, and progress are safely stored and tied to your account only.",
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <section className="home-hero">
        <span className="home-eyebrow">Online Coding Practice Platform</span>
        <h1 className="home-title">
          Write code. Run it. <span className="accent">Watch it become practice.</span>
        </h1>
        <p className="home-subtitle">
          CodesCastle compiles your code instantly and turns every successful run into a
          practice question — complete with star ratings based on how many attempts it took you
          to get it right.
        </p>

        <div className="home-cta-row">
          {isAuthenticated ? (
            <Link to="/practice" className="home-cta-primary">
              Go to Code Editor
            </Link>
          ) : (
            <>
              <Link to="/signup" className="home-cta-primary">
                Get Started Free
              </Link>
              <Link to="/login" className="home-cta-secondary">
                Log In
              </Link>
            </>
          )}
        </div>

        <div className="home-langs">
          <span className="lang-pill">C</span>
          <span className="lang-pill">C++</span>
          <span className="lang-pill">Java</span>
          <span className="lang-pill">Python</span>
          <span className="lang-pill">JavaScript</span>
        </div>
      </section>

      <section className="home-features">
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.title}>
            <span className="feature-icon">{f.icon}</span>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </section>
    </>
  );
};

export default Home;
