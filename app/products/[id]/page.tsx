"use client";
import { Button } from "@/components/general/Button";
import ProductImage from "@/components/general/ProductImage";
import ProductModal from "@/components/general/ProductModal";
import ReviewsContainer from "@/components/general/ReviewsContainer";
import { useAuth } from "@/hooks/useAuth";
import { addItemToCart } from "@/lib/api/cart";
import { fetchProduct } from "@/lib/api/product";
import {
  addItemToWishlist,
  checkWishlistItem,
  removeItemFromWishlist,
} from "@/lib/api/wishlist";
import { showNotification } from "@/redux/NotificationSlice";
import { Product } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Heart, Loader2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { formatNrs } from "@/lib/utils";
import Spinner from "@/components/Spinner";

const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = useQuery<Product>({
    queryKey: ["products", Number(productId)],
    queryFn: () => fetchProduct(Number(productId)),
  });

  const { data: wishlistCheck } = useQuery<{
    inWishlist: boolean;
    wishlist: { id: number };
  }>({
    queryKey: ["wishlistItems", Number(productId)],
    queryFn: () => checkWishlistItem(Number(productId)),
    enabled: !!user,
  });

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQty = Math.max(1, Number(e.target.value)); //  no negatives
    if (newQty !== quantity && !addToCartMutation.isPending) {
      setQuantity(newQty);
    }
  };
  const handleAddToCart = () => {
    if (!user) {
      dispatch(
        showNotification({
          message: "Please login first",
          type: "error",
        }),
      );
      return;
    }

    addToCartMutation.mutate({ productId: Number(productId), quantity });
  };

  const addToWishlistMutation = useMutation({
    mutationFn: addItemToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlistItems"] });
      queryClient.invalidateQueries({
        queryKey: ["wishlistItems", Number(productId)],
      });
      dispatch(
        showNotification({
          message: "Item added to Wishlist successfully",
          type: "success",
        }),
      );
    },

    onError: () => {
      dispatch(
        showNotification({
          message: "Failed to add Item to Wishlist",
          type: "error",
        }),
      );
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: removeItemFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlistItems"] });
      queryClient.invalidateQueries({
        queryKey: ["wishlistItems", Number(productId)],
      });
      dispatch(
        showNotification({
          message: "Item removed from Wishlist successfully",
          type: "success",
        }),
      );
    },

    onError: () => {
      dispatch(
        showNotification({
          message: "Failed to remove Item from Wishlist",
          type: "error",
        }),
      );
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: addItemToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      dispatch(
        showNotification({
          message: "Item added to Cart successfully",
          type: "success",
        }),
      );
    },

    onError: (error) => {
      const errorMessage =
        error instanceof AxiosError
          ? (error.response?.data?.message ??
            error.response?.data?.error ??
            "Failed to add Item to Cart")
          : "Failed to add Item to Cart";

      dispatch(
        showNotification({
          message: errorMessage,
          type: "error",
        }),
      );
    },
  });

  if (productLoading) return <Spinner />;
  if (productError) return <p>Failed to load product.</p>;
  if (!product) return <p>No product Found</p>;

  const handleToggleWishlist = () => {
    if (!user) {
      dispatch(
        showNotification({
          message: "Please log in to use Wishlist",
          type: "error",
        }),
      );
      return;
    }

    if (wishlistCheck?.inWishlist && wishlistCheck.wishlist) {
      removeFromWishlistMutation.mutate(wishlistCheck.wishlist.id);
    } else {
      addToWishlistMutation.mutate(product.id);
    }
  };

  const wishlistPending =
    addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  return (
    <div className="bg-neutral-50 p-16 shadow-md shadow-neutral-40 space-y-16">
      <div className="flex gap-16">
        <ProductImage
          imageSrc={process.env.NEXT_PUBLIC_STATIC_URL + product.imageUrls[0]}
          imageAlt="product-image"
          imageContainerRef={imageContainerRef}
          setIsModalOpen={setIsModalOpen}
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <span className="mt-2 self-start border px-3 py-1 rounded-md text-sm text-gray-700 bg-white shadow-sm">
            {product.category.name}
          </span>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="mt-4 text-xl font-bold">
            {product.discountPercent > 0 ? (
              <>
                {formatNrs(
                  product.price -
                    (product.price * product.discountPercent) / 100,
                )}
                <span className="line-through text-gray-400 ml-2 text-base">
                  {formatNrs(product.price)}
                </span>
              </>
            ) : (
              formatNrs(product.price)
            )}
          </p>
          <p className="mt-2 text-sm text-yellow-600">
            ⭐ {product.averageRating} / 5
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="neutral"
              className="hover:!bg-neutral/50 !grid h-8 w-8 place-content-center !p-0"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={addToCartMutation.isPending || quantity <= 1}
              icon={<Minus size={16} />}
            />

            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="input-field [&::-moz-appearance]:textfield h-8 w-16 appearance-none p-2 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              min={1}
              disabled={addToCartMutation.isPending}
            />
            <Button
              variant="neutral"
              className="hover:!bg-neutral/50 !grid h-8 w-8 place-content-center !p-0"
              disabled={addToCartMutation.isPending}
              onClick={() => setQuantity((prev) => prev + 1)}
              icon={<Plus size={16} />}
            />
          </div>
          <div className="flex gap-4 items-center mt-2">
            <Button
              icon={<ShoppingCart size={18} />}
              onClick={handleAddToCart}
              text="Add To cart"
              className={`flex items-center px-6 py-3 text-sm uppercase`}
            />

            {/* ✅ Wishlist Toggle Button */}
            <button
              className="cursor-pointer"
              onClick={handleToggleWishlist}
              disabled={wishlistPending}
            >
              {wishlistPending ? (
                <Loader2 className="animate-spin text-red-500" size={26} />
              ) : (
                <Heart
                  size={26}
                  className={`transition duration-300 ${
                    wishlistCheck?.inWishlist ? "text-red-500 fill-red-500" : ""
                  }`}
                />
              )}
            </button>
          </div>
        </div>
      </div>
      <ReviewsContainer productId={product.id} userId={user?.id} />
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc={product.imageUrls[0]}
        altText={`product-image`}
      />
    </div>
  );
};

export default ProductDetailPage;
