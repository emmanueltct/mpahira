// hooks/useSubmitProduct.ts]import { useMutation } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useCreateShopProduct = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Access localStorage inside mutationFn - only runs on client
      const tokensData = typeof window !== 'undefined' ? localStorage.getItem('tokens') : null;
      const token = tokensData ? JSON.parse(tokensData) : null;

      const res = await axios.post(
        'http://localhost:5500/api/shop-products',
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token.accessToken}` : '',
          },
        }
      );

      return res.data;
    },
  });
};

