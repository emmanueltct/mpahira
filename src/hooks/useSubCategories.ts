import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function useSubCategories () {
  return useQuery({
    queryKey: ["products-sub-categories"],
    queryFn: async () => {
      const res = await axios.get("/product-subcategories");
      return res.data;
    },
  });
}
