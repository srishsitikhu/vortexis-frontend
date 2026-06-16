"use client";

import { addOrder } from "@/lib/api/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { CreateOrderInput } from "@/schema/order.schema";
import { showNotification } from "@/redux/NotificationSlice";
import { PaymentStatus } from "@/types/order";

interface CartItem {
  productId: number;
  [key: string]: unknown;
}

const SuccessPageContent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderExists, setOrderExists] = useState(true);
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("pidx");

  const addOrderMutation = useMutation({
    mutationFn: addOrder,
    onMutate: async (newOrder: CreateOrderInput) => {
      setIsProcessing(true);
      await queryClient.cancelQueries({ queryKey: ["cartItems"] });

      const previousCartItems = queryClient.getQueryData<CartItem[]>([
        "cartItems",
      ]);
      const productIds = newOrder.orderItems.map((item) => item.productId);

      queryClient.setQueryData<CartItem[]>(
        ["cartItems"],
        (old) =>
          old?.filter((item) => !productIds.includes(item.productId)) ?? [],
      );

      return { previousCartItems };
    },
    onSuccess: async (data) => {
      dispatch(
        showNotification({
          message: "Order placed successfully!",
          type: "success",
        }),
      );
      localStorage.removeItem("pendingOrder");
      await queryClient.invalidateQueries({ queryKey: ["cartItems"] });

      setTimeout(() => {
        router.push(`/order-details?orderId=${data.id}`);
      }, 1000);
    },
    onError: (_error, _variables, context) => {
      setIsProcessing(false);
      if (context?.previousCartItems) {
        queryClient.setQueryData(["cartItems"], context.previousCartItems);
      }
      dispatch(
        showNotification({
          message: "Failed to create order. Redirecting home.",
          type: "error",
        }),
      );
      setTimeout(() => {
        router.replace("/");
      }, 2000);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
  });

  const processOrder = useCallback(() => {
    if (isProcessing) return; // guard against duplicate submissions

    const saved = localStorage.getItem("pendingOrder");
    if (!saved) {
      setOrderExists(false);
      setTimeout(() => router.replace("/"), 2000);
      return;
    }

    try {
      const payload = JSON.parse(saved) as CreateOrderInput;

      const finalPayload: CreateOrderInput = {
        ...payload,
        payment: {
          ...payload.payment,
          paidAt: new Date(),
          paymentStatus: PaymentStatus.paid,
          transactionId:
            transactionId ??
            payload.payment.transactionId ??
            `txn_${Date.now()}`, // safe fallback
        },
      };

      addOrderMutation.mutate(finalPayload);
    } catch {
      dispatch(
        showNotification({
          message: "Invalid order data. Redirecting to home.",
          type: "error",
        }),
      );
      setTimeout(() => router.replace("/"), 2000);
    }
  }, [isProcessing, transactionId, router, dispatch, addOrderMutation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      processOrder();
    }, 500); // slight delay so localStorage + params are ready
    return () => clearTimeout(timer);
  }, [processOrder]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-6">
          {isProcessing ? (
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-500" />
          ) : (
            <CheckCircle2
              className={`mx-auto h-16 w-16 ${orderExists ? "text-green-500" : "text-gray-400"}`}
            />
          )}
        </div>

        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          {isProcessing
            ? "Processing Order..."
            : orderExists
              ? "Payment Successful"
              : "No Order Found"}
        </h1>

        <p className="mb-6 text-gray-600">
          {isProcessing
            ? "Please wait while we process your order and redirect you to the order details."
            : orderExists
              ? "Your payment has been verified successfully. You will be redirected shortly."
              : "Redirecting you to home..."}
        </p>

        {addOrderMutation.isError && (
          <p className="text-sm text-red-600">
            Something went wrong. You will be redirected to the home page.
          </p>
        )}
      </div>
    </div>
  );
};

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
