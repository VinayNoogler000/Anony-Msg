import z from "zod";

export const userNameValidation = z
    .string()
    .min(2, {error: "Username must be atleast 2 characters"})
    .max(20, {error: "Username must be lesser than 20 characters"})
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special chracters, except underscore '_'");

export const UsernameQuerySchema = z.object({
    username: userNameValidation
});