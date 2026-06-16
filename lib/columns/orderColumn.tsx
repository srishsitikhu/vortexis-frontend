"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useDispatch } from "react-redux";

import { ReusableDropdown } from "@/components/general/ReusableDropDown";
import { showNotification } from "@/redux/NotificationSlice";
import { updateOrder } from "@/lib/api/order";
import { OrderStatus } from "@/types/order";

type OrderRow = {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt?: Date | string;
  user?: {
    name?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
  };
  payment?: {
    paymentMethod?: string | null;
    paymentStatus?: string | null;
  } | null;
};

const OrderStatusCell = ({ row }: { row: Row<OrderRow> }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const updateStatusMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-admin"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", row.original.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      dispatch(
        showNotification({
          message: "Order status updated successfully.",
          type: "success",
        }),
      );
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update order status.";
        dispatch(showNotification({ message, type: "error" }));
      } else {
        dispatch(
          showNotification({
            message: "Failed to update order status.",
            type: "error",
          }),
        );
      }
    },
  });

  const currentStatus = row.original.status;
  const items = Object.values(OrderStatus);

  return (
    <ReusableDropdown
      items={items}
      value={currentStatus}
      disabled={updateStatusMutation.isPending}
      onSelect={(nextStatus) => {
        if (nextStatus === currentStatus) return;
        updateStatusMutation.mutate({
          id: row.original.id,
          dataToSend: { status: nextStatus },
        });
      }}
    />
  );
};

const OrderActionCell = ({ row }: { row: Row<OrderRow> }) => {
  return (
    <div className="flex gap-4">
      <Link
        href={`/order-details?orderId=${row.original.id}`}
        className="hover:bg-warning/10 hover:text-warning cursor-pointer rounded-full p-2 transition-colors duration-300"
        aria-label={`View order ${row.original.id}`}
      >
        <Eye size={16} />
      </Link>
    </div>
  );
};

export const orderColumn: ColumnDef<OrderRow>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "user.name",
    header: "Customer",
    cell: ({ row }) => row.original.user?.name ?? "-",
  },
  {
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => row.original.user?.email ?? "-",
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) =>
      `Nrs. ${Number(row.original.totalAmount ?? 0).toFixed(2)}`,
  },
  {
    accessorKey: "payment.paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => row.original.payment?.paymentMethod ?? "-",
  },
  {
    accessorKey: "payment.paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => row.original.payment?.paymentStatus ?? "-",
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => <OrderStatusCell row={row} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      if (!createdAt) return "-";
      const date = new Date(createdAt);
      if (Number.isNaN(date.getTime())) return "-";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <OrderActionCell row={row} />,
  },
];
