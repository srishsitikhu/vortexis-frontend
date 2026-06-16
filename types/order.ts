export enum PaymentMethod {
  Khalti = "Khalti",
  CashOnDelivery = "CashOnDelivery",
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  Pending = "Pending",
  Processing = "Processing",
  paid = "paid",
  Failed = "Failed",
}

export type Payment = {
  id: number;
  paymentMethod: PaymentMethod;
  amount: number;
  paymentStatus: PaymentStatus;
  paidAt: Date | null;
  transactionId: string | null;
  order: Order;
};

export type orderItem = {
  id: number;
  quantity: number;
  orderId: number;
  order: {
    id: number;
    status: OrderStatus;
  };
  price: number;
  productId: number;
  product: {
    name: string;
    imageUrls: string[];
    price: number;
    category: {
      name: string;
    };
  };
};

export type Order = {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt?: Date | string;
  orderItems: orderItem[];
  payment: Payment;
  user: {
    name: string;
    phoneNumber: string;
    email: string;
  };
};
