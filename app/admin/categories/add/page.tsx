"use client";
import { Button } from "@/components/general/Button";
import { addCategory } from "@/lib/api/category";
import { showNotification } from "@/redux/NotificationSlice";
import { CategoryInput, categorySchema } from "@/schema/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const AddCategoryPage = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryInput>({ resolver: zodResolver(categorySchema) });

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const router = useRouter();

  const { mutate: addCategoryMutation, isPending } = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      reset();
      dispatch(
        showNotification({
          message: "Category added successfully",
          type: "success",
        })
      );
      router.push("/admin/categories");
    },
    onError: () => {
      dispatch(
        showNotification({
          message: "Error adding category",
          type: "error",
        })
      );
    },
  });

  const onSubmit = async (data: CategoryInput) => {
    addCategoryMutation(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="section-container space-y-8">
      <div className="flex justify-between">
        <h1 className="heading-admin">Add Category</h1>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categories")}
          text="Back to Categories"
        />
      </div>
      <div className="flex flex-col gap-4 form-block">
        <div className="flex flex-col gap-2">
          <label className="label-text" htmlFor="name">Category Name</label>
          <input
            {...register("name")}
            type="text"
            placeholder="Name of the category"
            className="input-field"
          />
          {errors.name && <p className="text-error">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="label-text" htmlFor="description">Description</label>
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
        <Button type="submit" isLoading={isPending} loadingText="Saving" disabled={isPending} text="Save" />
      </div>
    </form>
  );
};

export default AddCategoryPage;
