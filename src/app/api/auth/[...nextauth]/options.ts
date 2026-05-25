import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import type { User } from "@/model/User"

export const authOptions: NextAuthOptions = {
    // We need to tell Next.js "how we're going to authenticate user". It can be by using just email/username 
    // and password, or by using social logins, like Google, Facebook, Apple, etc. So, for that "providers" 
    // option needs to be defined.
    providers: [ 
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            type: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "vinaytambey000@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();

                try {
                    const user: User|null = await UserModel.findOne({email: credentials.identifier.email}).lean();

                    if(!user) throw new Error("No user found with this credentials");

                    if (!user.isVerified) throw new Error("User Not Verified! Please verify your account before login");
                
                    const isPasswordCorrect:boolean = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordCorrect) {
                        throw new Error("Please enter correct credentials");
                    }
                    
                    // User is Authenticated with Valid Credentials:
                    return user; 
                }
                catch(err: any) {
                    throw new Error(err);
                }
            }
        })
    ],

    // "pages" option allows us to define that for which routes we want to load custom-defined pages, instead 
    // of allowing Next.js to load simple, unbranded authentication pages for handling Sign in, Sign out, 
    // Email Verification and displaying error messages. For ex: when user will send request to "/sign-in" 
    // route, then the custom-page in "sign-in.tsx" file in "src/pages/" will be loaded by which Next.js 
    // in which the form should be consisting of fields defined in the "provider" option, where user can add their credentials.
    pages: { 
        signIn: "/sign-in",
    },

    // "session" options allows us to define that "how we're going to save user sessions". The options are: 
    // "jwt" (default) or "database". In JWT strategy, an ecrypted token will be stored in session cookie, 
    // whereas in DB strategy, the session cookie will only contain a `sessionToken` value, which is used to 
    // look up the session in the database.
    session: { // Here
        strategy: "jwt"
    },

    // "secret" option allows us to define a random string (kept secret) will be used to hash token, encrypt cookies and generate cryptographic keys. It's mandatory to be set when the app is in production stage.
    secret: process.env.NEXTAUTH_SECRET,

    // "callbacks" option allows us to define custom logic for handling different stages of the authentication process. For ex: in "jwt" callback, we can add custom properties to the token (like User details) and return it, which will be available in the "session" callback, where we can add those properties to the session object and return it, so that those properties will be available in the client-side.
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = { 
                    _id: user._id?.toString(),
                    isVerified: user.isVerified,
                    isAcceptingMsg: user.isAcceptingMsg,
                    username: user.username
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = token.user
            }
            return session
        },
    }
}