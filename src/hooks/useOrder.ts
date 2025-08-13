import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
// import { OrderItem, Order } from '@/types/Order';
import axiosInstance from '@/lib/axios';
import { useRouter } from "next/navigation"; // If using Next.js 13+


export const useOrder = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch Order


const orderQuery = useQuery({
  queryKey: ['Order'],
  queryFn: async () => {
    const res = await axiosInstance.get('/Orders');
    console.log("===============================================================",res.data.Orders)
    return res.data.Orders;
  },
  enabled: false, // disable auto fetch on mount
});

// When you want to fetch:
// orderQuery.refetch();



  // Add to Order

  const addToOrder = useMutation({
  mutationFn: async (item) => {
    const response = await axiosInstance.post("/Orders", item);
    return response.data;
  },
  onSuccess: (data) => {
     queryClient.invalidateQueries({ queryKey: ['Order'] });
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
  
  const updateOrderItem = useMutation({
    mutationFn: async ({productId,quantity}:{productId: string; quantity: number;}) => {
      const res = await axiosInstance.patch('/Orders/update', {
        productId:productId,
        quantity:quantity,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Order'] });
    },
    onError: (error) => {
      console.error('Error updating Order item:', error);
    },
  });

  // Remove item from Order
  const removeFromOrder = useMutation({
    mutationFn: async(productId: string) => await axiosInstance.delete(`/Orders/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Order'] });
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
    orderQuery,
    addToOrder,
    updateOrderItem,
    removeFromOrder,
    clientCheckout
  };
};
function async(arg0: { productId: any; quantity: any; }): import("@tanstack/query-core").MutationFunction<unknown, void> | undefined {
    throw new Error('Function not implemented.');
}

