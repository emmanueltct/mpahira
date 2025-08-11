// hooks/useSubmitProduct.ts
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import axios from "axios";

export const useCreateShopProduct = () => {
    const tokensData = localStorage.getItem('tokens');
    const token=JSON.parse(tokensData as string);
  return useMutation({
  mutationFn: async (formData: FormData) => {

    const res = await axios.post(
      'http://localhost:5500/api/shop-products',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token?.accessToken}`,
        },
      }
    );
    return res.data;
  },
});
}
