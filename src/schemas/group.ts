import { z } from "zod";

export const CreateGroupSchema = z.object({
    name: z.string().min(1, "Title is required and must be a string")
});

export const UpdateGroupSchema = z.object({
    name: z.string().optional()
});