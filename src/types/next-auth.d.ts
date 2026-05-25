import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        _id?: string,
        isVerified?: boolean,
        isAcceptingMsg?: boolean,
        username?: string
    }

    interface Session {
        user: {
            _id?: string,
            isVerified?: boolean,
            isAcceptingMsg?: boolean,
            username?: string 
        } & DefaultSession['user'] // This is to ensure that by default the session will have the "user" property with the default properties of the session user, so that we can use it properly, without getting any errors. 
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            _id?: string,
            isVerified?: boolean,
            isAcceptingMsg?: boolean,
            username?: string
        }
    } 

}