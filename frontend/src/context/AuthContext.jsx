import { useState, useEffect } from "react";
import { getCurrentFarmer } from "../api/auth";
import { AuthContext } from "./AuthStateContext";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("farmy_token") || null);
  const [farmer, setFarmer] = useState(() => {
    try {
      const stored = localStorage.getItem("farmy_farmer");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  function logout() {
    setToken(null);
    setFarmer(null);
    localStorage.removeItem("farmy_token");
    localStorage.removeItem("farmy_farmer");
  }

  // Validate stored token on mount
  useEffect(() => {
    async function verifySession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getCurrentFarmer();
        if (res.success && res.farmer) {
          setFarmer(res.farmer);
          localStorage.setItem("farmy_farmer", JSON.stringify(res.farmer));
        }
      } catch (err) {
        console.warn("Session check failed, logging out:", err.message);
        logout();
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [token]);

  const login = (newToken, farmerData) => {
    setToken(newToken);
    setFarmer(farmerData);
    localStorage.setItem("farmy_token", newToken);
    localStorage.setItem("farmy_farmer", JSON.stringify(farmerData));
  };

  const updateFarmer = (farmerData) => {
    setFarmer(farmerData);
    localStorage.setItem("farmy_farmer", JSON.stringify(farmerData));
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        farmer,
        isAuthenticated: !!token,
        loading,
        login,
        updateFarmer,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
