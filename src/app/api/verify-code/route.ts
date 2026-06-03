import dbConnect from "@/lib/dbConnect";
import { UsernameQuerySchema } from "@/schemas/usernameSchema";
import { verifySchema } from "@/schemas/verifySchema";
import z from "zod";
import UserModel from "@/model/User";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, verificationCode } = await req.json();

        if (!username && !verificationCode) {
            return Response.json({
                success: false,
                message: "Both Username and Verification Code are MISSING!"
            }, {status: 400} );
        }

        const usernameValidationResult = UsernameQuerySchema.safeParse( { username } );
        const verifyCodeValidationResult = verifySchema.safeParse( { verificationCode } );

        if (!usernameValidationResult.success ) {
            const zodErrors = z.treeifyError(usernameValidationResult.error).properties?.username?.errors || [];
            return Response.json({
                success: false,
                message: zodErrors.length > 0 ? `Username: ${zodErrors}` : "Invalid Username's Structure in Query"
            }, {status: 400} );
        }

        if (!verifyCodeValidationResult.success) {
            const zodErrors = z.treeifyError(verifyCodeValidationResult.error).properties?.verificationCode?.errors || [];
            return Response.json({
                success: false,
                message: zodErrors.length > 0 ? `Verification Code: ${zodErrors}` : "Invalid Verification-Code's Structure in Query"
            }, {status: 400} );
        }

        const { username: validatedUsername } = usernameValidationResult.data; 
        const { verificationCode: validatedVerifyCode } = verifyCodeValidationResult.data;

        const existingUnverifiedUser = await UserModel.findOne( { username: validatedUsername, isVerified: false } ).lean();

        if (!existingUnverifiedUser) {
            return Response.json({
                success: false,
                message: "User Not Found!❌"
            }, {status: 404} );
        }

        const isCodeValid = existingUnverifiedUser.verificationCode === validatedVerifyCode;
        const isCodeNotExpired = new Date(existingUnverifiedUser.verificationCodeExpiry) >= new Date();
            
            if (!isCodeValid && !isCodeNotExpired) {
                return Response.json({
                    success: false,
                    message: "Invalid (incorrect or expired) Verification Code!❌"
                }, {status: 400} );
            }
                
            return Response.json({
                success: true,
                message: "Verification Code Correct!🎉"
            }, {status: 200} );
    }
    catch(err) {
        console.error("Error in code verification: ", err);
        return Response.json({
            success: false,
            message: "Failed to Verify Code. Please try again later!"
        }, {status: 500} );
    }
}
