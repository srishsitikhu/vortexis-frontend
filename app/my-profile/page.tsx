"use client";

import { Button } from "@/components/general/Button";
import { updateMe } from "@/lib/api/user";
import { showNotification } from "@/redux/NotificationSlice";
import {
  UserProfileUpdateInput,
  userProfileUpdateSchema,
} from "@/schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { uploadImages } from "@/lib/api/upload";
import { isAxiosError } from "axios";
import { Plus, Upload, X } from "lucide-react";

const MyProfilePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user, isUserLoading } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileUpdateInput>({
    mode: "onChange",
    resolver: zodResolver(userProfileUpdateSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        avatarUrl: user.avatarUrl ?? "",
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/auth/login");
    }
  }, [isUserLoading, user, router]);

  const mutation = useMutation({
    mutationFn: updateMe,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      dispatch(
        showNotification({
          message: "Profile updated successfully",
          type: "success",
        }),
      );
      router.refresh();
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { error?: unknown; message?: unknown } };
      };
      const payload = err.response?.data;
      const message =
        typeof payload?.error === "string"
          ? payload.error
          : typeof payload?.message === "string"
            ? payload.message
            : "Failed to update profile";

      dispatch(
        showNotification({
          message,
          type: "error",
        }),
      );
    },
  });

  const onSubmit = async (data: UserProfileUpdateInput) => {
    try {
      let nextAvatarUrl = data.avatarUrl?.trim() || "";

      if (avatarFiles.length > 0) {
        setIsUploadingAvatar(true);
        const paths = await uploadImages(avatarFiles);
        const uploadedPath = paths?.[0];

        if (!uploadedPath) {
          dispatch(
            showNotification({
              message: "Avatar upload failed",
              type: "error",
            }),
          );
          return;
        }

        nextAvatarUrl = uploadedPath;
        setValue("avatarUrl", uploadedPath, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      mutation.mutate({
        name: data.name,
        email: data.email.trim().toLowerCase(),
        phoneNumber: data.phoneNumber?.trim() || "",
        avatarUrl: nextAvatarUrl,
      });
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data?.error ||
          "Error uploading avatar"
        : "Error uploading avatar";
      dispatch(
        showNotification({
          message,
          type: "error",
        }),
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarUrl = watch("avatarUrl");

  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
  const [avatarPreviews, setAvatarPreviews] = useState<string[]>([]);

  const resolveImageUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("/uploads")) {
      return `${process.env.NEXT_PUBLIC_STATIC_URL}${url}`;
    }
    return url;
  };

  useEffect(() => {
    if (user?.avatarUrl) {
      setAvatarPreviews([resolveImageUrl(user.avatarUrl) as string]);
    } else {
      setAvatarPreviews([]);
    }
    setAvatarFiles([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.avatarUrl]);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFiles([file]);
    setAvatarPreviews([URL.createObjectURL(file)]);
  };

  const handleRemoveAvatar = () => {
    setAvatarFiles([]);
    setAvatarPreviews([]);
    setValue("avatarUrl", "", { shouldDirty: true, shouldValidate: true });
  };

  const isSaving = isSubmitting || mutation.isPending || isUploadingAvatar;

  if (isUserLoading) {
    return (
      <div className="mx-auto w-[1580px] px-4 py-10">
        <div className="form-block max-w-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className=" w-full mx-auto flex justify-center py-10">
      <div className="form-block flex w-120 flex-col gap-5">
        <div className="space-y-1">
          <h1 className="heading">My Profile</h1>
          <p className="sm-text">Update your account information.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-2xl font-semibold">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              className="input-field"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-red-500 text-base">
                {String(errors.name.message)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-2xl font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="input-field"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500 text-base">
                {String(errors.email.message)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phoneNumber" className="text-2xl font-semibold">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              placeholder="+97798..."
              className="input-field"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <span className="text-red-500 text-base">
                {String(errors.phoneNumber.message)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="label-input-group">
              <label className="label-text">Avatar Image</label>
              {avatarPreviews.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {avatarPreviews.map((preview, index) => (
                    <div key={index} className="relative size-28">
                      <img
                        src={preview}
                        alt="preview"
                        className="size-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}

                  <label
                    htmlFor="avatar-image"
                    className="border-dashed border flex size-28 items-center justify-center cursor-pointer"
                  >
                    <Plus size={24} />
                  </label>
                  <input
                    id="avatar-image"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <label
                  htmlFor="avatar-image"
                  className="border-dashed border flex flex-col items-center justify-center p-4 cursor-pointer"
                >
                  <Upload size={32} />
                  <span>Click to browse</span>
                  <input
                    id="avatar-image"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                </label>
              )}

              {/* keep avatarUrl in the form state so updateMe can persist it */}
              <input
                type="hidden"
                value={avatarUrl || ""}
                {...register("avatarUrl")}
              />
              {errors.avatarUrl && (
                <span className="text-red-500 text-base">
                  {String(errors.avatarUrl.message)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              text="Save Changes"
              isLoading={isSaving}
              loadingText="Saving..."
            />
            <Button
              type="button"
              variant="outline"
              text="Back"
              onClick={() => router.back()}
              disabled={isSaving}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfilePage;
