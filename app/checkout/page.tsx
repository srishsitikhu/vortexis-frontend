"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartItem } from "@/types/cartItem";
import CartItemCard from "@/components/general/CartItemCard";
import { Button } from "@/components/general/Button";
import { formatNrs } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCartItems } from "@/lib/api/cart";
import Spinner from "@/components/Spinner";
import { useDispatch } from "react-redux";
import { showNotification } from "@/redux/NotificationSlice";
import { addOrder } from "@/lib/api/order";
import Image from "next/image";
import { BuildKhaltiPayload, BuildOrderPayload } from "@/lib/helper/order";
import { useAuth } from "@/hooks/useAuth";
import { KhaltiPaymentPayload } from "@/types/khalti";
import { initiateKhalti } from "@/lib/api/khalti";
import axios from "axios";

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<
    "cod" | "khalti" | null
  >(null);

  const paymentMethods = [
    { id: "cod", name: "Cash On Delivery", img: "/cod.png" },
    { id: "khalti", name: "Khalti", img: "/khalti.png" },
  ];

  // Load selected cart item IDs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("selectedCartItemsId");
    if (saved) {
      try {
        setSelectedIds(JSON.parse(saved));
      } catch {
        setSelectedIds([]);
      }
    }
  }, []);

  // Fetch cart items
  const {
    data: cartItems,
    isLoading: cartItemsLoading,
    isError: cartItemsError,
  } = useQuery<CartItem[]>({
    queryKey: ["cartItems"],
    queryFn: fetchCartItems,
  });

  const filteredItems =
    cartItems?.filter((item) => selectedIds.includes(item.id)) ?? [];

  // Compute subtotal & total
  const subtotal = filteredItems.reduce((acc, item) => {
    const price = Number(item.product.price);
    const discount = item.product.discountPercent ?? 0;
    const finalPrice = price * (1 - discount / 100);
    return acc + finalPrice * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  // COD Order Mutation
  const addOrderMutation = useMutation({
    mutationFn: addOrder,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      dispatch(
        showNotification({
          message: "Order has been placed successfully!",
          type: "success",
        }),
      );
      router.push(`/order-details?orderId=${data.id}`);
    },
    onError: () => {
      dispatch(
        showNotification({
          message: "Failed to create order. Please try again.",
          type: "error",
        }),
      );
    },
  });

  // Khalti Payment Mutation
  const khaltiMutation = useMutation({
    mutationFn: async (payload: KhaltiPaymentPayload) =>
      await initiateKhalti(payload),
    onSuccess: (data) => {
      window.location.href = data.payment_url;
    },
    onError: (error) => {
      const fallbackMessage = "Failed to initiate Khalti payment";

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as
          | { error?: unknown; message?: unknown }
          | undefined;
        const serverError = responseData?.error;
        const serverMessage = responseData?.message;
        const message =
          typeof serverError === "string"
            ? `${typeof serverMessage === "string" ? serverMessage : fallbackMessage}: ${serverError}`
            : typeof serverMessage === "string"
              ? serverMessage
              : fallbackMessage;
        dispatch(showNotification({ message, type: "error" }));
        return;
      }

      dispatch(showNotification({ message: fallbackMessage, type: "error" }));
    },
  });

  const handleConfirmOrder = () => {
    if (!filteredItems.length) {
      dispatch(
        showNotification({
          message: "No items selected for order",
          type: "error",
        }),
      );
      return;
    }
    if (!selectedPayment) {
      dispatch(
        showNotification({
          message: "Please select a payment method",
          type: "error",
        }),
      );
      return;
    }

    const payload = BuildOrderPayload(
      total,
      filteredItems.map((item) => {
        const price = Number(item.product.price);
        const discount = item.product.discountPercent ?? 0;
        const finalPrice = price * (1 - discount / 100);

        return {
          productId: item.product.id,
          price: Number(finalPrice.toFixed(2)),
          quantity: item.quantity,
        };
      }),
      selectedPayment,
    );

    addOrderMutation.mutate(payload);
  };

  const handleKhaltiPayment = () => {
    if (!filteredItems.length) {
      dispatch(
        showNotification({
          message: "No items selected for payment",
          type: "error",
        }),
      );
      return;
    }
    if (!user) {
      dispatch(
        showNotification({
          message: "You must be logged in for Khalti payment",
          type: "error",
        }),
      );
      return;
    }

    const payload = BuildOrderPayload(
      total,
      filteredItems.map((item) => {
        const price = Number(item.product.price);
        const discount = item.product.discountPercent ?? 0;
        const finalPrice = price * (1 - discount / 100);

        return {
          productId: item.product.id,
          price: Number(finalPrice.toFixed(2)),
          quantity: item.quantity,
        };
      }),
      "khalti",
    );

    // Save pending order
    localStorage.setItem("pendingOrder", JSON.stringify(payload));

    const khaltiPayload = BuildKhaltiPayload(
      filteredItems.map((item) => {
        const price = Number(item.product.price);
        const discount = item.product.discountPercent ?? 0;
        const finalPrice = price * (1 - discount / 100);

        return {
          productId: item.product.id,
          price: Number(finalPrice.toFixed(2)),
          quantity: item.quantity,
          product: item.product,
        };
      }),
      {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber ?? undefined,
      },
    );

    khaltiMutation.mutate(khaltiPayload);
  };

  if (cartItemsLoading) return <Spinner />;
  if (cartItemsError)
    return (
      <div className="p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Checkout</h2>
        <p>Failed to load cart. Please try again later.</p>
      </div>
    );

  return (
    <div className="p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Checkout</h2>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Selected Items */}
        <div className="flex flex-col gap-4 flex-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <CartItemCard key={item.id} variant="checkout" item={item} />
            ))
          ) : (
            <div className="flex flex-col gap-2">
              <p>No items selected for checkout.</p>
              <Button
                text="Back to Cart"
                onClick={() => router.push("/cart")}
              />
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[400px] flex-shrink-0 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-sm sticky top-6 self-start h-fit">
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

          <div className="flex flex-col gap-4 mt-4">
            <h2 className="sub-heading">Select Payment Method</h2>
            <div className="flex gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() =>
                    setSelectedPayment(method.id as "cod" | "khalti")
                  }
                  className={`flex h-32 w-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border px-4 transition ${
                    selectedPayment === method.id
                      ? "border-primary bg-primary/10"
                      : "border-neutral-300"
                  }`}
                >
                  <Image
                    alt={method.name}
                    width={64}
                    height={64}
                    src={method.img}
                  />
                  <span className="sm-text text-center">{method.name}</span>
                </div>
              ))}
            </div>

            {selectedPayment === "khalti" ? (
              <Button onClick={handleKhaltiPayment} text="Pay Now" />
            ) : selectedPayment === "cod" ? (
              <Button
                isLoading={addOrderMutation.isPending}
                loadingText="Creating Order"
                onClick={handleConfirmOrder}
                text="Confirm Order"
              />
            ) : (
              <div className="sm-text">Please select a payment method</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
