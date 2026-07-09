import * as z from "zod";

export const signInSchema = z.object({
    identifier: z.string("Email or Username is Required").min(2, "Identifier must be atleast 2 characters"), // email will be identifier which will be used to search the user in DB
    password: z.string("Password is Required").min(8, "Password must be atleast 8 characters"),
});