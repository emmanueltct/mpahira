'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Pagination } from '@/components/Pagination';
import { LayoutToggle } from '@/components/LayoutToggle';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import LoadingSkeloton from './loadingSkeloton';

export default function ProductPage() {
  // Add searchTerm to filters state
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    market: '',
    priceMin: 0,
    priceMax: 0,
    page: 1,
    limit:12,
  });

  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const { data, isLoading } = useProducts(filters);

  const handlePageChange = (page: number) => {
    console.log("=============================================",page)
    setFilters((prev) => ({ ...prev, page }));
  };




interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  productId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}



// Mutation function to add item to cart (POST)

  return (
    <div className="relative w-full items-center justify-between container mx-auto ">
      {/* Search input - always visible on mobile and desktop */}
      <div className="p-4 flex flex-col-reverse sm:flex-row justify-around items-center max-w-full sm:max-w-full space-x-4 bg-slate-50 border-b sm:sticky mt-30 sm:mt-5  sm:top-15 z-20 gap-3">
         <div className=' flex items-end justify-between  w-full sm:w-1/2  p-5 '>
        <input
          type="search"
          placeholder="Search products..."
          value={filters.searchTerm}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, searchTerm: e.target.value, page: 1 }))
          }
          className="flex-grow border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        </div>
        <div className=' flex items-center justify-between w-full sm:w-auto '>
        {/* Layout toggle */}
        <LayoutToggle layout={layout} setLayout={setLayout} />

        {/* Mobile filter button - hides on md+ */}
        <button
          onClick={() => setShowMobileFilter(true)}
          className="md:hidden bg-primary text-white px-4 py-2 rounded"
        >
          Filter
        </button>
        </div>
      </div>

      {/* Main flex container */}
      <div className="flex ">
        {/* Sidebar filters visible on md+ */}
        <div className="hidden md:block w-100 p-4 border-r sticky top-45 h-[calc(100vh-6rem)] overflow-auto">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>

        {/* Main product content */}
        <main className="flex-1 p-4 mt-2 sm:mt-2 ">
          {isLoading ? (
            <LoadingSkeloton/>
       ) : (
            <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-4 sm:grid-cols-5 gap-10 place-items-center' : 'space-y-4 flex flex-col w-full items-center'}>
              {data.data.map((product: any) => (
                <ProductCard key={product.id} product={product} layout={layout} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={filters.page}
            totalPages={data?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </main>
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilter && (
        <div className="fixed inset-0 bg-white z-50 p-4 overflow-y-auto ">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={() => setShowMobileFilter(false)}
              className="text-2xl font-bold leading-none"
              aria-label="Close filter"
            >
              &times;
            </button>
          </div>
          <FilterSidebar filters={filters} setFilters={setFilters} />
          <button
            onClick={() => setShowMobileFilter(false)}
            className="w-full bg-primary text-white py-2 mt-4 rounded"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
