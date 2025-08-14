"use client";

import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth'; // your auth context

export function GoogleLoginButton() {
  const router = useRouter();
  const { login } = useAuth();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Send tokenResponse.access_token to your backend to verify & get user
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/token`, {
          access_token: tokenResponse.access_token,
        });

        const { user, tokens } = res.data;

        login(user, tokens);
        toast.success('Google login successful');

        if (user.role !== 'buyer') {
          router.push(`/${user.role}/dashboard`);
        } else {
          router.push('/');
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Google login failed');
      }
    },
    onError: () => {
      toast.error('Google login failed');
    },
  });

  return (
    <button onClick={() => loginWithGoogle()} className="btn-google-login">
      Sign in with Google
    </button>
  );
}
