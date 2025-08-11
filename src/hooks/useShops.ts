// hooks/useShops.ts
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios"; // Adjust import path
import { useEffect, useState } from "react";

export function useShops() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserId(parsedUser?.id || parsedUser?.user?.id || null); // Adjust based on your structure
      }
    }
  }, []);

  return useQuery({
    queryKey: ["shops", userId],
    enabled: !!userId, // Ensures query runs only when userId is available
    queryFn: async () => {
      const res = await axiosInstance.get(`/shop/sellers/${userId}`);
      return res.data;
    },
  });
}
