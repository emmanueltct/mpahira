"use client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

interface DecodedToken {
  exp: number;
}

let isRefreshing = false;

// Request interceptor: attach/refresh tokens
axiosInstance.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") return config; // SSR-safe

  const tokenStr = localStorage.getItem("tokens");
  if (!tokenStr) return config; // no tokens = public request

  const { accessToken, refreshToken } = JSON.parse(tokenStr);
  const decoded: DecodedToken = jwtDecode(accessToken);
  const now = Date.now() / 1000;

  // expired token → refresh
  if (decoded.exp < now) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        } = res.data.token;

        localStorage.setItem(
          "tokens",
          JSON.stringify({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          })
        );

        if (config.headers) {
          config.headers.Authorization = `Bearer ${newAccessToken}`;
        }
      } catch (err) {
        // refresh failed → logout
        handleLogout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
  } else {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

// Response interceptor: catch 401/403 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if ([401, 403].includes(status)) {
      handleLogout();
    }

    return Promise.reject(error);
  }
);

// ✅ Centralized logout handler (prevents infinite loops)
function handleLogout() {
  if (typeof window !== "undefined") {
    const isOnLoginPage = window.location.pathname === "/login";

    localStorage.removeItem("tokens");
    window.dispatchEvent(new Event("logout"));

    if (!isOnLoginPage) {
      // redirect only if not already on login
      window.location.href = "/login";
    }
  }
}

export default axiosInstance;
