import React, { createContext, useState, useContext, useEffect } from "react";
import { checkAuthStatus } from "./CheckAuthStatus.js";
import { clearAuthCookies, getRole } from "./CookiesUtils.js";

// Create a context for the authentication state
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRole, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const status = await checkAuthStatus();
      setIsAuthenticated(status);
      setRole(getRole())
    };

    checkAuth();
  }, []);

  const logout = () => {
    clearAuthCookies();
    setIsAuthenticated(false);
    localStorage.clear();
    setRole(null)
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, hasRole, setIsAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
