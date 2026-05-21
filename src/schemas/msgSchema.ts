import * as z from "zod";

export const msgSchema = z.object({
    content: z.string().min(10, "Content must be at least 10 characters").max(300, "Content must be lesser than 300 characters") 
});