"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import {useRouter} from "next/navigation"

type Market = { marketName: string };
type Shop = { brandName: string; market?: Market };
type ProductUnity = { unitPrice?: number };
type Product = {
  id: string;
  engLabel: string;
  productProfile?: string;
  shopName?: Shop;
  productUnities?: ProductUnity[];
};

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router=useRouter()
  // Close overlay on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        setOpen(true);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/shop-products/products/search?products=${query}`
        );

        setResults(res.data.shopProducts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

    const  handleProductDetail=(id:string)=>{
        router.push(`/products/${id}`)
      }
  return (
    <div ref={wrapperRef} className="relative w-full max-w-7xl mx-auto px-4 z-40">
      {/* Search Input */}
      <div className="flex items-center w-full bg-white shadow-lg rounded-full px-5 py-3 relative  z-30">
        <input
          type="text"
          placeholder="Search fresh food from all Kigali markets..."
          className="w-full outline-none text-gray-700 text-sm md:text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={() => setOpen(!open)}
          className="ml-4 bg-pink-500 text-white px-5 py-2 rounded-full text-sm"
        >
          Search
        </button>
      </div>

      {/* Full-screen transparent backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-30 pointer-events-none z-20"
        />
      )}

      {/* Results Dropdown */}
      {open && (
        <div className="absolute top-full left-0 w-full mt-2 z-30">
          <div className="bg-white rounded-xl shadow-xl max-h-[450px] overflow-y-auto relative">
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                &times;
              </button>
            </div>

            {loading && (
              <p className="p-4 text-center text-gray-400">Searching...</p>
            )}

            {!loading && results.length === 0 && query && (
              <p className="p-4 text-center text-gray-400">No products found</p>
            )}

            {!loading &&
              results.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <img
                    src={product.productProfile || "/placeholder.png"}
                    alt={product.engLabel}
                    className="w-18 h-18 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-bold text-gray-800">{product.engLabel}</p>
                    {product.shopName && (
                      <span className="flex gap-1 flex-wrap py-2">
                        <p className="text-gray-600">{product.shopName.brandName} ~ </p>
                        {product.shopName.market && (
                          <p className="text-gray-500 text-sm">
                            {product.shopName.market.marketName}
                          </p>
                        )}
                      </span>
                    )}

                    {product.productUnities &&
                    product.productUnities.length > 1 ? (
                      <>
                      <p className="text-sm text-gray-500 italic font-bold">
                        Available in different options
                      </p>
                      <Button variant="contained" size="small" onClick={()=>{
                          handleProductDetail(product.id)
                        }}  >Select
                    </Button>
                      </>
                    ) : product.productUnities &&
                      product.productUnities[0]?.unitPrice ? (
                      <p className="text-sm text-gray-500">
                        Price: {product.productUnities[0].unitPrice} RWF
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
