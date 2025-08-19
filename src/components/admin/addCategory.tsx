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

type ProductCategoryModalProps = {
  isModalOpen: boolean;
  onClose: () => void;
};

const ProductCategoryModal: React.FC<ProductCategoryModalProps> = ({
  isModalOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    product: "",
  });

  // ✅ mutation for adding category
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: { product: string }) => {
      const { data } = await axiosInstance.post("/products", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setFormData({ product: "" });
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
    const { name, value } = e.target; // ✅ use "name"
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product.trim()) {
      toast.error("Category name is required");
      return;
    }
    mutate(formData);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>Add Product Category</DialogTitle>
          <DialogDescription>
            Create a new product category to organize your products.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input
            type="text"
            name="product" // ✅ matches formData key
            placeholder="Enter category name"
            value={formData.product}
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

export default ProductCategoryModal;
