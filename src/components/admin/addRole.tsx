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

type roleCategoryModalProps = {
  isModalOpen: boolean;
  onClose: () => void;
};

const RoleCategoryModal: React.FC<roleCategoryModalProps> = ({
  isModalOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    role: "",
  });

  // ✅ mutation for adding category
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: { role: string }) => {
      const { data } = await axiosInstance.post("/roles", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("New Role created successfully!");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setFormData({ role: "" });
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
    if (!formData.role.trim()) {
      toast.error("Role name is required");
      return;
    }
    mutate(formData);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>Add role Category</DialogTitle>
          <DialogDescription>
            Create a new role category to organize users and easily manage their access levels.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input
            type="text"
            name="role" // ✅ matches formData key
            placeholder="Enter role name"
            value={formData.role}
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

export default RoleCategoryModal;
