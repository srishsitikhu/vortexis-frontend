"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  PenSquare,
  Trash,
  Star,
  StarHalf,
  Star as StarOutline,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { useDispatch } from "react-redux";
import { Product } from "@/types/product";
import { showNotification } from "@/redux/NotificationSlice";
import { deleteProduct } from "../api/product";
import Link from "next/link";
import Image from "next/image";
import { formatNrs } from "@/lib/utils";

const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  for (let i = 0; i < fullStars; i++)
    stars.push(
      <Star key={`full-${i}`} size={16} className="text-yellow-500" />,
    );
  if (halfStar)
    stars.push(<StarHalf key="half" size={16} className="text-yellow-500" />);
  while (stars.length < 5)
    stars.push(
      <StarOutline
        key={`empty-${stars.length}`}
        size={16}
        className="text-gray-300"
      />,
    );
  return <div className="flex">{stars}</div>;
};

// ⚡ Action Cell
const ProductActionCell = ({ row }: { row: Row<Product> }) => {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      dispatch(
        showNotification({
          message: "Product deleted successfully.",
          type: "success",
        }),
      );
    },
    onError: () => {
      dispatch(
        showNotification({
          message: "Failed to delete product.",
          type: "error",
        }),
      );
    },
  });

  const handleDeleteConfirmation = () => {
    deleteMutation.mutate(row.original.id);
    setShowConfirmDeleteModal(false);
  };

  return (
    <>
      <div className="flex gap-4">
        <Link
          href={`/admin/products/${row.original.id}/edit`}
          className="hover:bg-warning/10 hover:text-warning cursor-pointer rounded-full p-2 transition-colors duration-300"
        >
          <PenSquare size={16} />
        </Link>
        <div
          onClick={() => setShowConfirmDeleteModal(true)}
          className="hover:bg-danger/10 hover:text-danger cursor-pointer rounded-full p-2 transition-colors duration-300"
        >
          <Trash size={16} />
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmDeleteModal}
        onClose={() => setShowConfirmDeleteModal(false)}
        onConfirm={handleDeleteConfirmation}
        title="Delete Product"
        description="Are you sure you want to proceed?"
        confirmButtonVariant="danger"
      />
    </>
  );
};

export const productColumn: ColumnDef<Product>[] = [
  {
    accessorKey: "imageUrls",
    header: "Image",
    cell: ({ row }) => {
      const url = row.original.imageUrls?.[0] || "/placeholder.png";
      return (
        <Image
          src={
            url.startsWith("/uploads")
              ? `${process.env.NEXT_PUBLIC_STATIC_URL}${url}`
              : url
          }
          alt={row.original.name}
          width={40}
          height={40}
          className="rounded-md object-cover size-10"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => row.original.category?.name ?? "-",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatNrs(row.original.price),
  },
  {
    accessorKey: "discountPercent",
    header: "Discount",
    cell: ({ row }) =>
      row.original.discountPercent > 0 ? (
        <span className="px-2 py-1 rounded bg-gray-100 text-xs font-medium">
          {row.original.discountPercent}%
        </span>
      ) : (
        "—"
      ),
  },
  {
    accessorKey: "averageRating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        {renderStars(row.original.averageRating)}
        <span className="text-sm text-gray-600">
          {row.original.averageRating.toFixed(1)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "isFlashSale",
    header: "Flash Sale",
    cell: ({ row }) =>
      row.original.isFlashSale ? (
        <span className="px-2 py-1 rounded bg-red-500 text-white text-xs font-semibold">
          Flash Sale
        </span>
      ) : (
        "—"
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ProductActionCell row={row} />,
  },
];
