"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaTrash } from "react-icons/fa";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface Unit {
  id: string;
  unitProduct: string;
  unitProductDescription?: string;
}

interface SubUnit {
  id: string;
  subUnit: string;
  subUnitDescription: string;
  unitId: string;
}

interface ProductPricing {
  id: string;
  unit?: { id: string; unitProduct: string; unitProductDescription: string };
  subUnit?: { id: string; subUnit: string; subUnitDescription: string };
  minPrice?: number;
  maxPrice?: number;
  unitPrice?: number;
  isDefaultSelection: boolean;
}

interface AddSubUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productUnities: ProductPricing[];
}

export default function ProductPricingModal({
  isOpen,
  onClose,
  productId,
  productUnities,
}: AddSubUnitModalProps) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    id: "",
    unitId: "",
    subUnitId: "",
    minPrice: "",
    maxPrice: "",
    unitPrice: "",
    isDefaultSelection: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /** ✅ Fetch Units */
  const { data: units = [] } = useQuery<Unit[]>({
    queryKey: ["units"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product-units");
      return res.data ?? [];
    },
    enabled: isOpen,
  });

  /** ✅ Fetch SubUnits */
  const { data: subUnits = [] } = useQuery<SubUnit[]>({
    queryKey: ["subUnits", form.unitId],
    queryFn: async () => {
      if (!form.unitId) return [];
      const res = await axiosInstance.get(`/product-units/${form.unitId}`);
      return res.data?.subUnits ?? [];
    },
    enabled: !!form.unitId,
  });

  const selectedSubUnit = subUnits.find((s) => s.id === form.subUnitId);

  /** ✅ Reset form when modal closes */
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setForm({
      id: "",
      unitId: "",
      subUnitId: "",
      minPrice: "",
      maxPrice: "",
      unitPrice: "",
      isDefaultSelection: false,
    });
  };

  /** ✅ Mutations */
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post("/product-pricing", data);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Saved successfully");
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Save failed");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.put(`/product-pricing/${form.id}`, data);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Update failed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`/product-pricing/${id}`);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Delete failed");
    },
  });

  /** ✅ Validation */
  const validateForm = (): boolean => {
    if (!form.unitId) {
      toast.error("Please select a Unit");
      return false;
    }
    if (!form.subUnitId) {
      toast.error("Please select a SubUnit");
      return false;
    }

    if (selectedSubUnit) {
      if (selectedSubUnit.subUnit === "Qty" && !form.minPrice) {
        toast.error("Minimum Price is required for Qty");
        return false;
      }
      if (selectedSubUnit.subUnit === "item") {
        if (!form.minPrice || !form.maxPrice) {
          toast.error("Both Min and Max Price are required for Item");
          return false;
        }
        if (Number(form.minPrice) > Number(form.maxPrice)) {
          toast.error("Min Price cannot be greater than Max Price");
          return false;
        }
      }
      if (
        selectedSubUnit.subUnit !== "Qty" &&
        selectedSubUnit.subUnit !== "item" &&
        !form.unitPrice
      ) {
        toast.error("Unit Price is required");
        return false;
      }
    }

    return true;
  };

  /** ✅ Handle Save / Update */
  const handleSubmit = () => {
    if (!validateForm()) return;

    const payload = {
      productId,
      unitId: form.unitId,
      subUnitId: form.subUnitId,
      minPrice: form.minPrice ? Number(form.minPrice) : null,
      maxPrice: form.maxPrice ? Number(form.maxPrice) : null,
      unitPrice: form.unitPrice ? Number(form.unitPrice) : null,
      isDefaultSelection: form.isDefaultSelection,
    };

    if (form.id) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  /** ✅ Handle Edit */
  const handleEdit = (unit: ProductPricing) => {
    setForm({
      id: unit.id,
      unitId: unit.unit?.id || "",
      subUnitId: unit.subUnit?.id || "",
      minPrice: unit.minPrice ? String(unit.minPrice) : "",
      maxPrice: unit.maxPrice ? String(unit.maxPrice) : "",
      unitPrice: unit.unitPrice ? String(unit.unitPrice) : "",
      isDefaultSelection: unit.isDefaultSelection,
    });
  };

  /** ✅ Handle Delete */
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this pricing?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-2/3 overflow-y-auto no-scrollbar ">
        <DialogHeader>
          <DialogTitle>
            {form.id ? "Edit SubUnit Pricing" : "Add SubUnit Pricing"}
          </DialogTitle>
        </DialogHeader>

        {/* ✅ FORM */}
        <div className="space-y-4">
          {/* Unit Select */}
          <div>
            <Label>Unit</Label>
            <select
              className="w-full border rounded-md p-2"
              value={form.unitId}
              onChange={(e) => handleChange("unitId", e.target.value)}
            >
              <option value="">Select Unit</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.unitProduct}
                </option>
              ))}
            </select>
          </div>

          {/* SubUnit Select */}
          {form.unitId && (
            <div>
              <Label>SubUnit</Label>
              <select
                className="w-full border rounded-md p-2"
                value={form.subUnitId}
                onChange={(e) => handleChange("subUnitId", e.target.value)}
              >
                <option value="">Select SubUnit</option>
                {subUnits.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.subUnit} ({s.subUnitDescription})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Dynamic Pricing Inputs */}
          {selectedSubUnit && (
            <>
              {selectedSubUnit.subUnit === "Qty" && (
                <div>
                  <Label>Set Minimum Price</Label>
                  <Input
                    type="number"
                    value={form.minPrice}
                    onChange={(e) => handleChange("minPrice", e.target.value)}
                  />
                </div>
              )}

              {selectedSubUnit.subUnit === "item" && (
                <>
                  <div>
                    <Label>Min Price</Label>
                    <Input
                      type="number"
                      value={form.minPrice}
                      onChange={(e) => handleChange("minPrice", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Max Price</Label>
                    <Input
                      type="number"
                      value={form.maxPrice}
                      onChange={(e) => handleChange("maxPrice", e.target.value)}
                    />
                  </div>
                </>
              )}

              {selectedSubUnit.subUnit !== "Qty" &&
                selectedSubUnit.subUnit !== "item" && (
                  <div>
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      value={form.unitPrice}
                      onChange={(e) => handleChange("unitPrice", e.target.value)}
                    />
                  </div>
                )}

              {/* Default selection */}
              <div className="flex items-center space-x-2">
                <input
                  id="defaultSelection"
                  type="checkbox"
                  checked={form.isDefaultSelection}
                  onChange={(e) =>
                    handleChange("isDefaultSelection", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="defaultSelection">Set as Default Selection</Label>
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-5">
            <Button variant="outline" onClick={resetForm}>
              Clear
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-blue-600 text-white"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : form.id
                ? "Update"
                : "Save"}
            </Button>
          </div>
        </div>

        {/* ✅ Display Saved Pricings */}
        <div className="mt-6 space-y-2 max-h-2/3 overflow-auto">
          {productUnities.map((unit) => (
            <div
              key={unit.id}
              className="p-3 border rounded-md flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {unit.unit?.unitProductDescription} ({unit.unit?.unitProduct}) -{" "}
                  {unit.subUnit?.subUnit}
                </p>
                <p className="text-sm text-gray-600">
                  {unit.unitPrice
                    ? `Price: ${unit.unitPrice}`
                    : `Min: ${unit.minPrice} | Max: ${unit.maxPrice}`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {unit.isDefaultSelection && (
                  <span className="text-xs text-green-600 font-semibold">
                    Default
                  </span>
                )}
                <FaEdit
                  className="cursor-pointer text-blue-600"
                  onClick={() => handleEdit(unit)}
                />
                <FaTrash
                  className="cursor-pointer text-red-600"
                  onClick={() => handleDelete(unit.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
