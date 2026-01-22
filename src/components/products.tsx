"use client";


import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Pagination } from '@/components/Pagination';
import { LayoutToggle } from '@/components/LayoutToggle';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


import LoadingSkeloton from './loadingSkeloton';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import CustomerFavouriteMarket from './customerFavauriteMarket';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import axios from 'axios';



type Market = {
  id: string;
  marketName: string;
};

type FavouriteMarket={
 
  marketId:string;
 
}

export default function ProductPage() {
  const searchParams = useSearchParams();
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
   const [isModalOpen, setIsModalOpen] = useState(false);
 
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const { data, isLoading } = useProducts(filters);

  const queryClient = useQueryClient();

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };


useEffect(() => {
  setFilters({
    searchTerm: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    market: searchParams.get('market') || '',
    priceMin: Number(searchParams.get('priceMin')) || 0,
    priceMax: Number(searchParams.get('priceMax')) || 0,
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
  });
}, [searchParams]);





const { data: markets = [] } = useQuery<Market[]>({
    queryKey: ["markets"],
    queryFn: async () => (await axiosInstance.get("/market")).data,
  });

      const { data: favouriteMarkets } = useQuery<FavouriteMarket>({
      queryKey: ["favourite-market"],
      queryFn: async () => {
        const res = await axiosInstance.get("/favourite-markets/single");
        console.log("Favourite market response:", res.data);
        return res.data; // must return the actual data
      },
    });

  const saveFavouriteMutation = useMutation({
    mutationFn: async (marketId: string) =>
      (await axiosInstance.post("/favourite-markets", { marketId })).data,
    onSuccess: (_, marketId) => {
      const market = markets.find((m) => m.id === marketId);
      if (market) setSelectedMarket(market.marketName);

      queryClient.invalidateQueries({ queryKey: ["favourite-market"] });
       setIsModalOpen(false)
    },
    onError: (error:any) => {
      if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      if (message) {
        toast.error(message )
      }else{
        toast.error("Could not save favourite market. Please try again.")
      }
    }
      
    },
  });

  // Handler
  const handleSaveFavourite = (marketId: string) => {
    saveFavouriteMutation.mutate(marketId);
  };



  return (
    <div className="relative w-full items-center justify-between container mx-auto ">
     <div className="max-w-[95%] mt-6 sm:mt-16 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded relative mx-auto">
        <p className='w-[90%]'>You can place orders only from your selected favorite market. Please choose the nearest market to reduce delivery costs.</p>
        <button
          className="absolute top-2 right-2 text-yellow-700 hover:text-yellow-900"
          onClick={(e) => e.target.closest('div').remove()}
        >
          <X size={30} color="red"/>
        </button>
      </div>
      {/* Search input - always visible on mobile and desktop */}
      <div className="p-4 flex flex-col-reverse sm:flex-row justify-around items-center max-w-full sm:max-w-full space-x-4 bg-slate-50 border-b sm:sticky mt-5 sm:mt-12  sm:top-15 z-20 gap-3">
      <div className=' flex flex-col sm:flex-row items-end justify-between w-full sm:w-2/3 p-5 gap-5 '>
      {favouriteMarkets?(
        <Button variant="outline" className='w-full sm:w-1/3' onClick={() => setIsModalOpen(true)}>
               Favourite market: {selectedMarket || favouriteMarkets?.market?.marketName} 
        </Button>
      ):(
          <Button
            onClick={() => setIsModalOpen(true)}
            style={{
              animation: "flash 1.5s infinite",
            }}
            className="text-white font-bold"
          >
            ⚠️ Set Favourite Market here
            <style>
              {`
                @keyframes flash {
                  0%, 100% { background-color:#db2777; } /* red-500 */
                  50% { background-color: #b91c1c; }     /* red-700 */
                }
              `}
            </style>
        </Button>
           )}
        <CustomerFavouriteMarket 
          marketId={markets.find((m) => m.marketName=== selectedMarket)?.id}
          markets={markets}
          isModalOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveFavourite}
        
        />
        <input
          type="search"
          placeholder="Search products..."
          value={filters.searchTerm}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, searchTerm: e.target.value, page: 1 }))
          }
          className="w-full sm:w-1/2 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
          <main className="flex-1 p-4 mt-2 sm:mt-6">
            {isLoading ? (
              <LoadingSkeloton />
            ) : data ? (
              <>
              
                 {data?.data && data.data.length > 0 ? (
                  <div
                  className={
                    layout === "grid"
                      ? "grid grid-cols-1 md:grid-cols-4 sm:grid-cols-5 gap-10 place-items-center"
                      : "space-y-4 flex flex-col w-full items-center bg-amber-300"
                  }
                >
                   { data.data.map((product: any) => (
                      <ProductCard key={product.id} product={product} layout={layout} />
                    ))
                  }
                     </div>
                  ) : (
                    <p className=" text-black-500 p-2">
                      No products found matching your criteria.
                    </p>
                  )}
               

                <Pagination
                  currentPage={filters.page}
                  totalPages={data?.totalPages || 1}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="flex w-full mt-4">
                <h1>No product data available</h1>
              </div>
            )}
          </main>
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilter && (
        <div className="fixed inset-0 bg-white z-50 p-4 overflow-y-auto mt-25 ">
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
