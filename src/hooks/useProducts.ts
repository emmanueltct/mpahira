// hooks/useProducts.ts

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export const useProducts = (filters: {
  category?: string;
  market?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/shop-products', {
        params: filters,
      });
      return data;
    },
    keepPreviousData: true,
  });
};


export const useSingleProduct = (id: string) => {
  return useQuery({
    queryKey: ["singleProduct", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/shop-products/${id}`);
      return data;
    },
    keepPreviousData: true,
    enabled: !!id, // only run when id exists
  });
};