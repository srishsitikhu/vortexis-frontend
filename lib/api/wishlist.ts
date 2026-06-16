import { axiosInstance } from "../axiosinstance";
import { Product } from "@/types/product"; // Assuming you already have this type

export type WishlistItem = {
  id: number;
  userId: number;
  productId: number;
  product: Product;
};

export const fetchWishlistItems = async () => {
  const { data } = await axiosInstance.get("/wishlists");
  return data.wishlistItems as WishlistItem[];
};

export const addItemToWishlist = async (productId: number) => {
  const { data } = await axiosInstance.post("/wishlists", { productId });
  return data.wishlist as WishlistItem;
};

export const removeItemFromWishlist = async (wishlistId: number) => {
  const { data } = await axiosInstance.delete(`/wishlists/${wishlistId}`);
  return data.wishlist as WishlistItem;
};

export const checkWishlistItem = async (productId: number) => {
  const { data } = await axiosInstance.get(`/wishlists/check/${productId}`);
  return data;
};
