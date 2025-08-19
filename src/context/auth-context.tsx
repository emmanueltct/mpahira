"use client";

import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axiosInstance from "@/lib/axios";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "buyer" | "admin" | "seller"|"agent";
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthContextType = {
  user: User | null;
  tokens: Tokens | null;
  login: (userData: User, tokens: Tokens) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);

  // Load from storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedTokens = localStorage.getItem("tokens");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedTokens) setTokens(JSON.parse(storedTokens));

    // 👇 listen for forced logout from axios interceptors
    const handleLogoutEvent = () => {
      setUser(null);
      setTokens(null);
      Cookies.remove("user");
    };
    window.addEventListener("logout", handleLogoutEvent);

    return () => {
      window.removeEventListener("logout", handleLogoutEvent);
    };
  }, []);

  const login = (userData: User, tokensData: Tokens) => {
    setUser(userData);
    setTokens(tokensData);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("tokens", JSON.stringify(tokensData));

    // 👇 sync user to cookie for middleware
    Cookies.set("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setTokens(null);

    localStorage.removeItem("user");
    localStorage.removeItem("tokens");

    Cookies.remove("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        login,
        logout,
        isAuthenticated: !!tokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
