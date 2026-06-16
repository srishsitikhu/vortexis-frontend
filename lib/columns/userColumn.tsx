"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { isAxiosError } from "axios";
import { PenSquare, Trash } from "lucide-react";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { User } from "@/types/user";
import { showNotification } from "@/redux/NotificationSlice";
import { deleteUser } from "../api/user";

// Reusable Action Cell Component
const UserActionCell = ({ row }: { row: Row<User> }) => {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      dispatch(
        showNotification({
          message: "User deleted successfully.",
          type: "success"
        })
      )
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const message =
          error.response?.statusText ||
          "An error occurred while processing your request.";
        dispatch(showNotification({
          message: message,
          type: "error"
        }))
      } else {
        dispatch(showNotification({
          message: "An unexpected error occurred. Please try again later.",
          type: "error"
        }))
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
          href={`/admin/users/${row.original.id}/edit`}
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
        title="Delete User"
        description="Are you sure you want to proceed?"
        confirmButtonVariant="danger"
      />
    </>
  );
};

// 📊 Column Definitions
export const userColumn: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email Address",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {
      const phoneNumber = row.getValue("phoneNumber") ?? " - "
      return phoneNumber
    }

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
    cell: ({ row }) => <UserActionCell row={row} />,
  },
];
