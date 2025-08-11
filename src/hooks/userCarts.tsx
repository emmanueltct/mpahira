import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CartItem, Cart } from '@/types/cart';
import axiosInstance from '@/lib/axios';

export const useCart = () => {
  const queryClient = useQueryClient();

  // Fetch cart
  const cartQuery = useQuery<Cart[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await axiosInstance.get('/carts');
      localStorage.setItem('carts',JSON.stringify(res.data.carts ))
      return res.data.carts;
    },
  });

  // Add to cart

  const addToCart = useMutation({
  mutationFn: async (item: CartItemPayload) => {
    const response = await axiosInstance.post("/carts", item);
    return response.data;
  },
  onSuccess: (data) => {
     queryClient.invalidateQueries({ queryKey: ['cart'] });
    if (data.message) {
   
      toast.success(data.message)
    
    }
  },
  onError: (error: any) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      if (message) {
        toast.error(message)
      }
    }
  },
});
  
  const updateCartItem = useMutation({
    mutationFn: async ({productId,quantity}:{productId: string; quantity: number;}) => {
      const res = await axiosInstance.patch('/carts/update', {
        productId:productId,
        quantity:quantity,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error updating cart item:', error);
    },
  });

  // Remove item from cart
  const removeFromCart = useMutation({
    mutationFn: async(productId: string) => await axiosInstance.delete(`/carts/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const clientCheckout= useMutation({
    mutationFn: async() => await axiosInstance.post(`/orders`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    cartQuery,
    addToCart,
    updateCartItem,
    removeFromCart,
    clientCheckout
  };
};
function async(arg0: { productId: any; quantity: any; }): import("@tanstack/query-core").MutationFunction<unknown, void> | undefined {
    throw new Error('Function not implemented.');
}

