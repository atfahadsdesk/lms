import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("lms_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setStudent(res.data.student))
      .catch(() => {
        localStorage.removeItem("lms_token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  function login(newToken, newStudent) {
    localStorage.setItem("lms_token", newToken);
    setToken(newToken);
    setStudent(newStudent);
  }

  function logout() {
    localStorage.removeItem("lms_token");
    setToken(null);
    setStudent(null);
  }

  return (
    <AuthContext.Provider value={{ student, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
