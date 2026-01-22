'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import Slider from '@mui/material/Slider';
import { Box } from '@mui/material';

type FilterProps = {
  filters: {
    category: string;
    market: string;
    priceMin: number;
    priceMax: number;
    searchTerm: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<FilterProps['filters']>>;
};

type SubCategory = {
  id: string | number;
  subCategoryEng: string;
};

type Category = {
  id: string | number;
  product: string;
  productSubCategory: SubCategory[];
  children?: SubCategory[];
};

type Market = {
  id: string | number;
  marketName: string;
};

export const FilterSidebar = ({ filters, setFilters }: FilterProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => (await axiosInstance.get('/products')).data,
  });

  const { data: markets = [] } = useQuery<Market[]>({
    queryKey: ['markets'],
    queryFn: async () => (await axiosInstance.get('/market')).data,
  });

  const getSubcategories = (category: Category): SubCategory[] =>
    category.productSubCategory ||
    category.productSubCategory ||
    category.children ||
    [];

  // Auto-expand parent category if subcategory selected
  useEffect(() => {
    if (!filters.category) return;

    const parent = categories.find(cat =>
      getSubcategories(cat).some(
        sub => String(sub.id) === String(filters.category)
      )
    );

    if (parent) setExpandedCategory(String(parent.id));
  }, [filters.category, categories]);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setFilters(prev => ({ ...prev, priceMin: min, priceMax: max }));
  };

  return (
    <Card className="w-full max-w-md p-4 rounded-2xl shadow-md sticky top-1 bg-white z-10">
      <CardContent className="space-y-6">

        {/* ================= CATEGORIES ================= */}
        <div className="space-y-2">
          <Label>Categories</Label>

          <ul className="space-y-1">
            {categories.map(category => {
              const subs = getSubcategories(category);
              const isExpanded = expandedCategory === String(category.id);

              return (
                <li key={category.id} className="border-b pb-1">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCategory(isExpanded ? null : String(category.id))
                    }
                    className="w-full flex justify-between items-center py-2 text-left font-medium text-green-600"
                  >
                    {category.product}
                    <span
                      className={`w-6 h-6 flex items-center justify-center rounded text-white
                        ${isExpanded ? 'bg-orange-400' : 'bg-green-500'}
                      `}
                    >
                      {isExpanded ? '˄' : '˅'}
                    </span>
                  </button>

                  {isExpanded && subs.length > 0 && (
                    <ul className="ml-4 border-l pl-4 space-y-1">
                      {subs.map(sub => {
                        const isSelected =
                          String(filters.category) === String(sub.id);

                        return (
                          <li key={sub.id}>
                            <button
                              type="button"
                              onClick={() =>
                                setFilters(prev => ({
                                  ...prev,
                                  category: String(sub.id),
                                }))
                              }
                              className={`w-full text-left py-1 text-sm
                                ${
                                  isSelected
                                    ? 'text-green-600 font-semibold'
                                    : 'text-gray-700 hover:text-green-600'
                                }
                              `}
                            >
                              {sub.subCategoryEng}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* ================= MARKETS (LIST) ================= */}
        <div className="space-y-2">
          <Label>Markets</Label>

          <ul className="space-y-1">
            {/* All Markets */}
            <li>
              <button
                type="button"
                onClick={() =>
                  setFilters(prev => ({ ...prev, market: '' }))
                }
                className={`w-full text-left py-1 text-sm
                  ${
                    !filters.market
                      ? 'text-green-600 font-semibold'
                      : 'text-gray-700 hover:text-green-600'
                  }
                `}
              >
                All Markets
              </button>
            </li>

            {markets.map(market => {
              const isSelected =
                String(filters.market) === String(market.id);

              return (
                <li key={market.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setFilters(prev => ({
                        ...prev,
                        market: String(market.id),
                      }))
                    }
                    className={`w-full text-left py-1 text-sm
                      ${
                        isSelected
                          ? 'text-green-600 font-semibold'
                          : 'text-gray-700 hover:text-green-600'
                      }
                    `}
                  >
                    {market.marketName}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ================= PRICE RANGE ================= */}
        <div className="space-y-2">
          <Label>Price Range (RWF)</Label>
          <Box className="px-2">
            <Slider
              value={[filters.priceMin, filters.priceMax]}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={0}
              max={100000}
              step={10}
              sx={{ color: '#16a34a' }}
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
