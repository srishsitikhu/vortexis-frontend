import z from "zod";

export const reviewCreateSchema = z.object({
    userId: z.int(),
    productId: z.int(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(1).max(1000),
});

export type ReviewCreate = z.infer<typeof reviewCreateSchema>;

export const reviewUpdateSchema = z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().min(1).max(1000).optional(),
});

export type ReviewUpdate = z.infer<typeof reviewUpdateSchema>;
