import React, { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Trash2Icon, Loader2 } from "lucide-react";

/* ===================== TYPES ===================== */

interface Category {
  id: string;
  product: string;
}

interface SubCategory {
  id: string;
  subCategoryEng: string;
}

interface Product {
  id: string;
  engLabel: string;
  productProfile?: string;
  productName: { product: string };
  shopName?: {
    brandName: string;
    market: { marketName: string };
  };
}

interface RecommendProduct {
  id: string;
  recommendedProduct: Product;
}

interface Props {
  shopProductId: string;
  onClose: () => void;
}

/* ===================== API ===================== */

const fetchRecommended = async (shopProductId: string) => {
  const { data } = await axiosInstance.get(
    `/recommend-products/shopProduct/${shopProductId}`
  );
  return data;
};

const fetchCategories = async () => {
  const { data } = await axiosInstance.get("/products");
  return data;
};

const fetchSubcategories = async (categoryId: string) => {
  const { data } = await axiosInstance.get(
    `/products/subcategories/${categoryId}`
  );
  return data;
};

const fetchProducts = async (subcategoryId: string) => {
  const { data } = await axiosInstance.get(
    `/product-subcategories/shopProduct/${subcategoryId}`
  );
  return data;
};

/* ===================== COMPONENT ===================== */

export default function RecommendedProductsModal({
  shopProductId,
  onClose,
}: Props) {
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  /* ---------- Queries ---------- */

  const {
    data: recommended = [],
    isLoading: isRecommendedLoading,
  } = useQuery<RecommendProduct[]>({
    queryKey: ["recommendedProducts", shopProductId],
    queryFn: () => fetchRecommended(shopProductId),
    enabled: !!shopProductId,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: subcategories = [], isLoading: isSubLoading } =
    useQuery<SubCategory[]>({
      queryKey: ["subcategories", selectedCategory],
      queryFn: () => fetchSubcategories(selectedCategory),
      enabled: !!selectedCategory,
    });

  const { data: products = [], isLoading: isProductLoading } =
    useQuery<Product[]>({
      queryKey: ["products", selectedSubcategory],
      queryFn: () => fetchProducts(selectedSubcategory),
      enabled: !!selectedSubcategory,
    });

  /* ---------- Mutations ---------- */

  const addMutation = useMutation({
    mutationFn: async (productId: string) =>
      axiosInstance.post("/recommend-products", {
        shopProductId,
        recommendedProductId: productId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recommendedProducts", shopProductId],
      });
      setSelectedProduct("");
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) =>
      axiosInstance.delete(`/recommend-products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recommendedProducts", shopProductId],
      });
    },
  });

  /* ===================== UI ===================== */

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-2/3 max-w-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>

        {/* ================= LIST ================= */}

        <div className="border rounded p-3 mb-5 max-h-48 overflow-y-auto">
          {isRecommendedLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin" />
            </div>
          ) : recommended.length === 0 ? (
            <p className="text-gray-500 text-sm">No recommendations yet.</p>
          ) : (
            <ul className="space-y-3">
              {recommended.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        r.recommendedProduct.productProfile ||
                        "/placeholder.png"
                      }
                      alt={r.recommendedProduct.engLabel}
                      width={50}
                      height={50}
                      className="rounded object-cover"
                    />

                    <div className="text-sm">
                      <p className="font-medium">
                        {r.recommendedProduct.engLabel}  {" ~ "}   {r.recommendedProduct.productName.product}
                      </p>
                      <p className="text-gray-500">
                       {r.recommendedProduct.shopName?.brandName} /{" "}
                        {r.recommendedProduct.shopName?.market.marketName} 
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeMutation.mutate(r.id)}
                    disabled={removeMutation.isPending}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    {removeMutation.isPending ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <Trash2Icon />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ================= SELECTORS ================= */}

        <div className="grid grid-cols-3 gap-3 mb-4">
          <select
            className="border p-2 rounded"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory("");
              setSelectedProduct("");
            }}
          >
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.product}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={selectedSubcategory}
            disabled={!selectedCategory || isSubLoading}
            onChange={(e) => {
              setSelectedSubcategory(e.target.value);
              setSelectedProduct("");
            }}
          >
            <option value="">
              {isSubLoading ? "Loading..." : "Subcategory"}
            </option>
            {subcategories.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.subCategoryEng}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={selectedProduct}
            disabled={!selectedSubcategory || isProductLoading}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">
              {isProductLoading ? "Loading..." : "Product"}
            </option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.engLabel}
              </option>
            ))}
          </select>
        </div>

        {/* ================= ACTION ================= */}

        <button
          onClick={() => addMutation.mutate(selectedProduct)}
          disabled={!selectedProduct || addMutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {addMutation.isPending && (
            <Loader2 className="animate-spin w-4 h-4" />
          )}
          Add Recommended Product
        </button>
      </div>
    </div>
  );
}
