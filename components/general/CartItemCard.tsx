"use client";

import { CartItem } from "@/types/cartItem";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import { Minus, Plus, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeItemFromCart, updateCartItemQuantity } from "@/lib/api/cart";
import { formatNrs } from "@/lib/utils";

type CartItemCardProps = {
  variant: "cart" | "checkout";
  item: CartItem;
};

const CartItemCard: React.FC<CartItemCardProps> = ({ item, variant }) => {
  const { product } = item;
  const [quantity, setQuantity] = useState(item.quantity);
  const queryClient = useQueryClient();

  const discountedPrice =
    product.discountPercent > 0
      ? product.price - (product.price * product.discountPercent) / 100
      : product.price;

  const updateQuantityMutation = useMutation({
    mutationFn: ({ quantity }: { quantity: number }) =>
      updateCartItemQuantity({ productId: product.id, quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cartItems"] }),
  });

  const removeMutation = useMutation({
    mutationFn: () => removeItemFromCart({ productId: product.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cartItems"] }),
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (quantity !== item.quantity) {
        updateQuantityMutation.mutate({ quantity });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [quantity]);

  return (
    <div className="w-full flex justify-between items-center border-b border-neutral-200 py-4">
      <div className="flex items-center gap-4">
        <div className="w-36 h-36 rounded-xl flex items-center justify-center">
          <Image
            src={process.env.NEXT_PUBLIC_STATIC_URL + product.imageUrls[0]}
            alt={product.name}
            width={256}
            height={256}
            className="object-contain w-full h-auto"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-medium text-black">{product.name}</span>
          <span className="text-sm text-neutral-500">
            {product.category?.name}
          </span>

          {variant === "cart" ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                icon={<Minus size={16} />}
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              />
              <span className="w-6 text-center">{quantity}</span>
              <Button
                variant="outline"
                icon={<Plus size={16} />}
                onClick={() => setQuantity((prev) => prev + 1)}
              />
            </div>
          ) : (
            <span>Qty: {item.quantity}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 min-w-[100px]">
        {product.discountPercent > 0 ? (
          <div className="flex flex-col items-end">
            <span className="text-red-500 font-semibold">
              {formatNrs(discountedPrice)}
            </span>
            <span className="line-through text-neutral-400 text-sm">
              {formatNrs(product.price)}
            </span>
          </div>
        ) : (
          <span className="font-semibold">{formatNrs(product.price)}</span>
        )}
        {variant === "cart" && (
          <button
            onClick={() => removeMutation.mutate()}
            className="text-red-500 hover:text-red-700 transition cursor-pointer"
          >
            <Trash size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CartItemCard;
