"use client";

import Image from "next/image";
import React from "react";
import { Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeItemFromWishlist, type WishlistItem } from "@/lib/api/wishlist";
import { formatNrs } from "@/lib/utils";

type WishlistItemCardProps = {
  item: WishlistItem;
};

const WishlistItemCard: React.FC<WishlistItemCardProps> = ({ item }) => {
  const queryClient = useQueryClient();

  const basePrice = Number(item.product.price);
  const discountedPrice =
    item.product.discountPercent > 0
      ? basePrice * (1 - item.product.discountPercent / 100)
      : basePrice;

  const removeMutation = useMutation({
    mutationFn: removeItemFromWishlist,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["wishlistItems"],
        exact: false,
      }),
  });

  return (
    <div className="w-full flex justify-between items-center border-b border-neutral-200 py-4">
      <div className="flex items-center gap-4">
        <div className="w-36 h-36 rounded-xl flex items-center justify-center">
          <Image
            src={process.env.NEXT_PUBLIC_STATIC_URL + item.product.imageUrls[0]}
            alt={item.product.name}
            width={256}
            height={256}
            className="object-contain w-full h-auto"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-medium text-black">{item.product.name}</span>
          <span className="text-sm text-neutral-500">
            {item.product.category?.name}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 min-w-[100px]">
        {item.product.discountPercent > 0 ? (
          <div className="flex flex-col items-end">
            <span className="text-red-500 font-semibold">
              {formatNrs(discountedPrice)}
            </span>
            <span className="line-through text-neutral-400 text-sm">
              {formatNrs(item.product.price)}
            </span>
          </div>
        ) : (
          <span className="font-semibold">{formatNrs(item.product.price)}</span>
        )}
        <button
          onClick={() => removeMutation.mutate(item.id)}
          className="text-red-500 hover:text-red-700 transition cursor-pointer"
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
};

export default WishlistItemCard;
