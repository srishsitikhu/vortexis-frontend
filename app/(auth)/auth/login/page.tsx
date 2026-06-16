"use client";
import { axiosInstance } from "@/lib/axiosinstance";
import { showNotification } from "@/redux/NotificationSlice";
import { LoginInput, loginSchema } from "@/schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye } from "react-icons/fa";
import { FaEyeLowVision } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/general/Button";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
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
      await axiosInstance.post(
        "/auth/login",
        {
          email: data.email.trim().toLowerCase(),
          password: data.password,
        },
        { withCredentials: true },
      );

      dispatch(
        showNotification({ message: "Login Successful", type: "success" }),
      );
      location.href = "/";
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: unknown } };
      };
      const serverError = err.response?.data?.error;
      const message =
        typeof serverError === "string" ? serverError : "Login failed";

      dispatch(
        showNotification({
          message,
          type: "error",
        }),
      );
      setError("password", {
        message,
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
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
        className="form-block relative z-10 w-full max-w-md flex flex-col gap-5"
      >
        <div className="flex justify-start">
          <Button
            type="button"
            variant="outline"
            text="Back to Home"
            onClick={() => router.push("/")}
          />
        </div>
        <div className="space-y-1">
          <h1 className="heading">Sign In</h1>
          <p className="sm-text">Welcome back. Please enter your details.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-2xl font-semibold">
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="Enter your Email"
            className="input-field"
          />
          {errors.email && (
            <span className="text-red-500 text-base">
              {String(errors?.email?.message)}
            </span>
          )}
        </div>
        <div className="flex flex-col relative gap-2">
          <label htmlFor="password" className="text-2xl font-semibold">
            Password
          </label>
          <input
            {...register("password")}
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            className="input-field pr-12"
          />
          {errors.password && (
            <span className="text-red-500 text-base">
              {String(errors?.password?.message)}
            </span>
          )}
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-15 right-3 cursor-pointer text-neutral-700"
          >
            {showPassword ? <FaEye /> : <FaEyeLowVision />}
          </div>
        </div>
        <button
          disabled={isSubmitting}
          className="btn-primary disabled:opacity-60"
        >
          Login
        </button>

        <p className="sm-text text-center">
          New here?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/register")}
            className="text-secondary-600 hover:underline font-medium"
          >
            Create Account
          </button>
        </p>
      </form>
    </div>
  );
};
export default LoginPage;
