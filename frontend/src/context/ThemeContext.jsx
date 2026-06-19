// ============================================
// FILE: frontend/src/context/ThemeContext.jsx
// PURPOSE: Manages the light/dark theme toggle (the moon icon button
// seen in all screenshots, top-right of the navbar). The chosen
// theme is persisted in localStorage and applied via a
// `data-theme="dark"` attribute on the <html> element, which the
// CSS variables in styles/theme.css respond to.
// ============================================

import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContextObject";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("cd_theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cd_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
