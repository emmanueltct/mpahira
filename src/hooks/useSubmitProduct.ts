// hooks/useSubmitProduct.ts]import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";


export const useCreateShopProduct = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Access localStorage inside mutationFn - only runs on client
      const tokensData = typeof window !== 'undefined' ? localStorage.getItem('tokens') : null;
      const token = tokensData ? JSON.parse(tokensData) : null;

      const res = await axiosInstance.post(
        '/shop-products',
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

// ------------------ DELETE ------------------
export function useDeleteShopProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`/shop-products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-products"] });
    },
  })
}

// ------------------ UPDATE ------------------
export function useUpdateShopProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      console.log("Update payload:", data);
      const res = await axiosInstance.patch(`/shop-products/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-products"] });
    },
  });
}

// ⬇️ Fetch single product by ID
export function useGetProductById(productId: string | null) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) return null;
      const { data } = await axiosInstance.get(`/shop-products/${productId}`);
      return data;
    },
    enabled: !!productId, // only fetch when id exists
  });
}