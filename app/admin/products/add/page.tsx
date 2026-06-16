"use client";

import { showNotification } from "@/redux/NotificationSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/general/Button";
import {
  ProductCreateInput,
  productCreateSchema,
} from "@/schema/product.schema";
import { addProduct } from "@/lib/api/product";
import { fetchCategories } from "@/lib/api/category";
import Spinner from "@/components/Spinner";
import { Category } from "@/types/category";
import { ReusableDropdown } from "@/components/general/ReusableDropDown";
import { Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { uploadImages } from "@/lib/api/upload";
import { isAxiosError } from "axios";

const AddPage = () => {
  const [isFlashSale, setIsFlashSale] = useState(false);
  const dispatch = useDispatch();
  const [images, setImages] = useState<File[]>([]);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [previews, setPreviews] = useState<string[]>([]);

  const {
    register,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    handleSubmit,
  } = useForm<ProductCreateInput>({
    mode: "onChange",
    resolver: zodResolver(
      productCreateSchema,
    ) as unknown as Resolver<ProductCreateInput>,
    defaultValues: {
      isFlashSale: false,
      discountPercent: undefined,
    },
  });

  useEffect(() => {
    setValue("isFlashSale", isFlashSale);
  }, [setValue, isFlashSale]);

  const {
    data: categoriesData = [],
    isLoading,
    isError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, i) => i !== indexToRemove);
    const updatedPreviews = previews.filter((_, i) => i !== indexToRemove);
    setImages(updatedImages);
    setPreviews(updatedPreviews);

    if (updatedPreviews.length > 0) {
      clearErrors("imageUrls");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const updatedFiles = [...images, ...newFiles];
    setImages(updatedFiles);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);

    if (newFiles.length > 0) {
      clearErrors("imageUrls");
    }
  };

  const { mutate: addMutation } = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      reset();
      setImages([]);
      setPreviews([]);
      dispatch(
        showNotification({
          message: "Product added successfully",
          type: "success",
        }),
      );
      router.push("/admin/products");
    },
    onError: (error: unknown) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data?.error ||
          "Error adding product"
        : "Error adding product";
      dispatch(
        showNotification({
          message,
          type: "error",
        }),
      );
    },
  });

  const onSubmit = async (data: ProductCreateInput) => {
    try {
      if (images.length === 0) {
        setError("imageUrls", {
          type: "manual",
          message: "At least one image is required",
        });
        dispatch(
          showNotification({
            message: "Please add at least one product image.",
            type: "error",
          }),
        );
        return;
      }

      const imageUrls = await uploadImages(images);

      addMutation({
        ...data,
        imageUrls,
        isFlashSale,
      });
    } catch (e) {
      const message = isAxiosError(e)
        ? e.response?.data?.message ||
          e.response?.data?.error ||
          "Error uploading images"
        : "Error uploading images";
      dispatch(
        showNotification({
          message,
          type: "error",
        }),
      );
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <p>Failed to load categories</p>;
  if (!categoriesData.length) return <p>No category data</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="section-container">
      <div className="flex justify-between">
        <h1 className="subHeading-admin">Add New Products</h1>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
          text="Back to Products"
        />
      </div>

      <div className="form-block flex flex-col gap-4">
        {/* Product Name */}
        <div className="flex flex-col gap-2">
          <label>Product Name *</label>
          <input
            {...register("name")}
            className="input-field"
            placeholder="Enter product name"
          />
          {errors.name && (
            <span className="error-text">{errors.name.message}</span>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label>Description *</label>
          <textarea
            {...register("description")}
            rows={3}
            className="input-field"
            placeholder="Enter product description"
          />
          {errors.description && (
            <span className="error-text">{errors.description.message}</span>
          )}
        </div>

        {/* Price + Discount */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label>Price (Nrs) *</label>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              placeholder="0.00"
              className="input-field"
            />
            {errors.price && (
              <span className="error-text">{errors.price.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label>Discount Percent(%)</label>
            <input
              {...register("discountPercent", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
              type="number"
              placeholder="0%"
              className="input-field"
            />
            {errors.discountPercent && (
              <span className="error-text">
                {errors.discountPercent.message}
              </span>
            )}
          </div>
        </div>

        {/* Stock + Category */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label>Stock Quantity *</label>
            <input
              {...register("stock", { valueAsNumber: true })}
              type="number"
              placeholder="0"
              className="input-field"
            />
            {errors.stock && (
              <span className="error-text">{errors.stock.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label>Category *</label>
            <ReusableDropdown
              items={categoriesData.map((c) => c.name)}
              onSelect={(name) => {
                const selected = categoriesData.find((c) => c.name === name);
                if (selected)
                  setValue("categoryId", selected.id, { shouldValidate: true });
              }}
            />
            {errors.categoryId && (
              <span className="error-text">{errors.categoryId.message}</span>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="label-input-group">
          <label className="label-text">Product Images</label>
          {previews.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative size-28">
                  <Image
                    src={preview}
                    alt="preview"
                    width={100}
                    height={100}
                    className="size-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <label
                htmlFor="product-images"
                className="border-dashed border flex size-28 items-center justify-center cursor-pointer"
              >
                <Plus size={24} />
              </label>
              <input
                id="product-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <label
              htmlFor="product-images"
              className="border-dashed border flex flex-col items-center justify-center p-4 cursor-pointer"
            >
              <Upload size={32} />
              <span>Click to browse</span>
              <input
                id="product-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
          {errors.imageUrls && (
            <span className="error-text">{errors.imageUrls.message}</span>
          )}
        </div>

        {/* Flash Sale Toggle */}
        <div className="flex justify-between items-center border rounded-lg px-2 py-1">
          <div>
            <label>Flash Sale</label>
            <p className="text-sm text-neutral-500">
              Mark this product as flash sale item
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsFlashSale((prev) => !prev)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              isFlashSale ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                isFlashSale ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="self-start"
        text="Submit"
        disabled={isSubmitting}
        isLoading={isSubmitting}
      />
    </form>
  );
};

export default AddPage;
