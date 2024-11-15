import { z } from "zod";

export const createEventSchema = z.object({
    title: z.string().min(1, "Title is required and must be a string"),
    description: z.string().min(1, "Description is required and must be a string"),
    grouped: z.boolean()
});

export const updateEventSchema = z.object({
    status: z.boolean().optional(),
    title: z.string().min(1, "Title is required and must be a string").optional(),
    description: z.string().min(1, "Description is required and must be a string").optional(),
    grouped: z.boolean().optional(),
});