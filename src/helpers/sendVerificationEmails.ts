import VerificationEmail from "../../emails/VerificationEmail";
import { resendAPI } from "@/lib/resendAPI";
import type ApiResponse from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, verificationCode: string, verificationLink: string): Promise<ApiResponse> {
    try {
        const { data, error } = await resendAPI.emails.send({
            from: 'AnonyMsg <verify@mail.vinaytambey.tech>',
            to: [email],
            subject: 'AnonyMsg | Verification Code',
            react: VerificationEmail({ username, otp: verificationCode, verificationLink }),
        });

        if (error) return { success: false, message: "Failed to Send Verification Email"};
        
        return {success: true, message:"Verification Email Send Successfully!"};
    }
    catch(emailError) {
        console.log("Error sending Verification Email: ", emailError);
        return {success: false, message:"Failed to send verification email"};
    }
}