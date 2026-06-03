import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import z from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: userNameValidation
});

export async function GET(req: Request) {
// 👇 This doesn't works in Next.js, 'cause the "req" object doesn't get created when the HTTP method !== "GET"   
    // if (req.method !== "GET") {
    //     return Response.json({
    //         success: false,
    //         message: "This route only serves 'GET' HTTP-Requests"
    //     }, {status: 405});
    // } 

    await dbConnect();

    try {
        const {searchParams} = new URL(req.url);
        const queryParam = { username: searchParams.get("username") };

        const result = UsernameQuerySchema.safeParse(queryParam);

        if (!result.success) {
            const usernameErrors = z.treeifyError(result.error).properties?.username?.errors || [];
            
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid Query Parameters"
            }, {status: 400});
        }

        const {username} = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already exists!"
            }, {status: 400});
        }

        return Response.json({
            success: true,
            message: "Username is available!🎉"
        }, {status: 200});

    } 
    catch (error) {
        console.error("Error checking username: ", error);
        return Response.json({ 
            success: false,
            message:  "Error checking username"
        }, {status: 500});
    }
}