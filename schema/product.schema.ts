import { z } from "zod";

const numberFromString = (schema: z.ZodNumber) =>
  z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed === "") return undefined;

      const num = Number(trimmed);
      return Number.isNaN(num) ? value : num;
    }
    return value;
  }, schema) as z.ZodType<number>;

const booleanFromString = (schema: z.ZodBoolean) =>
  z.preprocess((value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  }, schema) as z.ZodType<boolean>;

export const productCreateSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  description: z.string().nullable(),
  categoryId: numberFromString(z.number({ message: "Category is required" })),
  price: numberFromString(z.number({ message: "Price is required" })),
  discountPercent: numberFromString(
    z
      .number()
      .min(0, "Discount percent must be between 0 and 100")
      .max(100, "Discount percent must be between 0 and 100"),
  )
    .optional()
    .default(0),
  stock: numberFromString(
    z
      .number({ message: "Stock quantity is required" })
      .int("Stock quantity must be a whole number")
      .min(0, "Stock quantity cannot be negative"),
  ),
  imageUrls: z
    .array(z.string())
    .min(1, "At least one image is required")
    .optional(),
  isFlashSale: booleanFromString(z.boolean()),
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type productUpdateInput = z.infer<typeof productUpdateSchema>;
