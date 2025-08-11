"use client";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

interface DecodedToken {
  exp: number;
}

let isRefreshing = false;

// Add request interceptor
axiosInstance.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') return config; // SSR-safe

  const tokenStr = localStorage.getItem('tokens');
  if (!tokenStr) return config;

  const { accessToken, refreshToken } = JSON.parse(tokenStr);
  const decoded: DecodedToken = jwtDecode(accessToken);
  const now = Date.now() / 1000;

  if (decoded.exp < now) {
    if (isRefreshing) return config;

    isRefreshing = true;
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
        refreshToken,
      });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.token;
      localStorage.setItem('tokens', JSON.stringify({ accessToken: newAccessToken, refreshToken: newRefreshToken }));

      if (config.headers) {
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      }
    } catch (err) {
      localStorage.removeItem('tokens');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('logout'));
      }

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  } else {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if ([401, 403].includes(status)) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tokens');
        window.dispatchEvent(new Event('logout'));
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
