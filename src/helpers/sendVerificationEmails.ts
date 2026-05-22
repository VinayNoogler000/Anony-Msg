import VerificationEmail from "../../emails/VerificationEmail";
import { resendAPI } from "@/lib/resend";
import type ApiResponse from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, verificationCode: string): Promise<ApiResponse> {
    try {
        const { data, error } = await resendAPI.emails.send({
            from: '<onboarding@resend.dev>',
            to: [email],
            subject: 'AnonyMsg | Verification Code',
            react: VerificationEmail({ username, otp: verificationCode }),
        });

        return {success: true, message:"Verification Email Send Successfully!"};
    }
    catch(emailError) {
        console.log("Error sending Verification Email: ", emailError);
        return {success: false, message:"Failed to send verification email"};
    }
}
