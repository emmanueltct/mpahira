import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios"; // your configured axios instance

type LocationPayload = {
  type: "current" | "manual";
  location:{ locationLongitude: string; locationLatitude: string; googleMapCoordinate: string; streetNumber: string; nearestLandmark: string; locationDescription: string; }
};

export const useSaveLocation = () => {
   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LocationPayload) => {
        console.log(data)
      const response = await axiosInstance.post("/delivery-locations", data.location);
      return response.data;
    },
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
