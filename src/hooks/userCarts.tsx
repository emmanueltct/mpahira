import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CartItem, Cart } from '@/types/cart';
import axiosInstance from '@/lib/axios';
import { useRouter } from "next/navigation"; // If using Next.js 13+


export const useCart = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch cart


const cartQuery = useQuery({
  queryKey: ['cart'],
  queryFn: async () => {
    const res = await axiosInstance.get('/carts');
    console.log("===============================================================",res.data.carts)
    return res.data.carts;
  },
  enabled:options?.enabled, // disable auto fetch on mount
});

// When you want to fetch:
// cartQuery.refetch();



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
    //console.log("00000000000000000000000000000000000000000",error)
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
    mutationFn: async (item) => {
      const { data } = await axiosInstance.post(
        "/payments/start-mobilemoney-payment",
        item
      );
      return data;
    },
    onSuccess: (data) => {
      ///console.log("Payment response:", data.success);

         if (data?.status === "success") {
        toast.success(
          "Thank you for working with us. We will review your order and deliver shortly."
        );

        if (data?.redirect_url) {
          router.push(data.redirect_url);
        }
      } else {
        toast.error("Payment could not be processed. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Payment error:", error);
      toast.error("Something went wrong while processing your payment.");
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

