import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentFarmer } from "../api/auth";

const AuthContext = createContext(null);

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

  const logout = () => {
    setToken(null);
    setFarmer(null);
    localStorage.removeItem("farmy_token");
    localStorage.removeItem("farmy_farmer");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        farmer,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
