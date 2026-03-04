import { useState } from "react";
import Landing from "@pages/Landing";
import Dashboard from "@pages/Dashboard";
import AuthModal from "@components/AuthModal";
import "./index.css";

// 👇 STEP 1 — Apna token yahan paste karo
const HF_TOKEN = "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";

export default function App() {
  const [page, setPage] = useState("landing");
  const [authModal, setAuthModal] = useState(null);
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
          hfToken={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}  // 👈 STEP 2 — token pass karo
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
