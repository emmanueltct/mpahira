"use client";

import React,{useEffect} from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useProductsCategory } from "@/hooks/useProductsCategories";
import { useShops } from "@/hooks/useShops";
import { useUnitProducts } from "@/hooks/useUnitProduct";
import { useUpdateShopProduct, useGetProductById } from "@/hooks/useSubmitProduct";

// ✅ Schema
const formSchema = z.object({
  shopId: z.string().nonempty("Please select a shop"),
  productId: z.string().nonempty("Please select a product"),
  productUnit: z.string().nonempty("Please select a unit"),
  engLabel: z.string().min(2, "Name must be at least 2 characters"),
  kinyLabel: z.string().min(2, "Kinyarwanda name must be at least 2 characters"),
  productDiscount: z.string().optional(),
  productPrice: z.string().min(1, "Enter a price"),
  isExpires: z.boolean(),
  expireDate: z.string().optional(),
  isAvailable: z.boolean(),
  productDescription: z.string().min(20, "Enter at least 20 characters"),
  productProfile: z.any(),
});

type FormData = z.infer<typeof formSchema>;

// ✅ Reusable Inputs
function FormInput({ label, error, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...props} className="w-full border rounded-md p-2" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function FormSelect({ label, error, children, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select {...props} className="w-full border rounded-md p-2">
        {children}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function FormTextarea({ label, error, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea {...props} className="w-full border rounded-md p-2" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function FormCheckbox({ label, ...props }: any) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
}

function FormFile({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type="file" {...props} className="w-full border rounded-md p-2" />
    </div>
  );
}

// ✅ Main Update Form
export default function ProductUpdatePage() {
  const router = useRouter();
  const params = useParams();
  const productIdParam = params?.id as string;

  const { data: shops } = useShops();
  const { data: products } = useProductsCategory();
  const { data: units } = useUnitProducts();
  const { data: product, isLoading } = useGetProductById(productIdParam);
  const updateProduct = useUpdateShopProduct();
console.log("855555555555555555555555555555555555555555555555",productIdParam )
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopId: "",
      productId: "",
      productUnit: "",
      engLabel: "",
      kinyLabel: "",
      productPrice: "",
      productDiscount: "0",
      isExpires: true,
      expireDate: "",
      isAvailable: true,
      productDescription: "",
      productProfile: null,
    },
  });

  // Prefill when product is loaded
  useEffect(() => {
    if (product) {
      form.reset({
        shopId: product.shopId || "",
        productId: product.productId || "",
        productUnit: product.productUnit || "",
        engLabel: product.engLabel || "",
        kinyLabel: product.kinyLabel || "",
        productPrice: String(product.productPrice || ""),
        productDiscount: String(product.productDiscount || "0"),
        isExpires: product.isExpires ?? true,
        expireDate: product.expireDate || "",
        isAvailable: product.isAvailable ?? true,
        productDescription: product.productDescription || "",
        productProfile: null,
      });
    }
  }, [product, form]);

  const isExpires = form.watch("isExpires");

  const onSubmit = (values: FormData) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "productProfile" && value?.[0]) {
        formData.append("productProfile", value[0]);
      } else if (key === "isExpires" || key === "isAvailable") {
        formData.append(key, value ? "true" : "false");
      } else if (key === "expireDate" && !value) {
        return;
      } else {
        formData.append(key, String(value));
      }
    });

    updateProduct.mutate(
      { id: productIdParam, data: formData },
      {
        onSuccess: () => {
          toast.success("✅ Product updated successfully!");
         router.push("/seller/products");
        },
        onError: () => {
          toast.error("❌ Failed to update product.");
        },
      }
    );
  };

  if (isLoading) return <p className="text-center mt-10">Loading product...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Update Product</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        {/* Shop + Category */}
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="w-1/2">
            <FormSelect
              label="Shop"
              error={form.formState.errors.shopId?.message}
              {...form.register("shopId")}
            >
              <option value="">Select a shop</option>
              {shops?.map((shop: any) => (
                <option key={shop.id} value={shop.id}>
                  {shop.brandName}
                </option>
              ))}
            </FormSelect>
          </div>
          <div className="w-1/2">
            <FormSelect
              label="Category"
              error={form.formState.errors.productId?.message}
              {...form.register("productId")}
            >
              <option value="">Select a category</option>
              {products?.map((product: any) => (
                <option key={product.id} value={product.id}>
                  {product.product}
                </option>
              ))}
            </FormSelect>
          </div>
        </div>

        {/* Product Name + Kinyarwanda */}
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="w-1/2">
            <FormInput
              label="Product Name (English)"
              placeholder="Product name engLabel"
              error={form.formState.errors.engLabel?.message}
              {...form.register("engLabel")}
            />
          </div>
          <div className="w-1/2">
            <FormInput
              label="Product Name (Kinyarwanda)"
              placeholder="Izina ry'igicuruzwa"
              {...form.register("kinyLabel")}
            />
          </div>
        </div>

        {/* Unit */}
        <FormSelect
          label="Unit"
          error={form.formState.errors.productUnit?.message}
          {...form.register("productUnit")}
        >
          <option value="">Select a unit</option>
          {units?.map((unit: any) => (
            <option key={unit.id} value={unit.id}>
              {unit.unitProduct}
            </option>
          ))}
        </FormSelect>

        {/* Price + Discount */}
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="w-1/2">
            <FormInput
              label="Product Price"
              type="number"
              placeholder="Price"
              error={form.formState.errors.productPrice?.message}
              {...form.register("productPrice")}
            />
          </div>
          <div className="w-1/2">
            <FormInput
              label="Discount"
              type="number"
              placeholder="Discount %"
              {...form.register("productDiscount")}
            />
          </div>
        </div>

        {/* Description */}
        <FormTextarea
          label="Product Description"
          placeholder="Enter product description..."
          {...form.register("productDescription")}
        />

        {/* Toggles */}
        <div className="w-full flex flex-col md:flex-row gap-4">
          <FormCheckbox label="Has Expiry" {...form.register("isExpires")} />
          <FormCheckbox label="Available" {...form.register("isAvailable")} />
        </div>

        {/* Expire Date */}
        {isExpires && (
          <FormInput
            label="Expire Date"
            type="date"
            {...form.register("expireDate")}
          />
        )}

        {/* Product Image */}
        <FormFile label="Product Image" accept="image/*" {...form.register("productProfile")} />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={updateProduct.isPending}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          {updateProduct.isPending ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
