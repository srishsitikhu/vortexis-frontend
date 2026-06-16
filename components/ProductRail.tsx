"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import ProductCard from "../components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";
import { fetchProducts } from "@/lib/api/product";

type ProductRailsProps = {
  title: string;
  subtitle: string;
  dbTimeString: string;
};

const ProductRail: React.FC<ProductRailsProps> = ({
  title,
  subtitle,
  dbTimeString,
}) => {
  const targetTime = new Date(dbTimeString).getTime();

  const isFlashSalesRail = subtitle === "Flash Sales";

  const [isEnded, setIsEnded] = useState(() =>
    isFlashSalesRail ? targetTime <= Date.now() : false,
  );
  const [remainingTime, setRemainingTime] = useState(() =>
    isFlashSalesRail ? Math.max(0, targetTime - Date.now()) : 0,
  );

  const intervalRef = useRef<NodeJS.Timeout | number>(0);

  const {
    data: productsData,
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["products", isFlashSalesRail ? "flash-sales" : subtitle],
    queryFn: () =>
      isFlashSalesRail ? fetchProducts({ isFlashSale: true }) : fetchProducts(),
    enabled: !isFlashSalesRail || !isEnded,
  });

  // Countdown Timer
  useEffect(() => {
    if (!isFlashSalesRail) return;

    if (targetTime <= Date.now()) {
      setRemainingTime(0);
      setIsEnded(true);
      return;
    }

    if (!isEnded) {
      intervalRef.current = setInterval(() => {
        const timeLeft = targetTime - Date.now();
        if (timeLeft <= 0) {
          clearInterval(intervalRef.current);
          setRemainingTime(0);
          setIsEnded(true);
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isEnded, isFlashSalesRail, targetTime]);

  // Time formatting
  const safeRemainingTime = Math.max(0, remainingTime);
  const days = String(
    Math.floor(safeRemainingTime / (1000 * 60 * 60 * 24)),
  ).padStart(2, "0");
  const hr = String(
    Math.floor((safeRemainingTime / (1000 * 60 * 60)) % 24),
  ).padStart(2, "0");
  const min = String(
    Math.floor((safeRemainingTime / (1000 * 60)) % 60),
  ).padStart(2, "0");
  const sec = String(Math.floor((safeRemainingTime / 1000) % 60)).padStart(
    2,
    "0",
  );

  const ScrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (ScrollRef.current) {
      ScrollRef.current.scrollLeft += 350;
      ScrollRef.current.style.scrollBehavior = "smooth";
    }
  };
  const scrollLeft = () => {
    if (ScrollRef.current) {
      ScrollRef.current.scrollLeft -= 350;
      ScrollRef.current.style.scrollBehavior = "smooth";
    }
  };

  if (isLoading) return <div>Loading products...</div>;
  if (isError) return <div>Failed to load products</div>;

  const shouldShowProducts = !isFlashSalesRail || !isEnded;

  return (
    <div className="flex flex-col">
      <h1 className="border-l-15 border-red-500 rounded-sm px-2 responsive-content py-1">
        {title}
      </h1>

      <div className="flex flex-col-reverse laptop:flex-row laptop:justify-between">
        {/* Subtitle + Flash Sale Timer */}
        <div className="responsive-subtitle py-4 font-semibold flex gap-5 justify-between laptop:gap-35">
          <h1>{subtitle}</h1>
          {isFlashSalesRail && isEnded && (
            <div className="text-neutral-500">Flash Sale has ended.</div>
          )}
          {isFlashSalesRail && !isEnded && (
            <div className="flex gap-2 laptop:gap-4">
              <div>
                <h1 className="time-heading">Days</h1>
                <h1>{days}</h1>
              </div>
              <div className="mt-6 text-red-400">:</div>
              <div>
                <h1 className="time-heading">Hours</h1>
                <h1>{hr}</h1>
              </div>
              <div className="mt-6 text-red-400">:</div>
              <div>
                <h1 className="time-heading">Minutes</h1>
                <h1>{min}</h1>
              </div>
              <div className="mt-6 text-red-400">:</div>
              <div>
                <h1 className="time-heading">Seconds</h1>
                <h1>{sec}</h1>
              </div>
            </div>
          )}
        </div>

        {/* Arrows */}
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

      {/* Product Rail */}
      <div
        ref={ScrollRef}
        className="flex gap-4 tablet:gap-10 overflow-auto scrollbar-hide"
      >
        {isFlashSalesRail && isEnded && (
          <div className="text-neutral-500">
            Come back tomorrow for new deals.
          </div>
        )}
        {isFlashSalesRail &&
          shouldShowProducts &&
          productsData?.length === 0 && (
            <div className="text-neutral-500">
              No flash sale products available.
            </div>
          )}
        {shouldShowProducts &&
          productsData?.map((product, index) => (
            <ProductCard key={product.id || index} product={product} />
          ))}
      </div>

      {/* View All */}
      <div className="flex justify-center">
        <span className="border-2 px-4 py-2 responsive-content bg-red-500 text-neutral-100 cursor-pointer">
          View All Products
        </span>
      </div>
    </div>
  );
};

export default ProductRail;
