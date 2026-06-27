import dbConnect from "@/lib/dbConnect"
import UserModel, { User } from "@/model/User"
import { Message } from "@/model/User"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { HydratedDocument } from "mongoose";

export async function POST( req:Request ): Promise<Response> {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        const loggedInUser = session?.user;

        if (!session || !loggedInUser) {
            return Response.json({
                success: false,
                message: "Not Authenticated!"
            }, { status: 401 }); 
        }

        const { username, content } = await req.json();
    
        const userInDB: HydratedDocument<User> | null = await UserModel.findOne({username});

        if (!userInDB) {
            return Response.json({
                success: false,
                message: "User Not Found!"
            }, { status: 404 });
        }

        if (!userInDB.isAcceptingMsg) {
            return Response.json({
                success: false,
                message: "User is not Accepting Messages!"
            }, { status: 403 });
        }

        const newMsg = { content, createdAt: new Date() } as Message;
        userInDB.messages.push(newMsg);
        await userInDB.save();

        return Response.json({
            success: true,
            message: "Message Sent Successfully"
        }, { status: 403 });
    }
    catch (err) {
        console.error("An Unexpected Error Occurred when Sending Messages: ", err);

        return Response.json({
            success: false,
            message: "Error in Sending Message to the User. Please try again later!"
            }, {status: 500}
        );
    }
} 