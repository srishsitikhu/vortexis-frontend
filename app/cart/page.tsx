"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CartItemCard from "@/components/general/CartItemCard";
import { Button } from "@/components/general/Button";
import { formatNrs } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchCartItems } from "@/lib/api/cart";
import Spinner from "@/components/Spinner";
import { ShoppingCart } from "lucide-react";
import { CartItem } from "@/types/cartItem";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";

const Page = () => {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const {
    data: cartItems,
    isLoading: cartItemsLoading,
    isError: cartItemsError,
  } = useQuery<CartItem[]>({
    queryKey: ["cartItems"],
    queryFn: fetchCartItems,
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
            Please login to view and manage your shopping cart.
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

  if (cartItemsLoading) return <Spinner />;

  if (cartItemsError) {
    return (
      <div className="p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Shopping Cart</h2>
        <p>Failed to load cart. Please try again later.</p>
      </div>
    );
  }

  // --- selection logic ---
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === cartItems!.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems!.map((item) => item.id));
    }
  };

  const selectedItems =
    cartItems?.filter((item) => selectedIds.includes(item.id)) ?? [];

  const subtotal = selectedItems.reduce((acc, item) => {
    const price = Number(item.product.price);
    const discount = item.product.discountPercent ?? 0;
    const finalPrice = price * (1 - discount / 100);
    return acc + finalPrice * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const handleProcessToCheckout = () => {
    if (!selectedIds.length) return;
    setLoading(true);
    localStorage.setItem("selectedCartItemsId", JSON.stringify(selectedIds));
    router.push("/checkout");
  };

  return (
    <div className="p-6 flex w-full h-full flex-col gap-6">
      <h2 className="text-2xl font-semibold">Shopping Cart</h2>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex flex-col gap-4 flex-1">
          {cartItems && cartItems.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={selectedIds.length === cartItems.length}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Select All
                </span>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4"
                >
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => toggleSelect(item.id)}
                    className="mt-2"
                  />
                  <CartItemCard variant="cart" item={item} />
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-16 border border-dashed rounded-2xl bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <ShoppingCart className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Your Cart is Empty
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
                Looks like you haven’t added anything yet. Start exploring our
                products and add your favorites to the cart.
              </p>
              <Button
                text="Continue Shopping"
                onClick={() => router.push("/products")}
              />
            </div>
          )}
        </div>

        {/* Order Summary */}
        {cartItems && cartItems.length > 0 && (
          <div
            className="w-full lg:w-[400px] flex-shrink-0 p-4 rounded-xl 
                         bg-white dark:bg-neutral-900 
                         border border-neutral-300 dark:border-neutral-700 shadow-sm
                         sticky top-6 self-start h-fit"
          >
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{formatNrs(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>{formatNrs(shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-neutral-200 dark:border-neutral-700 pt-2">
              <span>Total:</span>
              <span>{formatNrs(total)}</span>
            </div>
            <Button
              text="Proceed to Checkout"
              onClick={handleProcessToCheckout}
              disabled={!selectedIds.length || loading}
              className="mt-4 w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
