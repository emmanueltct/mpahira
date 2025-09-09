"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios"; // adjust path
import { useRouter } from "next/navigation";

export const useUserProfile = () => {
  const router = useRouter();

  const getUserProfile = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/profile");
        const user = res.data?.user;

        if (!user) {
          localStorage.removeItem("user");
          router.push("/login");
          return null;
        }

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem(
            "tokens",
            JSON.stringify({
              accessToken: res.data.user.accessToken,
              refreshToken: res.data.user.refreshToken,
            })
          );
          localStorage.setItem("refreshToken", res.data.user.refreshToken);

        if(res.data.user.role.role==="Buyer"){
            router.push(`/products`);
          }else{
            if(res.data?.user?.role?.role){
              const role=res.data?.user?.role?.role;
              router.push(`/${role.toLowerCase()}/dashboard`);
            }else{
               router.push(`/`);
            }
            
          }

        // Check if Google user has no password
        if (user.isGoogleLogin && !user.hasPassword) {
          router.push("/complete-profile"); // page where user sets password & phone
        }

        // Check if phone is missing
        if (!user.telephone) {
          router.push("/complete-profile");
        }

        return user;
      } catch (err: any) {
        // Invalid token or session expired → logout
        localStorage.removeItem("user");
        router.push("/login");
        throw err;
      }
    },
    enabled: false, // only fetch when manually triggered
    retry: false,   // don’t retry on failure (avoid redirect loops)
  });

  return getUserProfile;
};
