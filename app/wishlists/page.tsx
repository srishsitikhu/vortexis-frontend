"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/general/Button";
import WishlistItemCard from "@/components/general/WishlistItemCard";
import { useQuery } from "@tanstack/react-query";
import { fetchWishlistItems, type WishlistItem } from "@/lib/api/wishlist";
import Spinner from "@/components/Spinner";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Page = () => {
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: wishlistItems,
    isLoading: wishlistItemsLoading,
    isError: wishlistItemsError,
  } = useQuery<WishlistItem[]>({
    queryKey: ["wishlistItems"],
    queryFn: fetchWishlistItems,
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-gray-50 dark:bg-neutral-900 px-4">
        <div className="w-full max-w-md rounded-xl bg-white dark:bg-neutral-800 p-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Login Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please login to view and manage your wishlist.
          </p>
          <Button
            text="Go to Login"
            onClick={() => router.push("/auth/login")}
            className="w-full"
          />
        </div>
      </div>
    );
  }

  if (wishlistItemsLoading) {
    return <Spinner />;
  }

  if (wishlistItemsError) {
    return (
      <div className="p-6 w-[1280px] mx-auto flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Wishlist</h2>
        <p>Failed to load wishlist. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6 w-[1280px] mx-auto flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Wishlist</h2>

      <div className="flex flex-col gap-4 flex-1">
        {wishlistItems && wishlistItems.length > 0 ? (
          wishlistItems.map((item) => (
            <WishlistItemCard key={item.id} item={item} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16 border border-dashed rounded-2xl bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30">
              <Heart className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Your Wishlist is Empty
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
              Looks like you haven’t added anything to your wishlist yet.
              Explore our products and save the ones you love!
            </p>
            <Button
              text="Continue Shopping"
              onClick={() => router.push("/products")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
