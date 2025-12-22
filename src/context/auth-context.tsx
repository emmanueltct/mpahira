"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type Role = "buyer" | "admin" | "seller" | "agent" | string;

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    id: string;
    role: Role;
  };
};


export type UserData= {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role:string
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthContextType = {
  user: UserData | null;
  tokens: Tokens | null;
  login: (userData: UserData, tokensData: Tokens) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean; // NEW
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [loading, setLoading] = useState(true); // track initial loading

  // Load user & tokens from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedTokens = localStorage.getItem("tokens");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedTokens) setTokens(JSON.parse(storedTokens));

    setLoading(false); // done loading

    // Listen for forced logout
    const handleLogoutEvent = () => logout();
    window.addEventListener("logout", handleLogoutEvent);

    return () => window.removeEventListener("logout", handleLogoutEvent);
  }, []);

  const login = (userData:UserData, tokensData: Tokens) => {
    setUser(userData);
    setTokens(tokensData);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("tokens", JSON.stringify(tokensData));

    // Store minimal info in cookie for middleware
    Cookies.set("user", JSON.stringify({ id: userData.id, role: userData.role }));

    // Redirect after login
    if (userData.role !== "buyer") {
      router.push(`/${userData.role.toLowerCase()}/dashboard`);
    } else {
      router.push("/");
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);

    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
    Cookies.remove("user");

    router.push("/login"); // redirect after logout
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        login,
        logout,
        isAuthenticated: !!tokens,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
