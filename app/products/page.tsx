"use client";
import FilterSideBar from "@/components/general/FilterSideBar";
import ProductGrid from "@/components/general/ProductGrid";
import { ProductFilters } from "@/types/filter";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const ProductPageContent = () => {
  const searchParams = useSearchParams();

  const initialFilters: ProductFilters = {
    search: searchParams.get("search") || undefined,
    categoryIds: searchParams.get("categoryIds")
      ? searchParams.get("categoryIds")!.split(",").map(Number)
      : [],
  };
  const [filters, setFilters] = React.useState<ProductFilters>(initialFilters);
  return (
    <div className="flex gap-4">
      <FilterSideBar filters={filters} setFilters={setFilters} />
      <div className="flex-1">
        <ProductGrid filters={filters} />
      </div>
    </div>
  );
};

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="p-6" />}>
      <ProductPageContent />
    </Suspense>
  );
}
