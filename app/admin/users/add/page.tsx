"use client";

import { Button } from "@/components/general/Button";
import { ReusableDropdown } from "@/components/general/ReusableDropDown";
import { uploadImages } from "@/lib/api/upload";
import { addUser } from "@/lib/api/user";
import { showNotification } from "@/redux/NotificationSlice";
import { UserCreateInput, userCreateSchema } from "@/schema/user.schema";
import { RoleEnum } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, SquarePen, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const AddUserPage = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const router = useRouter();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserCreateInput>({ resolver: zodResolver(userCreateSchema) });

  useEffect(() => {
    if (avatarFile) {
      const objectUrl = URL.createObjectURL(avatarFile);
      setPreviewImage(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewImage("");
    }
  }, [avatarFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] || null;
    setAvatarFile(newFile);
  };

  const handleRemoveFile = () => {
    setAvatarFile(null);
  };

  const { mutate: addUserMutation, isPending } = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      reset();
      setAvatarFile(null);
      router.push("/admin/users")
      dispatch(showNotification({ message: "User added successfully", type: "success" }));
    },
    onError: () => {
      dispatch(showNotification({ message: "Error adding user", type: "error" }));
    },
  });

  const onSubmit = async (data: UserCreateInput) => {
    let uploadedPaths: string[] = [];

    // upload avatar if exists
    if (avatarFile) {
      uploadedPaths = await uploadImages([avatarFile]);
    }
    console.log(uploadedPaths)

    setValue("avatarUrl", uploadedPaths[0] || "")

    const payload: UserCreateInput = {
      ...data,
      avatarUrl: uploadedPaths[0] || "",
    };

    addUserMutation(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="section-container">
      <div className="flex justify-between">
        <h1 className="heading-admin">Add User</h1>
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
              <label htmlFor="name" className="label-text">Name *</label>
              <input
                {...register("name")}
                type="text"
                placeholder="John Doe"
                className="input-field"
              />
              {errors.name && <p className="text-error">{errors.name.message}</p>}
            </div>

            <div className="label-input-group group">
              <label htmlFor="email" className="label-text">Email *</label>
              <input
                {...register("email")}
                type="email"
                placeholder="johndoe@example.com"
                className="input-field"
              />
              {errors.email && <p className="text-error">{errors.email.message}</p>}
            </div>

            <div className="label-input-group group">
              <label htmlFor="role" className="label-text">Role *</label>
              <ReusableDropdown
                items={Object.values(RoleEnum)}
                onSelect={(item) => setValue("role", item)}
                placeholder="Select a role"
              />
              {errors.role && <p className="text-error">{errors.role.message}</p>}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            <div className="label-input-group group">
              <label htmlFor="phoneNumber" className="label-text">Phone Number</label>
              <input
                {...register("phoneNumber")}
                type="text"
                placeholder="e.g 9860000001"
                className="input-field"
              />
              {errors.phoneNumber && <p className="text-error">{errors.phoneNumber.message}</p>}
            </div>

            {/* Password */}
            <div className="label-input-group group">
              <label htmlFor="password" className="label-text">Password *</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="input-field pr-8 w-full"
                />
                <Eye
                  size={18}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              </div>
              {errors.password && <p className="text-error">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="label-input-group group">
              <label htmlFor="confirmPassword" className="label-text">Confirm Password *</label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className="input-field pr-8 w-full"
                />
                <Eye
                  size={18}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                />
              </div>
              {errors.confirmPassword && <p className="text-error">{errors.confirmPassword.message}</p>}
            </div>
          </div>
        </div>

        {/* Avatar Upload */}
        <div className="label-input-group">
          <label htmlFor="avatar-image" className="label-text">Avatar Image</label>
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
                <span className="text-neutral-800 capitalize text-center">Change Image</span>
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
                <span className="text-neutral-800 capitalize">Click to browse</span>
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
          {errors.avatarUrl && <span className="error-text">{errors.avatarUrl.message}</span>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending} loadingText="Saving" disabled={isPending} text="Save" />
      </div>
    </form>
  );
};

export default AddUserPage;
