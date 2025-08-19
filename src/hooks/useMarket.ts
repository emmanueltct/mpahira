// hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function useMarkets() {
  return useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      const res = await axios.get("/market");
      return res.data;
    },
  });
}
