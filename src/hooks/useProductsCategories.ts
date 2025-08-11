// hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function useProductsCategory() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("/products");
      return res.data;
    },
  });
}
