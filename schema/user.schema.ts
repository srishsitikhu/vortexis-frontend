import { RoleEnum } from "@/types/user";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, {
    message: "Password must contain at least one number",
  });

export const userCreateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(50, { message: "Name must be 50 characters or fewer" }),
    email: z.email({ message: "Invalid email format" }),
    avatarUrl: z.string().optional(),
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
    phoneNumber: z
      .string()
      .trim()
      .refine((value) => !value || /^\+?[0-9]{7,15}$/.test(value), {
        message: "Enter a valid phone number",
      })
      .optional()
      .or(z.literal("")),
    role: z.nativeEnum(RoleEnum),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const userUpdateSchema = userCreateSchema.partial();
export type userUpdateInput = z.infer<typeof userUpdateSchema>;

export const userProfileUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be 50 characters or fewer" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  phoneNumber: z
    .string()
    .trim()
    .refine((value) => !value || /^\+?[0-9]{7,15}$/.test(value), {
      message: "Enter a valid phone number",
    })
    .optional()
    .or(z.literal("")),
  avatarUrl: z.string().trim().optional().or(z.literal("")),
});

export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>;

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
