"use client";

import { fetchCategories } from "@/lib/api/category";
import { Category } from "@/types/category";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { Star } from "lucide-react";
import { ProductFilters } from "@/types/filter";
import Spinner from "../Spinner";

type Props = {
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
};

const FilterSideBar = ({ filters, setFilters }: Props) => {
  const {
    data: categoryData,
    isLoading: categoriesLoading,
  } = useQuery<Category[]>({
    queryFn: () => fetchCategories(),
    queryKey: ["categories"],
  });

  const categories = categoryData ?? [];


  const toggleCategory = (id: number) => {
    setFilters((prev) => {
      const current = prev.categoryIds ?? [];
      return {
        ...prev,
        categoryIds: current.includes(id)
          ? current.filter((catId) => catId !== id)
          : [...current, id],
      };
    });
  };

  if (categoriesLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-80 space-y-6">
      {/* Categories */}
      <div className="rounded-lg px-4 py-2 border border-neutral-400">
        <h2 className="text-xl font-semibold">Categories</h2>

        <div className="space-y-3 mt-4">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                checked={filters.categoryIds?.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <label className="sm-text">{category.name}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="rounded-lg p-4 border border-neutral-400">
        <h2 className="text-xl font-semibold">Price Range</h2>
        <Slider
          value={[filters.minPrice ?? 0, filters.maxPrice ?? 200000]}
          onValueChange={([min, max]) =>
            setFilters((prev) => ({
              ...prev,
              minPrice: min,
              maxPrice: max,
            }))
          }
          min={0}
          max={200000}
          step={10}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>{filters.minPrice ?? 0}</span>
          <span>{filters.maxPrice ?? 200000}</span>
        </div>
      </div>

      {/* Rating */}
      <div className="rounded-lg px-4 py-2 border border-neutral-400">
        <h2 className="text-xl font-semibold">Rating</h2>
        <div className="flex items-center space-x-1 mt-4">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            return (
              <Star
                key={value}
                className={`h-5 w-5 cursor-pointer ${value <= (filters.rating ?? 0)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
                  }`}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, rating: value }))
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterSideBar;
