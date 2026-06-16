"use client";
import { Button } from "@/components/general/Button";
import { fetchCategory, updateCategory } from "@/lib/api/category";
import { showNotification } from "@/redux/NotificationSlice";
import {
  UpdateCategoryInput,
  updateCategorySchema,
} from "@/schema/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Spinner from "@/components/Spinner";

const EditCategoryPage = () => {
  const { id: categoryId } = useParams();
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
  });

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const {
    data: categoryData,
    isLoading: categoryDataLoading,
    isError: categoryDataError,
  } = useQuery({
    queryKey: ["categories", Number(categoryId)],
    queryFn: () => fetchCategory(Number(categoryId)),
  });

  useEffect(() => {
    reset(categoryData);
  }, [reset, categoryData]);

  const { mutate: updateCategoryMutation, isPending } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      reset();
      dispatch(
        showNotification({
          message: "Category updated successfully",
          type: "success",
        }),
      );
    },
    onError: () => {
      dispatch(
        showNotification({
          message: "Error update category",
          type: "error",
        }),
      );
    },
  });

  const onSubmit = async (data: UpdateCategoryInput) => {
    updateCategoryMutation({ id: Number(categoryId), dataToSend: data });
  };

  if (categoryDataLoading) return <Spinner />;
  if (categoryDataError) {
    return (
      <div className="section-container">
        <p className="error-text">Failed to load category.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="section-container space-y-8"
    >
      <div className="flex justify-between">
        <h1 className="heading-admin">Update Category</h1>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categories")}
          text="Back to Categories"
        />
      </div>
      <div className="flex flex-col gap-4 form-block">
        <div className="flex flex-col gap-2">
          <label className="label-text" htmlFor="name">
            Category Name
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="Name of the category"
            className="input-field"
          />
          {errors.name && <p className="text-error">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="label-text" htmlFor="description">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Description of the category"
            rows={6}
            className="input-field resize-none"
          />
          {errors.description && (
            <p className="text-error">{errors.description.message}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isPending}
          loadingText="Saving"
          disabled={isPending}
          text="Save"
        />
      </div>
    </form>
  );
};

export default EditCategoryPage;
