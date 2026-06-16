"use client";
import "react-phone-number-input/style.css";
import { showNotification } from "@/redux/NotificationSlice";
import { UserCreateInput, userCreateSchema } from "@/schema/user.schema";
import { RoleEnum } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import PhoneInput from "react-phone-number-input";
import { Button } from "@/components/general/Button";
const Registerpage = () => {
  const router = useRouter();
  const serverUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const {
    register,
    setError,
    setValue,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
  } = useForm<UserCreateInput>({
    mode: "onChange",
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      role: RoleEnum.Customer,
      phoneNumber: "",
    },
  });
  const dispatch = useDispatch();

  const phoneNumber = watch("phoneNumber");

  const onSubmit = async (data: UserCreateInput) => {
    try {
      const normalizedEmail = data.email.trim().toLowerCase();
      const emailResponse = await axios.post(`${serverUrl}/users/checkEmail`, {
        email: normalizedEmail,
      });

      if (emailResponse.data.userExists) {
        setError("email", { message: emailResponse.data.message });
        return;
      } else {
        await axios.post(`${serverUrl}/auth/register`, {
          ...data,
          email: normalizedEmail,
        });
        dispatch(
          showNotification({
            message: "Registeration succesfull",
            type: "success",
          }),
        );
      }
      router.push("/auth/login");
    } catch (error) {
      console.log(error);
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
        className="form-block relative z-10 w-full max-w-md flex flex-col gap-4"
      >
        <div className="flex justify-start">
          <Button
            type="button"
            variant="outline"
            text="Back to Home"
            onClick={() => router.push("/")}
          />
        </div>
        <input type="hidden" {...register("role")} />
        <input type="hidden" {...register("phoneNumber")} />

        <div className="space-y-1">
          <h1 className="heading">Create Account</h1>
          <p className="sm-text">Enter your details to get started.</p>
        </div>

        <div className="label-input-group">
          <label htmlFor="name" className="label-text">
            Name
          </label>
          <input
            id="name"
            {...register("name")}
            type="text"
            placeholder="Enter your name"
            className="input-field"
          />
          {errors.name && (
            <span className="text-error">{String(errors.name.message)}</span>
          )}
        </div>

        <div className="label-input-group">
          <label htmlFor="email" className="label-text">
            Email
          </label>
          <input
            id="email"
            {...register("email")}
            type="text"
            placeholder="Enter your email"
            className="input-field"
          />
          {errors.email && (
            <span className="text-error">
              {String(errors.email.message ?? "Invalid email")}
            </span>
          )}
        </div>

        <div className="label-input-group">
          <label htmlFor="password" className="label-text">
            Password
          </label>
          <input
            id="password"
            {...register("password")}
            placeholder="Create a password"
            type="password"
            className="input-field"
          />
          {errors.password && (
            <span className="text-error">
              {String(errors.password.message)}
            </span>
          )}
        </div>

        <div className="label-input-group">
          <label htmlFor="confirmPassword" className="label-text">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            {...register("confirmPassword")}
            placeholder="Confirm your password"
            type="password"
            className="input-field"
          />
          {errors.confirmPassword && (
            <span className="text-error">
              {String(errors.confirmPassword.message)}
            </span>
          )}
        </div>

        <div className="label-input-group">
          <label className="label-text">Phone Number</label>
          <PhoneInput
            value={phoneNumber || undefined}
            onChange={(value) =>
              setValue("phoneNumber", value ?? "", {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            defaultCountry="NP"
            className="input-field"
          />
          {errors.phoneNumber && (
            <span className="text-error">
              {String(errors.phoneNumber.message)}
            </span>
          )}
        </div>

        <Button
          type="submit"
          text="Create Account"
          className="btn-primary"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        />

        <p className="sm-text text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="text-secondary-600 hover:underline font-medium"
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default Registerpage;
