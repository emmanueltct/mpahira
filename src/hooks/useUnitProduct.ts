import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function useUnitProducts() {
  return useQuery({
    queryKey: ["unitProducts"],
    queryFn: async () => {
      const res = await axios.get("/product-units");
      return res.data;
    },
  });
}
