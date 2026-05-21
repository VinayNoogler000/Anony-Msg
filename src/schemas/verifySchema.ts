import * as z from "zod";

export const verifySchema = z.object({
    verificationCode: z.string().length(6, "Verification Code must be of 6 digits")
});