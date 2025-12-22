// hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";

export function useMarkets() {
  return useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      const res = await axiosInstance.get("/market");
      return res.data;
    },
  });
}

export const fetchAgentList = async () => {
  const { data } = await axiosInstance.get(`/agents`);
  return data.agents;
};

export const fetchUserMarket = async () => {
  const { data } = await axiosInstance.get(`/market`);
  return data;
};
