"use client";

import { fetchProducts } from "@/lib/api/product";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../ProductCard";
import Spinner from "../Spinner";
import { ProductFilters } from "@/types/filter";

type Props = {
  filters: ProductFilters;
};

const ProductGrid = ({ filters }: Props) => {
  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products", filters], 
    queryFn: () => fetchProducts(filters),
  });

  if (isLoading) return <Spinner />;
  if (isError) return <div>Failed to load products</div>;

  return (
    <div className="grid grid-cols-1 laptop:grid-cols-3 gap-6">
      {data?.length ? (
        data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default ProductGrid;
