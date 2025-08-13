"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "buyer" | "admin" | "seller";
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

// Hook for using auth
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);

  // Load from localStorage on mount
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
    localStorage.setItem("tokens", JSON.stringify(tokensData));
    localStorage.setItem("accessToken", tokensData.accessToken);
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for logged-in user profile
export const useLoggedInUserProfile = () => {
  return useQuery({
    queryKey: ["loggedinUserProfile"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found in localStorage");
      }
      const res = await axiosInstance.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!localStorage.getItem("accessToken"),
  });
};
