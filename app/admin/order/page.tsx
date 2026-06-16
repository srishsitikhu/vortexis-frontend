"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Spinner from "@/components/Spinner";
import { DataTable } from "@/components/general/DataTable";
import { PaginationComponent } from "@/components/general/PaginationComponent";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchOrders } from "@/lib/api/order";
import { orderColumn } from "@/lib/columns/orderColumn";
import { Order } from "@/types/order";

const PAGE_SIZE = 10;

const AdminOrdersPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery<{ orders: Order[]; total: number }>({
    queryKey: ["orders-admin", page, debouncedSearchTerm],
    queryFn: () =>
      fetchOrders({ page, limit: PAGE_SIZE, search: debouncedSearchTerm }),
  });

  const total = ordersData?.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="section-container space-y-8">
      <h1 className="heading-admin">Orders Management</h1>

      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
      </div>

      {ordersLoading ? (
        <Spinner />
      ) : ordersError ? (
        <p className="error-text">Failed to load orders.</p>
      ) : (
        <div className="space-y-6">
          <DataTable columns={orderColumn} data={ordersData?.orders ?? []} />
          <PaginationComponent
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
