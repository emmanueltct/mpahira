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
import { Textarea } from "@/components/ui/textarea";
import { useUnitProducts } from "@/hooks/useUnitProduct";

type AddSubUnitProductProps = {
   isSubUnitModalOpen: boolean;
onCloseSubUnit: () => void;
};

const AddSubUnitProduct: React.FC<AddSubUnitProductProps> = ({
   isSubUnitModalOpen,
onCloseSubUnit,
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    unitId: "",
    subUnit: "",
    description: "",
  });

  // ✅ mutation for adding sub-unit product
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: {
      unitId: string;
      subUnit: string;
      description?: string;
    }) => {
      const { data } = await axiosInstance.post("/sub-units", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Sub-unit created successfully!");
      queryClient.invalidateQueries({ queryKey: ["product-units"] });
      setFormData({ unitId: "", subUnit: "", description: "" });
    onCloseSubUnit();
    },
    onError: (error: any) => {
      if (error.response && error.response.data) {
        const { message, errors } = error.response.data;

        toast.error(message);

        if (errors) {
          Object.entries(errors).forEach(([field, err]: any) => {
            if (err._errors && err._errors.length > 0) {
              toast.error(`${field}: ${err._errors.join(", ")}`);
            }
          });
        }
      } else {
        toast.error("Unexpected error");
      }
    },
  });

  // ✅ fetch unit products (parent units)
  const {
    data: unitProducts = [],
    isLoading,
    error,
  } = useUnitProducts();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.unitId) {
      toast.error("Please select a unit product");
      return;
    }
    if (!formData.subUnit.trim()) {
      toast.error("Sub-unit name is required");
      return;
    }
    mutate(formData);
  };

  return (
    <Dialog open={ isSubUnitModalOpen} onOpenChange={onCloseSubUnit}>
      <DialogContent className="max-w-md w-full rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>Add Sub-Unit</DialogTitle>
          <DialogDescription>
            Create a new sub-unit under a unit product.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* ✅ UnitProduct dropdown */}
          <select
            name="unitId"
            value={formData.unitId}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">-- Select Unit Product --</option>
            {unitProducts.map((unit: any) => (
              <option key={unit.id} value={unit.id}>
                {unit.unitProduct}
              </option>
            ))}
          </select>

          {/* ✅ Sub-unit name */}
          <Input
            type="text"
            name="subUnit"
            placeholder="Enter sub-unit name"
            value={formData.subUnit}
            onChange={handleChange}
            className="w-full"
          />

          {/* ✅ Optional description */}
          <Textarea
            name="description"
            placeholder="Enter description (optional)"
            value={formData.description}
            onChange={handleChange}
            className="w-full"
          />

          <DialogFooter className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCloseSubUnit}>
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

export default AddSubUnitProduct;
