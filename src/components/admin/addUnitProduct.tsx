"use client";

import React, { useState } from "react";
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
import { Textarea } from "../ui/textarea";

type UnitCategoryModalProps = {
  isModalOpen: boolean;
  onClose: () => void;
};

const UnitCategoryModal: React.FC<UnitCategoryModalProps> = ({
  isModalOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    unitProduct: "",
    unitProductDescription: "",
  });

  // ✅ mutation for adding unit category
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: {
      unitProduct: string;
      unitProductDescription: string;
    }) => {
      const { data } = await axiosInstance.post("/product-units", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Unit category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["product-units"] });
      setFormData({ unitProduct: "", unitProductDescription: "" });
      onClose();
    },
    onError: (error: any) => {
      
        if (error.response && error.response.data) {
            const { message, errors } = error.response.data;

            // General error message
           toast.error(message);

            // Detailed validation errors
            Object.entries(errors).forEach(([field, err]: any) => {
            if (err._errors && err._errors.length > 0) {
               toast.error(`${field}: ${err._errors.join(", ")}`);
            }
            });
        } else {
           toast.error("Unexpected error", error);
        }
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.unitProduct.trim()) {
      toast.error("Unit name is required");
      return;
    }
    mutate(formData);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>Add Unit Category</DialogTitle>
          <DialogDescription>
            Create a new unit category to organize your units and pricing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input
            type="text"
            name="unitProduct"
            placeholder="Enter unit category name"
            value={formData.unitProduct}
            onChange={handleChange}
            className="w-full"
          />

          <Textarea
            name="unitProductDescription"
            placeholder="Enter description"
            value={formData.unitProductDescription}
            onChange={handleChange}
            className="w-full"
          />

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

export default UnitCategoryModal;
