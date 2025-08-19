"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type MarketModalProps = {
  isModalOpen: boolean;
  onClose: () => void;
};

const MarketModal: React.FC<MarketModalProps> = ({
  isModalOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    marketName: "",
    province: "",
    district: "",
    sector: "",
    classification: "",
    locationLatitude: "",
    locationLongitude: "",
    googleMapCoordinate: "",
    marketThumbnail: null as File | null,
  });

  // ✅ Get current user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            locationLatitude: pos.coords.latitude.toString(),
            locationLongitude: pos.coords.longitude.toString(),
            googleMapCoordinate: `${pos.coords.latitude}-${pos.coords.longitude}`,
          }));
        },
        (err) => {
          toast.error("Unable to fetch location");
          console.error(err);
        }
      );
    }
  }, []);

  // ✅ Mutation to create market
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: typeof formData) => {
      const formDataObj = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value) {
          formDataObj.append(key, value as any);
        }
      });

      const { data } = await axiosInstance.post("/market", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      toast.success("New Market created successfully!");
      queryClient.invalidateQueries({ queryKey: ["markets"] });
      setFormData({
        marketName: "",
        province: "",
        district: "",
        sector: "",
        classification: "",
        locationLatitude: "",
        locationLongitude: "",
        googleMapCoordinate: "",
        marketThumbnail: null,
      });
      onClose();
    },
    onError: (error: any) => {
      const validationErrors = error?.response?.data?.errors;
      if (Array.isArray(validationErrors)) {
        validationErrors.forEach((err: any) => toast.error(err.message));
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.marketName.trim()) {
      toast.error("Market name is required");
      return;
    }
    mutate(formData);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>Add Market</DialogTitle>
          <DialogDescription>
            Create a new market and provide its details. Location will be
            auto-filled from your current position.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input
            type="text"
            name="marketName"
            placeholder="Market Name"
            value={formData.marketName}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="province"
            placeholder="Province"
            value={formData.province}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="district"
            placeholder="District"
            value={formData.district}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="sector"
            placeholder="Sector"
            value={formData.sector}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="classification"
            placeholder="Classification"
            value={formData.classification}
            onChange={handleChange}
          />

          {/* Thumbnail Upload */}
          <Input
            type="file"
            name="marketThumbnail"
            accept="image/*"
            onChange={handleChange}
          />

          {/* Read-only location preview */}
          <div className="text-sm text-gray-600">
            📍 Lat: {formData.locationLatitude || "Fetching..."} | Lng:{" "}
            {formData.locationLongitude || "Fetching..."}
          </div>

          <DialogFooter className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MarketModal;
