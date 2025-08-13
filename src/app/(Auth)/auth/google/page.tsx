"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axios";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const accessToken = searchParams.get("accessToken");

      if (accessToken) {
        try {
          // Save token in localStorage
          localStorage.setItem("accessToken", accessToken);

          // Fetch logged-in user profile
          const res= await axiosInstance.get("/auth/profile", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          console.log("0000000000000000000000000000000000000000000",res.data.user.accessToken)

           localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("tokens", JSON.stringify({accessToken:res.data.user.accessToken, refreshToken:res.data.user.refreshToken}));
            localStorage.setItem("accessToken", res.data.user.accessToken);
              
             toast.success("Google login successful!");
             router.push(`/${res.data.user.role.role}/dashboard`);
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to fetch profile");
          //router.push("/login");
        }
      } else {
        toast.error("Google login failed: tokens missing");
        router.push("/login");
      }
    };

    handleGoogleCallback();
  }, [searchParams, router]);

  return <div>Logging in with Google...</div>;
}
