import { CreateOrderInput } from "@/schema/order.schema";
import { KhaltiPaymentPayload } from "@/types/khalti";
import { PaymentMethod, PaymentStatus } from "@/types/order";
import { Product } from "@/types/product";

type PaymentOption = "cod" | "khalti";

export const BuildOrderPayload = (
  total: number,
  selectedItems: { productId: number; price: number; quantity: number }[],
  payment: PaymentOption,
): CreateOrderInput => {
  return {
    totalAmount: Number(total.toFixed(2)),
    orderItems: selectedItems.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      productId: item.productId,
    })),
    payment: {
      paymentMethod:
        payment === "khalti"
          ? PaymentMethod.Khalti
          : PaymentMethod.CashOnDelivery,
      amount: total,
      paymentStatus: PaymentStatus.Pending,
      transactionId: null,
      paidAt: payment === "khalti" ? new Date() : null,
    },
  };
};

export const BuildKhaltiPayload = (
  selectedItems: {
    productId: number;
    price: number;
    quantity: number;
    product: Product;
  }[],
  user: { name?: string; email?: string; phoneNumber?: string },
): KhaltiPaymentPayload => {
  const runtimeOrigin =
    typeof window !== "undefined" ? window.location.origin : undefined;
  const clientBaseUrl =
    process.env.NEXT_PUBLIC_CLIENT_URL ?? runtimeOrigin ?? "";

  const purchaseOrderId = `order-${Date.now()}`;

  const subtotal = selectedItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  return {
    return_url: `${clientBaseUrl}/success`,
    website_url: clientBaseUrl,
    amount: Math.round(subtotal * 100), // total amount in paisa
    purchase_order_id: purchaseOrderId,
    purchase_order_name: `Order ${purchaseOrderId}`,
    customer_info: {
      name: user?.name ?? "Guest",
      email: user?.email ?? "guest@example.com",
      phone:
        user?.phoneNumber ??
        process.env.NEXT_PUBLIC_FALLBACK_PHONE ??
        "9800000000",
    },
    amount_breakdown: [
      { label: "Subtotal", amount: Math.round(subtotal * 100) },
      { label: "Shipping", amount: 0 }, // you can add shipping cost if needed
    ],
    product_details: selectedItems.map((item) => {
      return {
        identity: item.productId.toString(),
        name: item.product.name,
        total_price: Math.round(item.price * item.quantity * 100),
        quantity: item.quantity,
        unit_price: Math.round(item.price * 100),
      };
    }),
    merchant_username: "merchant_name",
    merchant_extra: "extra_info",
  };
};
