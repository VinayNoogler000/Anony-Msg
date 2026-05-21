import * as z from "zod";

export const signInSchema = z.object({
    identifier: z.string(), // email will be identifier which will be used to search the user in DB
    password: z.string().min(8, "Password must be atleast 8 characters"),
});