import * as z from "zod";

export const AcceptMsgSchema = z.object({
    acceptMessage: z.boolean()
});