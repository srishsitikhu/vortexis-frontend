import { axiosInstance } from "../axiosinstance";
import { CartItem } from "@/types/cartItem";

export const fetchCartItems = async () => {
    const { data } = await axiosInstance.get("/carts");
    return data.cartItems as CartItem[];
};

export const addItemToCart = async ({
    productId,
    quantity,
}: {
    productId: number;
    quantity: number;
}) => {
    const { data } = await axiosInstance.post("/carts", { productId, quantity });
    return data.data as CartItem;
};

export const removeItemFromCart = async ({
    productId,
}: {
    productId: number;
}) => {
    const { data } = await axiosInstance.delete("/carts", { data: { productId } });
    return data.deletedItem;
};

export const updateCartItemQuantity = async ({
    productId,
    quantity,
}: {
    productId: number;
    quantity: number;
}) => {
    const { data } = await axiosInstance.patch("/carts", { productId, quantity });
    return data.updatedItem;
};
