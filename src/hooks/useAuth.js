import { useState, useCallback } from "react";

/**
 * useAuth — Simulated auth hook
 * Replace the `login` / `signup` methods with real API calls
 * e.g. Firebase Auth, Supabase, or your own backend
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 1200));

      // TODO: Replace with real API call
      // const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.message);

      const mockUser = {
        id: `user_${Date.now()}`,
        name: email.split("@")[0],
        email,
        avatar: null,
        plan: "free",
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
      return { success: true, user: mockUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 1400));

      // TODO: Replace with real API call
      const mockUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        avatar: null,
        plan: "free",
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
      return { success: true, user: mockUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const socialLogin = useCallback(async (provider) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const mockUser = {
        id: `user_${Date.now()}`,
        name: provider === "google" ? "Google User" : "GitHub User",
        email: `user@${provider}.com`,
        avatar: null,
        plan: "free",
        provider,
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
      return { success: true, user: mockUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  return { user, loading, error, login, signup, socialLogin, logout };
}
