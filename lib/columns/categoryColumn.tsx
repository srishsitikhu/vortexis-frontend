"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { PenSquare, Trash } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { showNotification } from "@/redux/NotificationSlice";
import { Category } from "@/types/category";
import { deleteCategory } from "../api/category";
import { useState } from "react";

const CategoryActionCell = ({ row }: { row: Row<Category> }) => {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      dispatch(
        showNotification({
          message: "Category deleted successfully.",
          type: "success",
        })
      );
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const message =
          error.response?.statusText ||
          "An error occurred while deleting category.";
        dispatch(showNotification({ message, type: "error" }));
      } else {
        dispatch(
          showNotification({
            message: "An unexpected error occurred. Please try again later.",
            type: "error",
          })
        );
      }
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
          href={`/admin/categories/${row.original.id}/edit`}
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
        title="Delete Category"
        description="Are you sure you want to delete this category?"
        confirmButtonVariant="danger"
      />
    </>
  );
};

export default CategoryActionCell;


export const categoryColumn: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const desc = row.getValue("description") as string | null;
      return desc || " - ";
    },
  },
  {
    id: "productCount",
    header: "Products",
    cell: ({ row }) => {
      // just use relation length
      return row.original.products.length;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
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
    cell: ({ row }) => <CategoryActionCell row={row} />,
  },
];