import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  productId: string;
  isApproved: boolean;
}

export const useReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product-reviews");
      return res.data.data as Review[];
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Review, "id" | "isApproved">) =>
      axiosInstance.post("/product-reviews", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
