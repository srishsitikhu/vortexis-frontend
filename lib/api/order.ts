import { CreateOrderInput, UpdateOrderInput } from "@/schema/order.schema";
import { axiosInstance } from "../axiosinstance";

export const addOrder = async (dataToSend: CreateOrderInput) => {
  const { data } = await axiosInstance.post("/orders", dataToSend);
  return data.data;
};

export const fetchOrder = async (id: number) => {
  const { data } = await axiosInstance.get(`/orders/${id}`);
  return data.data;
};

export const fetchOrders = async ({
  search,
  page,
  limit,
}: {
  search?: string;
  page: number;
  limit?: number;
}) => {
  const { data } = await axiosInstance.get(`/orders`, {
    params: {
      search,
      page,
      limit,
    },
  });
  return data.data;
};

export const updateOrder = async ({
  id,
  dataToSend,
}: {
  id: number;
  dataToSend: UpdateOrderInput;
}) => {
  const { data } = await axiosInstance.patch(`/orders/${id}`, dataToSend);
  return data.data;
};

export const fetchOrdersById = async ({
  search,
  page,
  limit,
}: {
  search?: string;
  page: number;
  limit?: number;
}) => {
  const { data } = await axiosInstance.get(`/orders/me`, {
    params: {
      search,
      page,
      limit,
    },
  });
  return data.data;
};
