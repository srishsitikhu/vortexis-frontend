import { axiosInstance } from "../axiosinstance";
import { OrderStatus } from "@/types/order";

export type AdminDashboardResponse = {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: number;
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
    user?: {
      name?: string | null;
      email?: string | null;
      phoneNumber?: string | null;
    };
    payment?: {
      paymentMethod?: string | null;
      paymentStatus?: string | null;
    } | null;
  }>;
};

export const fetchAdminDashboard = async () => {
  const { data } = await axiosInstance.get("/dashboard");
  return data.data as AdminDashboardResponse;
};
