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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AddsubCategoryProductProps = {
  isSubCategoryModalOpen: boolean;
  selectedProductCategory: any;
  productCategory: Array<any>;
  onClosesubCategory: () => void;
};

const AddsubCategoryProduct: React.FC<AddsubCategoryProductProps> = ({
  isSubCategoryModalOpen,
  productCategory,
  selectedProductCategory,
  onClosesubCategory,
}) => {
  const queryClient = useQueryClient();

  const [editingSubCategory, setEditingSubCategory] = useState<any | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    categoryId: "",
    subCategoryEng: "",
    subCategoryKiny: "",
    image: null as File | null, // ✅ Added image field
  });

  // ✅ Pre-fill form when editing or creating
  useEffect(() => {
    if (editingSubCategory) {
      setFormData({
        id: editingSubCategory.id,
        categoryId: editingSubCategory.categoryId,
        subCategoryEng: editingSubCategory.subCategoryEng,
        subCategoryKiny: editingSubCategory.subCategoryKiny,
        image: null, // when editing, user can re-upload image
      });
      setPreviewImage(editingSubCategory.imageUrl || null);
    } else {
      setFormData({
        id: "",
        categoryId: selectedProductCategory?.id || "",
        subCategoryEng: "",
        subCategoryKiny: "",
        image: null,
      });
      setPreviewImage(null);
    }
  }, [editingSubCategory, selectedProductCategory]);

  // ✅ Add or Update mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: typeof formData) => {
      const formDataToSend = new FormData();
      formDataToSend.append("categoryId", payload.categoryId);
      formDataToSend.append("subCategoryEng", payload.subCategoryEng);
      formDataToSend.append("subCategoryKiny", payload.subCategoryKiny);
      if (payload.image) {
        formDataToSend.append("image", payload.image);
      }

      if (payload.id) {
        const { data } = await axiosInstance.patch(
          `/product-subcategories/${payload.id}`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        return data;
      } else {
        const { data } = await axiosInstance.post(
          "/product-subcategories",
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        return data;
      }
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.id
          ? "Sub-category updated successfully!"
          : "Sub-category created successfully!"
      );
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetForm();
      onClosesubCategory();
    },
    onError: (error: any) => {
      if (error.response?.data) {
        const { message, errors } = error.response.data;
        toast.error(message || "Error occurred");

        if (errors) {
          Object.entries(errors).forEach(([field, err]: any) => {
            if (err._errors?.length > 0) {
              toast.error(`${field}: ${err._errors.join(", ")}`);
            }
          });
        }
      } else {
        toast.error("Unexpected error");
      }
    },
  });

  const resetForm = () => {
    setEditingSubCategory(null);
    setFormData({
      id: "",
      categoryId: selectedProductCategory?.id || "",
      subCategoryEng: "",
      subCategoryKiny: "",
      image: null,
    });
    setPreviewImage(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image:file}));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error("Please select a product category");
      return;
    }
    if (!formData.subCategoryEng.trim()) {
      toast.error("Sub-category (English) is required");
      return;
    }
    if (!formData.subCategoryKiny.trim()) {
      toast.error("Sub-category (Kinyarwanda) is required");
      return;
    }
    mutate(formData);
  };

  return (
    <Dialog
      open={isSubCategoryModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClosesubCategory();
        }
      }}
    >
      <DialogContent className="max-w-md w-full rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>
            {editingSubCategory ? "Update Sub-category" : "Add Sub-category"}
          </DialogTitle>
          <DialogDescription>
            {editingSubCategory
              ? "Update the selected sub-category."
              : "Create a new sub-category under a product category."}
          </DialogDescription>
        </DialogHeader>

        {/* ✅ FORM */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">-- Select Category --</option>
            {productCategory.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.product}
              </option>
            ))}
          </select>

          <Input
            type="text"
            name="subCategoryEng"
            placeholder="Enter sub-category (English)"
            value={formData.subCategoryEng}
            onChange={handleChange}
          />

          <Input
            type="text"
            name="subCategoryKiny"
            placeholder="Enter sub-category (Kinyarwanda)"
            value={formData.subCategoryKiny}
            onChange={handleChange}
          />

          {/* ✅ IMAGE UPLOAD */}
          <div>
            <label className="block mb-1 font-medium">Upload Image</label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 h-24 w-24 object-cover rounded-lg border"
              />
            )}
          </div>

          <DialogFooter className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClosesubCategory();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : editingSubCategory
                ? "Update"
                : "Save"}
            </Button>
          </DialogFooter>
        </form>

        {/* ✅ TABLE */}
        <div className="border-t border-pink-700 mt-4 pt-4 overflow-auto">
          <h3 className="border-b border-pink-700 pb-4">
            All product subcategories belong to this category
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>English</TableHead>
                <TableHead>Kinyarwanda</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProductCategory.productSubCategory?.map(
                (sub: any, i: number) => (
                  <TableRow key={sub.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{sub.subCategoryEng}</TableCell>
                    <TableCell>{sub.subCategoryKiny}</TableCell>
                    <TableCell>
                      {sub.imageUrl ? (
                        <img
                          src={sub.imageUrl}
                          alt={sub.subCategoryEng}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingSubCategory(sub)}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddsubCategoryProduct;
