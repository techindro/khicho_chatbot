import { useState } from "react";
import Landing from "@pages/Landing";
import Dashboard from "@pages/Dashboard";
import AuthModal from "@components/AuthModal";
import "./index.css";

/**
 * App — Root component managing routing and auth state
 *
 * Page flow:
 *   landing → (auth modal) → dashboard
 *
 * To add real routing, replace this with <BrowserRouter> + <Routes>
 * and use React Router's <Route> components.
 */
export default function App() {
  const [page, setPage] = useState("landing"); // "landing" | "dashboard"
  const [authModal, setAuthModal] = useState(null); // null | "login" | "signup"
  const [user, setUser] = useState(null);

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
        />
      )}

      {page === "dashboard" && user && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
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
