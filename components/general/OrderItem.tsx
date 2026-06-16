import Image from "next/image";
import React from "react";
import { Button } from "./Button";
import { useRouter } from "next/navigation";
import { orderItem } from "@/types/order";
import { formatNrs } from "@/lib/utils";

interface OrderItemProps {
  item: orderItem;
}

const OrderItem = ({ item }: OrderItemProps) => {
  const router = useRouter();

  const handleViewOrderDetails = () => {
    if (!item.orderId) return;
    router.push(`/order-details?orderId=${item.orderId}`);
  };

  return (
    <div
      onClick={handleViewOrderDetails}
      className="flex w-full flex-col gap-3 px-2 py-4 sm:flex-row sm:items-start sm:gap-4"
    >
      {/* Product Image */}
      <div className="flex-shrink-0 self-center sm:self-start">
        <Image
          src={`${process.env.NEXT_PUBLIC_STATIC_URL}${item.product.imageUrls[0]}`}
          alt={item.product.name}
          width={100}
          height={100}
          className="h-20 w-20 rounded-lg object-cover sm:h-24 sm:w-24 md:h-28 md:w-28"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="flex-1">
            <h3 className="sub-heading line-clamp-2">{item.product.name}</h3>

            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="sm-text rounded-lg border bg-neutral-100 px-2 py-1 text-xs">
                {item.product.category.name}
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 sm:mt-0 sm:ml-4 sm:flex-col sm:items-end">
            <p className="font-medium text-neutral-900">
              {formatNrs(item.product.price)}
            </p>
            <p className="sm-text text-neutral-500">each</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <p className="sm-text">
              Qty: <span className="font-semibold">{item.quantity}</span>
            </p>
            <p className="large-text font-semibold text-neutral-900">
              Total: {formatNrs(item.price * item.quantity)}
            </p>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleViewOrderDetails();
            }}
            text="View Order"
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
