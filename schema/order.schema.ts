import { OrderStatus, PaymentMethod, PaymentStatus } from "@/types/order";
import z from "zod";

export const orderItemSchema = z.object({
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    price: z.number().nonnegative('Price must be non-negative'),
    productId: z.number().int().positive('SKU ID is required'),
})

export const paymentCreateSchema = z.object({
    paymentMethod: z.enum(PaymentMethod),
    amount: z.number().nonnegative(),
    paymentStatus: z.enum(PaymentStatus).default(PaymentStatus.Pending),
    transactionId: z.string().optional().nullable(),
    paidAt: z.date().optional().nullable(),
})

export const orderCreateSchema = z.object({
    totalAmount: z.number().nonnegative('Total amount is required'),
    payment: paymentCreateSchema,
    orderItems: z.array(orderItemSchema)
})

export const updateOrderInputSchema = z.object({
    status: z.enum(OrderStatus),
});

export type orderItemInput = z.infer<typeof orderItemSchema>;
export type CreateOrderInput = z.infer<typeof orderCreateSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderInputSchema>;