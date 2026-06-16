"use client";

import { fetchRecommendedProducts } from "@/lib/api/product";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useRef } from "react";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import ProductCard from "./ProductCard";
import { useAuth } from "@/hooks/useAuth";

const RecommendedProductRail = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user, isUserLoading } = useAuth();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products", "recommended", user?.id],
    queryFn: () => fetchRecommendedProducts(),
    enabled: Boolean(user?.id),
    retry: false,
  });

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft -= 350;
    scrollRef.current.style.scrollBehavior = "smooth";
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft += 350;
    scrollRef.current.style.scrollBehavior = "smooth";
  };

  if (isUserLoading || !user?.id) {
    return null;
  }

  if (isLoading) {
    return <div>Loading recommendations...</div>;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <h1 className="border-l-15 border-red-500 rounded-sm px-2 responsive-content py-1">
        Picked For You
      </h1>

      <div className="flex flex-col-reverse laptop:flex-row laptop:justify-between">
        <div className="responsive-subtitle py-4 font-semibold">
          <h1>Recommended from similar shoppers</h1>
        </div>

        <div className="flex text-4xl tablet:text-6xl gap-3 tablet:gap-4 font-normal text-neutral-500 cursor-pointer self-end -mt-6 laptop:self-auto">
          <IoIosArrowRoundBack
            className="p-2 bg-neutral-300 rounded-full hover:bg-neutral-200 active:scale-130 transition-all ease-in-out duration-300"
            onClick={scrollLeft}
          />
          <IoIosArrowRoundForward
            className="p-2 bg-neutral-300 rounded-full hover:bg-neutral-200 active:scale-130 transition-all ease-in-out duration-300"
            onClick={scrollRight}
          />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 tablet:gap-10 overflow-auto scrollbar-hide"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex justify-center">
        <Link
          href="/products"
          className="border-2 px-4 py-2 responsive-content bg-red-500 text-neutral-100 cursor-pointer"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
};

export default RecommendedProductRail;
