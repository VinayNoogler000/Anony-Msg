import * as z from "zod";
import { userNameValidation } from "./usernameSchema";

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.email("Email Address Required"),
    password: z.string().min(8, "Password must be atleast 8 characters").max(16, "Password shouldn't be less than 16 characters")
});
