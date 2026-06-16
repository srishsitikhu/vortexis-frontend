import { Product } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaRegEye, FaStar } from "react-icons/fa";
import { LuStar } from "react-icons/lu";
import { formatNrs } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls[0]
      : "/placeholder.png";

  // Render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400" />
        ) : (
          <LuStar key={i} className="text-gray-300" />
        ),
      );
    }
    return stars;
  };

  const router = useRouter();

  const discountedPrice =
    product.discountPercent > 0
      ? (Number(product.price) * (1 - product.discountPercent / 100)).toFixed(2)
      : null;

  return (
    <div className="min-w-[14rem] max-w-[14rem] tablet:min-w-[18rem] tablet:max-w-[18rem] bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative w-full overflow-hidden">
        {product.discountPercent > 0 && (
          <div className="absolute top-2 left-2 rounded-md text-white bg-red-500 px-2 py-1 text-xs font-semibold z-10">
            -{product.discountPercent}%
          </div>
        )}

        {/* Hover Icons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={() => router.push(`/products/${product.id}`)}
            className="bg-white cursor-pointer rounded-full p-2 hover:bg-gray-100 shadow"
          >
            <FaRegEye size={18} />
          </button>
        </div>

        <Image
          className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
          src={`${process.env.NEXT_PUBLIC_STATIC_URL}${imageUrl}`}
          alt={product.name}
          width={300}
          height={200}
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h2 className="font-semibold text-sm tablet:text-base truncate mb-1">
          {product.name}
        </h2>

        <div className="flex items-center gap-2">
          {discountedPrice ? (
            <>
              <span className="text-red-500 font-bold">
                {formatNrs(discountedPrice)}
              </span>
              <span className="text-gray-400 line-through text-sm">
                {formatNrs(product.price)}
              </span>
            </>
          ) : (
            <span className="text-gray-800 font-bold">
              {formatNrs(product.price)}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex gap-1 text-sm mt-2">
          {renderStars(Math.round(product.averageRating))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
