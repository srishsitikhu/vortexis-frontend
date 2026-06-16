"use client";
import { Button } from "@/components/general/Button";
import { InvoiceButton } from "@/components/general/InvoiceButton";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import Spinner from "@/components/Spinner";
import { fetchOrder, updateOrder } from "@/lib/api/order";
import { Order, OrderStatus } from "@/types/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "@/redux/NotificationSlice";
import { formatNrs } from "@/lib/utils";

const OrderDetailTablePageContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const queryClient = useQueryClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: orderData, isError: orderError } = useQuery<Order>({
    queryKey: ["order", Number(orderId)],
    queryFn: () => fetchOrder(Number(orderId)),
    enabled: !!orderId,
  });

  const updateOrderMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", Number(orderId)] });
      dispatch(
        showNotification({
          message: "Order updated successfully",
          type: "success",
        }),
      );
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong while updating the order.";
        dispatch(showNotification({ message, type: "error" }));
      } else {
        dispatch(
          showNotification({
            message: "Failed to update order. Please try again.",
            type: "error",
          }),
        );
      }
    },
  });

  const formatDate = (date?: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      [OrderStatus.DELIVERED]: "bg-green-100 text-success",
      [OrderStatus.OUT_FOR_DELIVERY]: "bg-yellow-100 text-warning",
      [OrderStatus.SHIPPED]: "bg-yellow-100 text-warning",
      [OrderStatus.PROCESSING]: "bg-yellow-100 text-warning",
      [OrderStatus.CONFIRMED]: "bg-yellow-100 text-warning",
      [OrderStatus.PENDING]: "bg-gray-100 text-shadow-neutral-dark",
      [OrderStatus.CANCELLED]: "bg-red-100 text-danger",
    };
    return colors[status] || "bg-gray-100 text-shadow-neutral-dark";
  };

  if (orderError)
    return <div className="error-text">Failed to load order.</div>;
  if (!orderData) return <Spinner />;

  const canCancel =
    orderData.status !== OrderStatus.CANCELLED &&
    orderData.status !== OrderStatus.DELIVERED &&
    orderData.status !== OrderStatus.SHIPPED &&
    orderData.status !== OrderStatus.OUT_FOR_DELIVERY;

  const subtotal = orderData.totalAmount;

  const onUpdate = (status: OrderStatus) => {
    updateOrderMutation.mutate({ id: Number(orderId), dataToSend: { status } });
    setShowConfirmModal(false);
  };

  return (
    <div className="content-wrapper space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-text">Order #{orderData.id}</h1>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            text="Back"
            onClick={() => router.push("/")}
          />
          <span
            className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-medium capitalize ${statusColor(
              orderData.status,
            )}`}
          >
            {orderData.status}
          </span>
        </div>
      </div>

      {/* Confirm Cancel Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => onUpdate(OrderStatus.CANCELLED)}
        title="Cancel Order"
        description="Are you sure you want to cancel this order?"
        confirmButtonVariant="danger"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Order Items */}
        <div className="space-y-6 lg:col-span-2">
          <div className="border-neutral rounded-xl border p-6">
            <h2 className="sub-heading mb-4">Order Items</h2>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="py-2 px-3 text-sm font-medium">S/N</th>
                  <th className="py-2 px-3 text-sm font-medium">Product</th>
                  <th className="py-2 px-3 text-sm font-medium">Quantity</th>
                  <th className="py-2 px-3 text-sm font-medium">Price</th>
                  <th className="py-2 px-3 text-sm font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderData.orderItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-neutral-100 dark:border-neutral-800"
                  >
                    <td className="py-2 px-3 text-sm">{index + 1}</td>
                    <td className="py-2 px-3 text-sm">{item.product.name}</td>
                    <td className="py-2 px-3 text-sm">{item.quantity}</td>
                    <td className="py-2 px-3 text-sm">
                      {formatNrs(item.price)}
                    </td>
                    <td className="py-2 px-3 text-sm">
                      {formatNrs(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ml-auto w-full max-w-[320px] space-y-2 pt-4">
              <div className="flex justify-between text-sm text-shadow-neutral-dark">
                <span>Subtotal</span>
                <span>{formatNrs(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-shadow-neutral-dark">
                <span>Shipping</span>
                <span>{formatNrs(0)}</span>
              </div>
              <div className="flex justify-between border-t py-2 text-base font-medium text-neutral-dark">
                <span>Total</span>
                <span>{formatNrs(orderData.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="border-neutral rounded-xl border p-6">
            <h2 className="sub-heading mb-4">Payment Details</h2>
            <div className="sm-text space-y-2">
              <div className="flex justify-between">
                <span className="font-bold">Status</span>
                <span className="font-medium">
                  {orderData.payment.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Method</span>
                <span>{orderData.payment.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Paid On</span>
                <span>
                  {orderData.payment.paidAt
                    ? formatDate(orderData.payment.paidAt)
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Customer + Shipping */}
        <div className="space-y-6">
          <div className="border-neutral rounded-xl border p-6">
            <h2 className="sub-heading mb-4">Customer Details</h2>
            <div className="space-y-2 text-sm text-shadow-neutral-dark">
              <p className="flex flex-col">
                <span className="font-bold">Name</span> {orderData.user.name}
              </p>
              <p className="flex flex-col">
                <span className="font-bold">Email</span> {orderData.user.email}
              </p>
              <p className="flex flex-col">
                <span className="font-bold">Phone</span>{" "}
                {orderData.user?.phoneNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap pb-6 justify-end gap-3">
        {canCancel && (
          <Button
            onClick={() => setShowConfirmModal(true)}
            variant="outline"
            text="Cancel Order"
          />
        )}
        <InvoiceButton order={orderData} />
      </div>
    </div>
  );
};

export default function OrderDetailTablePage() {
  return (
    <Suspense fallback={<Spinner />}>
      <OrderDetailTablePageContent />
    </Suspense>
  );
}
