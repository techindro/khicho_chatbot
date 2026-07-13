import { useState, useEffect } from "react";
import Landing from "@pages/Landing";
import Dashboard from "@pages/Dashboard";
import AuthModal from "@components/Authmodal";
import "./index.css";

// Use environment variable for the token
const HF_TOKEN = import.meta.env.VITE_HF_TOKEN || "";

export default function App() {
  const [page, setPage] = useState("landing");
  const [authModal, setAuthModal] = useState(null);
  const [user, setUser] = useState(null);

  // Theme management
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("khicho_theme") || "dark";
  });
  
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("khicho_theme", theme);
  }, [theme]);


  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setAuthModal(null);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setPage("landing");
  };

  return (
    <>
      {page === "landing" && (
        <Landing
          onLogin={() => setAuthModal("login")}
          onSignup={() => setAuthModal("signup")}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
      {page === "dashboard" && user && (
        <Dashboard
          user={user}
          hfToken={HF_TOKEN}
          onLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}
