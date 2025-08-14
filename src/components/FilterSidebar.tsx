'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from '@/lib/axios';
import Slider from '@mui/material/Slider';
import { Box } from '@mui/material';

type FilterProps = {
  filters: {
    category: string;
    market: string;
    priceMin: number;
    priceMax: number;
    searchTerm: string;       // Add searchTerm here
  };
  setFilters: React.Dispatch<React.SetStateAction<FilterProps['filters']>>;
};

type Category = {
  id: string;
  product: string;
};

type Market = {
  id: string;
  marketName: string;
};

export const FilterSidebar = ({ filters, setFilters }: FilterProps) => {
  // Local state for controlled input
  const [localSearch, setLocalSearch] = useState(filters.searchTerm);

  // Debounce search input update to filters (optional for better UX)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchTerm: localSearch }));
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [localSearch, setFilters]);

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => (await axiosInstance.get('/products')).data,
  });

  // Fetch markets
  const { data: markets = [] } = useQuery<Market[]>({
    queryKey: ['markets'],
    queryFn: async () => (await axiosInstance.get('/market')).data,
  });

  // Handle slider change
  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setFilters(prev => ({
      ...prev,
      priceMin: min,
      priceMax: max,
    }));
  };

  return (
    <Card className="w-full max-w-md p-4 space-y-6 rounded-2xl shadow-md
      fixed md:sticky top-20 md:top-24
      bg-white z-10"
    >
      <CardContent className="space-y-5">

        {/* Search input */}
        {/* <div className="space-y-2">
          <Label htmlFor="search">Search Products</Label>
          <Input
            id="search"
            type="search"
            placeholder="Search by product name..."
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            className="w-full"
          />
        </div> */}

        {/* Category */}
        <div className="space-y-2 w-[80%]">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.product}
              </option>
            ))}
          </select>
        </div>

        {/* Market */}
        <div className="space-y-2">
          <Label htmlFor="market">Market</Label>
          <select
            id="market"
            value={filters.market}
            onChange={(e) => setFilters(prev => ({ ...prev, market: e.target.value }))}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">All Markets</option>
            {markets.map((m) => (
              <option key={m.id} value={m.id}>
                {m.marketName}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range (RWF)</Label>
          <Box className="px-2">
            <Slider
              value={[filters.priceMin, filters.priceMax]}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={0}
              max={100000}
              step={1000}
              sx={{
                color: '#2563eb', // Tailwind blue-600
              }}
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>{filters.priceMin.toLocaleString()} RWF</span>
              <span>{filters.priceMax.toLocaleString()} RWF</span>
            </div>
          </Box>
        </div>

      </CardContent>
    </Card>
  );
};
