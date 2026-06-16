"use client";
import OrderItem from "@/components/general/OrderItem";
import { PaginationComponent } from "@/components/general/PaginationComponent";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { fetchOrdersById } from "@/lib/api/order";
import { Order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { formatNrs } from "@/lib/utils";

const PAGE_SIZE = 10;

const MyOrderPage = () => {
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const router = useRouter();

  // Always call useQuery, but disable it if user is not logged in
  const {
    data: myordersData,
    isLoading: myordersLoading,
    isError: myordersError,
  } = useQuery<{ orders: Order[]; total: number }>({
    queryKey: ["orders", page, user?.id],
    queryFn: () => fetchOrdersById({ page, limit: PAGE_SIZE }),
    enabled: !!user, // query only runs when user exists
  });

  // If no user, show login required screen
  if (!user) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <LogIn className="mx-auto mb-4 h-12 w-12 text-blue-500" />
          <h1 className="mb-2 text-xl font-bold text-gray-900">
            Login Required
          </h1>
          <p className="mb-6 text-gray-600">
            Please log in to view your orders and track your purchases.
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (myordersLoading) {
    return <Spinner />;
  }

  if (myordersError) {
    return <div className="error-text">Failed to load orders.</div>;
  }

  const total = myordersData?.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="content-wrapper p-4">
      {myordersData?.orders?.length ? (
        <ul className="space-y-4">
          {myordersData.orders.map((order) => (
            <li
              key={order.id}
              className="border-neutral-light rounded-lg border p-4 shadow-sm"
            >
              {/* Order header */}
              <div className="mb-3 flex items-center justify-between">
                <span className="sub-heading">Order #{order.id}</span>
                <span className="sm-text">{order.status}</span>
              </div>

              {/* Order items */}
              <div className="space-y-2">
                {order.orderItems?.length > 0 ? (
                  order.orderItems.map((item) => (
                    <OrderItem key={item.id} item={item} />
                  ))
                ) : (
                  <div className="text-sm text-gray-500">
                    No items found in this order.
                  </div>
                )}
              </div>

              {/* Order total */}
              <div className="mt-3 text-right font-bold">
                Total: {formatNrs(order.totalAmount)}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No orders found.</div>
      )}

      {/* Pagination */}
      <div className="mt-6">
        <PaginationComponent
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default MyOrderPage;
