import * as z from "zod";
import { userNameValidation } from "./usernameSchema";

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be atleast 8 characters"),
});
