"use client";

import FeatureCard from "@/components/FeatureCard";
import NewArrivalCart from "@/components/NewArrivalCart";
import RecommendedProductRail from "@/components/RecommendedProductRail";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";

type Category = {
  id: number;
  name: string;
};

const HomePage = () => {
  // Flash-sale countdown end time (end of today). Replace with DB-driven time when available.
  const flashSaleEnd = new Date();
  flashSaleEnd.setHours(23, 59, 59, 999);
  if (flashSaleEnd.getTime() <= Date.now()) {
    flashSaleEnd.setDate(flashSaleEnd.getDate() + 1);
  }
  const dbTimeString = flashSaleEnd.toISOString();

  const ProductRail = dynamic(() => import("@/components/ProductRail"), {
    ssr: false,
  });

  const SlideContent = dynamic(() => import("@/components/SlideContent"), {
    ssr: false,
  });

  useEffect(() => {
    // Countdown is handled inside ProductRail.
  }, []);

  const fetchCategories = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
    );
    return data.categories;
  };

  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const categoryList: Category[] = categoryData || [];

  return (
    <div className="flex flex-col gap-10 tablet:gap-20">
      <div className="flex flex-col-reverse gap-4 laptop:flex-row laptop:justify-between">
        <div className="flex flex-wrap laptop:flex-col gap-1 laptop:gap-3 whitespace-nowrap laptop:text-lg ">
          {categoryList.map((category, index) => (
            <Link
              key={index}
              href={`/products?categoryIds=${category.id}`}
              className="cursor-pointer hover:text-red-500 transition"
            >
              {category.name}
            </Link>
          ))}
        </div>
        <SlideContent />
      </div>
      <ProductRail
        title="Today's"
        subtitle="Flash Sales"
        dbTimeString={dbTimeString}
      />
      <ProductRail
        title="This Month"
        subtitle="Best Selling Products"
        dbTimeString={dbTimeString}
      />
      <RecommendedProductRail />
      <NewArrivalCart />
      <FeatureCard />
    </div>
  );
};

export default HomePage;
