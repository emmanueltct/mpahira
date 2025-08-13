"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axios";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const accessToken = searchParams.get("accessToken");

      if (accessToken) {
        try {
          setLoading(true);

          // Save token in localStorage
          localStorage.setItem("accessToken", accessToken);

          // Fetch logged-in user profile
          const res = await axiosInstance.get("/auth/profile", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem(
            "tokens",
            JSON.stringify({
              accessToken: res.data.user.accessToken,
              refreshToken: res.data.user.refreshToken,
            })
          );
          localStorage.setItem("accessToken", res.data.user.accessToken);

          toast.success("Google login successful!");
          if(res.data.user.role.role==="Buyer"){
            router.push(`/products`);
          }else{
            router.push(`/${res.data.user.role.role}/dashboard`);
          }
          
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to fetch profile");
          router.push("/login");
        } finally {
          setLoading(false);
        }
      } else {
        toast.error("Google login failed: tokens missing");
        router.push("/login");
      }
    };

    handleGoogleCallback();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Logging in with Google...</p>
      </div>
    );
  }

  return null;
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Preparing Google login...</p>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
