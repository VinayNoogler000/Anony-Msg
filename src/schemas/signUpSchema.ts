import * as z from "zod";

export const userNameValidation = z
    .string()
    .min(2, {error: "Username must be atleast 2 characters"})
    .max(20, {error: "Username must be lesser than 20 characters"})
    .regex(/[a-zA-Z][a-zA-Z0-9-_]{3,32}/gi, "Username must not contain special chracters");

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be atleast 8 characters"),
});
