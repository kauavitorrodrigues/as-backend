import { z } from "zod";

export const CreatePersonSchema = z.object({
    name: z.string().min(1, "Name is required and must be a string"),
    cpf: z.string().min(1, "CPF is required and must be a string"),
});

export const UpdatePersonSchema = z.object({
    name: z.string().min(1, "Name is required and must be a string").optional(),
    cpf: z.string().min(1, "CPF must be a string").transform((cpf) => cpf.replace(/\.|-/gm, '')).optional(),
});

export const SearchPersonSchema = z.object({
    cpf: z.string().min(1, "CPF is required and must be a string").transform((cpf) => cpf.replace(/\.|-/gm, ''))
});