"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api/product";
import { Button } from "@/components/general/Button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/general/DataTable";
import { productColumn } from "@/lib/columns/productColumn";
import { Product } from "@/types/product";
import Spinner from "@/components/Spinner";
import { useDebounce } from "@/hooks/useDebounce";

const ProductTablePage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery<Product[]>({
    queryKey: ["products", debouncedSearchTerm],
    queryFn: () => fetchProducts({ search: debouncedSearchTerm }),
  });

  return (
    <div className="section-container space-y-8">
      <h1 className="heading-admin">Products Management</h1>

      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
        <Button
          variant="outline"
          icon={<Plus size={18} />}
          text="Add Product"
          onClick={() => router.push("/admin/products/add")}
        />
      </div>

      {productsLoading ? (
        <Spinner />
      ) : productsError ? (
        <p className="error-text">Failed to load products.</p>
      ) : (
        <div>
          <DataTable columns={productColumn} data={productsData ?? []} />
        </div>
      )}
    </div>
  );
};

export default ProductTablePage;
