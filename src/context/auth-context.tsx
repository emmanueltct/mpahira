"use client";

import { createContext, useState, useEffect, useContext } from "react";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Buyer" | "admin" | "seller";
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthContextType = {
  user: User | null;
  tokens: Tokens | null;
  login: (userData: User, tokens: Tokens) => void;
  logout: () => void;
};

// Create the context
export const AuthContext = createContext<AuthContextType | null>(null);

// Create and export the useAuth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider definition
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedTokens = localStorage.getItem("tokens");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedTokens) setTokens(JSON.parse(storedTokens));
  }, []);

  const login = (userData: User, tokensData: Tokens) => {
    setUser(userData);
    setTokens(tokensData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("refresh_token", JSON.stringify(tokensData.refreshToken));
    localStorage.setItem("access_token", JSON.stringify(tokensData.accessToken));
     localStorage.setItem("tokens", JSON.stringify(tokensData));
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
  };

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
