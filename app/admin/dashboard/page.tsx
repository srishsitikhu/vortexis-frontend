"use client";

import React from "react";
import { FaBox, FaDollarSign, FaRegEye, FaUsers } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import Spinner from "@/components/Spinner";
import {
  AdminDashboardResponse,
  fetchAdminDashboard,
} from "@/lib/api/dashboard";
import { Button } from "@/components/general/Button";
import { DataTable } from "@/components/general/DataTable";
import { orderColumn } from "@/lib/columns/orderColumn";
import { formatNrs } from "@/lib/utils";

const DashboardPage = () => {
  const router = useRouter();
  const {
    data: dashboard,
    isLoading,
    isError,
  } = useQuery<AdminDashboardResponse>({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboard,
  });

  if (isLoading) return <Spinner />;
  if (isError || !dashboard) {
    return <p className="error-text">Failed to load dashboard.</p>;
  }

  return (
    <div className="section-container">
      <div className="flex flex-col gap-1">
        <h1 className="heading-admin">Dashboard</h1>
        <p className="sm-text">
          Overview of your admin panel statistics and recent activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="form-block flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-secondary-500/10 p-3 text-secondary-500">
              <FaUsers size={22} />
            </div>
            <div className="flex flex-col">
              <p className="sm-text">Total Users</p>
              <p className="text-2xl font-bold text-secondary-900">
                {dashboard.totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="form-block flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-secondary-500/10 p-3 text-secondary-500">
              <FaBox size={22} />
            </div>
            <div className="flex flex-col">
              <p className="sm-text">Total Products</p>
              <p className="text-2xl font-bold text-secondary-900">
                {dashboard.totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="form-block flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-secondary-500/10 p-3 text-secondary-500">
              <IoCartOutline size={22} />
            </div>
            <div className="flex flex-col">
              <p className="sm-text">Total Orders</p>
              <p className="text-2xl font-bold text-secondary-900">
                {dashboard.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="form-block flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-secondary-500/10 p-3 text-secondary-500">
              <FaDollarSign size={22} />
            </div>
            <div className="flex flex-col">
              <p className="sm-text">Total Revenue</p>
              <p className="text-2xl font-bold text-secondary-900">
                {formatNrs(dashboard.totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="form-block">
        <div className="flex items-center justify-between gap-4">
          <h2 className="subHeading-admin">Recent Orders</h2>
          <Button
            variant="outline"
            text="View All"
            icon={<FaRegEye />}
            onClick={() => router.push("/admin/orders")}
          />
        </div>

        <div className="mt-4">
          <DataTable
            columns={orderColumn}
            data={dashboard.recentOrders ?? []}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
