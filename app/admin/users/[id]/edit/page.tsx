"use client";

import { Button } from "@/components/general/Button";
import { ReusableDropdown } from "@/components/general/ReusableDropDown";
import { uploadImages } from "@/lib/api/upload";
import { fetchUser, updateUser } from "@/lib/api/user";
import { showNotification } from "@/redux/NotificationSlice";
import { userUpdateInput, userUpdateSchema } from "@/schema/user.schema";
import { RoleEnum } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SquarePen, Upload, X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Spinner from "@/components/Spinner";

const EditUserPage = () => {
  const { id: userId } = useParams();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState<string>("/uploads/abcpng");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const router = useRouter();
  const {
    register,
    reset,
    getValues,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<userUpdateInput>({ resolver: zodResolver(userUpdateSchema) });

  const {
    data: userData,
    isLoading: userDataLoading,
    isError: userDataError,
  } = useQuery({
    queryKey: ["user", Number(userId)],
    queryFn: () => fetchUser(Number(userId)),
  });

  const { mutate: updateUserMutation, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", Number(userId)] });
      reset();
      dispatch(
        showNotification({
          message: "User Update successfully",
          type: "success",
        }),
      );
      router.push("/admin/users");
    },
    onError: () => {
      dispatch(
        showNotification({
          message: "Error update user",
          type: "error",
        }),
      );
    },
  });

  useEffect(() => {
    reset(userData);
    if (userData?.avatarUrl) {
      setPreviewImage(
        `${process.env.NEXT_PUBLIC_STATIC_URL}${userData.avatarUrl}`,
      );
    }
  }, [reset, userData]);

  useEffect(() => {
    if (avatarFile) {
      const objectUrl = URL.createObjectURL(avatarFile);
      setPreviewImage(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else if (userData?.avatarUrl) {
      setPreviewImage(
        `${process.env.NEXT_PUBLIC_STATIC_URL}${userData.avatarUrl}`,
      );
    } else {
      setPreviewImage("");
    }
  }, [avatarFile, userData]);

  if (userDataLoading) return <Spinner />;
  if (userDataError) {
    return (
      <div className="section-container">
        <p className="error-text">Failed to load user.</p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] || null;
    setAvatarFile(newFile);
  };

  const handleRemoveFile = () => {
    setAvatarFile(null);
  };
  const onSubmit = async (data: userUpdateInput) => {
    let avatarUrl = data.avatarUrl || "";

    if (avatarFile) {
      const uploadPath = await uploadImages([avatarFile]);
      avatarUrl = uploadPath[0] || "";
      setValue("avatarUrl", avatarUrl);
    }

    const payload: userUpdateInput = {
      ...data,
      avatarUrl,
    };

    updateUserMutation({ id: Number(userId), dataToSend: payload });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="section-container">
      <div className="flex justify-between">
        <h1 className="heading-admin">Update User</h1>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/users")}
          text="Back to User"
        />
      </div>

      <div className="flex flex-col gap-4 form-block">
        <div className="grid grid-cols-2 gap-4">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            <div className="label-input-group group">
              <label htmlFor="name" className="label-text">
                Name *
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="John Doe"
                className="input-field"
              />
              {errors.name && (
                <p className="text-error">{errors.name.message}</p>
              )}
            </div>
            <div className="label-input-group group">
              <label htmlFor="role" className="label-text">
                Role *
              </label>
              <ReusableDropdown
                items={Object.values(RoleEnum)}
                value={getValues("role")}
                onSelect={(item) => setValue("role", item)}
                placeholder="Select a role"
              />
              {errors.role && (
                <p className="text-error">{errors.role.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="label-input-group group">
              <label htmlFor="email" className="label-text">
                Email *
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="johndoe@example.com"
                className="input-field"
              />
              {errors.email && (
                <p className="text-error">{errors.email.message}</p>
              )}
            </div>
            <div className="label-input-group group">
              <label htmlFor="phoneNumber" className="label-text">
                Phone Number
              </label>
              <input
                {...register("phoneNumber")}
                type="text"
                placeholder="e.g 9860000001"
                className="input-field"
              />
              {errors.phoneNumber && (
                <p className="text-error">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Avatar Upload */}
        <div className="label-input-group">
          <label htmlFor="avatar-image" className="label-text">
            Avatar Image
          </label>
          {previewImage ? (
            <div className="flex flex-wrap gap-4">
              <div className="relative size-28 overflow-clip rounded-sm">
                <Image
                  src={previewImage}
                  alt="avatarImage"
                  width={100}
                  height={100}
                  className="size-full object-cover"
                />
                <button
                  onClick={handleRemoveFile}
                  type="button"
                  className="bg-red-500 hover:bg-red-800 absolute top-1 right-1 flex cursor-pointer items-center justify-center rounded-full p-0.5 transition-colors duration-300"
                >
                  <X size={16} className="text-neutral-100" />
                </button>
              </div>
              <label
                htmlFor="avatar-image"
                className="border-neutral-400 hover:bg-neutral-400/10 flex size-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed p-4 transition-colors duration-300"
              >
                <SquarePen size={32} />
                <span className="text-neutral-800 capitalize text-center">
                  Change Image
                </span>
              </label>
              <input
                onChange={handleFileChange}
                id="avatar-image"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </div>
          ) : (
            <>
              <label
                htmlFor="avatar-image"
                className="border-neutral-400 hover:bg-neutral-400/10 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed p-4 transition-colors duration-300"
              >
                <Upload size={32} />
                <span className="text-neutral-800 capitalize">
                  Click to browse
                </span>
                <span className="">Supports: JPG, PNG</span>
              </label>
              <input
                onChange={handleFileChange}
                id="avatar-image"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </>
          )}
          {errors.avatarUrl && (
            <span className="error-text">{errors.avatarUrl.message}</span>
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

export default EditUserPage;
