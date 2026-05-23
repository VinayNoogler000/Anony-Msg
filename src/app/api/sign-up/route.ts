import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import type ApiResponse from "@/types/ApiResponse";
import { HydratedDocument } from "mongoose";

export async function POST(request: Request): Promise<Response> {
    await dbConnect();

    try {
        const {username, email, password} = await request.json();
        
        if (!username || !email || !password) return Response.json({ success: false, message: "All the fields (usernamne, email and password) are required." }, {status: 400});

        const existingVerifiedUserByUsername: User | null = await UserModel.findOne({ username, isVerified: true }).lean();

        if (existingVerifiedUserByUsername) return Response.json({ success: false, message: "Username already exists. Please use a different username or login if the username is yours." }, {status: 400});

        const existingUserByEmail: HydratedDocument<User> | null = await UserModel.findOne({ email });
        
        const verificationCode = Math.floor((Math.random() * 900000) + 100000).toString(); // Generates a 6-Digit Unique Code
        const expiryDate = new Date(Date.now() + 3600000); // after 1 hour, code will expire 
        const encryptedPassword = await bcrypt.hash(password, 10);

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({success: false, messsage: "Email already exists. Please try a different email, or login if this email is yours."}, {status: 400});
            }
            else { // update the existing user details with the new details
                existingUserByEmail.username = username;
                existingUserByEmail.email = email;
                existingUserByEmail.password = encryptedPassword
                existingUserByEmail.verificationCode = verificationCode;
                existingUserByEmail.verificationCodeExpiry = expiryDate;
                existingUserByEmail.isVerified = false;
                await existingUserByEmail.save();
            }
        }
        else { // create a new user
            const newUser = await UserModel.create({
                username,
                email,
                password: encryptedPassword,
                verificationCode,
                verificationCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMsg: true,
                messages: []
            });
        }

        const verifyEmailResponse: ApiResponse = await sendVerificationEmail(email, username, verificationCode);
        if (!verifyEmailResponse.success) {
            return Response.json({ success: false, message: verifyEmailResponse.message }, { status: 500 });
        }

        return Response.json({ success: true, message: "User Registered Successfully. Please verify your email. Verification Email has been sent to your email" }, { status: 200 });
    }
    catch (error) {
        console.log("Error Registering User: ", error);

        return Response.json(
            { success:false, message: "Failed Registering User" },
            { status: 500 }
        );
    }
}