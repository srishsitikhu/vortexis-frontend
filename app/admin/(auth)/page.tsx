"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { showNotification } from "@/redux/NotificationSlice";
import { axiosInstance } from "@/lib/axiosinstance";
import { LoginInput, loginSchema } from "@/schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

const Loginpage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
  });

  const dispatch = useDispatch();

  const onSubmit = async (data: LoginInput) => {
    try {
      await axiosInstance.post(`/auth/login`, {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });
      const profile = await axiosInstance.get(`/users/me`);
      if (profile.data.user?.role !== "Admin") {
        await axiosInstance.post("/users/logout");
        const message = "Only admin accounts can access the admin panel";
        setError("email", { message });
        dispatch(
          showNotification({
            message,
            type: "error",
          }),
        );
        return;
      }
      dispatch(
        showNotification({
          message: "Login successful",
          type: "success",
        }),
      );
      router.push("/admin/dashboard");
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: unknown; error?: unknown } };
      };
      const serverMessage =
        err.response?.data?.message ?? err.response?.data?.error;
      const message =
        typeof serverMessage === "string" ? serverMessage : "Login failed";
      setError("password", { message });
      dispatch(
        showNotification({
          message,
          type: "error",
        }),
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-block relative z-10 w-full max-w-md flex flex-col gap-4"
      >
        <div className="space-y-1">
          <h1 className="heading-admin">Admin Sign In</h1>
          <p className="sm-text">Enter your credentials to continue.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            {...register("email")}
            type="email"
            id="email"
            placeholder="Enter your email"
            className="input-field"
          />
          {errors.email && <p className="text-error">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col relative gap-2">
          <label htmlFor="password">Password</label>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
            className="input-field pr-12"
          />
          {errors.password && (
            <p className="text-error">{errors.password.message}</p>
          )}

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 cursor-pointer text-neutral-700"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        <button
          disabled={isSubmitting}
          className="btn-primary disabled:opacity-60"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Loginpage;
